"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings with environment variable loading."""

    # Database
    DATABASE_URL: str = "postgresql://exitdebt:exitdebt@localhost:5432/exitdebt"

    # Security
    SECRET_KEY: str = "change-me-in-production"
    AES_ENCRYPTION_KEY: str = "0123456789abcdef0123456789abcdef"  # 32 hex chars = 16 bytes
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # OTP
    OTP_PROVIDER: str = "mock"
    OTP_EXPIRY_SECONDS: int = 300  # 5 minutes
    OTP_LENGTH: int = 6

    # CIBIL
    CIBIL_API_URL: str = "https://api.cibil.example.com"
    CIBIL_API_KEY: str = ""

    # Zoho CRM
    ZOHO_CRM_URL: str = "https://www.zohoapis.com/crm/v2"
    ZOHO_CRM_TOKEN: str = ""
    ZOHO_CLIENT_ID: str = ""
    ZOHO_CLIENT_SECRET: str = ""
    ZOHO_REFRESH_TOKEN: str = ""
    ZOHO_REDIRECT_URI: str = "https://exitdebt.in/oauth/callback"
    ZOHO_ACCOUNTS_URL: str = "https://accounts.zoho.in/oauth/v2/token"

    # Internal API
    INTERNAL_API_KEY: str = "change-me-in-production"

    # WhatsApp
    WHATSAPP_API_URL: str = ""
    WHATSAPP_API_KEY: str = ""

    # Payment
    PAYMENT_PROVIDER: str = "mock"
    PAYMENT_API_KEY: str = ""

    # Setu Account Aggregator
    SETU_AA_BASE_URL: str = "https://fiu-uat.setu.co"
    SETU_AA_CLIENT_ID: str = ""
    SETU_AA_CLIENT_SECRET: str = ""
    SETU_AA_PRODUCT_INSTANCE_ID: str = ""
    SETU_AA_REDIRECT_URL: str = "http://localhost:3000/aa/callback"
    SETU_AA_PROVIDER: str = "mock"  # "mock" or "setu"

    # Setu UPI Payments
    SETU_UPI_BASE_URL: str = "https://uat.setu.co"
    SETU_UPI_CLIENT_ID: str = ""
    SETU_UPI_CLIENT_SECRET: str = ""
    SETU_UPI_PROVIDER: str = "mock"  # "mock" or "setu"

    # Setu Auth
    SETU_AUTH_URL: str = "https://accountservice.setu.co"

    # Setu PAN Verification
    SETU_PAN_BASE_URL: str = "https://dg-sandbox.setu.co"
    SETU_PAN_CLIENT_ID: str = ""
    SETU_PAN_CLIENT_SECRET: str = ""
    SETU_PAN_PRODUCT_INSTANCE_ID: str = ""
    SETU_PAN_PROVIDER: str = "mock"  # "mock" or "setu"

    # Rate Limiting
    RATE_LIMIT_CIBIL_PULLS: int = 3
    RATE_LIMIT_WINDOW_HOURS: int = 24

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance."""
    return Settings()
