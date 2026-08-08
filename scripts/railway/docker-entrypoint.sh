#!/bin/sh
# Railway staging entrypoint — fix volume permissions, optional bootstrap, start app.
set -e

chown -R nextjs:nodejs /app/media /app/.migration-work 2>/dev/null || true

if [ "${RUN_BOOTSTRAP:-false}" = "true" ]; then
  echo "=== Staging bootstrap (RUN_BOOTSTRAP=true) ==="
  su-exec nextjs sh -c "cd /app/new-site && MIGRATE_PAGES_SKIP_MEDIA=1 npm run staging:migrate && npm run staging:admin"
  su-exec nextjs touch /app/media/.bootstrap-complete 2>/dev/null || true
  echo "=== Bootstrap complete ==="
fi

# Ensure Payload schema matches code (new block tables after bootstrap).
if [ "${SITE_ENV:-}" = "staging" ]; then
  echo "=== Staging schema push ==="
  su-exec nextjs sh -c "cd /app/new-site && NODE_OPTIONS=--no-deprecation node node_modules/payload/bin.js run scripts/staging/push-schema.ts" || {
    echo "WARNING: staging schema push failed — app may error on page loads"
  }
fi

exec su-exec nextjs "$@"
