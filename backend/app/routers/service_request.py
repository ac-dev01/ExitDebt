"""ServiceRequest API endpoints.

Handles Shield service requests for harassment protection and creditor communication.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.service_request import ServiceRequest
from app.models.subscription import Subscription
from app.schemas.service_request import (
    ServiceRequestCreate,
    ServiceRequestResponse,
    ServiceRequestListResponse,
)
from app.services.callback_service import get_crm_service
from app.utils.audit import log_event

router = APIRouter(prefix="/api/service-request", tags=["Service Requests"])

VALID_TYPES = {"harassment", "creditor_comms"}


@router.post("", response_model=ServiceRequestResponse)
async def create_service_request(
    payload: ServiceRequestCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    """Create a new service request (Shield users only).

    Validates:
    - User exists
    - User has active Shield subscription
    - Valid request type
    """
    try:
        uid = UUID(payload.user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Validate Shield subscription
    active_sub = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == uid,
            Subscription.tier == "shield",
            Subscription.status == "active",
        )
        .first()
    )
    if not active_sub:
        raise HTTPException(
            status_code=403,
            detail="Service requests require an active Shield subscription.",
        )

    if payload.type not in VALID_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid type: {payload.type}. Must be one of {VALID_TYPES}",
        )

    sr = ServiceRequest(
        user_id=uid,
        type=payload.type,
        details=payload.details,
    )
    db.add(sr)
    db.commit()
    db.refresh(sr)

    # Push to CRM
    crm_service = get_crm_service()
    try:
        await crm_service.create_lead({
            "name": user.name,
            "phone": user.phone,
            "type": f"service_request_{payload.type}",
            "request_id": str(sr.id),
        })
    except Exception:
        pass  # CRM failure does not block

    # Audit
    client_ip = request.client.host if request.client else None
    log_event(
        db=db,
        event_type="service_request_created",
        user_id=uid,
        phone=user.phone,
        ip_address=client_ip,
        metadata={"type": payload.type, "request_id": str(sr.id)},
    )

    return ServiceRequestResponse(
        id=str(sr.id),
        user_id=str(sr.user_id),
        type=sr.type,
        status=sr.status,
        details=sr.details,
        assigned_to=sr.assigned_to,
        created_at=sr.created_at,
        resolved_at=sr.resolved_at,
    )


@router.get("/{user_id}", response_model=ServiceRequestListResponse)
async def list_service_requests(
    user_id: str,
    db: Session = Depends(get_db),
):
    """List all service requests for a user."""
    try:
        uid = UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    requests = (
        db.query(ServiceRequest)
        .filter(ServiceRequest.user_id == uid)
        .order_by(ServiceRequest.created_at.desc())
        .all()
    )

    return ServiceRequestListResponse(
        requests=[
            ServiceRequestResponse(
                id=str(r.id),
                user_id=str(r.user_id),
                type=r.type,
                status=r.status,
                details=r.details,
                assigned_to=r.assigned_to,
                created_at=r.created_at,
                resolved_at=r.resolved_at,
            )
            for r in requests
        ],
        total=len(requests),
    )
