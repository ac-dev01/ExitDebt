"""Callback scheduling endpoints."""

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.callback import CallbackRequest, CallbackResponse
from app.models.callback import Callback
from app.models.user import User
from app.models.health_score import HealthScore
from app.services.callback_service import get_crm_service
from app.utils.audit import log_event

router = APIRouter(prefix="/api/callback", tags=["Callback"])


@router.post("", response_model=CallbackResponse)
async def create_callback(
    payload: CallbackRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """Schedule a callback and create a lead in CRM."""
    client_ip = request.client.host if request.client else None

    # Validate user exists
    try:
        user_uuid = UUID(payload.user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    user = db.query(User).filter(User.id == user_uuid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Validate preferred time is in the future
    if payload.preferred_time < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Preferred callback time must be in the future.")

    # Create callback record
    callback = Callback(
        user_id=user.id,
        preferred_time=payload.preferred_time,
        status="pending",
    )
    db.add(callback)
    db.commit()
    db.refresh(callback)

    # Get latest health score for CRM lead data
    latest_score = (
        db.query(HealthScore)
        .filter(HealthScore.user_id == user.id)
        .order_by(HealthScore.calculated_at.desc())
        .first()
    )

    # Push lead to CRM
    crm_service = get_crm_service()
    try:
        lead_data = {
            "name": user.name,
            "phone": user.phone,
            "preferred_time": payload.preferred_time.isoformat(),
            "score": latest_score.score if latest_score else None,
            "total_outstanding": latest_score.savings_est if latest_score else None,
        }
        await crm_service.create_lead(lead_data)
    except Exception:
        pass  # CRM failure should not block callback creation

    # Audit log
    log_event(
        db=db,
        event_type="callback_request",
        user_id=user.id,
        phone=user.phone,
        ip_address=client_ip,
        metadata={"preferred_time": payload.preferred_time.isoformat()},
    )

    return CallbackResponse(
        id=str(callback.id),
        user_id=str(callback.user_id),
        preferred_time=callback.preferred_time,
        status=callback.status,
        message="Callback scheduled successfully. Our advisor will call you at the selected time.",
    )
