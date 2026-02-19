"""OTP request/response schemas."""

from pydantic import BaseModel, Field
import re


class OTPSendRequest(BaseModel):
    phone: str = Field(..., description="10-digit Indian phone number", examples=["9876543210"])

    def validate_phone(self) -> bool:
        return bool(re.match(r"^[6-9]\d{9}$", self.phone))


class OTPVerifyRequest(BaseModel):
    phone: str = Field(..., description="Phone number used for OTP")
    otp_code: str = Field(..., min_length=6, max_length=6, description="6-digit OTP code")


class OTPResponse(BaseModel):
    success: bool
    message: str
    token: str | None = None
