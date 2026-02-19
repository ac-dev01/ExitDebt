"""User management endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.user import UserDeleteRequest, UserResponse
from app.models.user import User
from app.utils.audit import log_event

router = APIRouter(prefix="/api/user", tags=["User"])


@router.delete("/delete-request", response_model=UserResponse)
async def request_deletion(
    payload: UserDeleteRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """Request user data deletion (GDPR/DPDPA compliance)."""
    client_ip = request.client.host if request.client else None

    try:
        user_uuid = UUID(payload.user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    user = db.query(User).filter(User.id == user_uuid, User.phone == payload.phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found or phone mismatch.")

    # Audit log before deletion
    log_event(
        db=db,
        event_type="user_delete_request",
        user_id=user.id,
        phone=user.phone,
        ip_address=client_ip,
    )

    # Soft delete: remove sensitive data but keep audit trail
    user.pan_hash = "DELETED"
    user.name = "DELETED"
    user.phone = "DELETED"
    db.commit()

    return UserResponse(
        success=True,
        message="Your data deletion request has been processed. Personal data has been removed.",
    )
