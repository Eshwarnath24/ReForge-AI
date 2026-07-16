import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent

from agents.tools import ALL_TOOLS
from services.matcher import load_knowledge_base, prefilter_projects
from services.youtube_service import search_youtube_videos
from services.impact_calculator import estimate_impact
from prompts import build_matching_prompt
from services.ask_ai import ask_ai  # fallback path if the agent itself fails

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

AGENT_SYSTEM_PROMPT = """You are a practical upcycling advisor agent for ReForge AI.

Given a user's detected items, their skill level, and their user_id, you must:
1. Call search_knowledge_base_tool to find verified projects
2. Call search_youtube_tool to find real community DIY videos
3. Call estimate_environmental_impact_tool to estimate waste/CO2 impact
4. Call get_user_preferences_tool with the user's ID to check their personal taste history
5. Using ALL of this information, choose the TOP 3 BEST options overall — weighing
   practicality (would a reasonable person actually want to make this?), verification
   status (kb_project is pre-verified, youtube_video is not), community feedback,
   and the user's personal preference history as a tie-breaker.

Never invent a project or video that wasn't returned by your tools.
If fewer than 3 realistic options exist, return fewer. If none are realistic,
say so clearly.

Return your FINAL ANSWER as ONLY valid JSON (no markdown fences, no explanation
outside the JSON), in this exact format:

If matches exist:
{
  "recommendation": "upcycle",
  "matches": [
    {
      "source": "kb_project" or "youtube_video",
      "id": "string (project_id or video_id)",
      "title": "string",
      "reason": "string (why this ranks here)",
      "missing_items": ["string"],
      "adapted_steps": ["string"],
      "estimated_time_minutes": number,
      "difficulty": "string",
      "safety_notes": ["string"],
      "url": "string or null",
      "channel": "string or null",
      "thumbnail": "string or null"
    }
  ],
  "impact_estimate": {
    "estimated_waste_diverted_grams": number,
    "estimated_co2_saved_grams": number,
    "note": "string"
  }
}

If no suitable option exists:
{
  "recommendation": "no_suitable_idea",
  "reason": "string",
  "fallback_suggestion": "Repair, Donate, Sell, or Recycle"
}
"""


def _build_agent():
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.5-flash",
        google_api_key=GEMINI_API_KEY,
        temperature=0.3,
    )

    agent = create_agent(
        model=llm,
        tools=ALL_TOOLS,
        system_prompt=AGENT_SYSTEM_PROMPT,
    )
    return agent


def _clean_json(text: str) -> str:
    return text.replace("```json", "").replace("```", "").strip()


def _extract_final_text(agent_result: dict) -> str:
    """
    create_agent's invoke() returns a dict with a 'messages' list.
    The final assistant message holds our JSON answer.
    """
    messages = agent_result.get("messages", [])
    if not messages:
        raise ValueError("Agent returned no messages")

    last_message = messages[-1]
    # last_message may be a LangChain message object or a dict, handle both
    content = getattr(last_message, "content", None)
    if content is None and isinstance(last_message, dict):
        content = last_message.get("content")

    if not content:
        raise ValueError("Agent's final message had no content")

    return content


def run_matching_agent(detected_items: list, skill_level: str, user_id: int):
    """
    Runs the LangChain agent to decide which tools to call and produce
    a final ranked recommendation. Falls back to the non-agent pipeline
    if the agent itself errors out — the app must not go down just
    because the agent layer fails.
    """
    try:
        agent = _build_agent()

        input_text = (
            f"Detected items: {json.dumps(detected_items)}\n"
            f"Skill level: {skill_level}\n"
            f"User ID: {user_id}"
        )

        result = agent.invoke({"messages": [{"role": "user", "content": input_text}]})
        raw_output = _extract_final_text(result)
        parsed = json.loads(_clean_json(raw_output))

        return {"matching_provider": "langchain_agent_gemini", **parsed}

    except Exception as e:
        print(f"Agent failed, falling back to direct pipeline: {e}")
        return _fallback_matching(detected_items, skill_level)


def _fallback_matching(detected_items: list, skill_level: str):
    """Non-agent fallback path — reuses your existing tested pipeline."""
    all_projects = load_knowledge_base()
    kb_candidates = prefilter_projects(detected_items, all_projects)
    kb_candidates = [{**p, "source": "kb_project"} for p in kb_candidates]

    youtube_candidates = search_youtube_videos(detected_items)
    combined_candidates = kb_candidates + youtube_candidates

    impact_estimate = estimate_impact(detected_items)

    if not combined_candidates:
        return {
            "matching_provider": "fallback_no_agent",
            "recommendation": "no_suitable_idea",
            "reason": "No candidate projects or videos matched the detected items.",
            "fallback_suggestion": "Repair, Donate, Sell, or Recycle",
            "impact_estimate": impact_estimate,
        }

    prompt = build_matching_prompt(detected_items, skill_level, combined_candidates)
    result = ask_ai(prompt=prompt)

    return {
        "matching_provider": f"fallback_no_agent_{result['provider_used']}",
        "impact_estimate": impact_estimate,
        **result["data"],
    }