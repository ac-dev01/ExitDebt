"""002 — PRD3: subscriptions, service requests, settlement cases, shield consent

Revision ID: 002_prd3_entities
Revises: 001_initial
Create Date: 2026-02-21
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "002_prd3_entities"
down_revision: Union[str, None] = "001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add role column to users
    op.add_column(
        "users",
        sa.Column("role", sa.String(20), nullable=False, server_default="user"),
    )

    # Add reason column to callbacks
    op.add_column(
        "callbacks",
        sa.Column("reason", sa.String(255), nullable=True),
    )

    # Subscriptions
    op.create_table(
        "subscriptions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("tier", sa.String(20), nullable=True),
        sa.Column("billing_period", sa.String(10), nullable=False, server_default="monthly"),
        sa.Column("amount_paid", sa.Integer, nullable=False, server_default="0"),
        sa.Column("status", sa.String(20), nullable=False, server_default="trial"),
        sa.Column("trial_ends_at", sa.DateTime, nullable=False),
        sa.Column("expires_at", sa.DateTime, nullable=True),
        sa.Column("upgrade_history", postgresql.JSONB, nullable=False, server_default="[]"),
        sa.Column("shield_consent_timestamp", sa.DateTime, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )

    # Service Requests (Shield)
    op.create_table(
        "service_requests",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("type", sa.String(30), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="open"),
        sa.Column("details", sa.Text, nullable=True),
        sa.Column("assigned_to", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("resolved_at", sa.DateTime, nullable=True),
    )

    # Settlement Cases
    op.create_table(
        "settlement_cases",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("total_debt", sa.Integer, nullable=False),
        sa.Column("target_amount", sa.Integer, nullable=True),
        sa.Column("status", sa.String(20), nullable=False, server_default="intake"),
        sa.Column("settled_amount", sa.Integer, nullable=True),
        sa.Column("fee_amount", sa.Integer, nullable=True),
        sa.Column("assigned_to", sa.String(255), nullable=True),
        sa.Column("started_at", sa.DateTime, nullable=False),
        sa.Column("settled_at", sa.DateTime, nullable=True),
    )

    # Shield Consents
    op.create_table(
        "shield_consents",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("consent_text_version", sa.String(20), nullable=False, server_default="1.0"),
        sa.Column("ip_address", sa.String(45), nullable=False),
        sa.Column("timestamp", sa.DateTime, nullable=False),
    )


def downgrade() -> None:
    op.drop_table("shield_consents")
    op.drop_table("settlement_cases")
    op.drop_table("service_requests")
    op.drop_table("subscriptions")
    op.drop_column("callbacks", "reason")
    op.drop_column("users", "role")
