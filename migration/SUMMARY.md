# Phase 1 Migration Audit — Executive Summary

**Date:** 2026-08-07  
**Site:** https://onixdatacentres.com  
**Branch:** `cursor/phase1-migration-audit-28a7`

---

## Repository contents

The repository contained **four legacy source files** in a flat `Onix Website files/` folder. These have been reorganised into `migration/source/`:

| File | Size | Purpose |
|------|------|---------|
| `onixdatacentre.WordPress.2026-08-07.xml` | 9.1 MB | WordPress WXR export (789 items) |
| `onix db.gz` | 15 MB | UpdraftPlus MySQL database dump (~172 MB uncompressed) |
| `astra theme.zip` | 6.3 MB | Stock Astra theme (no child theme) |
| `CFO ROI Calculator.html` | 100 KB | Custom ROI calculator widget code |

**Not supplied:** Media uploads, Elementor kit zip, child theme, custom plugins, screenshots, documentation, `wp-config.php`.

---

## Existing website

Onix Data Centres operates a WordPress 7.0.3 site on WordPress.com hosting (nginx, MariaDB), built with:

- **Astra theme** (stock, customised via Customizer)
- **Elementor + Elementor Pro** (primary page builder — 96% of pages)
- **23 active plugins** including Yoast SEO (via DB tables), Polylang, Forminator, FluentForm, Google Site Kit, Redirection, and numerous Elementor addon packs
- **Bilingual hints:** Polylang + TranslatePress tables, `/fr/` sitemap entries

Tagline: *"Connecting Africa to the Globe"*

---

## Pages

| Metric | Value |
|--------|-------|
| Pages in export | 53 |
| Live pages (sitemap) | 46 |
| Elementor-built | 51/53 (96%) |
| Leadership profile pages | 15 |
| Staging/duplicate pages | ~7 (need cleanup) |

Key pages: Homepage, About, Services, Our Solutions, Infrastructure, Certification, Sustainability, Partners, News, Blog, Contact, Senegal, CFO/Finance, Legal (Privacy, Cookie Policy).

---

## Articles

| Metric | Value |
|--------|-------|
| Posts in export | 90 |
| Live articles (sitemap) | 85 |
| Date range | Dec 2019 – Jul 2026 |
| URL format | `/YYYY/MM/DD/slug/` (must preserve) |
| Elementor page builder on articles | 9 of 90 |
| Migration difficulty | **Moderate** |

Most articles use standard HTML content with a shared Elementor single-post template. See `migration/reports/article-migration-assessment.md`.

---

## Media

| Metric | Value |
|--------|-------|
| Attachment records | 563 |
| Local files | **0 (critical gap)** |
| Types | JPG (250), PNG (183), JPEG (108), WebP (9), PDF (8), SVG (4) |
| PDFs | 8 (brochures, legal docs, IMS) |
| Referenced in content | 106 confirmed |

All media URLs point to production `wp-content/uploads/`. A full uploads archive must be obtained before migration can proceed offline.

---

## Elementor

**Extensively used** — this is an Elementor-driven site, not an Astra-themed site.

| Metric | Value |
|--------|-------|
| Items with Elementor data | 232 |
| Library templates | 46 (headers, footers, heroes, CTAs, team grids, etc.) |
| Top widgets | heading (528), icon-box (229), spacer (209), text-editor (194) |
| Third-party widget addons | Essential Addons, Royal Addons, Jeg Kit, Happy Addons, Megapack |
| Global kit colours | Brand red `#EC0223`, heading navy `#1C244B` |
| Global fonts | Roboto, Poppins, Roboto Slab |

**No Elementor kit zip** — data embedded in XML/DB. Rebuild as React components; do not import Elementor JSON.

See `migration/reports/elementor-analysis.md` for full template inventory and recommended components.

---

## Custom code

| Item | Finding |
|------|---------|
| Child theme | None |
| Custom PHP | None in supplied files |
| Custom CSS | Sticky header styles in Elementor; 1 `custom_css` post |
| Custom JS | CFO ROI Calculator (migrate to React) |
| Forms | Forminator (2), FluentForm, CF7 (1), Elementor forms |
| Redirects | Redirection plugin + Pretty Links in DB |
| Cookie consent | Complianz + Cookie Law Info tables in DB |

See `migration/reports/custom-code-analysis.md`.

---

## SEO

| Item | Finding |
|------|---------|
| SEO plugin | Yoast SEO (5 database tables with full indexables) |
| XML export SEO data | Minimal (12 content scores only) |
| Sitemap | `wp-sitemap.xml` — 158 URLs |
| Canonical tags | Present on live articles |
| Meta descriptions | Often empty on live pages |
| Redirect rules | In DB (Redirection plugin) |

**Primary SEO migration source:** database `wp_yoast_indexable`, not XML export.

See `migration/reports/seo-migration.md`.

---

## URLs

| Metric | Value |
|--------|-------|
| URLs crawled from sitemap | 158 |
| HTTP 200 | 154 |
| Errors | 4 (author sitemap entries) |
| URL map entries | 193 |
| Default action | **Preserve all paths** |

Article URLs use date prefixes. French pages use `/fr/` prefix. Legacy paths like `/o-home/o-ghana/...` appear in menus — verify redirects.

Full inventory: `migration/reports/site-inventory.csv`  
URL map: `migration/url-map.csv`

---

## Forms / integrations

| Integration | Status | Action |
|-------------|--------|--------|
| Contact forms (Forminator/FluentForm/CF7) | Active | Rebuild with new form handling |
| Google Site Kit / GA4 | Active | Reconfigure via env vars |
| Facebook Pixel | Referenced in DB | Confirm if still needed |
| Google Maps | 4 Elementor widgets | Rebuild with Maps API |
| Polylang (multilingual) | Active | Scope decision needed |
| Jetpack | Active | Remove |
| Pretty Links | Active | Migrate to Redirects collection |
| Email/SMTP | In DB (sensitive) | Reconfigure for new stack |

---

## Analytics

| Service | Detected | Recommendation |
|---------|----------|----------------|
| Google Site Kit | Yes (plugin) | Replace with direct GA4/GTM integration |
| GA4 | References in DB | Retain via environment variable |
| GTM | dns-prefetch on live site | Retain via environment variable |
| Facebook Pixel | 3 DB references | Confirm with stakeholder |
| LinkedIn Insight Tag | Not confirmed | Verify |
| Jetpack analytics | Plugin active | Remove |

**Planned new capabilities** (not yet implemented): page analytics, article analytics, PDF download tracking, form conversion tracking, email/phone click tracking, CTA tracking.

Staging must use separate analytics property with no pollution of production data.

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| No media files in repository | **Blocker** | Download uploads archive from production |
| Database dump in Git (sensitive) | **High** | Remove from Git history before public access; store offline |
| Elementor-heavy pages | **High** | Component-based rebuild; allow time per page |
| Missing post status in XML | Medium | Use DB as authoritative source |
| Duplicate/staging pages in export | Medium | Content audit with stakeholders |
| French content scope undefined | Medium | Decision before CMS model finalisation |
| Author emails in XML export | Medium | Redact if repo becomes public |
| Legacy menu URLs (`/o-home/...`) | Medium | Map redirects from DB |
| 9 Elementor-built articles | Low–Medium | Manual conversion |
| Plugin dependency surface (23 plugins) | Medium | Document and replace each function |

---

## Missing information

1. **`wp-content/uploads` archive** — required for media migration
2. **Confirmation of production page list** — which duplicates/staging pages to exclude
3. **French content scope** — maintain bilingual or English-only?
4. **Analytics IDs** — confirm which tracking services remain active (via env vars, not in docs)
5. **Form submission routing** — where should contact forms send email?
6. **Hosting/deployment target** — self-hosted server details for Docker planning
7. **Elementor Pro license** — not needed for new site but confirms Pro features in use
8. **Search Console verification** — for post-migration monitoring
9. **Email DNS (SPF/DKIM)** — for new form email delivery
10. **Author archive pages** — keep or redirect?

---

## Recommended architecture

**Confirmed:** Next.js + TypeScript + Payload CMS + PostgreSQL

| Layer | Recommendation |
|-------|----------------|
| Frontend | Next.js 14+ App Router, TypeScript, Tailwind CSS |
| CMS | Payload CMS 3.x with PostgreSQL adapter |
| Database | PostgreSQL (content, redirects, forms) |
| Media | Payload media collection → S3-compatible or local persistent volume |
| Search | Payload built-in or Meilisearch (if site search needed) |
| Cache | Next.js ISR/static generation for pages; on-demand revalidation |
| Auth | Payload admin auth for editors |
| Deployment | Docker Compose (app + postgres + media volume) on self-hosted server |
| CI | GitHub Actions — lint, test, build, deploy |
| Environments | development / staging (noindex + auth) / production |
| Staging protection | Auth + noindex meta + X-Robots-Tag + robots.txt (defence in depth) |

**Not recommended:** WordPress, Elementor, proprietary hosting, unrestricted page builder.

---

## Recommended build order

### Phase 2: Foundation
1. Review and approve this audit
2. Obtain media uploads archive
3. Secure/remove database dump from Git
4. Scaffold `new-site/` — Next.js + Payload + PostgreSQL + Docker
5. Implement staging noindex/auth protections (with tests)
6. Extract design tokens from `docs/design-system-source.md`

### Phase 3: Core components
7. Build Header, Footer, Layout components
8. Implement Payload collections: Pages, Articles, Media, Categories, Users
9. Implement globals: Site Settings, Header Navigation, Footer, SEO Defaults
10. Build reusable blocks: Hero, ServiceGrid, CTA, TeamGrid, ContactMap

### Phase 4: Content migration
11. Export Yoast SEO + redirects from DB
12. Download and import media to Payload
13. Import articles (automated script for 81 standard HTML posts)
14. Manually convert 9 Elementor articles
15. Rebuild marketing pages using blocks (one page at a time, starting with homepage)

### Phase 5: Features
16. Rebuild CFO ROI Calculator as React component
17. Implement contact forms with tracking
18. Implement analytics (GA4, GTM, download/CTA tracking)
19. Leadership collection + pages
20. Redirects collection populated from DB

### Phase 6: QA and launch
21. URL validation against `url-map.csv` (all 193 entries)
22. SEO validation (titles, descriptions, canonicals, schema)
23. Performance and accessibility audit
24. Staging review with stakeholders
25. Production deployment with DNS cutover plan

---

## Blocking issues

| # | Issue | Owner action required |
|---|-------|----------------------|
| 1 | **No media uploads supplied** | Provide `wp-content/uploads` archive or approve production download |
| 2 | **Database dump contains secrets** | Decide on Git history cleanup before repo visibility changes |
| 3 | **French content scope undecided** | Confirm whether `/fr/` content must be maintained |
| 4 | **Production page list unconfirmed** | Confirm which staging/duplicate pages to exclude |
| 5 | **Phase 1 audit review** | Approve findings before Phase 2 development begins |

---

## Deliverables produced

| Document | Path |
|----------|------|
| Source inventory | `migration/SOURCE-INVENTORY.md` |
| WordPress content summary | `migration/reports/wordpress-content-summary.md` |
| Elementor analysis | `migration/reports/elementor-analysis.md` |
| Custom code analysis | `migration/reports/custom-code-analysis.md` |
| Media inventory (CSV) | `migration/reports/media-inventory.csv` |
| Media summary | `migration/reports/media-summary.md` |
| Site inventory (CSV) | `migration/reports/site-inventory.csv` |
| URL map (CSV) | `migration/url-map.csv` |
| SEO migration | `migration/reports/seo-migration.md` |
| Article migration assessment | `migration/reports/article-migration-assessment.md` |
| Design system source audit | `docs/design-system-source.md` |
| Proposed CMS model | `docs/proposed-cms-model.md` |
| Security (.gitignore) | `.gitignore` |
| This summary | `migration/SUMMARY.md` |

---

**Phase 1 complete. Awaiting review before beginning the rebuild.**
