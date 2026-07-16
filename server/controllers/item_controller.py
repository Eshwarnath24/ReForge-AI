import base64

from services.ask_ai import ask_ai
from db.feedback_repository import record_feedback
from agents.matching_agent import run_matching_agent
from prompts import OBJECT_DETECTION_PROMPT


async def detect_objects_controller(image):
    image_bytes = await image.read()
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    result = ask_ai(
        prompt=OBJECT_DETECTION_PROMPT,
        image_base64=image_base64,
        mime_type=image.content_type or "image/jpeg"
    )

    return {
        "provider_used": result["provider_used"],
        "detected_items": result["data"]
    }


async def analyze_item_controller(image, skill_level: str, user_id: str):
    image_bytes = await image.read()
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    detect_result = ask_ai(
        prompt=OBJECT_DETECTION_PROMPT,
        image_base64=image_base64,
        mime_type=image.content_type or "image/jpeg"
    )
    detected_items = detect_result["data"]

    if not detected_items:
        return {
            "recommendation": "no_suitable_idea",
            "reason": "No identifiable items detected in the image.",
            "fallback_suggestion": "Repair, Donate, Sell, or Recycle"
        }

    agent_result = run_matching_agent(detected_items, skill_level, user_id)

    return {
        "detection_provider": detect_result["provider_used"],
        "detected_items": detected_items,
        **agent_result
    }


async def feedback_controller(user_id: str, source: str, item_id: str, title: str, tags: list, vote: str):
    if vote not in ("like", "dislike"):
        raise ValueError("vote must be 'like' or 'dislike'")

    result = record_feedback(user_id, source, item_id, title, tags, vote)
    return result