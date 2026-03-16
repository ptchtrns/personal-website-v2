from flask import Flask
from flask_cors import CORS

from app.config import FRONTEND_BASE_URL
from app.db import close_client
from app.routes.auth import auth_bp
from app.routes.photos import photos_bp

def create_app():
    app = Flask(__name__)

    CORS(
        app,
        origins=[FRONTEND_BASE_URL],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Accept", "Authorization", "Content-Type", "X-CSRF-Token"],
        expose_headers=["Link"],
        supports_credentials=True,
        max_age=300,
    )

    app.register_blueprint(auth_bp)
    app.register_blueprint(photos_bp)

    app.teardown_appcontext(close_client)

    return app