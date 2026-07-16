from fastapi import APIRouter, UploadFile, File, Form, Depends

from controllers.item_controller import (
    detect_objects_controller,
    analyze_item_controller,
    feedback_controller
)
from controllers.auth_controller import get_current_user
from models.schemas import FeedbackRequest

router = APIRouter()


@router.post("/detect")
async def detect_objects(image: UploadFile = File(...)):
    return await detect_objects_controller(image)


@router.post("/analyze")
async def analyze_item(
    image: UploadFile = File(...),
    skill_level: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    return await analyze_item_controller(image, skill_level, current_user["id"])


@router.post("/feedback")
async def submit_feedback(
    payload: FeedbackRequest,
    current_user: dict = Depends(get_current_user)
):
    return await feedback_controller(
        current_user["id"], payload.source, payload.id,
        payload.title, payload.tags, payload.vote
    )