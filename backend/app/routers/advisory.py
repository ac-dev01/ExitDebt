"""Advisory plan endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.advisory import AdvisoryPurchaseRequest, AdvisoryResponse
from app.models.advisory_plan import AdvisoryPlan
from app.models.user import User
from app.services.advisory_service import get_payment_service, get_tier_info
from app.utils.audit import log_event

router = APIRouter(prefix="/api/advisory", tags=["Advisory"])


@router.post("/purchase", response_model=AdvisoryResponse)
async def purchase_advisory(
    payload: AdvisoryPurchaseRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """Initiate an advisory plan purchase via UPI."""
    client_ip = request.client.host if request.client else None

    # Validate user
    try:
        user_uuid = UUID(payload.user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    user = db.query(User).filter(User.id == user_uuid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Validate tier
    tier_info = get_tier_info(payload.tier)
    if not tier_info:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid tier '{payload.tier}'. Available tiers: basic, standard, premium",
        )

    # Create payment order
    payment_service = get_payment_service()
    try:
        order = await payment_service.create_order(
            amount=tier_info["price"],
            user_id=str(user.id),
            description=tier_info["description"],
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail="Payment service unavailable. Please try again.")

    # Create advisory plan
    plan = AdvisoryPlan(
        user_id=user.id,
        tier=payload.tier,
        price=tier_info["price"],
        status="pending",
        plan_data_json={
            "order_id": order["order_id"],
            "features": tier_info["features"],
            "description": tier_info["description"],
        },
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)

    # Audit log
    log_event(
        db=db,
        event_type="advisory_purchase",
        user_id=user.id,
        phone=user.phone,
        ip_address=client_ip,
        metadata={"tier": payload.tier, "price": tier_info["price"], "order_id": order["order_id"]},
    )

    return AdvisoryResponse(
        id=str(plan.id),
        user_id=str(plan.user_id),
        tier=plan.tier,
        price=plan.price,
        status=plan.status,
        plan_data=plan.plan_data_json,
        payment_url=order.get("payment_url"),
        message=f"Advisory plan ({payload.tier}) created. Complete payment to activate.",
    )


@router.get("/{advisory_id}", response_model=AdvisoryResponse)
async def get_advisory(advisory_id: str, db: Session = Depends(get_db)):
    """Get advisory plan details."""
    try:
        plan_uuid = UUID(advisory_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid advisory ID format.")

    plan = db.query(AdvisoryPlan).filter(AdvisoryPlan.id == plan_uuid).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Advisory plan not found.")

    return AdvisoryResponse(
        id=str(plan.id),
        user_id=str(plan.user_id),
        tier=plan.tier,
        price=plan.price,
        status=plan.status,
        plan_data=plan.plan_data_json,
        message=f"Advisory plan ({plan.tier}) — Status: {plan.status}",
    )
