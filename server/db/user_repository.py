from bson import ObjectId
from db.database import users_collection


def create_user(email: str, hashed_password: str):
    result = users_collection.insert_one({
        "email": email,
        "hashed_password": hashed_password,
    })
    return {"id": str(result.inserted_id), "email": email}


def find_user_by_email(email: str):
    doc = users_collection.find_one({"email": email})
    if not doc:
        return None
    return {
        "id": str(doc["_id"]),
        "email": doc["email"],
        "hashed_password": doc["hashed_password"],
    }


def find_user_by_id(user_id: str):
    try:
        doc = users_collection.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return None

    if not doc:
        return None
    return {
        "id": str(doc["_id"]),
        "email": doc["email"],
        "hashed_password": doc["hashed_password"],
    }