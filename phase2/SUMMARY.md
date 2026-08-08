# Phase 2 Summary

**Project:** Onix Data Centres website migration  
**Phase:** 2 — Application foundation and representative prototype  
**Date:** 2026-08-07  
**Status:** Complete (stop condition reached — no bulk migration)

---

## Application status

The replacement application under `new-site/` builds and runs successfully:

- Next.js 15.4.11 + Payload CMS 3.87.1 + PostgreSQL
- `npm run typecheck` — passes
- `npm test` — 8 tests passing (staging, importer, routes)
- `npm run build` — passes with Postgres available
- Prototype seed and article import scripts executed successfully

**Local URLs (when running `npm run dev`):**

- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin

---

## Architecture

See `docs/architecture.md`.

**Stack:** Next.js App Router, TypeScript, Payload CMS, PostgreSQL, Lexical editor, Sharp, Tailwind v4.

**Key decisions:**

- CMS-driven dynamic rendering (`force-dynamic` on frontend)
- WordPress date-based article URLs preserved
- `/fr/` routing scaffold with Payload `en`/`fr` locales
- Migration tooling outside application runtime (`migration/`)

---

## CMS

### Collections implemented

| Collection | Status |
|------------|--------|
| Users (admin/editor) | ✅ |
| Media (sizes: hero, article, card, thumbnail) | ✅ |
| Categories | ✅ |
| Articles (Lexical + custom blocks) | ✅ |
| Pages (structured blocks) | ✅ |
| Data Centres | ✅ |
| Leadership | ✅ (schema only) |
| Redirects | ✅ (schema only) |

### Globals implemented

- Site Settings
- Header Navigation
- Footer
- SEO Defaults

---

## Prototype

| Page | Route | Source |
|------|-------|--------|
| Homepage | `/` | CMS page `home` + seed content |
| Corporate | `/about-us` | CMS page + seed content |
| Data centre | `/senegal` | Data Centres collection |
| Standard article | `/2025/11/13/what-is-peering/` | Imported from WordPress XML |
| Elementor article | `/2025/10/28/africa-digital-cloud-resilience/` | Imported (degraded content) |
| French placeholder | `/fr/`, `/fr/about-us`, `/fr/senegal` | Route preservation |

### Core components (Phase 2)

Header, Footer, Container, Section, Button, Hero, PageHero, ArticleHero, ArticleCard, CTA, Breadcrumbs, LexicalContent renderer.

Design tokens in `src/app/(frontend)/styles.css` based on Phase 1 audit (Poppins, brand red `#EC0223`, heading `#1C244B`).

---

## Article migration

### Importer v1 (`new-site/scripts/import-article.ts`)

**Tested slugs:**

1. `what-is-peering` — standard HTML article
2. `africa-digital-cloud-resilience` — Elementor-heavy

**Report:** `migration/reports/article-import-report.json`

| Slug | Result | Notes |
|------|--------|-------|
| what-is-peering | ✅ Success | Gutenberg comment markers flagged; 1 missing image |
| africa-digital-cloud-resilience | ✅ Success (degraded) | Elementor warning; plain-text fallback only |

**Idempotency:** Re-import updates by `legacy.wordpressId` (no duplicates).

**SEO mapping:** Falls back to `migration/extracted/seo-metadata.json` live crawl when Yoast meta absent from XML.

---

## Elementor-heavy article

See `migration/reports/elementor-heavy-article-assessment.md`.

**Finding:** Elementor `_elementor_data` cannot be auto-converted in v1. Phase 3 requires a dedicated Elementor widget mapper and manual review queue for 9 affected articles.

---

## Media

| Item | Status |
|------|--------|
| Media inventory script | ✅ `npm run media:inventory` |
| Output | `migration/reports/media-migration-map.csv` (563 attachments) |
| Uploads archive | ❌ Not yet supplied |
| Production URL dependency | ❌ Not used in final architecture |
| Payload media records | Empty (awaiting archive) |

---

## SEO

| Item | Status |
|------|--------|
| Sanitised extraction | ✅ `migration/extracted/seo-metadata.json` |
| CMS SEO fields | ✅ On Articles, Pages, Data Centres |
| Importer SEO mapping | ✅ XML meta + live crawl fallback |
| Bulk population | Not started (Phase 3) |

---

## Redirects

| Item | Status |
|------|--------|
| Sanitised extraction | ✅ `migration/extracted/redirects.json` (25 rules) |
| Redirects collection | ✅ Schema in Payload |
| Runtime redirect middleware | Not implemented (Phase 3) |

---

## Security

| Item | Status |
|------|--------|
| DB dump removed from Git | ✅ |
| Git history purged | ✅ (Phase 1, documented) |
| Sanitised extracts only in repo | ✅ |
| Documentation | `migration/reports/security-cleanup.md` |

---

## Staging protection

Implemented in `src/lib/staging.ts` + `src/middleware.ts` + `src/app/robots.ts`:

1. Global `noindex,nofollow,noarchive` when `SITE_ENV=staging`
2. `X-Robots-Tag` header
3. Disallow-all `robots.txt`
4. No production canonical/analytics contamination (analytics not yet implemented)

**Tests:** `tests/staging.test.ts` — all passing.

---

## CI

`.github/workflows/ci.yml`:

- Install (`npm ci`)
- Typecheck
- Lint
- Test
- Production build (Postgres service container)

---

## Docker

| File | Purpose |
|------|---------|
| `docker-compose.yml` | PostgreSQL + app service |
| `Dockerfile` | Multi-stage Next.js standalone |
| `.env.example` | Documented environment template |

---

## Page scope

`migration/reports/page-scope-review.csv` — 51 pages classified:

- 39 MIGRATE
- 9 EXCLUDE (staging/test duplicates)
- 3 MANUAL REVIEW

---

## French content

`migration/reports/french-content.md` — `/fr/` URLs preserved; full translation workflow deferred.

---

## Forms

`docs/forms-technical-spec.md` — technical specification only (Contact, Newsletter FR/EN, ROI calculator). No form rebuild in Phase 2.

---

## Remaining issues (before Phase 3)

1. **Uploads archive** required for media migration
2. **Elementor article parser** for 9 posts
3. **HTML → Lexical** conversion (currently strips tags for v1)
4. **Redirect middleware** from Redirects collection
5. **French content** population and Polylang mapping
6. **Leadership** collection population (15 profiles)
7. **Forms** implementation
8. **Production hosting** configuration (reverse proxy, TLS, backups)
9. **Remove dev admin default password** before shared staging
10. **Analytics** integration (disabled on staging)

---

## Recommendation — Phase 3 build order

1. Import uploads archive → populate Media collection
2. Enhance article importer (HTML → Lexical, image attachment linking)
3. Implement redirect middleware from `redirects.json`
4. Migrate remaining **MIGRATE** pages (39) using page-scope CSV
5. Build Elementor widget mapper; manual queue for edge cases
6. Populate Leadership collection
7. Implement Contact + Newsletter forms
8. Complete French locale content and `/fr/` routes
9. Staging deployment with `SITE_ENV=staging` verification
10. Bulk article import (85 posts) with QA sampling
11. Production cutover planning (DNS, redirects, Search Console)

---

## Stop condition

Phase 2 scope is complete. **No bulk page or article migration** has been started beyond the representative prototype set.

Awaiting Phase 2 review before proceeding to Phase 3.
