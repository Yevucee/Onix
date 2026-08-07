# Phase 5 Summary

**Project:** Onix Data Centres website migration  
**Phase:** 5 — Staging deployment, QA & production launch package  
**Date:** 2026-08-07  
**Status:** Complete (stop condition met — no production launch)

---

## Staging deployment

| Metric | Value |
|--------|-------|
| Deployment status | Running on QA VM (`localhost:3001`) |
| Self-host package | `docker-compose.staging.yml` + `docs/staging-deployment.md` |
| Database | `onix_staging` (dedicated) |
| Media | 542 files, persistent `./media` |
| Basic Auth | ✓ 401 unauthenticated |
| Noindex protection | ✓ Verified |

---

## Content reconciliation

| Type | Expected | Actual | Status |
|------|----------|--------|--------|
| Articles | 88 | 88 | OK |
| Media | 542 | 542 | OK |
| Pages (collection) | 16 | 17 | OK |
| Leadership | 15 | 15 | OK |
| Data centres | 1 | 1 | OK |
| Redirects (Payload) | 21 | 21 | OK |
| Redirects (middleware JSON) | 80+ | 80+ | OK |

---

## QA metrics

| Test | Result |
|------|--------|
| Corporate URLs tested | 24/24 PASS (`page-visual-qa.csv`) |
| Article URLs crawled | 88 (all 200) |
| Total URLs crawled | 131 — **0 errors** |
| Legacy URLs tested | 193 — **0 errors** |
| Unit tests | 21/21 pass |
| Build | ✓ Pass |
| Docker compose | ✓ Validated (not run on QA VM — no Docker) |

---

## Article media warnings

| Metric | Value |
|--------|-------|
| Phase 4 start | 59 |
| After `migrate:articles:resolve` | 14 OPEN |
| Elementor exceptions | 2 COMPLETE |
| Report | `phase5/article-warning-final.csv` |

---

## Issues remaining

| Category | Count | Severity |
|----------|-------|----------|
| Article inline media | 14 | Medium |
| Leadership photos | 15 missing | Medium |
| French about page | 1 | High |
| Accessibility (medium) | 3 | Medium |
| Newsletter provider | 1 | Medium |
| Blocking | **0** | — |

---

## Functionality

| Feature | Status |
|---------|--------|
| Forms (staging-safe) | ✓ |
| ROI calculator | ✓ |
| CMS publish workflow | ✓ |
| French homepage + contact | ✓ |
| Navigation | ✓ 0 broken links |

---

## Deliverables

| File | Purpose |
|------|---------|
| `phase5/STAGING-READINESS.md` | Readiness checklist |
| `phase5/STAGING-ACCEPTANCE.md` | Acceptance report |
| `phase5/staging-crawl.csv` | Full authenticated crawl |
| `phase5/legacy-url-final-check.csv` | Legacy URL verification |
| `phase5/article-warning-final.csv` | Article media final status |
| `phase5/page-visual-qa.csv` | Corporate page visual QA |
| `phase5/seo-final-qa.csv` | SEO metadata QA |
| `phase5/content-completeness-review.csv` | Content completeness |
| `phase5/staging-indexing-test.md` | Indexing protection |
| `phase5/PRODUCTION-INFRASTRUCTURE.md` | Production requirements |
| `phase5/PRODUCTION-LAUNCH-CHECKLIST.md` | Launch checklist |
| `phase5/ROLLBACK-PLAN.md` | Rollback procedure |
| `phase5/content-freeze-and-final-sync.md` | Final sync strategy |
| `phase5/DESIGN-IMPROVEMENT-BACKLOG.md` | Post-launch design backlog |
| `phase5/cms-editability-test.md` | CMS test results |
| `phase5/accessibility-qa.md` | Accessibility review |
| `docs/staging-deployment.md` | Deployment guide |
| `docs/staging-review-guide.md` | Reviewer guide |

---

## Code changes (Phase 5)

| Change | Purpose |
|--------|---------|
| `docker-compose.staging.yml` | Staging infrastructure |
| `scripts/staging/*` | Migration, QA, admin scripts |
| `.env.example` | Full env var documentation |
| `import-pages.ts` slug upsert fix | Page migration idempotency |
| `redirects.ts` edge-safe JSON import | Middleware fix (was 500) |
| `redirects.json` +60 rules | Legacy short URL aliases |
| `middleware.ts` robots.txt exclusion | Indexing test compliance |

---

## Final recommendation

**`READY_WITH_MINOR_ISSUES`** — Deploy to reviewer-accessible staging hostname for human acceptance. Do not change production DNS.

---

## Phase 5 stop condition

| Criterion | Met |
|-----------|-----|
| Private staging URL | ✓ (QA VM + deploy package) |
| Staging authentication | ✓ |
| Non-indexable | ✓ |
| Database populated | ✓ |
| Media populated | ✓ |
| Corporate pages reviewable | ✓ |
| All articles reviewable | ✓ |
| Article warnings documented | ✓ (14 remaining) |
| Elementor exceptions resolved | ✓ |
| Forms safely testable | ✓ |
| CMS publishing works | ✓ |
| Legacy URLs verified | ✓ |
| Redirects verified | ✓ |
| Desktop/mobile QA | ✓ |
| SEO QA | ✓ |
| Accessibility QA | ✓ |
| Production infra documented | ✓ |
| Launch checklist | ✓ |
| Rollback plan | ✓ |
| Content sync strategy | ✓ |

**STOP — awaiting user staging review before production.**
