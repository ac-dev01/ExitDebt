"""004 – Model field additions.

Add missing columns to debt_accounts, callbacks, and subscriptions
to match the data model specification.
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = "004_model_field_additions"
down_revision = "003_setu_integration"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── DebtAccount: add due_date ──
    op.add_column(
        "debt_accounts",
        sa.Column("due_date", sa.Integer, nullable=True),
    )

    # ── Callback: add assigned_to, called_at, outcome ──
    op.add_column(
        "callbacks",
        sa.Column("assigned_to", sa.String(255), nullable=True),
    )
    op.add_column(
        "callbacks",
        sa.Column("called_at", sa.DateTime, nullable=True),
    )
    op.add_column(
        "callbacks",
        sa.Column("outcome", sa.String(255), nullable=True),
    )

    # ── Subscription: add payment_ref, subscribed_at ──
    op.add_column(
        "subscriptions",
        sa.Column("payment_ref", sa.String(255), nullable=True),
    )
    op.add_column(
        "subscriptions",
        sa.Column("subscribed_at", sa.DateTime, nullable=True),
    )


def downgrade() -> None:
    op.drop_column("subscriptions", "subscribed_at")
    op.drop_column("subscriptions", "payment_ref")
    op.drop_column("callbacks", "outcome")
    op.drop_column("callbacks", "called_at")
    op.drop_column("callbacks", "assigned_to")
    op.drop_column("debt_accounts", "due_date")
