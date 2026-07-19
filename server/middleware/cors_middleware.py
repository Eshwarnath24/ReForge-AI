import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# Default origins for local dev + deployed frontend.
# Override with a comma-separated ALLOWED_ORIGINS env var in production.
_DEFAULT_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://reforge-ai-one.vercel.app",
]


def setup_cors(app):
    raw = os.getenv("ALLOWED_ORIGINS", "")
    if raw.strip():
        origins = [o.strip() for o in raw.split(",") if o.strip()]
    else:
        origins = _DEFAULT_ORIGINS

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )