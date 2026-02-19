"""Security utilities — PAN hashing, AES encryption, JWT tokens, PAN masking."""

import hashlib
import base64
import os
from datetime import datetime, timedelta
from typing import Optional

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
from jose import jwt, JWTError

from app.config import get_settings


# ─── PAN Hashing ──────────────────────────────────────────────────────────────

def hash_pan(pan: str) -> str:
    """Hash PAN using SHA-256. Never store raw PAN."""
    return hashlib.sha256(pan.upper().strip().encode("utf-8")).hexdigest()


def mask_pan(pan: str) -> str:
    """Mask PAN for display: ABCDE1234F → A****234F."""
    pan = pan.upper().strip()
    if len(pan) != 10:
        return "****"
    return f"{pan[0]}****{pan[5:9]}{pan[9]}"


# ─── AES-256 Encryption ──────────────────────────────────────────────────────

def _get_aes_key() -> bytes:
    """Get AES key from settings (32 bytes for AES-256)."""
    key_hex = get_settings().AES_ENCRYPTION_KEY
    key_bytes = bytes.fromhex(key_hex)
    # Pad or truncate to 32 bytes for AES-256
    if len(key_bytes) < 32:
        key_bytes = key_bytes.ljust(32, b'\0')
    return key_bytes[:32]


def encrypt_data(plaintext: str) -> str:
    """Encrypt data using AES-256-CBC. Returns base64(iv + ciphertext)."""
    key = _get_aes_key()
    iv = os.urandom(16)
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(plaintext.encode("utf-8")) + padder.finalize()

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()

    return base64.b64encode(iv + ciphertext).decode("utf-8")


def decrypt_data(encrypted: str) -> str:
    """Decrypt AES-256-CBC encrypted data."""
    key = _get_aes_key()
    raw = base64.b64decode(encrypted)
    iv = raw[:16]
    ciphertext = raw[16:]

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    padded_data = decryptor.update(ciphertext) + decryptor.finalize()

    unpadder = padding.PKCS7(128).unpadder()
    plaintext = unpadder.update(padded_data) + unpadder.finalize()

    return plaintext.decode("utf-8")


# ─── JWT Tokens ───────────────────────────────────────────────────────────────

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    settings = get_settings()
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")


def verify_token(token: str) -> Optional[dict]:
    """Verify and decode a JWT token. Returns payload or None."""
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except JWTError:
        return None
