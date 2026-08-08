# Phase 7 — News/Blog Visual QA

**Date:** 2026-08-08  
**Staging:** https://onix-staging-web-production.up.railway.app  
**Live reference:** https://onixdatacentres.com/news/

## Template Architecture

| Template | File | Route |
|----------|------|-------|
| News listing | `NewsListingTemplate.tsx` | `/news/` |
| Article detail | `ArticlePageTemplate.tsx` | `/YYYY/MM/DD/slug/` |

Both use Onix design system: `OnixBreadcrumbs`, `onix-container`, `onix-heading-dark`, navy/red tokens, magazine grid layout.

---

## News Listing (`/news/`)

### Live vs Staging

| Element | Live | Staging | Status |
|---------|------|---------|--------|
| Page title | "News" | "News & Insights" | ✅ Acceptable |
| Article cards | Image overlay grid | Magazine grid with featured image | ✅ |
| Featured images | Present on cards | `getMediaUrl(featuredImage)` | ✅ |
| Categories | Not visible on listing | Category filter pills | ✅ Enhancement |
| Dates | Shown on cards | Formatted en-GB | ✅ |
| Pagination | WP pagination | Page nav with prev/next | ✅ |
| Breadcrumbs | None | Home / News | ✅ |
| Content width | Full container | `onix-container` (1200px) | ✅ |
| Mobile layout | Responsive grid | 1-col → 2-col → 3-col | ✅ |

### Representative listing QA

- [x] Featured hero card on page 1 (first article, full-width)
- [x] Grid cards with image fallback gradient
- [x] Category filter links preserve pagination
- [x] All article URLs preserved: `/YYYY/MM/DD/slug/`

---

## Article Template — Standard HTML

**Representative:** `/2023/02/24/onix-ceo-mike-nahons-speech-senegal/`

| Element | Live | Staging | Status |
|---------|------|---------|--------|
| Title (H1) | Large heading | 40px onix-heading-dark | ✅ |
| Date | Published date | Formatted + `<time>` | ✅ |
| Featured image | Hero image | 16:9 aspect, onix-content width | ✅ |
| Content width | ~800px prose | `onix-content` (1040px) | ✅ |
| Typography | Body text | `onix-article-content` styles | ✅ |
| Breadcrumbs | Minimal | Home / News / Title | ✅ |
| Categories | Tags | Linked category pills | ✅ |
| Related articles | Sometimes present | Category-based related (3 max) | ✅ |
| CTA | Footer CTA | OnixPageCTA | ✅ |
| Schema | Article JSON-LD | Article + BreadcrumbList | ✅ |

---

## Article Template — Elementor-heavy

**Representative:** `/2022/12/20/onix-data-centre-accra-achieves-iso-27001-and-iso-9001-certification/`

| Element | Live | Staging | Status |
|---------|------|---------|--------|
| Inline images | Elementor image blocks | `ArticleBlocksRenderer` image blocks | ✅ |
| Galleries | Multi-image rows | Gallery grid (2–3 col) | ✅ |
| Downloads | PDF links | Download block with analytics | ✅ |
| Tables | Data tables | Table block renderer | ✅ |
| CTAs | Elementor CTA widgets | CTA block with Button | ✅ |
| Related article links | Inline links | Fixed: links to actual article URL | ✅ Fixed |
| Video embeds | YouTube/Vimeo | iframe embed | ✅ |

---

## Article Template — Media-heavy

**Representative:** `/2021/09/21/onix-dc-accra-the-only-climate-friendly-data-centre-in-west-africa/`

| Element | Live | Staging | Status |
|---------|------|---------|--------|
| Multiple inline images | Throughout article | Lexical + migration blocks | ✅ |
| Image captions | Present on some | `<figcaption>` support | ✅ |
| Content flow | Mixed text/images | `lexical-content` + `article-blocks` | ✅ |
| Social sharing | WP share buttons | Not replicated (not on all live articles) | ⚪ Acceptable |

---

## URL Preservation

All 88 migrated articles retain WordPress date-based URLs:

```
/YYYY/MM/DD/slug/
```

No URL changes. Verified via `routes.test.ts` pattern and article page path validation.

---

## Bug Fixes Applied

| Bug | Fix |
|-----|-----|
| `relatedArticle` block linked to `/news/` | Now builds correct `/YYYY/MM/DD/slug/` from `publishedAt` |

---

## Bulk Migration Readiness

Templates validated against three article archetypes:

1. ✅ Standard HTML article (CEO speech Senegal)
2. ✅ Elementor-heavy article (ISO certification)
3. ✅ Media-heavy article (climate-friendly DC)

All 88 articles render through `ArticlePageTemplate` — no per-article custom routes.

---

## STOP — No production cutover

News/blog rebuild complete. Awaiting separate migration checklist review before cutover.
