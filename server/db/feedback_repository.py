from datetime import datetime, timezone
from db.database import feedback_collection


def record_feedback(user_id: str, source: str, item_id: str, title: str, tags: list, vote: str):
    """
    Upserts feedback — one vote per (user, source, item) at a time.
    Voting again just updates the existing vote instead of creating duplicates.
    """
    feedback_collection.update_one(
        {"user_id": user_id, "source": source, "item_id": item_id},
        {
            "$set": {
                "title": title,
                "tags": tags or [],
                "vote": vote,
                "updated_at": datetime.now(timezone.utc),
            },
            "$setOnInsert": {
                "created_at": datetime.now(timezone.utc),
            },
        },
        upsert=True,
    )
    return {"user_id": user_id, "source": source, "item_id": item_id, "vote": vote}


def get_feedback_counts(source: str, item_id: str):
    likes = feedback_collection.count_documents({"source": source, "item_id": item_id, "vote": "like"})
    dislikes = feedback_collection.count_documents({"source": source, "item_id": item_id, "vote": "dislike"})
    return {"likes": likes, "dislikes": dislikes}


def get_user_vote(user_id: str, source: str, item_id: str):
    doc = feedback_collection.find_one({"user_id": user_id, "source": source, "item_id": item_id})
    return doc["vote"] if doc else None


def get_user_feedback_history(user_id: str, limit: int = 50):
    cursor = feedback_collection.find({"user_id": user_id}).sort("created_at", -1).limit(limit)
    history = []
    for doc in cursor:
        history.append({
            "source": doc["source"],
            "item_id": doc["item_id"],
            "title": doc.get("title"),
            "tags": doc.get("tags", []),
            "vote": doc["vote"],
        })
    return history