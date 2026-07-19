from fastapi import APIRouter, Depends

from controllers.auth_controller import (
    signup_controller,
    login_controller,
    get_current_user,
)
from models.schemas import SignupRequest, LoginRequest

router = APIRouter()


@router.post("/auth/signup")
async def signup(payload: SignupRequest):
    return await signup_controller(payload.email, payload.password)


@router.post("/auth/login")
async def login(payload: LoginRequest):
    return await login_controller(payload.email, payload.password)


@router.get("/auth/me")
async def me(current_user: dict = Depends(get_current_user)):
    return current_user