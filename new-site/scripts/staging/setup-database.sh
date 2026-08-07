#!/usr/bin/env bash
# Create dedicated staging PostgreSQL database (run once per host).
set -euo pipefail

DB_NAME="${STAGING_DB_NAME:-onix_staging}"
DB_USER="${STAGING_DB_USER:-onix_staging}"
DB_PASS="${STAGING_DB_PASSWORD:?Set STAGING_DB_PASSWORD}"

PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"
PGUSER="${PGUSER:-postgres}"

psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres <<SQL
SELECT 'CREATE USER ${DB_USER} WITH PASSWORD '''${DB_PASS}''''
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}')\gexec
SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_databases WHERE datname = '${DB_NAME}')\gexec
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
SQL

echo "Staging database ready: ${DB_NAME} (user: ${DB_USER})"
echo "DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@${PGHOST}:${PGPORT}/${DB_NAME}"
