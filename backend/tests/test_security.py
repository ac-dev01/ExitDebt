"""Unit tests for security utilities."""

import pytest
from app.utils.security import hash_pan, mask_pan, encrypt_data, decrypt_data


class TestPANHashing:
    def test_hash_consistency(self):
        """Same PAN should always produce same hash."""
        hash1 = hash_pan("ABCDE1234F")
        hash2 = hash_pan("ABCDE1234F")
        assert hash1 == hash2

    def test_hash_case_insensitive(self):
        """PAN hashing should be case-insensitive."""
        hash1 = hash_pan("ABCDE1234F")
        hash2 = hash_pan("abcde1234f")
        assert hash1 == hash2

    def test_hash_is_64_chars(self):
        """SHA-256 produces 64-character hex digest."""
        h = hash_pan("ABCDE1234F")
        assert len(h) == 64

    def test_different_pans_different_hashes(self):
        h1 = hash_pan("ABCDE1234F")
        h2 = hash_pan("XYZAB9876C")
        assert h1 != h2


class TestPANMasking:
    def test_mask_format(self):
        """PAN ABCDE1234F → A****1234F."""
        masked = mask_pan("ABCDE1234F")
        assert masked == "A****1234F"

    def test_mask_invalid_length(self):
        masked = mask_pan("ABC")
        assert masked == "****"

    def test_mask_case_handling(self):
        masked = mask_pan("abcde1234f")
        assert masked == "A****1234F"


class TestAESEncryption:
    def test_encrypt_decrypt_roundtrip(self):
        """Data should survive encrypt→decrypt round trip."""
        original = "This is sensitive CIBIL data with score 750"
        encrypted = encrypt_data(original)
        decrypted = decrypt_data(encrypted)
        assert decrypted == original

    def test_encrypted_differs_from_plaintext(self):
        original = "sensitive data"
        encrypted = encrypt_data(original)
        assert encrypted != original

    def test_different_encryptions_differ(self):
        """Each encryption should use a different IV, producing different ciphertext."""
        original = "same data"
        enc1 = encrypt_data(original)
        enc2 = encrypt_data(original)
        assert enc1 != enc2  # Different IVs

    def test_large_data(self):
        """Encryption should handle large payloads."""
        original = "x" * 100000
        encrypted = encrypt_data(original)
        decrypted = decrypt_data(encrypted)
        assert decrypted == original

    def test_unicode_data(self):
        """Encryption should handle Unicode."""
        original = "₹50,000 — CIBIL रिपोर्ट"
        encrypted = encrypt_data(original)
        decrypted = decrypt_data(encrypted)
        assert decrypted == original
