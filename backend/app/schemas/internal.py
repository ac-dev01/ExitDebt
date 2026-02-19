"""Response schemas for internal admin API endpoints."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ─── User ──────────────────────────────────────────────────────────────────

class UserSummary(BaseModel):
    id: str
    name: str
    phone: str
    created_at: datetime


class UserDetail(BaseModel):
    id: str
    name: str
    phone: str
    pan_hash: str
    consent_ts: datetime
    created_at: datetime
    health_scores: List["HealthScoreSummary"]
    callbacks: List["CallbackSummary"]


# ─── Health Score ──────────────────────────────────────────────────────────

class HealthScoreSummary(BaseModel):
    id: str
    score: int
    avg_rate: Optional[float] = None
    savings_est: Optional[float] = None
    calculated_at: datetime


class HealthCheckDetail(BaseModel):
    id: str
    user_id: str
    user_name: str
    user_phone: str
    score: int
    avg_rate: Optional[float] = None
    dti_ratio: Optional[float] = None
    savings_est: Optional[float] = None
    calculated_at: datetime


# ─── Callback ──────────────────────────────────────────────────────────────

class CallbackSummary(BaseModel):
    id: str
    user_id: str
    preferred_time: datetime
    status: str
    created_at: datetime


class CallbackDetail(BaseModel):
    id: str
    user_id: str
    user_name: str
    user_phone: str
    preferred_time: datetime
    status: str
    created_at: datetime


class CallbackStatusUpdate(BaseModel):
    status: str = Field(
        ...,
        description="New status: pending, confirmed, completed, or cancelled",
        pattern="^(pending|confirmed|completed|cancelled)$",
    )


# ─── Stats ─────────────────────────────────────────────────────────────────

class StatsOverview(BaseModel):
    total_users: int
    total_health_checks: int
    total_callbacks: int
    avg_health_score: Optional[float] = None
    total_savings_found: Optional[float] = None
    callbacks_pending: int
    callbacks_confirmed: int
    callbacks_completed: int
    callbacks_cancelled: int


# ─── Paginated ─────────────────────────────────────────────────────────────

class PaginatedResponse(BaseModel):
    items: List[dict]
    total: int
    page: int
    page_size: int
    total_pages: int


# Rebuild forward refs
UserDetail.model_rebuild()
