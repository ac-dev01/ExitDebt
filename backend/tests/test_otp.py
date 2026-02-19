"""Unit tests for OTP service."""

import pytest
import asyncio
from app.integrations.mock_providers import MockOTPService


class TestOTPService:
    """Test OTP generation, verification, and expiry."""

    def setup_method(self):
        self.otp_service = MockOTPService()

    def test_send_otp_success(self):
        result = asyncio.get_event_loop().run_until_complete(
            self.otp_service.send_otp("9876543210")
        )
        assert result is True

    def test_verify_otp_success(self):
        loop = asyncio.get_event_loop()
        loop.run_until_complete(self.otp_service.send_otp("9876543210"))
        result = loop.run_until_complete(
            self.otp_service.verify_otp("9876543210", "123456")
        )
        assert result is True

    def test_verify_otp_wrong_code(self):
        loop = asyncio.get_event_loop()
        loop.run_until_complete(self.otp_service.send_otp("9876543210"))
        result = loop.run_until_complete(
            self.otp_service.verify_otp("9876543210", "000000")
        )
        assert result is False

    def test_verify_otp_no_code_sent(self):
        result = asyncio.get_event_loop().run_until_complete(
            self.otp_service.verify_otp("9876543210", "123456")
        )
        assert result is False

    def test_otp_consumed_after_verification(self):
        """OTP should be single-use."""
        loop = asyncio.get_event_loop()
        loop.run_until_complete(self.otp_service.send_otp("9876543210"))
        # First verify succeeds
        result1 = loop.run_until_complete(
            self.otp_service.verify_otp("9876543210", "123456")
        )
        assert result1 is True
        # Second verify fails (code consumed)
        result2 = loop.run_until_complete(
            self.otp_service.verify_otp("9876543210", "123456")
        )
        assert result2 is False

    def test_different_phones(self):
        """OTPs for different phones should be independent."""
        loop = asyncio.get_event_loop()
        loop.run_until_complete(self.otp_service.send_otp("9876543210"))
        loop.run_until_complete(self.otp_service.send_otp("9876543211"))

        # Verify phone 1
        result = loop.run_until_complete(
            self.otp_service.verify_otp("9876543210", "123456")
        )
        assert result is True

        # Phone 2's OTP should still work
        result = loop.run_until_complete(
            self.otp_service.verify_otp("9876543211", "123456")
        )
        assert result is True
