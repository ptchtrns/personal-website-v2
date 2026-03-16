import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "personal-website")
PHOTOS_COLLECTION = os.getenv("PHOTOS_COLLECTION", "photos")

S3_BUCKET = os.getenv("S3_BUCKET", "")

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
JWT_EXPIRY_HOURS = int(os.getenv("JWT_EXPIRY_HOURS", "1"))

FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "*")

PHOTO_BASE_URL = os.getenv("PHOTO_BASE_URL", "https://ptchtrns.com")