# Phase 4 Summary

**Project:** Onix Data Centres website migration  
**Phase:** 4 — Corporate page reconstruction & staging readiness  
**Date:** 2026-08-07  
**Status:** Complete (stop condition met — no production launch)

---

## Corporate pages

| Metric | Value |
|--------|-------|
| Expected (MIGRATE scope) | 39 |
| Routed via `[...slug]` + dedicated routes | 39 |
| Excluded (staging/test/trash) | 9 |
| Page importer | `npm run migrate:pages` |
| Build plan | `phase4/page-build-plan.csv` |

Dedicated routes: `/`, `/about-us`, `/contact-us`, `/news`, `/senegal`, `/home/cfo-roi`, `/fr/*`  
Dynamic: `/home/*`, `/o-home/*`, `/partners`, `/services`, leadership profiles, etc.

---

## Components

| Family | Components |
|--------|------------|
| Layout | Header, Footer (+ newsletter), Breadcrumbs, Container, Section |
| Page sections | Hero, PageHero, StatisticsGrid, FeatureCards, LogoGrid, DownloadsSection, VideoSection, GallerySection, SplitContent, CTASection |
| Pages | PageBlocksRenderer, DataCentreTemplate, LeadershipGrid, LeadershipProfileView |
| Articles | LexicalContent, ArticleBlocksRenderer (gallery, table, video, download, CTA, quote) |
| Forms | ContactForm, NewsletterForm |
| ROI | RoiCalculator + `lib/roi-calculator/calculate.ts` |

Payload page blocks extended: featureCards, logoGrid, downloads, video, gallery, leadershipGrid

---

## Articles

| Metric | Value |
|--------|-------|
| Phase 3 warnings (manual review) | 59 |
| Improved media matcher | Yes (suffix stripping, attachment path base match) |
| Elementor `image-carousel` | Supported in parser |
| migrationBlocks field | Added to legacy group for article media blocks |
| Re-import required | Run `npm run migrate:articles:resolve` with DB + media archive |
| Elementor exceptions | 2 articles flagged — see `phase4/article-warning-resolution.csv` |

---

## Media

| Item | Status |
|------|--------|
| Leadership photos | Still missing from Phase 3 import (archive-dependent) |
| Inline article media | Improved resolver; re-import recommended |

---

## French

| URL | Status |
|-----|--------|
| `/fr/home-francais/` | Route + importer support |
| `/fr/contactez-nous/` | Contact form route |
| `/fr/a-propos/` | Route (content import pending) |
| `/fr/author/*` | 301 → `/news/` |
| Report | `phase4/french-page-migration.csv` |

---

## Functionality

| Feature | Status |
|---------|--------|
| Contact form | Production-ready architecture (`CONTACT_FORM_RECIPIENT`, `EMAIL_PROVIDER`) |
| Newsletter | UI + API; provider via `NEWSLETTER_PROVIDER` env |
| ROI calculator | `/home/cfo-roi/` — TypeScript port with tests |
| Redirects | Extended (`/home/` → `/`, `/blog/` → `/news/`) |
| Sitemap | `/sitemap.xml` (production only) |
| 404 | Branded `not-found.tsx` |
| Staging auth | HTTP Basic via `STAGING_AUTH_USER` / `STAGING_AUTH_PASSWORD` |

---

## SEO

| Item | Status |
|------|--------|
| Page QA report | `phase4/seo-page-qa.csv` (template — crawl validation in staging) |
| JSON-LD | Article, Organisation (via article template) |
| Staging noindex | Retained + tested |

---

## Forms

| Form | Status |
|------|--------|
| Contact | Server validation, honeypot, email abstraction |
| Newsletter | Fluent Form id 2 reference; log mode until provider configured |

---

## Accessibility

- Semantic headings in templates
- Form labels and error states
- Keyboard-navigable header menu (`<details>` mobile)
- Alt text from Payload media

---

## Performance

- Next.js Image for media sections
- Lazy video embeds
- No Elementor DOM/bloat
- ROI calculator client-only where needed

---

## CMS

- Page blocks editable in Payload
- Leadership centralised collection
- Data centres single source of truth
- Editability review: `phase4/cms-editability-review.md` (see repo)

---

## Staging

| Protection | Status |
|------------|--------|
| HTTP Basic auth | Implemented (env-controlled) |
| noindex / X-Robots-Tag | Yes |
| Staging email suppression | Yes (`STAGING_SEND_EMAIL`) |
| Separate DB/media | Documented in `docs/deployment.md` |

---

## Testing

| Check | Result |
|-------|--------|
| Typecheck | Pass |
| Unit tests | 21 passed |
| Production build | Pass |
| Migration tests | Pass |
| ROI calculator tests | Pass |

---

## Open issues

See `phase4/OPEN-ISSUES.md` for tracked items including:
- Article re-import after media mapper improvements
- 2 Elementor article visual QA
- FR about page content
- Leadership photos
- Newsletter provider credentials
- Production email provider configuration

---

## Recommendation

**Ready for Phase 5 private staging acceptance** after:

1. Deploy to private staging with auth + separate DB
2. Run `migrate:pages` and `migrate:articles:resolve` against staging DB with media archive
3. Visual QA of corporate pages and 2 Elementor articles
4. Configure `CONTACT_FORM_RECIPIENT` and email provider for staging test (optional)
5. Configure newsletter provider if retaining production integration

Do not change DNS or decommission WordPress until Phase 5 sign-off.
