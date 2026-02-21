"""003 – Setu integration entities.

Add aa_consents table for tracking Setu Account Aggregator consent requests.
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, ARRAY

# revision identifiers
revision = "003_setu_integration"
down_revision = "002_prd3_entities"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── AA Consents table ──
    op.create_table(
        "aa_consents",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("setu_consent_id", sa.String, unique=True, nullable=False, index=True),
        sa.Column("status", sa.String, server_default="PENDING"),
        sa.Column("redirect_url", sa.String, nullable=True),
        sa.Column("fi_types", ARRAY(sa.String), server_default="{}"),
        sa.Column("data_range_from", sa.DateTime, nullable=True),
        sa.Column("data_range_to", sa.DateTime, nullable=True),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
        sa.Column("approved_at", sa.DateTime, nullable=True),
    )

    op.create_index("ix_aa_consents_user_id", "aa_consents", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_aa_consents_user_id")
    op.drop_table("aa_consents")
