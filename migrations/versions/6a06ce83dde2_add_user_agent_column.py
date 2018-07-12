"""Add user agent column.

Revision ID: 6a06ce83dde2
Revises: 42a810a76302
Create Date: 2018-07-12 13:48:00.527162

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6a06ce83dde2'
down_revision = '42a810a76302'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('clicks', sa.Column('user_agent', sa.String(255)))


def downgrade():
    op.drop_column('clicks', 'user_agent')
