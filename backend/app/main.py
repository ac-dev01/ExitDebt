"""ExitDebt FastAPI application entry point."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import get_settings
from app.routers import otp, health_check, callback, advisory, user, internal
from app.routers import subscription, settlement, service_request
from app.routers import pan, setu_aa, payment


settings = get_settings()

# Global rate limiter (HTTP-level)
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown hooks."""
    print("🚀 ExitDebt API starting up...")
    print(f"   Environment: {settings.ENVIRONMENT}")
    print(f"   Debug: {settings.DEBUG}")
    print(f"   OTP Provider: {settings.OTP_PROVIDER}")
    print(f"   Setu PAN Provider: {settings.SETU_PAN_PROVIDER}")
    print(f"   Setu AA Provider: {settings.SETU_AA_PROVIDER}")
    print(f"   Setu UPI Provider: {settings.SETU_UPI_PROVIDER}")
    yield
    print("🛑 ExitDebt API shutting down...")


app = FastAPI(
    title="ExitDebt API",
    description="Debt restructuring platform — health score analysis, advisory, and settlement support.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Rate limiter middleware
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(otp.router)
app.include_router(health_check.router)
app.include_router(callback.router)
app.include_router(advisory.router)
app.include_router(user.router)
app.include_router(internal.router)
app.include_router(subscription.router)
app.include_router(settlement.router)
app.include_router(service_request.router)
app.include_router(pan.router)
app.include_router(setu_aa.router)
app.include_router(payment.router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "ExitDebt API",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs" if settings.DEBUG else "disabled",
    }


@app.get("/health", tags=["Root"])
async def health():
    return {"status": "ok"}
