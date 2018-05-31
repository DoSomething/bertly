"""Add shortened index.

Revision ID: 42a810a76302
Revises: 37ba37319784
Create Date: 2018-05-31 14:40:05.795057

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '42a810a76302'
down_revision = '37ba37319784'
branch_labels = None
depends_on = None


def upgrade():
    op.create_index('shortened_index', 'clicks', ['shortened'])


def downgrade():
    op.drop_index('shortened_index', 'clicks')
