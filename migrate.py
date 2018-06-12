from flask_migrate import upgrade
from bertly import app


def run(event, context):
    """Run outstanding migrations."""
    with app.app_context():
        upgrade()
