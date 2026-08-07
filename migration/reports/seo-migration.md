# SEO Migration Assessment

**Sources:** Database dump (`wp_yoast_*` tables), WordPress XML export, live site crawl

---

## SEO system identified

**Primary:** Yoast SEO (confirmed by database tables)

| Table | Purpose |
|-------|---------|
| `wp_yoast_indexable` | Full SEO metadata per URL (titles, descriptions, canonical, OG) |
| `wp_yoast_indexable_hierarchy` | Parent/child URL relationships |
| `wp_yoast_primary_term` | Primary category per post |
| `wp_yoast_seo_links` | Internal link graph |
| `wp_yoast_migrations` | Schema version |

**Secondary:** Elementor page settings (per-page title/description where configured)

**Not detected:** Rank Math, All in One SEO

---

## Data available for migration

| SEO field | XML export | Database (Yoast) | Live site crawl |
|-----------|------------|------------------|-----------------|
| SEO title | Minimal (12 content scores only) | **Yes** — `wp_yoast_indexable` | Visible in `<title>` |
| Meta description | **No** | **Yes** | Partially in crawl data |
| Canonical URL | **No** | **Yes** | Confirmed on articles |
| Open Graph title | **No** | **Yes** | Not crawled separately |
| Open Graph description | **No** | **Yes** | — |
| Social/OG image | **No** | **Yes** | — |
| Robots/indexing | **No** | **Yes** | `max-image-preview:large` on live |
| Focus keyphrase | **No** | **Yes** | — |
| Schema/structured data | **No** | **Yes** (Yoast graph) | Not verified |
| Primary category | 12 in XML | **Yes** | — |
| Internal link data | **No** | **Yes** (`wp_yoast_seo_links`) | Crawl has link counts |

**Conclusion:** Database Yoast indexables are the **authoritative SEO source**. XML export alone is insufficient.

---

## Sitemap configuration

| Item | Value |
|------|-------|
| Live sitemap | `https://onixdatacentres.com/wp-sitemap.xml` |
| Sitemap index entries | Posts, pages, categories, tags, users, FR pages |
| URLs in sitemap | 158 |
| robots.txt | Standard WP — disallows `/wp-admin/`, references sitemap |
| Old `sitemap_index.xml` | Returns 404 (Yoast-style path not in use) |

**New site:** Generate Next.js sitemap from Payload content. Do not submit staging sitemap to search engines.

---

## Live crawl SEO observations

- **154/158 URLs** return HTTP 200
- **4 URLs** returned errors (likely author/user sitemap entries)
- **Canonical tags** present on article pages (self-referencing)
- **Meta descriptions** often empty in HTML output — Yoast may not have descriptions set for all pages, or they are rendered differently
- **H1 tags** present on article pages
- **Title format:** `{Page Title} – Onix Data Centre` (em dash separator)

---

## URL structure to preserve

| Content type | Pattern | Example |
|--------------|---------|---------|
| Homepage | `/` | `onixdatacentres.com/` |
| Pages | `/{slug}/` | `/about-us/` |
| Articles | `/{YYYY}/{MM}/{DD}/{slug}/` | `/2026/07/28/what-happens-inside-a-tier-iv-data-centre-during-a-power-cut/` |
| Categories | `/category/{slug}/` | `/category/news/` |
| Tags | `/tag/{slug}/` | `/tag/africa/` |
| French pages | `/fr/{slug}/` | Partial — 4 pages in FR sitemap |
| Authors | `/author/{slug}/` | 3 author URLs in sitemap |

**Default rule:** Preserve all paths exactly. See `migration/url-map.csv`.

---

## Redirect data

| Source | Notes |
|--------|-------|
| Redirection plugin | Rules in `wp_redirection_items` — export before migration |
| Pretty Links | Short URL mappings in `wp_prli_*` tables |
| Legacy paths | Menu references `/o-home/o-ghana/...` — verify if redirects exist |

---

## What can be automatically migrated

| Item | Automation level |
|------|------------------|
| Yoast SEO titles | **High** — export from `wp_yoast_indexable` |
| Meta descriptions | **High** |
| Canonical URLs | **High** |
| OG data | **High** |
| Primary categories | **High** |
| robots/noindex flags | **High** |
| Schema markup | **Medium** — Yoast schema must be reimplemented (JSON-LD in Next.js) |
| Sitemap | **High** — generate from Payload |
| Redirect rules | **High** — from Redirection plugin DB |
| hreflang (Polylang) | **Low** — needs FR content scope decision |

---

## What requires manual review

1. **Pages with empty meta descriptions** — write new copy or accept defaults
2. **Duplicate/staging pages** — ensure not indexed
3. **French content SEO** — separate or combined strategy
4. **Author archive pages** — may not be needed in new site (3 author URLs)
5. **Category/tag archive pages** — decide if taxonomy pages are needed or redirect to `/news/`
6. **Schema type per page** — Organization, Article, WebPage, etc.
7. **Social image defaults** — site-wide fallback when per-page OG image missing
8. **Cookie/consent impact on tracking** — separate from SEO but affects GSC data

---

## Staging SEO protection (future requirement)

When staging is built, enforce:

1. Password/authentication protection
2. `<meta name="robots" content="noindex,nofollow,noarchive">`
3. `X-Robots-Tag: noindex, nofollow, noarchive` header
4. Restrictive `robots.txt`
5. No staging sitemap submitted
6. Separate analytics property
7. Automated tests confirming all protections

Production launch must remove global noindex rules.

---

## Recommended migration script inputs

1. Export `wp_yoast_indexable` → JSON/CSV keyed by permalink
2. Export `wp_redirection_items` → redirects collection
3. Cross-reference with live crawl `site-inventory.csv` for gaps
4. Map to Payload SEO fields on Pages and Articles collections
