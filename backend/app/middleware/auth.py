from functools import wraps

import jwt
from flask import jsonify, request
from datetime import datetime, timedelta, UTC

from app.config import JWT_SECRET


def create_token() -> str:
    payload = {
        "exp": datetime.now(UTC) + timedelta(hours=24),  # token expires in 24h
        "iat": datetime.now(UTC),
        "sub": "admin",
    }

    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    return token

def validate_token(token: str) -> bool:
    try:
        jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return True
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError as e:
        return False

def require_auth(f):
    """Decorator that enforces JWT authentication on a route."""

    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get("auth_token")
        error = validate_token(token)
        if error:
            return jsonify({"error": error}), 401
        return f(*args, **kwargs)

    return decorated