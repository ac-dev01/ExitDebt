"""Unit tests for mock service providers.

Covers:
- MockCRMService (lead creation)
- MockPaymentService (order creation, verification)
- MockWhatsAppService (message sending, share link generation)
- MockCIBILService (credit report generation)
"""

import pytest
import asyncio
from app.integrations.mock_providers import (
    MockCRMService,
    MockPaymentService,
    MockWhatsAppService,
    MockCIBILService,
)


class TestMockCRMService:
    """Test mock CRM lead creation."""

    def setup_method(self):
        self.crm = MockCRMService()

    def test_create_lead_returns_id(self):
        lead_id = asyncio.get_event_loop().run_until_complete(
            self.crm.create_lead({"name": "Test User", "phone": "9876543210"})
        )
        assert lead_id is not None
        assert lead_id.startswith("MOCK_LEAD_")

    def test_create_lead_unique_ids(self):
        loop = asyncio.get_event_loop()
        id1 = loop.run_until_complete(self.crm.create_lead({"name": "A"}))
        id2 = loop.run_until_complete(self.crm.create_lead({"name": "B"}))
        assert id1 != id2


class TestMockPaymentService:
    """Test mock payment order + verification flow."""

    def setup_method(self):
        self.payment = MockPaymentService()

    def test_create_order_returns_order_data(self):
        order = asyncio.get_event_loop().run_until_complete(
            self.payment.create_order(499.0, "user_123", "Basic plan")
        )
        assert "order_id" in order
        assert order["status"] == "created"
        assert order["amount"] == 499.0
        assert "payment_url" in order

    def test_create_order_id_format(self):
        order = asyncio.get_event_loop().run_until_complete(
            self.payment.create_order(100.0, "user_1", "Test")
        )
        assert order["order_id"].startswith("MOCK_ORDER_")

    def test_verify_payment_succeeds(self):
        loop = asyncio.get_event_loop()
        order = loop.run_until_complete(
            self.payment.create_order(999.0, "user_1", "Test")
        )
        result = loop.run_until_complete(
            self.payment.verify_payment(order["order_id"])
        )
        assert result["status"] == "paid"

    def test_verify_unknown_order(self):
        result = asyncio.get_event_loop().run_until_complete(
            self.payment.verify_payment("NONEXISTENT_ORDER")
        )
        assert result["status"] == "not_found"
        assert result["amount"] == 0

    def test_payment_url_contains_upi(self):
        order = asyncio.get_event_loop().run_until_complete(
            self.payment.create_order(499.0, "u1", "Test")
        )
        assert "upi://" in order["payment_url"]


class TestMockWhatsAppService:
    """Test mock WhatsApp messaging."""

    def setup_method(self):
        self.wa = MockWhatsAppService()

    def test_send_message_returns_true(self):
        result = asyncio.get_event_loop().run_until_complete(
            self.wa.send_message("9876543210", "Hello!")
        )
        assert result is True

    def test_generate_share_link_format(self):
        link = self.wa.generate_share_link("Check out ExitDebt!")
        assert link.startswith("https://wa.me/?text=")
        assert "ExitDebt" in link


class TestMockCIBILService:
    """Test mock credit report generation."""

    def setup_method(self):
        self.cibil = MockCIBILService()

    def test_pull_report_returns_score(self):
        report = asyncio.get_event_loop().run_until_complete(
            self.cibil.pull_report("ABCDE1234F", "Test User", "9876543210")
        )
        assert "credit_score" in report
        assert 550 <= report["credit_score"] <= 850

    def test_pull_report_returns_accounts(self):
        report = asyncio.get_event_loop().run_until_complete(
            self.cibil.pull_report("ABCDE1234F", "Test User", "9876543210")
        )
        assert "accounts" in report
        assert len(report["accounts"]) > 0

    def test_pull_report_returns_raw_data(self):
        report = asyncio.get_event_loop().run_until_complete(
            self.cibil.pull_report("ABCDE1234F", "Test User", "9876543210")
        )
        assert "raw_data" in report
        assert isinstance(report["raw_data"], str)

    def test_accounts_have_required_fields(self):
        report = asyncio.get_event_loop().run_until_complete(
            self.cibil.pull_report("ABCDE1234F", "Test User", "9876543210")
        )
        required = {"lender_name", "account_type", "outstanding", "interest_rate", "status"}
        for account in report["accounts"]:
            assert required.issubset(account.keys())
