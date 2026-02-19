"""Advisory plan service."""

from typing import Dict, Any
from app.integrations.base import PaymentServiceBase
from app.integrations.mock_providers import MockPaymentService

_payment_service: PaymentServiceBase = MockPaymentService()

# Pricing tiers
ADVISORY_TIERS: Dict[str, Dict[str, Any]] = {
    "basic": {
        "price": 499.0,
        "description": "Basic Debt Analysis Report",
        "features": [
            "Detailed debt breakdown",
            "Savings opportunities",
            "Basic restructuring plan",
        ],
    },
    "standard": {
        "price": 1499.0,
        "description": "Standard Advisory Package",
        "features": [
            "Everything in Basic",
            "1-on-1 advisor consultation (30 min)",
            "Custom restructuring strategy",
            "Lender negotiation guidance",
        ],
    },
    "premium": {
        "price": 2999.0,
        "description": "Premium Advisory Package",
        "features": [
            "Everything in Standard",
            "3 advisor consultations (30 min each)",
            "Active lender negotiation support",
            "Settlement tracking dashboard",
            "Priority support for 3 months",
        ],
    },
}


def get_payment_service() -> PaymentServiceBase:
    return _payment_service


def set_payment_service(service: PaymentServiceBase) -> None:
    global _payment_service
    _payment_service = service


def get_tier_info(tier: str) -> Dict[str, Any] | None:
    return ADVISORY_TIERS.get(tier)
