# ExitDebt Backend

FastAPI-powered backend for the ExitDebt debt restructuring platform. Provides health score analysis, PAN verification, subscription management, settlement processing, Account Aggregator integration, and UPI payment support.

## Tech Stack

| Layer           | Technology                                   |
|-----------------|----------------------------------------------|
| Framework       | FastAPI                                      |
| Language        | Python 3.11+                                 |
| Database        | PostgreSQL + SQLAlchemy ORM                  |
| Migrations      | Alembic                                      |
| Validation      | Pydantic v2                                  |
| Auth            | JWT + OTP (mock / MSG91)                     |
| Integrations    | Setu (PAN, AA, UPI), Zoho CRM               |
| Testing         | pytest + pytest-asyncio                      |
| Containerization| Docker + Docker Compose                      |

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py             # Environment-driven settings (Pydantic)
│   ├── database.py           # SQLAlchemy engine & session
│   ├── routers/              # API endpoint handlers
│   │   ├── otp.py            # POST /api/otp/send, /verify
│   │   ├── health_check.py   # POST /api/health-check, GET /:id
│   │   ├── callback.py       # POST /api/callback
│   │   ├── advisory.py       # POST /api/advisory/purchase, GET /:id
│   │   ├── subscription.py   # GET /plans, /status/:id, POST /upgrade, /shield-consent
│   │   ├── settlement.py     # POST /api/settlement/intake, GET /:userId
│   │   ├── service_request.py# POST /api/service-request, GET /:userId
│   │   ├── pan.py            # POST /api/pan/verify
│   │   ├── setu_aa.py        # Account Aggregator consent/data endpoints
│   │   ├── payment.py        # UPI payment link, status, webhook
│   │   ├── user.py           # DELETE /api/user/delete-request
│   │   └── internal.py       # Admin endpoints (X-API-Key auth)
│   ├── services/             # Business logic layer
│   │   ├── health_score.py   # 5-factor debt health scoring model
│   │   ├── settlement_service.py # Settlement state machine + fee calc
│   │   ├── subscription_service.py # Plan pricing, proration, upgrades
│   │   ├── advisory_service.py     # Advisory tier management
│   │   ├── setu_pan_service.py     # PAN verification (mock/Setu)
│   │   ├── setu_aa_service.py      # Account Aggregator (mock/Setu)
│   │   ├── setu_payment_service.py # UPI payments (mock/Setu)
│   │   ├── callback_service.py     # CRM service injection
│   │   └── otp_service.py         # OTP service injection
│   ├── models/               # SQLAlchemy ORM models
│   │   ├── user.py           # User (PAN hash, phone, name)
│   │   ├── health_score.py   # Health score results
│   │   ├── debt_account.py   # Debt accounts from CIBIL
│   │   ├── subscription.py   # Subscription (tier, billing, status)
│   │   ├── settlement_case.py# Settlement cases + state machine
│   │   ├── callback.py       # Callback scheduling
│   │   ├── advisory_plan.py  # Advisory plan purchases
│   │   ├── service_request.py# Shield service requests
│   │   ├── audit_log.py      # Audit trail
│   │   └── ...
│   ├── schemas/              # Pydantic request/response models
│   ├── integrations/         # External service adapters
│   │   ├── base.py           # Abstract base classes
│   │   ├── mock_providers.py # Mock implementations for dev
│   │   └── zoho_crm.py       # Real Zoho CRM integration
│   └── utils/                # Shared utilities
│       ├── security.py       # PAN hashing, AES encryption, JWT
│       └── audit.py          # Audit logging
├── tests/                    # Test suite
│   ├── conftest.py           # Shared fixtures
│   ├── test_health_score.py  # Health score algorithm tests
│   ├── test_otp.py           # OTP send/verify tests
│   ├── test_pan_service.py   # PAN verification tests
│   ├── test_security.py      # Hashing, masking, encryption tests
│   ├── test_settlement_service.py  # Fee calc, state machine tests
│   ├── test_subscription_service.py # Expiry, pricing, validation tests
│   ├── test_advisory_service.py     # Tier lookup tests
│   ├── test_mock_providers.py       # Mock service tests
│   └── test_routers.py       # FastAPI integration tests
├── alembic/                  # Database migrations
├── requirements.txt          # Python dependencies
└── Dockerfile                # Container build
```

## Getting Started

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- pip

### Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# 5. Run database migrations
alembic upgrade head

# 6. Start the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Interactive docs at `/docs`.

### Docker

```bash
docker compose up --build
```

## Running Tests

```bash
# Run all tests
python3 -m pytest tests/ -v

# Run specific test file
python3 -m pytest tests/test_health_score.py -v

# Run with coverage
python3 -m pytest tests/ --cov=app --cov-report=term-missing
```

**Current test count:** 98 passed, 5 skipped (router tests require psycopg2)

## Architecture

The backend follows a **Layered / Service-Oriented Architecture**:

```
Router (HTTP) → Service (Business Logic) → Model (Database)
```

| Layer        | Purpose                                                  |
|--------------|----------------------------------------------------------|
| **Routers**  | HTTP endpoint handlers, request validation, response formatting |
| **Services** | Business logic, state machines, calculations             |
| **Models**   | SQLAlchemy ORM, database schema                          |
| **Schemas**  | Pydantic DTOs for request/response validation            |
| **Integrations** | External API adapters (Setu, Zoho, SMS)             |

### Provider Pattern

All external services use a **mock/real provider pattern**:

```python
# config.py
SETU_PAN_PROVIDER: str = "mock"  # "mock" or "setu"
```

- `mock` — Returns realistic dummy data for development
- `setu` / `zoho` — Calls real external APIs in production

## API Endpoints

| Method   | Path                              | Description                            |
|----------|-----------------------------------|----------------------------------------|
| POST     | `/api/otp/send`                   | Send OTP to phone                      |
| POST     | `/api/otp/verify`                 | Verify OTP, get JWT                    |
| POST     | `/api/health-check`               | Run full debt health check             |
| GET      | `/api/health-check/:id`           | Retrieve health check results          |
| POST     | `/api/callback`                   | Schedule advisor callback              |
| GET      | `/api/subscription/plans`         | List subscription plans                |
| GET      | `/api/subscription/status/:id`    | Get subscription status                |
| POST     | `/api/subscription/upgrade`       | Upgrade subscription tier              |
| POST     | `/api/subscription/shield-consent`| Record Shield consent                  |
| POST     | `/api/settlement/intake`          | Start settlement case                  |
| GET      | `/api/settlement/:userId`         | Get settlement case                    |
| POST     | `/api/service-request`            | Create service request (Shield)        |
| GET      | `/api/service-request/:userId`    | List service requests                  |
| POST     | `/api/pan/verify`                 | Verify PAN via Setu                    |
| POST     | `/api/payment/create-link`        | Create UPI payment link                |
| GET      | `/api/payment/status/:id`         | Check payment status                   |
| POST     | `/api/advisory/purchase`          | Purchase advisory plan                 |
| GET      | `/api/advisory/:id`               | Get advisory plan details              |
| DELETE   | `/api/user/delete-request`        | GDPR/DPDPA data deletion               |
| POST     | `/aa/consent`                     | Create AA consent request              |
| GET      | `/aa/consent/:id`                 | Check consent status                   |
| GET      | `/aa/data/:id`                    | Fetch financial data                   |

## Environment Variables

See [.env.example](.env.example) for all available configuration options. Key variables:

| Variable               | Description                              | Default                     |
|------------------------|------------------------------------------|-----------------------------|
| `DATABASE_URL`         | PostgreSQL connection string             | `postgresql://...localhost`  |
| `SECRET_KEY`           | JWT signing key                          | `change-me-in-production`   |
| `OTP_PROVIDER`         | OTP service (`mock` / `msg91`)           | `mock`                      |
| `SETU_PAN_PROVIDER`    | PAN verification (`mock` / `setu`)       | `mock`                      |
| `SETU_AA_PROVIDER`     | Account Aggregator (`mock` / `setu`)     | `mock`                      |
| `SETU_UPI_PROVIDER`    | UPI payments (`mock` / `setu`)           | `mock`                      |
| `INTERNAL_API_KEY`     | Admin API authentication key             | `change-me-in-production`   |

## License

Copyright © 2026 ExitDebt Technologies Pvt. Ltd.
