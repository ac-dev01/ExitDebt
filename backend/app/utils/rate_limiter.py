"""Rate limiter for CIBIL pulls — 3 pulls per 24 hours per phone number."""

from datetime import datetime, timedelta
from typing import Dict, List
from app.config import get_settings


class RateLimiter:
    """In-memory rate limiter. Replace with Redis for production scaling."""

    def __init__(self):
        self._attempts: Dict[str, List[datetime]] = {}

    def _cleanup(self, key: str) -> None:
        """Remove expired entries."""
        settings = get_settings()
        cutoff = datetime.utcnow() - timedelta(hours=settings.RATE_LIMIT_WINDOW_HOURS)
        if key in self._attempts:
            self._attempts[key] = [ts for ts in self._attempts[key] if ts > cutoff]
            if not self._attempts[key]:
                del self._attempts[key]

    def is_allowed(self, phone: str, action: str = "cibil_pull") -> bool:
        """Check if the action is allowed for this phone number."""
        settings = get_settings()
        key = f"{action}:{phone}"
        self._cleanup(key)
        current_count = len(self._attempts.get(key, []))
        return current_count < settings.RATE_LIMIT_CIBIL_PULLS

    def record(self, phone: str, action: str = "cibil_pull") -> None:
        """Record an action attempt."""
        key = f"{action}:{phone}"
        if key not in self._attempts:
            self._attempts[key] = []
        self._attempts[key].append(datetime.utcnow())

    def remaining(self, phone: str, action: str = "cibil_pull") -> int:
        """Get remaining attempts."""
        settings = get_settings()
        key = f"{action}:{phone}"
        self._cleanup(key)
        current_count = len(self._attempts.get(key, []))
        return max(0, settings.RATE_LIMIT_CIBIL_PULLS - current_count)


# Singleton instance
rate_limiter = RateLimiter()
