"""Internal admin API endpoints.

All endpoints require X-API-Key authentication.
Provides read access to users, health checks, callbacks, and dashboard stats.
"""

import math
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.utils.auth import require_api_key
from app.models.user import User
from app.models.health_score import HealthScore
from app.models.callback import Callback
from app.schemas.internal import (
    UserSummary,
    UserDetail,
    HealthScoreSummary,
    HealthCheckDetail,
    CallbackSummary,
    CallbackDetail,
    CallbackStatusUpdate,
    StatsOverview,
    PaginatedResponse,
)

router = APIRouter(
    prefix="/api/internal",
    tags=["Internal"],
    dependencies=[Depends(require_api_key)],
)


# ─── Users ─────────────────────────────────────────────────────────────────


@router.get("/users", response_model=PaginatedResponse)
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None, description="Search by phone number"),
    db: Session = Depends(get_db),
):
    """List all users with pagination and optional phone search."""
    query = db.query(User).filter(User.pan_hash != "DELETED")

    if search:
        query = query.filter(User.phone.contains(search))

    total = query.count()
    users = (
        query.order_by(User.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return PaginatedResponse(
        items=[
            UserSummary(
                id=str(u.id),
                name=u.name,
                phone=u.phone,
                created_at=u.created_at,
            ).model_dump()
            for u in users
        ],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total > 0 else 0,
    )


@router.get("/users/{user_id}", response_model=UserDetail)
async def get_user(user_id: str, db: Session = Depends(get_db)):
    """Get detailed user info including health scores and callbacks."""
    try:
        uid = UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    scores = (
        db.query(HealthScore)
        .filter(HealthScore.user_id == uid)
        .order_by(HealthScore.calculated_at.desc())
        .all()
    )

    callbacks = (
        db.query(Callback)
        .filter(Callback.user_id == uid)
        .order_by(Callback.created_at.desc())
        .all()
    )

    return UserDetail(
        id=str(user.id),
        name=user.name,
        phone=user.phone,
        pan_hash=user.pan_hash,
        consent_ts=user.consent_ts,
        created_at=user.created_at,
        health_scores=[
            HealthScoreSummary(
                id=str(s.id),
                score=s.score,
                avg_rate=s.avg_rate,
                savings_est=s.savings_est,
                calculated_at=s.calculated_at,
            )
            for s in scores
        ],
        callbacks=[
            CallbackSummary(
                id=str(c.id),
                user_id=str(c.user_id),
                preferred_time=c.preferred_time,
                status=c.status,
                created_at=c.created_at,
            )
            for c in callbacks
        ],
    )


# ─── Callbacks ─────────────────────────────────────────────────────────────


@router.get("/callbacks", response_model=PaginatedResponse)
async def list_callbacks(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None, description="Filter by status"),
    db: Session = Depends(get_db),
):
    """List all callbacks with optional status filter."""
    query = db.query(Callback)

    if status:
        query = query.filter(Callback.status == status)

    total = query.count()
    callbacks = (
        query.order_by(Callback.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = []
    for c in callbacks:
        user = db.query(User).filter(User.id == c.user_id).first()
        items.append(
            CallbackDetail(
                id=str(c.id),
                user_id=str(c.user_id),
                user_name=user.name if user else "Unknown",
                user_phone=user.phone if user else "Unknown",
                preferred_time=c.preferred_time,
                status=c.status,
                created_at=c.created_at,
            ).model_dump()
        )

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total > 0 else 0,
    )


@router.patch("/callbacks/{callback_id}/status")
async def update_callback_status(
    callback_id: str,
    payload: CallbackStatusUpdate,
    db: Session = Depends(get_db),
):
    """Update callback status (pending → confirmed → completed / cancelled)."""
    try:
        cid = UUID(callback_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid callback ID format.")

    callback = db.query(Callback).filter(Callback.id == cid).first()
    if not callback:
        raise HTTPException(status_code=404, detail="Callback not found.")

    callback.status = payload.status
    db.commit()

    return {"id": str(callback.id), "status": callback.status, "updated": True}


# ─── Health Checks ─────────────────────────────────────────────────────────


@router.get("/health-checks", response_model=PaginatedResponse)
async def list_health_checks(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all health checks with pagination."""
    total = db.query(HealthScore).count()
    scores = (
        db.query(HealthScore)
        .order_by(HealthScore.calculated_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = []
    for s in scores:
        user = db.query(User).filter(User.id == s.user_id).first()
        items.append(
            HealthCheckDetail(
                id=str(s.id),
                user_id=str(s.user_id),
                user_name=user.name if user else "Unknown",
                user_phone=user.phone if user else "Unknown",
                score=s.score,
                avg_rate=s.avg_rate,
                dti_ratio=s.dti_ratio,
                savings_est=s.savings_est,
                calculated_at=s.calculated_at,
            ).model_dump()
        )

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total > 0 else 0,
    )


@router.get("/health-checks/{check_id}", response_model=HealthCheckDetail)
async def get_health_check(check_id: str, db: Session = Depends(get_db)):
    """Get a single health check detail."""
    try:
        cid = UUID(check_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid health check ID format.")

    score = db.query(HealthScore).filter(HealthScore.id == cid).first()
    if not score:
        raise HTTPException(status_code=404, detail="Health check not found.")

    user = db.query(User).filter(User.id == score.user_id).first()

    return HealthCheckDetail(
        id=str(score.id),
        user_id=str(score.user_id),
        user_name=user.name if user else "Unknown",
        user_phone=user.phone if user else "Unknown",
        score=score.score,
        avg_rate=score.avg_rate,
        dti_ratio=score.dti_ratio,
        savings_est=score.savings_est,
        calculated_at=score.calculated_at,
    )


# ─── Stats ─────────────────────────────────────────────────────────────────


@router.get("/stats/overview", response_model=StatsOverview)
async def get_stats(db: Session = Depends(get_db)):
    """Dashboard stats overview."""
    total_users = db.query(User).filter(User.pan_hash != "DELETED").count()
    total_checks = db.query(HealthScore).count()
    total_callbacks = db.query(Callback).count()

    avg_score = db.query(func.avg(HealthScore.score)).scalar()
    total_savings = db.query(func.sum(HealthScore.savings_est)).scalar()

    callback_counts = {}
    for s in ["pending", "confirmed", "completed", "cancelled"]:
        callback_counts[s] = db.query(Callback).filter(Callback.status == s).count()

    return StatsOverview(
        total_users=total_users,
        total_health_checks=total_checks,
        total_callbacks=total_callbacks,
        avg_health_score=round(avg_score, 1) if avg_score else None,
        total_savings_found=round(total_savings, 0) if total_savings else None,
        callbacks_pending=callback_counts.get("pending", 0),
        callbacks_confirmed=callback_counts.get("confirmed", 0),
        callbacks_completed=callback_counts.get("completed", 0),
        callbacks_cancelled=callback_counts.get("cancelled", 0),
    )
