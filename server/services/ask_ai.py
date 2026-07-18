import os
import json
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_KEY_2 = os.getenv("GEMINI_API_KEY_2")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


def clean_json(text: str) -> str:
    text = text.replace("```json", "").replace("```", "")
    return text.strip()


def safe_parse_json(text: str):
    cleaned = clean_json(text)
    return json.loads(cleaned)


def _call_gemini_with_key(api_key: str, prompt: str, image_base64: str = None, mime_type: str = "image/jpeg"):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={api_key}"

    parts = [{"text": prompt}]
    if image_base64:
        parts.append({
            "inline_data": {
                "mime_type": mime_type,
                "data": image_base64
            }
        })

    body = {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {"temperature": 0.3}
    }

    res = requests.post(url, json=body, timeout=30)
    if not res.ok:
        raise Exception(f"Gemini failed: {res.status_code} {res.text}")

    data = res.json()
    text = data["candidates"][0]["content"]["parts"][0]["text"]
    return safe_parse_json(text)


def call_gemini(prompt: str, image_base64: str = None, mime_type: str = "image/jpeg"):
    """Tries the first Gemini key, then the second, before giving up on Gemini entirely."""
    keys_to_try = [k for k in [GEMINI_API_KEY, GEMINI_API_KEY_2] if k]

    last_error = None
    for key in keys_to_try:
        try:
            return _call_gemini_with_key(key, prompt, image_base64, mime_type)
        except Exception as e:
            last_error = e
            print(f"Gemini key failed, trying next: {e}")

    raise last_error if last_error else Exception("No Gemini API keys configured")


def call_groq(prompt: str, image_base64: str = None, mime_type: str = "image/jpeg"):
    url = "https://api.groq.com/openai/v1/chat/completions"

    content = [{"type": "text", "text": prompt}]
    if image_base64:
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:{mime_type};base64,{image_base64}"}
        })

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROQ_API_KEY}"
    }
    body = {
        "model": "qwen/qwen3.6-27b",
        "messages": [{"role": "user", "content": content}],
        "temperature": 0.3
    }

    res = requests.post(url, headers=headers, json=body, timeout=30)
    if not res.ok:
        raise Exception(f"Groq failed: {res.status_code} {res.text}")

    data = res.json()
    text = data["choices"][0]["message"]["content"]
    return safe_parse_json(text)


def call_openrouter(prompt: str, image_base64: str = None, mime_type: str = "image/jpeg"):
    url = "https://openrouter.ai/api/v1/chat/completions"

    content = [{"type": "text", "text": prompt}]
    if image_base64:
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:{mime_type};base64,{image_base64}"}
        })

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENROUTER_API_KEY}"
    }

    models_to_try = [
        "google/gemma-4-31b-it:free",
        "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    ]

    last_error = None
    for model in models_to_try:
        body = {
            "model": model,
            "messages": [{"role": "user", "content": content}],
            "temperature": 0.3
        }
        res = requests.post(url, headers=headers, json=body, timeout=30)
        if res.ok:
            data = res.json()
            text = data["choices"][0]["message"]["content"]
            return safe_parse_json(text)
        last_error = f"OpenRouter ({model}) failed: {res.status_code} {res.text}"
        print(last_error)

    raise Exception(last_error)


def ask_ai(prompt: str, image_base64: str = None, mime_type: str = "image/jpeg"):
    """
    Tries Gemini (key 1 -> key 2) -> Groq -> OpenRouter (2 free models) in order.
    Returns dict: {"data": <parsed JSON>, "provider_used": <str>}
    Raises if all fail.
    """
    try:
        data = call_gemini(prompt, image_base64, mime_type)
        return {"data": data, "provider_used": "gemini"}
    except Exception as e:
        print(f"Gemini (both keys) failed, falling back to Groq: {e}")

    try:
        data = call_groq(prompt, image_base64, mime_type)
        return {"data": data, "provider_used": "groq"}
    except Exception as e:
        print(f"Groq failed, falling back to OpenRouter: {e}")

    try:
        data = call_openrouter(prompt, image_base64, mime_type)
        return {"data": data, "provider_used": "openrouter"}
    except Exception as e:
        print(f"OpenRouter failed too: {e}")
        raise Exception("All AI providers failed")