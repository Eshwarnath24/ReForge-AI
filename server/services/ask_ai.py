import os
import json
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROK_API_KEY = os.getenv("GROK_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


def clean_json(text: str) -> str:
    text = text.replace("```json", "").replace("```", "")
    return text.strip()


def safe_parse_json(text: str):
    cleaned = clean_json(text)
    return json.loads(cleaned)


def call_gemini(prompt: str, image_base64: str = None, mime_type: str = "image/jpeg"):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={GEMINI_API_KEY}"

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


def call_grok(prompt: str, image_base64: str = None, mime_type: str = "image/jpeg"):
    url = "https://api.x.ai/v1/chat/completions"

    content = [{"type": "text", "text": prompt}]
    if image_base64:
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:{mime_type};base64,{image_base64}"}
        })

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROK_API_KEY}"
    }
    body = {
        "model": "grok-4.3",
        "messages": [{"role": "user", "content": content}],
        "temperature": 0.3
    }

    res = requests.post(url, headers=headers, json=body, timeout=30)
    if not res.ok:
        raise Exception(f"Grok failed: {res.status_code} {res.text}")

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
    try:
        data = call_gemini(prompt, image_base64, mime_type)
        return {"data": data, "provider_used": "gemini"}
    except Exception as e:
        print(f"Gemini failed, falling back to Grok: {e}")

    try:
        data = call_grok(prompt, image_base64, mime_type)
        return {"data": data, "provider_used": "grok"}
    except Exception as e:
        print(f"Grok failed, falling back to OpenRouter: {e}")

    try:
        data = call_openrouter(prompt, image_base64, mime_type)
        return {"data": data, "provider_used": "openrouter"}
    except Exception as e:
        print(f"OpenRouter failed too: {e}")
        raise Exception("All AI providers failed")