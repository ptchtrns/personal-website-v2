from pymongo import MongoClient
from app.config import MONGO_URI, MONGO_DB, PHOTOS_COLLECTION

_client: MongoClient | None = None


def get_client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(MONGO_URI)
    return _client


def get_db():
    return get_client()[MONGO_DB]


def get_photos_collection():
    return get_db()[PHOTOS_COLLECTION]


def close_client(exception):
    global _client
    if _client is not None:
        _client.close()
        _client = None