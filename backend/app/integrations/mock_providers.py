"""Mock implementations of all service integrations for development.

These return realistic dummy data so the full flow can be tested
without any external API keys or services.
"""

import random
import string
import json
from datetime import datetime
from typing import Optional, Dict, Any
from urllib.parse import quote

from app.integrations.base import (
    CIBILServiceBase,
    OTPServiceBase,
    CRMServiceBase,
    WhatsAppServiceBase,
    PaymentServiceBase,
)


class MockOTPService(OTPServiceBase):
    """Mock OTP service — stores codes in memory. OTP is always 123456 in dev."""

    def __init__(self):
        self._codes: Dict[str, str] = {}

    async def send_otp(self, phone: str) -> bool:
        code = "123456"  # Fixed code for development
        self._codes[phone] = code
        print(f"[MOCK OTP] Sent OTP {code} to {phone}")
        return True

    async def verify_otp(self, phone: str, otp_code: str) -> bool:
        stored = self._codes.get(phone)
        if stored and stored == otp_code:
            del self._codes[phone]
            return True
        return False


class MockCIBILService(CIBILServiceBase):
    """Mock CIBIL service — returns realistic dummy credit data."""

    async def pull_report(self, pan: str, name: str, phone: str) -> Dict[str, Any]:
        # Simulate varied credit profiles based on PAN hash
        score = random.randint(550, 850)

        accounts = [
            {
                "lender_name": "HDFC Bank",
                "account_type": "personal_loan",
                "outstanding": round(random.uniform(50000, 500000), 2),
                "interest_rate": round(random.uniform(12, 24), 2),
                "emi_amount": round(random.uniform(5000, 25000), 2),
                "status": "active",
                "utilization": 0.0,
                "payment_history": round(random.uniform(0.7, 1.0), 2),
            },
            {
                "lender_name": "ICICI Bank",
                "account_type": "credit_card",
                "outstanding": round(random.uniform(10000, 200000), 2),
                "interest_rate": round(random.uniform(30, 42), 2),
                "emi_amount": 0,
                "status": "active",
                "utilization": round(random.uniform(0.3, 0.95), 2),
                "payment_history": round(random.uniform(0.5, 1.0), 2),
            },
            {
                "lender_name": "SBI",
                "account_type": "home_loan",
                "outstanding": round(random.uniform(1000000, 5000000), 2),
                "interest_rate": round(random.uniform(8.5, 11), 2),
                "emi_amount": round(random.uniform(15000, 50000), 2),
                "status": "active",
                "utilization": 0.0,
                "payment_history": round(random.uniform(0.8, 1.0), 2),
            },
            {
                "lender_name": "Bajaj Finserv",
                "account_type": "personal_loan",
                "outstanding": round(random.uniform(20000, 300000), 2),
                "interest_rate": round(random.uniform(16, 28), 2),
                "emi_amount": round(random.uniform(3000, 15000), 2),
                "status": random.choice(["active", "overdue"]),
                "utilization": 0.0,
                "payment_history": round(random.uniform(0.4, 0.9), 2),
            },
        ]

        raw_data = json.dumps({
            "score": score,
            "accounts": accounts,
            "report_date": datetime.utcnow().isoformat(),
            "pan_ref": pan[:2] + "****" + pan[-2:],
        })

        return {
            "credit_score": score,
            "accounts": accounts,
            "raw_data": raw_data,
        }


class MockCRMService(CRMServiceBase):
    """Mock Zoho CRM — logs lead creation."""

    async def create_lead(self, data: Dict[str, Any]) -> Optional[str]:
        lead_id = "MOCK_LEAD_" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
        print(f"[MOCK CRM] Created lead {lead_id}: {json.dumps(data, default=str)}")
        return lead_id


class MockWhatsAppService(WhatsAppServiceBase):
    """Mock WhatsApp — logs messages, generates real share links."""

    async def send_message(self, phone: str, message: str) -> bool:
        print(f"[MOCK WHATSAPP] Message to {phone}: {message}")
        return True

    def generate_share_link(self, text: str) -> str:
        return f"https://wa.me/?text={quote(text)}"


class MockPaymentService(PaymentServiceBase):
    """Mock UPI payment — simulates order creation and verification."""

    def __init__(self):
        self._orders: Dict[str, Dict[str, Any]] = {}

    async def create_order(self, amount: float, user_id: str, description: str) -> Dict[str, Any]:
        order_id = "MOCK_ORDER_" + "".join(random.choices(string.digits, k=10))
        order = {
            "order_id": order_id,
            "payment_url": f"upi://pay?pa=exitdebt@ybl&pn=ExitDebt&am={amount}&tn={quote(description)}",
            "status": "created",
            "amount": amount,
        }
        self._orders[order_id] = order
        print(f"[MOCK PAYMENT] Created order {order_id} for ₹{amount}")
        return order

    async def verify_payment(self, order_id: str) -> Dict[str, Any]:
        order = self._orders.get(order_id)
        if order:
            order["status"] = "paid"  # Always succeed in mock mode
            return order
        return {"order_id": order_id, "status": "not_found", "amount": 0}
