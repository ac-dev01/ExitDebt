"""OTP service — wraps the OTP provider integration."""

from app.integrations.base import OTPServiceBase
from app.integrations.mock_providers import MockOTPService

# Default to mock provider — swap via dependency injection
_otp_service: OTPServiceBase = MockOTPService()


def get_otp_service() -> OTPServiceBase:
    """Get the active OTP service instance."""
    return _otp_service


def set_otp_service(service: OTPServiceBase) -> None:
    """Replace the OTP service provider (for testing or prod config)."""
    global _otp_service
    _otp_service = service
