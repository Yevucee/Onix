# Phase 5 Summary

**Project:** Onix Data Centres website migration  
**Phase:** 5 — Railway private staging deployment  
**Date:** 2026-08-08  
**Status:** Complete — ready for user review (no production launch)

---

## Railway staging deployment

| Metric | Value |
|--------|-------|
| Platform | Railway |
| Project | `onix-staging` |
| Web service | `onix-staging-web` |
| PostgreSQL service | `Postgres` |
| Media volume | `onix-staging-media` (`/app/media`) |
| **Staging URL** | `https://onix-staging-web-production.up.railway.app` |
| Branch | `cursor/phase5-staging-deployment-28a7` |
| Deploy status | SUCCESS |

---

## Content on Railway

| Type | Count | Status |
|------|-------|--------|
| Articles | 88 | OK |
| Media (DB) | 542 | OK |
| Media files (volume) | ~2,050 | OK |
| Pages | 17 | OK |
| Leadership | 15 | OK |
| Redirects | 21+ (middleware JSON) | OK |

---

## QA results (live Railway URL)

| Test | Result |
|------|--------|
| Basic Auth (401 unauthenticated) | PASS |
| Authenticated homepage | 200 |
| `robots.txt` Disallow | PASS |
| `X-Robots-Tag` noindex | PASS |
| Payload `/admin` | 200 |
| Legacy URLs (193) | 0 errors |
| Article media warnings | 14 OPEN (down from 59) |
| Elementor exceptions | 2 COMPLETE |
| Unit tests (local) | 21/21 |

---

## Protection verified

- HTTP Basic Auth ✓
- noindex / nofollow / noarchive ✓
- robots.txt blocks crawling ✓
- No GA4 on staging ✓
- No production email ✓
- No DNS changes ✓

---

## Deliverables

- `docs/staging-deployment.md` — Railway deployment guide
- `docs/staging-review-guide.md` — Reviewer checklist
- `phase5/STAGING-ACCEPTANCE.md` — Acceptance report
- `phase5/STAGING-READINESS.md` — Readiness checklist
- `Dockerfile.railway` + `railway.toml` — Infrastructure as code
- Production launch package (unchanged from Phase 5)

---

## User actions required

1. **Retrieve credentials** from Railway Dashboard → `onix-staging` → `onix-staging-web` → Variables (`STAGING_AUTH_*`, `STAGING_ADMIN_*`)
2. **Browse** `https://onix-staging-web-production.up.railway.app` with Basic Auth
3. **Log into** `/admin` with staging admin credentials
4. **Review** using `docs/staging-review-guide.md`

---

## Recommendation

**`READY_WITH_MINOR_ISSUES`** — Private Railway staging is live for review. Do not proceed to production.
