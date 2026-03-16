from datetime import datetime, timezone

import uuid
from flask import Blueprint, jsonify, request

from app.config import PHOTO_BASE_URL
from app.db import get_photos_collection
from app.middleware.auth import require_auth
from app.storage import generate_presigned_put_url

photos_bp = Blueprint("photos", __name__)


def _serialize(doc: dict) -> dict:
    """Convert MongoDB document to a JSON-serializable dict."""
    doc["_id"] = str(doc["_id"])
    return doc


@photos_bp.get("/api/photos")
def get_photos():
    collection = get_photos_collection()
    photos = [_serialize(doc) for doc in collection.find({})]
    return jsonify(photos), 200


@photos_bp.post("/api/photos")
@require_auth
def upload_photo():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid request body"}), 400

    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 400

    description = data.get("description", "")
    aspect_ratio = data.get("aspect_ratio", "")

    photo_id = str(uuid.uuid4())
    s3_key = f"media/photos/{photo_id}/original.jpg"

    try:
        presigned_url = generate_presigned_put_url(s3_key, expires_in=60)
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

    now = datetime.now(tz=timezone.utc)
    photo = {
        "id": photo_id,
        "title": title,
        "description": description,
        "aspect_ratio": aspect_ratio,
        "image": {
            "original": f"{PHOTO_BASE_URL}/media/photos/{photo_id}/original.jpg",
            "full": f"{PHOTO_BASE_URL}/media/photos/{photo_id}/full.jpg",
            "400": f"{PHOTO_BASE_URL}/media/photos/{photo_id}/400.jpg",
        },
        "created_at": now,
        "updated_at": now,
    }

    collection = get_photos_collection()
    result = collection.insert_one(photo)

    return jsonify({
        "id": str(result.inserted_id),
        "presigned_url": presigned_url,
        "photo": _serialize(photo),
    }), 201