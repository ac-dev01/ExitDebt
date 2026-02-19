"""Abstract base classes for all external service integrations.

Use dependency injection — swap providers without changing business logic.
"""

from abc import ABC, abstractmethod
from typing import Optional, Dict, Any


class CIBILServiceBase(ABC):
    """CIBIL credit bureau integration."""

    @abstractmethod
    async def pull_report(self, pan: str, name: str, phone: str) -> Dict[str, Any]:
        """
        Pull credit report from CIBIL.

        Returns:
            {
                "credit_score": int,
                "accounts": [
                    {
                        "lender_name": str,
                        "account_type": str,
                        "outstanding": float,
                        "interest_rate": float,
                        "emi_amount": float,
                        "status": str,
                        "utilization": float,  # 0-1 for revolving credit
                        "payment_history": float,  # 0-1 score
                    }
                ],
                "raw_data": str,  # Full JSON response for encrypted storage
            }
        """
        ...


class OTPServiceBase(ABC):
    """OTP SMS provider integration."""

    @abstractmethod
    async def send_otp(self, phone: str) -> bool:
        """Send OTP to phone number. Returns True on success."""
        ...

    @abstractmethod
    async def verify_otp(self, phone: str, otp_code: str) -> bool:
        """Verify OTP code. Returns True if valid."""
        ...


class CRMServiceBase(ABC):
    """CRM integration (Zoho)."""

    @abstractmethod
    async def create_lead(self, data: Dict[str, Any]) -> Optional[str]:
        """
        Create a lead in CRM.

        Args:
            data: {name, phone, preferred_time, score, total_outstanding}

        Returns:
            Lead ID from CRM or None on failure.
        """
        ...


class WhatsAppServiceBase(ABC):
    """WhatsApp messaging integration."""

    @abstractmethod
    async def send_message(self, phone: str, message: str) -> bool:
        """Send a WhatsApp message. Returns True on success."""
        ...

    @abstractmethod
    def generate_share_link(self, text: str) -> str:
        """Generate a WhatsApp share link."""
        ...


class PaymentServiceBase(ABC):
    """UPI payment integration."""

    @abstractmethod
    async def create_order(self, amount: float, user_id: str, description: str) -> Dict[str, Any]:
        """
        Create a payment order.

        Returns:
            {"order_id": str, "payment_url": str, "status": str}
        """
        ...

    @abstractmethod
    async def verify_payment(self, order_id: str) -> Dict[str, Any]:
        """
        Verify payment status.

        Returns:
            {"order_id": str, "status": str, "amount": float}
        """
        ...
