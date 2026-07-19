import jwt
from fastapi import HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends

from db.user_repository import create_user, find_user_by_email
from services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)

# FastAPI security scheme — extracts "Bearer <token>" from the Authorization header
_bearer_scheme = HTTPBearer()


async def signup_controller(email: str, password: str):
    existing = find_user_by_email(email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(password)
    user = create_user(email, hashed)
    token = create_access_token(user["id"], user["email"])

    return {"access_token": token, "token_type": "bearer", "email": user["email"]}


async def login_controller(email: str, password: str):
    user = find_user_by_email(email)
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token(user["id"], user["email"])
    return {"access_token": token, "token_type": "bearer", "email": user["email"]}


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
):
    """FastAPI dependency — validates the JWT from the Authorization header."""
    try:
        payload = decode_access_token(credentials.credentials)
        return {"id": payload["sub"], "email": payload["email"]}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")