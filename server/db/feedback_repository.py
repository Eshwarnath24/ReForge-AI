import json
from db.database import get_connection


def record_feedback(user_id: int, source: str, item_id: str, title: str, tags: list, vote: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO feedback (user_id, source, item_id, title, tags, vote)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (user_id, source, item_id, title, json.dumps(tags or []), vote)
    )
    conn.commit()
    conn.close()
    return {"user_id": user_id, "source": source, "item_id": item_id, "vote": vote}


def get_feedback_counts(source: str, item_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT vote, COUNT(*) as count FROM feedback WHERE source = ? AND item_id = ? GROUP BY vote",
        (source, item_id)
    )
    rows = cursor.fetchall()
    conn.close()

    result = {"likes": 0, "dislikes": 0}
    for row in rows:
        if row["vote"] == "like":
            result["likes"] = row["count"]
        elif row["vote"] == "dislike":
            result["dislikes"] = row["count"]
    return result


def get_user_feedback_history(user_id: int, limit: int = 50):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM feedback WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
        (user_id, limit)
    )
    rows = cursor.fetchall()
    conn.close()

    history = []
    for row in rows:
        item = dict(row)
        item["tags"] = json.loads(item["tags"]) if item["tags"] else []
        history.append(item)
    return history