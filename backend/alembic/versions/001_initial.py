"""initial migration — create all tables

Revision ID: 001_initial
Revises: None
Create Date: 2026-02-17
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Users
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("pan_hash", sa.String(64), nullable=False, index=True),
        sa.Column("phone", sa.String(15), nullable=False, index=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("consent_ts", sa.DateTime, nullable=False),
        sa.Column("consent_ip", sa.String(45), nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    # CIBIL Reports
    op.create_table(
        "cibil_reports",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("raw_encrypted", sa.Text, nullable=True),
        sa.Column("credit_score", sa.Integer, nullable=True),
        sa.Column("pulled_at", sa.DateTime, nullable=False),
        sa.Column("expires_at", sa.DateTime, nullable=False),
    )

    # Debt Accounts
    op.create_table(
        "debt_accounts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("report_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("cibil_reports.id"), nullable=False, index=True),
        sa.Column("lender_name", sa.String(255), nullable=False),
        sa.Column("account_type", sa.String(50), nullable=False),
        sa.Column("outstanding", sa.Float, nullable=False),
        sa.Column("interest_rate", sa.Float, nullable=True),
        sa.Column("emi_amount", sa.Float, nullable=True),
        sa.Column("status", sa.String(30), nullable=False),
    )

    # Health Scores
    op.create_table(
        "health_scores",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("score", sa.Integer, nullable=False),
        sa.Column("dti_ratio", sa.Float, nullable=True),
        sa.Column("avg_rate", sa.Float, nullable=True),
        sa.Column("savings_est", sa.Float, nullable=True),
        sa.Column("calculated_at", sa.DateTime, nullable=False),
    )

    # Callbacks
    op.create_table(
        "callbacks",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("preferred_time", sa.DateTime, nullable=False),
        sa.Column("status", sa.String(30), nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    # Advisory Plans
    op.create_table(
        "advisory_plans",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("tier", sa.String(30), nullable=False),
        sa.Column("price", sa.Float, nullable=False),
        sa.Column("status", sa.String(30), nullable=False),
        sa.Column("plan_data_json", postgresql.JSON, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    # Audit Logs
    op.create_table(
        "audit_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("event_type", sa.String(50), nullable=False, index=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True, index=True),
        sa.Column("phone", sa.String(15), nullable=True),
        sa.Column("ip_address", sa.String(45), nullable=True),
        sa.Column("metadata_json", postgresql.JSON, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False, index=True),
    )


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("advisory_plans")
    op.drop_table("callbacks")
    op.drop_table("health_scores")
    op.drop_table("debt_accounts")
    op.drop_table("cibil_reports")
    op.drop_table("users")
