# Phase 8 — SEO Final Audit

**Date:** 2026-08-08  
**Staging:** https://onix-staging-web-production.up.railway.app  
**Production:** https://onixdatacentres.com

## Summary

| Area | Status | Notes |
|------|--------|-------|
| Sitemap | ✅ | Static + dynamic entries; FR URLs added |
| robots.txt | ✅ | Staging: disallow all; Production: allow + sitemap |
| Canonical URLs | ✅ | `productionCanonical()` on key pages |
| Metadata | ✅ | Title, description via `buildMetadata()` |
| OpenGraph | ✅ | Default OG image + per-article images |
| Schema | ✅ | Organization (site-wide), Article, BreadcrumbList |
| hreflang | ✅ | EN/FR pairs for homepage + contact |
| Redirects | ✅ | `redirects.json` + middleware |
| Old WordPress URLs | ✅ | Redirect map preserved |
| Staging indexing | ✅ | Blocked via robots + metadata robots |

---

## Sitemap (`/sitemap.xml`)

### Static entries

| URL | Priority |
|-----|----------|
| `/` | 1.0 |
| `/about-us/` | 0.8 |
| `/contact-us/` | 0.8 |
| `/news/` | 0.8 |
| `/senegal/` | 0.8 |
| `/home/cfo-roi/` | 0.8 |
| `/fr/` | 0.8 |
| `/fr/home-francais/` | 0.8 |
| `/fr/contactez-nous/` | 0.8 |

### Dynamic entries

- Published CMS pages (legacy paths)
- All published articles (`/YYYY/MM/DD/slug/`)
- Leadership profiles
- Data centre pages

### Staging behaviour

Returns empty sitemap array when `isStaging()` — prevents indexing signal.

---

## robots.txt

| Environment | Rule |
|-------------|------|
| Staging | `Disallow: /` for all user agents |
| Production | `Allow: /` + sitemap reference |

Additional staging protection via `buildMetadata()` setting `robots: { index: false, follow: false, nocache: true }`.

---

## Canonical URLs

`productionCanonical()` always uses `https://onixdatacentres.com` regardless of staging domain.

| Page | Canonical |
|------|-----------|
| Homepage | `https://onixdatacentres.com/` |
| Contact | `https://onixdatacentres.com/contact-us/` |
| News | `https://onixdatacentres.com/news/` |
| Articles | `https://onixdatacentres.com/YYYY/MM/DD/slug/` |
| French home | `https://onixdatacentres.com/fr/` |
| French contact | `https://onixdatacentres.com/fr/contactez-nous/` |

---

## Metadata & OpenGraph

- Title template: `%s – Onix Data Centre` (duplicate suffix prevented)
- Default OG image: `https://onixdatacentres.com/images/onix/logo.png`
- Article pages: featured image or SEO ogImage override
- `og:site_name`: Onix Data Centre
- `og:locale`: `en_GB` (EN) / `fr_FR` (FR pages)

---

## Schema.org Structured Data

| Type | Scope | File |
|------|-------|------|
| Organization | Site-wide (layout) | `src/lib/schema.ts` |
| Article | Article pages | `ArticlePageTemplate` |
| BreadcrumbList | Article pages | `ArticlePageTemplate` |

Organization includes: name, url, logo, sameAs (Twitter, LinkedIn), contactPoint.

---

## hreflang

EN/FR alternate pairs configured in `HREFLANG_PAIRS`:

| English | French |
|---------|--------|
| `/` | `/fr/` |
| `/contact-us/` | `/fr/contactez-nous/` |

Rendered via `buildMetadata({ hreflangPath })` → `alternates.languages` with `x-default` pointing to EN.

No hreflang for `/fr/a-propos/` — page does not exist.

---

## Redirects

Source: `new-site/data/redirects.json` (imported via migration)

Key redirect categories:

| Pattern | Destination | Count |
|---------|-------------|-------|
| `/fr/author/*` | `/news/` | 3 |
| `/home-francais/` | `/fr/home-francais/` | 1 |
| Legacy `/o-home/*`, `/o-ghana/*` paths | New routes | ~50+ |
| Old blog paths | Date-based article URLs | ~88 |

Middleware applies redirects before page render.

---

## Old WordPress URLs

- All legacy paths mapped in `redirects.json`
- Phase 5 `legacy-url-final-check.csv` validated 200/301 responses
- Article URLs unchanged: `/YYYY/MM/DD/slug/`
- French author archives redirect to `/news/`

---

## Staging Indexing Prevention

Three layers:

1. `robots.ts` → `Disallow: /`
2. `buildMetadata()` → `noindex, nofollow, nocache` on all pages
3. `sitemap.ts` → empty array on staging

Verified in Phase 5 `staging-indexing-test.md`.

---

## Outstanding Items (post-cutover)

| Item | Priority | Notes |
|------|----------|-------|
| `/fr/a-propos/` SEO | Low | Page does not exist — add when FR content available |
| French hreflang for about | Low | Blocked on missing FR about page |
| News hreflang | N/A | No French news section |
| Google Search Console re-submission | Cutover | Submit new sitemap after DNS switch |
| Production OG image asset | Medium | Verify `/images/onix/logo.png` exists on production |

---

## STOP — No production cutover

SEO final pass complete. Awaiting separate migration checklist review (`phase5/PRODUCTION-LAUNCH-CHECKLIST.md`).
