#!/bin/sh
# Post-deploy verification against Railway staging URL (run locally with railway shell vars).
set -e
BASE="${STAGING_BASE_URL:-$NEXT_PUBLIC_SITE_URL}"
USER="${STAGING_AUTH_USER}"
PASS="${STAGING_AUTH_PASSWORD}"

if [ -z "$BASE" ] || [ -z "$USER" ] || [ -z "$PASS" ]; then
  echo "Set NEXT_PUBLIC_SITE_URL, STAGING_AUTH_USER, STAGING_AUTH_PASSWORD"
  exit 1
fi

echo "Testing $BASE"
code_unauth=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/")
echo "Unauthenticated: $code_unauth (expect 401)"

code_auth=$(curl -s -o /dev/null -w "%{http_code}" -u "$USER:$PASS" "$BASE/")
echo "Authenticated homepage: $code_auth (expect 200)"

robots=$(curl -s "$BASE/robots.txt" | head -1)
echo "robots.txt: $robots"

xrobots=$(curl -sI -u "$USER:$PASS" "$BASE/" | grep -i x-robots-tag || true)
echo "X-Robots-Tag: ${xrobots:-none}"

admin=$(curl -s -o /dev/null -w "%{http_code}" -u "$USER:$PASS" "$BASE/admin")
echo "Admin: $admin (expect 200 or 302)"
