from langchain.tools import tool
import json

from services.matcher import load_knowledge_base, prefilter_projects
from services.youtube_service import search_youtube_videos
from services.impact_calculator import estimate_impact
from services.personalization_service import build_user_preference_summary
from db.feedback_repository import get_feedback_counts


@tool
def search_knowledge_base_tool(detected_items_json: str) -> str:
    """
    Searches the curated, verified DIY knowledge base for projects matching
    the detected items. Input must be a JSON string of detected items, e.g.
    '[{"item":"plastic bottle","condition":"good","material":"plastic"}]'.
    Returns a JSON string of candidate projects with a 'kb_project' source tag.
    """
    detected_items = json.loads(detected_items_json)
    all_projects = load_knowledge_base()
    candidates = prefilter_projects(detected_items, all_projects)

    for c in candidates:
        c["source"] = "kb_project"
        feedback = get_feedback_counts("kb_project", c.get("project_id", ""))
        c["community_feedback"] = feedback

    return json.dumps(candidates)


@tool
def search_youtube_tool(detected_items_json: str) -> str:
    """
    Searches YouTube for real DIY videos relevant to the detected items.
    Input must be a JSON string of detected items, same format as
    search_knowledge_base_tool. Returns a JSON string of video candidates
    with a 'youtube_video' source tag, including view/like counts.
    """
    detected_items = json.loads(detected_items_json)
    candidates = search_youtube_videos(detected_items)

    for c in candidates:
        feedback = get_feedback_counts("youtube_video", c.get("video_id", ""))
        c["community_feedback"] = feedback

    return json.dumps(candidates)


@tool
def estimate_environmental_impact_tool(detected_items_json: str) -> str:
    """
    Estimates waste diverted (grams) and CO2 saved (grams) if the detected
    items are upcycled instead of discarded. Input must be a JSON string of
    detected items. Returns a JSON string with the estimate.
    """
    detected_items = json.loads(detected_items_json)
    result = estimate_impact(detected_items)
    return json.dumps(result)


@tool
def get_user_preferences_tool(user_id: str) -> str:
    """
    Retrieves a summary of what kinds of projects this user has liked or
    disliked in the past, based on their feedback history. Input is the
    user's numeric ID as a string. Returns a short text summary to use
    when ranking recommendations for this specific user.
    """
    summary = build_user_preference_summary(user_id)
    return summary


ALL_TOOLS = [
    search_knowledge_base_tool,
    search_youtube_tool,
    estimate_environmental_impact_tool,
    get_user_preferences_tool,
]