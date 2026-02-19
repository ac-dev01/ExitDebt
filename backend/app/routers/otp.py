"""OTP endpoints — send and verify OTP codes."""

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.otp import OTPSendRequest, OTPVerifyRequest, OTPResponse
from app.services.otp_service import get_otp_service
from app.utils.audit import log_event
from app.utils.security import create_access_token

router = APIRouter(prefix="/api/otp", tags=["OTP"])


@router.post("/send", response_model=OTPResponse)
async def send_otp(payload: OTPSendRequest, request: Request, db: Session = Depends(get_db)):
    """Send OTP to the provided phone number."""
    # Validate phone format
    if not payload.validate_phone():
        raise HTTPException(status_code=400, detail="Invalid phone number. Must be a 10-digit Indian mobile number.")

    # Log audit event
    log_event(
        db=db,
        event_type="otp_send",
        phone=payload.phone,
        ip_address=request.client.host if request.client else None,
    )

    # Send OTP
    otp_service = get_otp_service()
    success = await otp_service.send_otp(payload.phone)

    if not success:
        raise HTTPException(status_code=500, detail="Failed to send OTP. Please try again.")

    return OTPResponse(success=True, message="OTP sent successfully")


@router.post("/verify", response_model=OTPResponse)
async def verify_otp(payload: OTPVerifyRequest, request: Request, db: Session = Depends(get_db)):
    """Verify OTP code and return a session token."""
    otp_service = get_otp_service()
    is_valid = await otp_service.verify_otp(payload.phone, payload.otp_code)

    client_ip = request.client.host if request.client else None

    if not is_valid:
        log_event(
            db=db,
            event_type="otp_verify_fail",
            phone=payload.phone,
            ip_address=client_ip,
        )
        raise HTTPException(status_code=400, detail="Invalid or expired OTP code.")

    # Log success
    log_event(
        db=db,
        event_type="otp_verify_success",
        phone=payload.phone,
        ip_address=client_ip,
    )

    # Create session token
    token = create_access_token(data={"phone": payload.phone})

    return OTPResponse(success=True, message="OTP verified successfully", token=token)
