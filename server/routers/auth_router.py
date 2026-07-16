from fastapi import APIRouter

from controllers.auth_controller import signup_controller, login_controller
from models.schemas import SignupRequest, LoginRequest, TokenResponse

router = APIRouter()


@router.post("/auth/signup", response_model=TokenResponse)
async def signup(payload: SignupRequest):
    return await signup_controller(payload.email, payload.password)


@router.post("/auth/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    return await login_controller(payload.email, payload.password)