from flask import Blueprint, jsonify, request, make_response
from app.config import ADMIN_PASSWORD
from app.middleware.auth import create_token, validate_token

auth_bp = Blueprint("auth", __name__)

@auth_bp.get("/api/me")
def me():
    token = request.cookies.get("auth_token")

    if not token or not validate_token(token):
        return jsonify({"authenticated": False}), 401

    return jsonify({"authenticated": True}), 200

@auth_bp.post("/api/login")
def login():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid request body"}), 400
    
    password = data.get("password", "")

    if password == ADMIN_PASSWORD:
        token = create_token()

        response = make_response(jsonify({"success": True}))

        response.set_cookie(
            "auth_token",
            token,
            httponly=True,
            secure=False, # HTTPS only
            samesite="Lax", # CSRF protection
            max_age=60 * 60 * 24,  # 1 day
            path="/"
        )

        return response
    else:
        return jsonify({"error": "Invalid credentials"}), 401