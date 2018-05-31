from dotenv import load_dotenv
import os

# Load environment variables from `.env` if it exists.
load_dotenv()

# PostgreSQL
POSTGRES = {
    'user': os.getenv('POSTGRESQL_USER'),
    'pw': os.getenv('POSTGRESQL_PASSWORD'),
    'db': os.getenv('POSTGRESQL_DB'),
    'host': os.getenv('POSTGRESQL_HOST'),
    'port': os.getenv('POSTGRESQL_PORT'),
}

POSTGRES_URL = (
    'postgresql://%(user)s:' +
    '%(pw)s@%(host)s:%(port)s/%(db)s') % POSTGRES

# Redis
REDIS_URL = os.getenv('COMPOSE_REDIS_URL')
