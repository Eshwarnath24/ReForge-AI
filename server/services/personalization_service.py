from collections import Counter
from db.feedback_repository import get_user_feedback_history


def build_user_preference_summary(user_id: int):
    """
    Looks at a user's past likes/dislikes and builds a short, human-readable
    summary the agent can use as context. Kept simple and explainable —
    not a trained model, just aggregated counts.
    """
    history = get_user_feedback_history(user_id, limit=50)

    if not history:
        return "No feedback history yet — no personalization data available."

    liked_tags = Counter()
    disliked_tags = Counter()

    for entry in history:
        tags = entry.get("tags", [])
        if entry["vote"] == "like":
            liked_tags.update(tags)
        elif entry["vote"] == "dislike":
            disliked_tags.update(tags)

    summary_parts = []
    if liked_tags:
        top_liked = [tag for tag, _ in liked_tags.most_common(3)]
        summary_parts.append(f"User tends to LIKE: {', '.join(top_liked)}")
    if disliked_tags:
        top_disliked = [tag for tag, _ in disliked_tags.most_common(3)]
        summary_parts.append(f"User tends to DISLIKE: {', '.join(top_disliked)}")

    if not summary_parts:
        return "Feedback history exists but no clear tag pattern yet."

    return " | ".join(summary_parts)