from pydantic import BaseModel, EmailStr
from typing import List, Optional


class DetectedItem(BaseModel):
    item: str
    condition: str
    material: str


class DetectResponse(BaseModel):
    provider_used: str
    detected_items: List[DetectedItem]


class MatchDetail(BaseModel):
    source: str
    id: str
    title: str
    reason: str
    missing_items: List[str]
    adapted_steps: List[str]
    estimated_time_minutes: int
    difficulty: str
    safety_notes: List[str]
    url: Optional[str] = None
    channel: Optional[str] = None
    thumbnail: Optional[str] = None


class NoSuitableIdeaResponse(BaseModel):
    recommendation: str
    reason: str
    fallback_suggestion: str


class FeedbackRequest(BaseModel):
    source: str        # "kb_project" or "youtube_video"
    id: str             # project_id or video_id
    title: Optional[str] = None
    tags: Optional[List[str]] = []
    vote: str            # "like" or "dislike"


class SignupRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    email: str