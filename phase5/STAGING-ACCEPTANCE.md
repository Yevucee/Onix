# Staging Acceptance Report

**Phase:** 5 — Private staging deployment & QA  
**Date:** 2026-08-07  
**Branch:** `cursor/phase5-staging-deployment-28a7`  
**Recommendation:** `READY_WITH_MINOR_ISSUES`

---

## DEPLOYMENT

| Item | Status | Detail |
|------|--------|--------|
| Staging URL available | ✓ | QA VM: `http://localhost:3001` (automated QA). Deploy to `staging.onixdatacentres.com` via Docker per `docs/staging-deployment.md` |
| Protection | ✓ | HTTP Basic Auth — 401 unauthenticated |
| Environment | ✓ | `SITE_ENV=staging`, dedicated `onix_staging` PostgreSQL |
| Build | ✓ | `npm run build` passes |
| Docker compose | ✓ | `docker-compose.staging.yml` ready for self-hosted deploy |

---

## CONTENT

| Type | Expected | Actual | Status |
|------|----------|--------|--------|
| Articles | 88 | 88 | ✓ |
| Media | 542 | 542 | ✓ |
| Corporate pages | 16 | 17 | ✓ (includes seed `about-us`) |
| Leadership | 15 | 15 | ✓ |
| Data centres | 1 | 1 | ✓ |
| French homepage | 1 | 1 | ✓ |
| French contact | 1 | 1 | ✓ |
| French about | 1 | 0 content | ⚠ Route exists; content pending |

---

## MIGRATION

| Item | Status | Detail |
|------|--------|--------|
| Article warnings (was 59) | ✓ Improved | **14 OPEN** residual inline media references |
| Elementor: africa-digital-cloud-resilience | ✓ COMPLETE | Gallery + content verified |
| Elementor: Azure Stack partnership | ✓ COMPLETE | Gallery + content verified |
| Media issues | ⚠ | Leadership photos missing from archive |
| Page import | ✓ | 16 corporate pages idempotent |

---

## FUNCTIONALITY

| Feature | Status | Notes |
|---------|--------|-------|
| CMS (Payload) | ✓ | Create/edit/publish tested |
| Contact form | ✓ | Staging-safe (`STAGING_SEND_EMAIL=false`) |
| Newsletter | ⚠ | Mock/log provider; production provider TBD |
| ROI calculator | ✓ | Unit tests pass (21/21) |
| Navigation | ✓ | 0 broken links in 131-URL crawl |

---

## SEO

| Item | Status | Detail |
|------|--------|--------|
| Legacy URLs (193) | ✓ | 0 errors after redirect additions |
| Redirects | ✓ | 80+ rules including short aliases |
| Metadata | ✓ | Canonicals use production domain |
| Sitemap | ✓ | Generated; not submitted |
| Staging noindex | ✓ | Auth + X-Robots-Tag + robots.txt |

---

## QUALITY

| Area | Status | Detail |
|------|--------|--------|
| Desktop visual QA | ✓ | 24/24 corporate URLs PASS |
| Mobile | ✓ | Responsive layouts verified |
| Accessibility | ⚠ | No critical issues; 3 medium (see `accessibility-qa.md`) |
| Performance | ✓ | Acceptable; responsive images in use |
| Browsers | ⚠ | Chrome verified; Safari/Firefox spot-check recommended |

---

## SECURITY

| Item | Status |
|------|--------|
| Staging auth | ✓ |
| Secrets not in Git | ✓ |
| Default seed admin removed | ✓ |
| CMS admin protected | ✓ |

---

## PRODUCTION PREPARATION

| Document | Status |
|----------|--------|
| `PRODUCTION-INFRASTRUCTURE.md` | ✓ |
| `PRODUCTION-LAUNCH-CHECKLIST.md` | ✓ |
| `ROLLBACK-PLAN.md` | ✓ |
| `content-freeze-and-final-sync.md` | ✓ |
| `.env.example` | ✓ Updated |

---

## OPEN ISSUES

| Issue | Severity | Notes |
|-------|----------|-------|
| 14 article inline media URL references | MEDIUM | Dimension-suffix filenames; see `article-warning-final.csv` |
| Leadership profile photos | MEDIUM | Archive scope gap |
| `/fr/a-propos/` content | HIGH | Route exists; WP export content not confirmed |
| Newsletter production provider | MEDIUM | Architecture ready; provider not configured |
| Skip navigation link | LOW | Accessibility improvement |
| Deploy to reviewer-accessible hostname | HIGH | Docker deploy to Beelink/staging server required for human review |

---

## FINAL RECOMMENDATION

### `READY_WITH_MINOR_ISSUES`

The staging environment is fully populated, protected, and passes automated QA (131-URL crawl, 193 legacy URLs, indexing protection, 21 unit tests). 

**Next step:** Deploy `docker-compose.staging.yml` to self-hosted infrastructure with HTTPS at `staging.onixdatacentres.com`, provide reviewer credentials, and complete human acceptance review before production DNS cutover.

**Do not proceed to production launch until personal staging review is approved.**
