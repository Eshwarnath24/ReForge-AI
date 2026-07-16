from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

from db.user_repository import create_user, find_user_by_email, find_user_by_id
from services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


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


def get_current_user(token: str = Depends(oauth2_scheme)):
    """Shared dependency — used by item_router.py to require login on /analyze and /feedback."""
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = find_user_by_id(int(payload["sub"]))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user