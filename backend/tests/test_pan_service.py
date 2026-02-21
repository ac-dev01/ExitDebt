"""Unit tests for Setu PAN verification service."""

import pytest
from app.services.setu_pan_service import (
    verify_pan,
    is_pan_valid,
    get_verified_name,
    _mock_verify_pan,
)


class TestMockPANVerification:
    """Test PAN verification in mock mode."""

    def test_valid_pan_sandbox(self):
        """ABCDE1234A (Setu sandbox valid PAN) → success."""
        result = _mock_verify_pan("ABCDE1234A", "Y", "Debt health check for ExitDebt user")
        assert result["verification"] == "success"
        assert result["message"] == "PAN is valid"
        assert result["data"]["full_name"] == "John Doe"
        assert result["data"]["category"] == "Individual"

    def test_invalid_pan_sandbox(self):
        """ABCDE1234B (Setu sandbox invalid PAN) → failed."""
        result = _mock_verify_pan("ABCDE1234B", "Y", "Debt health check for ExitDebt user")
        assert result["verification"] == "failed"
        assert result["message"] == "PAN is invalid"

    def test_exitdebt_profile_pan(self):
        """ABCDE1234F (ExitDebt mock profile) → success with Saurabh Mehta."""
        result = _mock_verify_pan("ABCDE1234F", "Y", "Debt health check for ExitDebt user")
        assert result["verification"] == "success"
        assert result["data"]["full_name"] == "Saurabh Mehta"

    def test_unknown_valid_pan(self):
        """Any valid-format PAN not in mock data → generic success."""
        result = _mock_verify_pan("ZZZZZ9999Z", "Y", "Debt health check for ExitDebt user")
        assert result["verification"] == "success"
        assert result["data"]["full_name"] == "ExitDebt User"

    def test_invalid_format_pan(self):
        """Invalid PAN format → error."""
        result = _mock_verify_pan("INVALID", "Y", "Debt health check for ExitDebt user")
        assert result["verification"] == "error"
        assert "format" in result["message"].lower()

    def test_missing_consent(self):
        """Consent != Y → error."""
        result = _mock_verify_pan("ABCDE1234A", "N", "Debt health check for ExitDebt user")
        assert result["verification"] == "error"
        assert "consent" in result["message"].lower()

    def test_short_reason(self):
        """Reason < 20 chars → error."""
        result = _mock_verify_pan("ABCDE1234A", "Y", "too short")
        assert result["verification"] == "error"
        assert "reason" in result["message"].lower()

    def test_lowercase_pan_normalizes(self):
        """Lowercase PAN should be normalized to uppercase."""
        result = _mock_verify_pan("abcde1234a", "Y", "Debt health check for ExitDebt user")
        assert result["verification"] == "success"

    def test_consent_case_insensitive(self):
        """Consent 'y' (lowercase) should work."""
        result = _mock_verify_pan("ABCDE1234A", "y", "Debt health check for ExitDebt user")
        assert result["verification"] == "success"


class TestPANHelpers:
    """Test helper functions."""

    def test_is_pan_valid_success(self):
        result = {"verification": "success"}
        assert is_pan_valid(result) is True

    def test_is_pan_valid_failure(self):
        result = {"verification": "failed"}
        assert is_pan_valid(result) is False

    def test_get_verified_name_success(self):
        result = {"verification": "success", "data": {"full_name": "Test User"}}
        assert get_verified_name(result) == "Test User"

    def test_get_verified_name_failure(self):
        result = {"verification": "failed", "data": {"full_name": ""}}
        assert get_verified_name(result) is None


class TestAsyncPANVerification:
    """Test the public async verify_pan function (mock mode)."""

    @pytest.mark.asyncio
    async def test_verify_pan_mock_mode(self):
        """verify_pan should use mock when SETU_PAN_PROVIDER=mock."""
        result = await verify_pan("ABCDE1234A")
        assert result["verification"] == "success"
        assert result["data"]["full_name"] == "John Doe"

    @pytest.mark.asyncio
    async def test_verify_pan_returns_dict(self):
        """verify_pan always returns a dict."""
        result = await verify_pan("ABCDE1234F")
        assert isinstance(result, dict)
        assert "verification" in result
