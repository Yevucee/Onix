# Staging Acceptance Report

**Phase:** 5 — Railway private staging deployment  
**Date:** 2026-08-08  
**Platform:** Railway (`onix-staging` project)  
**Recommendation:** `READY_WITH_MINOR_ISSUES`

---

## DEPLOYMENT

| Item | Status | Detail |
|------|--------|--------|
| Staging URL | ✓ | `https://onix-staging-web-production.up.railway.app` |
| Project | ✓ | `onix-staging` |
| Web service | ✓ | `onix-staging-web` |
| Database service | ✓ | `Postgres` |
| Media volume | ✓ | `onix-staging-media` → `/app/media` |
| Build/deploy | ✓ | SUCCESS (Dockerfile.railway + railway.toml) |
| GitHub branch | ✓ | `cursor/phase5-staging-deployment-28a7` |

---

## CONTENT (Railway database)

| Type | Count | Status |
|------|-------|--------|
| Articles | 88 | ✓ |
| Media records | 542 | ✓ |
| Pages | 17 | ✓ |
| Leadership | 15 | ✓ |
| Media files on volume | ~2,050 | ✓ |

Content loaded via `pg_restore` + volume media upload (migration zip truncated in Docker image).

---

## PROTECTION

| Check | Status |
|-------|--------|
| Unauthenticated access blocked (401) | ✓ |
| HTTP Basic Auth active | ✓ |
| `X-Robots-Tag: noindex, nofollow, noarchive` | ✓ |
| `robots.txt` → `Disallow: /` | ✓ |
| No production analytics | ✓ |
| `STAGING_SEND_EMAIL=false` | ✓ |
| Production DNS unchanged | ✓ |
| WordPress untouched | ✓ |

---

## FUNCTIONALITY

| Feature | Status |
|---------|--------|
| Homepage (authenticated) | ✓ 200 |
| News listing | ✓ 200 |
| Payload `/admin` | ✓ 200 |
| Legacy URLs (193) | ✓ 0 errors |
| ROI calculator route | ✓ (from Phase 5 QA) |
| CMS admin account | ✓ Created (seed removed) |

---

## MIGRATION WARNINGS

| Item | Status |
|------|--------|
| Article media warnings | ~14 OPEN (from Phase 5 QA dump) |
| Elementor articles (2) | COMPLETE |
| Leadership photos | Some missing (archive scope) |
| French `/fr/a-propos/` | Content pending |

---

## OPEN ISSUES

| Issue | Severity |
|-------|----------|
| Postgres service named `Postgres` not `onix-staging-postgres` | Low (cosmetic) |
| `uploads.zip` in Docker image truncated — bootstrap uses dump+upload | Low (documented) |
| 14 residual article inline media references | Medium |
| Leadership profile photos | Medium |
| `/fr/a-propos/` content | High |

---

## FINAL RECOMMENDATION

### `READY_WITH_MINOR_ISSUES`

Private Railway staging is deployed, populated, and protected. Ready for personal review.

**Credentials:** Retrieve `STAGING_AUTH_USER`, `STAGING_AUTH_PASSWORD`, `STAGING_ADMIN_EMAIL` from Railway → `onix-staging` → `onix-staging-web` → Variables.

**Do not proceed to production.**
