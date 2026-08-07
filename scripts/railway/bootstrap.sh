#!/bin/sh
# One-time staging content bootstrap on Railway (run via railway ssh).
set -e
cd /app/new-site
export MIGRATE_PAGES_SKIP_MEDIA="${MIGRATE_PAGES_SKIP_MEDIA:-1}"
echo "=== Staging migrate ==="
npm run staging:migrate
echo "=== Staging admin ==="
npm run staging:admin
touch /app/media/.bootstrap-complete 2>/dev/null || true
echo "=== Bootstrap finished ==="
