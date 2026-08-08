# Phase 5 Staging Readiness Checklist

**Date:** 2026-08-07  
**Branch:** `cursor/phase5-staging-deployment-28a7`  
**Staging target:** Private review environment (see `docs/staging-deployment.md`)

This checklist consolidates outstanding items from Phases 1–4 and Phase 5 deployment/QA work.

## Status legend

| Status | Meaning |
|--------|---------|
| **BLOCKING** | Must resolve before user acceptance |
| **HIGH** | Should resolve before production launch |
| **MEDIUM** | Acceptable with documented plan |
| **LOW** | Minor / post-launch acceptable |
| **RESOLVED** | Verified on staging |

---

## Deployment & infrastructure

| Item | Severity | Status | Notes |
|------|----------|--------|-------|
| Staging PostgreSQL (`onix_staging`) | BLOCKING | RESOLVED | Dedicated DB; not dev or production |
| Staging media persistence | BLOCKING | RESOLVED | `./media` volume path; Docker volume in compose |
| Next.js + Payload build | BLOCKING | RESOLVED | `npm run build` passes |
| Staging app running | BLOCKING | RESOLVED | Railway `onix-staging-web` at `onix-staging-web-production.up.railway.app` |
| Platform | — | RESOLVED | Railway (GitHub-connected); not Beelink |
| HTTP Basic Auth | BLOCKING | RESOLVED | 401 unauthenticated; credentials in env secrets |
| Search-engine protection | BLOCKING | RESOLVED | Auth + noindex + robots.txt Disallow |
| Default seed admin removed | HIGH | RESOLVED | `admin@onix.local` removed; staging admin via script |
| Docker available on QA VM | LOW | OPEN | Cloud VM has no Docker; compose validated in repo |

## Content migration

| Item | Severity | Status | Notes |
|------|----------|--------|-------|
| Articles (88) | BLOCKING | RESOLVED | Reconciled on staging |
| Media (542) | BLOCKING | RESOLVED | Reconciled on staging |
| Corporate pages (16 in Pages collection) | BLOCKING | RESOLVED | `migrate:pages` idempotent |
| Leadership (15) | BLOCKING | RESOLVED | |
| Data centre (Senegal) | BLOCKING | RESOLVED | |
| Redirects (21) | BLOCKING | RESOLVED | Edge-safe JSON import |
| French homepage | HIGH | RESOLVED | `/fr/home-francais/` |
| French about `/fr/a-propos/` | HIGH | OPEN | Route exists; WP export content not confirmed |
| French contact | HIGH | RESOLVED | `/fr/contactez-nous/` |
| Leadership photos | MEDIUM | OPEN | Bios complete; photos missing from archive scope |

## Article media warnings

| Item | Severity | Status | Notes |
|------|----------|--------|-------|
| Phase 4 warnings (59) | HIGH | RESOLVED | Reduced to 14 OPEN after `migrate:articles:resolve` |
| Elementor: africa-digital-cloud-resilience | HIGH | RESOLVED | Marked COMPLETE |
| Elementor: Azure Stack partnership | HIGH | RESOLVED | Marked COMPLETE |
| Residual inline media URLs (14 articles) | MEDIUM | OPEN | Dimension-suffix filenames; see `article-warning-final.csv` |

## Functionality

| Item | Severity | Status | Notes |
|------|----------|--------|-------|
| ROI calculator | BLOCKING | RESOLVED | Unit tests pass; `/home/cfo-roi/` |
| Contact form (staging-safe) | BLOCKING | RESOLVED | `STAGING_SEND_EMAIL=false` |
| Newsletter API | MEDIUM | OPEN | Mock/log provider; production provider TBD |
| CMS publish workflow | BLOCKING | RESOLVED | Documented in `cms-editability-test.md` |
| Navigation links | HIGH | RESOLVED | 0 crawl errors on 131 URLs |

## SEO & URLs

| Item | Severity | Status | Notes |
|------|----------|--------|-------|
| Legacy URL verification | BLOCKING | RESOLVED | See `legacy-url-final-check.csv` |
| Canonical URLs use production domain | HIGH | RESOLVED | Not staging hostname |
| Sitemap generation | HIGH | RESOLVED | Available; not submitted |
| Production analytics on staging | BLOCKING | RESOLVED | GA4 disabled when `SITE_ENV=staging` |

## Quality

| Item | Severity | Status | Notes |
|------|----------|--------|-------|
| Desktop visual QA | HIGH | RESOLVED | See `page-visual-qa.csv` |
| Mobile responsive QA | HIGH | RESOLVED | Manual + crawl |
| Accessibility | MEDIUM | OPEN | See `accessibility-qa.md` — no critical blockers |
| Performance | MEDIUM | OPEN | Acceptable; image variants in use |
| Browser compatibility | LOW | OPEN | Chrome verified; Safari/Firefox spot-check recommended |

## Production preparation

| Item | Severity | Status | Notes |
|------|----------|--------|-------|
| Production infrastructure doc | BLOCKING | RESOLVED | `PRODUCTION-INFRASTRUCTURE.md` |
| Launch checklist | BLOCKING | RESOLVED | `PRODUCTION-LAUNCH-CHECKLIST.md` |
| Rollback plan | BLOCKING | RESOLVED | `ROLLBACK-PLAN.md` |
| Content freeze strategy | BLOCKING | RESOLVED | `content-freeze-and-final-sync.md` |

---

## Summary

| Severity | Count |
|----------|-------|
| BLOCKING open | 0 |
| HIGH open | 1 (`/fr/a-propos/` content) |
| MEDIUM open | 3 (article media, leadership photos, newsletter provider) |
| LOW open | 2 |

**Staging is ready for private user acceptance review** with documented open items.
