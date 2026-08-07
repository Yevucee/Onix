#!/bin/sh
# Railway staging entrypoint — fix volume permissions, optional bootstrap, start app.
set -e

# Railway volumes mount as root; ensure nextjs can write media
chown -R nextjs:nodejs /app/media /app/.migration-work 2>/dev/null || true

if [ "${RUN_BOOTSTRAP:-false}" = "true" ]; then
  echo "=== Staging bootstrap (RUN_BOOTSTRAP=true) ==="
  su-exec nextjs sh -c "cd /app/new-site && MIGRATE_PAGES_SKIP_MEDIA=1 npm run staging:migrate && npm run staging:admin"
  su-exec nextjs touch /app/media/.bootstrap-complete 2>/dev/null || true
  echo "=== Bootstrap complete ==="
fi

exec su-exec nextjs "$@"
