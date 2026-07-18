import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

_client = MongoClient(MONGODB_URI)
_db = _client["reforge_ai"]

users_collection = _db["users"]
feedback_collection = _db["feedback"]
projects_collection = _db["projects"]


def init_db():
    users_collection.create_index("email", unique=True)
    feedback_collection.create_index([("source", 1), ("item_id", 1)])
    feedback_collection.create_index("user_id")
    projects_collection.create_index("id", unique=True)
    print("MongoDB connected and indexes ensured.")