# WordPress Content Summary

**Source:** `migration/source/wordpress/onixdatacentre.WordPress.2026-08-07.xml`  
**Export date:** 2026-08-07  
**Site:** Onix Data Centre — https://onixdatacentres.com

---

## Overview

| Metric | Count |
|--------|-------|
| Total items in export | 789 |
| Pages | 53 |
| Posts (articles) | 90 |
| Attachments (metadata) | 563 |
| Elementor library templates | 46 |
| Nav menu items | 31 |
| Forminator forms | 2 |
| Contact Form 7 forms | 1 |
| Custom CSS posts | 1 |
| Header/footer Elementor items (`elementor-hf`) | 1 |

**Publication date range:** 2019-12-24 to 2026-07-28

---

## Export anomaly: missing post status

The export contains **no `wp:post_status` values** (all empty). This is non-standard and likely an export tool issue. Status was inferred from:

- Presence in live sitemap (158 URLs crawled)
- Slug patterns (`__trashed`, `staging`, duplicates)
- Cross-reference with database dump (`wp_posts.post_status`)

**Migration concern:** Treat DB dump as authoritative for publish/draft/trash status when discrepancies arise.

---

## Authors

| ID | Login | Display name | Email in export |
|----|-------|--------------|-----------------|
| 5 | Yinka | Yinka Oyelade | Present (sensitive) |
| 7 | Samuel | Samuel | Present (sensitive) |
| 10 | onixdc | onixdc | Present (sensitive) |

**Migration concern:** Map to Payload CMS users; do not migrate raw WordPress password hashes.

---

## Categories

| Slug | Name |
|------|------|
| africa | Africa |
| blog | Blog |
| data | Data |
| news | News |
| technology | Technology |
| uncategorized | Uncategorized |
| uncategorized-fr | Uncategorized (FR duplicate) |

7 category terms total (including duplicate FR uncategorized from Polylang).

---

## Tags (13)

2021, Africa, AIIM, CLS, Corporations, Dakar, Data Centre, Funding, Growth, News, OnixDC News, solar, Sustainable

---

## Custom post types in export

| Post type | Count | Notes |
|-----------|-------|-------|
| `elementor_library` | 46 | Reusable Elementor templates |
| `elementor-hf` | 1 | Header/footer builder item |
| `forminator_forms` | 2 | Form definitions |
| `wpcf7_contact_form` | 1 | Legacy contact form |
| `custom_css` | 1 | Additional CSS (sticky header behaviour) |
| `wp_global_styles` | 1 | Block editor global styles |

---

## Pages (53 in export)

### Production pages (confirmed in live sitemap, 46 page URLs)

Key public pages identified from live crawl + export:

| Path | Title | Elementor |
|------|-------|-----------|
| `/` | Onix Data Centre (homepage) | Yes |
| `/about-us/` | About Us | Yes |
| `/services/` | Services | Yes |
| `/our-solutions/` | Our Solutions | Yes |
| `/infrastructure/` | Infrastructure | Yes |
| `/infrastructure-innovation/` | Infrastructure Innovation | Yes |
| `/certification/` | Certification | Yes |
| `/sustainability/` | Sustainability | Yes |
| `/partners/` | Partners | Yes |
| `/news/` | News | Yes |
| `/blog/` | Blog | Yes |
| `/contact-us/` | Contact Us | Yes |
| `/senegal/` | Senegal | Yes |
| `/virtual-machine/` | Virtual Machines | Yes |
| `/finance/` | Finance | Yes |
| `/cfo/` | CFO | Yes |
| `/cfo-roi/` | CFO ROI | Yes |
| `/pitch/` | Pitch Competition | Yes |
| `/feedback/` | Feedback | Yes |
| `/privacy-policy/` | Privacy Policy | Yes |
| `/elementor-9089/` | Cookie Policy | Yes |
| `/linxaccra/` | Linx Accra | Yes |

### Leadership / team profile pages (individual Elementor pages)

`/baraawafall/`, `/bretttucker/`, `/edemscott/`, `/eric-tenkorang/`, `/kevinopata/`, `/leonardmckinlay/`, `/mamadoukebe/`, `/michaelthompson/`, `/paulrichards/`, `/razak-awudulai/`, `/razak-awudulai1/`, `/samuel-osew-kwatia/`, `/samuelpolley/`, `/serwaakankam/`, `/stephenappiah/`

### Non-production / duplicate / staging pages in export (not in sitemap or duplicates)

| Path | Concern |
|------|---------|
| `/home/`, `/o-home/`, `/home-english/`, `/home-francais/`, `/home-v2/` | Multiple homepage variants — only `/` is live |
| `/staging-tab/`, `/staging123/` | Staging content |
| `/o-services/` | Legacy path variant |
| `/onix-team-contact/` | Possibly superseded |
| Duplicate slugs: `about-us`, `contact-us`, `infrastructure`, `partners`, `sustainability` (2 entries each) | Polylang translations or revisions |

**Migration concern:** Deduplicate before import; confirm canonical page for each slug with stakeholders.

---

## Posts / articles (90 in export, 85 in live sitemap)

Articles use **WordPress date-based URLs**: `/YYYY/MM/DD/slug/`

**Examples (most recent):**

- `/2026/07/28/what-happens-inside-a-tier-iv-data-centre-during-a-power-cut/`
- `/2026/07/07/when-financial-data-comes-home-what-nigerias-new-direction-means-for-ghana/`
- `/2026/06/15/ai-boom-africa-data-centres/`

### Elementor involvement in articles

| Metric | Count |
|--------|-------|
| Posts with `_elementor_data` (full page builder) | 9 |
| Posts with any Elementor metadata | 45 |
| Posts without Elementor page builder | 81 |

**Most articles use standard WordPress/editor content** with the Elementor single-post template (`onix-blog-template`) for layout — not per-article Elementor page building.

### Content characteristics

- **Featured images:** 93 `_thumbnail_id` references
- **Embedded video:** 18 items reference YouTube/Vimeo/iframe in content
- **PDF links in content:** 5 items
- **Excerpts:** Present on subset of posts

---

## Attachments (563 metadata records)

| Type | Count |
|------|-------|
| JPG | 250 |
| PNG | 183 |
| JPEG | 108 |
| WebP | 9 |
| PDF | 8 |
| SVG | 4 |
| ZIP | 1 |

**No binary files supplied** — all URLs point to `https://onixdatacentres.com/wp-content/uploads/...`

106 attachments confirmed referenced in post/page content.

---

## Navigation / menus

6 menu terms defined:

- Ghana
- Language
- ONIX Ghana menu
- ONIX New menu
- OnixDC Menu Header
- Senegal menu

31 menu items in export. Many items link to **anchor sections** on `/our-solutions/` (e.g. `#tangor`, `#virtualmachines`, `#peering`).

**Migration concern:** Navigation is complex with country variants (Ghana/Senegal) and hash-based service links. Requires structured nav model in Payload globals.

---

## French / multilingual content

- **Polylang** plugin active (confirmed in DB)
- **TranslatePress** tables also present in DB (`wp_trp_*`)
- Live sitemap includes `/fr/wp-sitemap-posts-page-1.xml` — **4 French page URLs**
- Category `uncategorized-fr` in export

**Migration concern:** Clarify whether French content must be maintained in new site; affects CMS model (locales, duplicate content strategy).

---

## Elementor metadata in export

2,086 references to "elementor" in XML. Key postmeta keys:

| Meta key | Occurrences |
|----------|-------------|
| `_elementor_template_type` | 138 |
| `_elementor_edit_mode` | 135 |
| `_elementor_data` | 129 |
| `_elementor_version` | 114 |
| `_elementor_pro_version` | 110 |
| `_elementor_page_settings` | 71 |
| `_elementor_conditions` | 33 |

---

## SEO metadata in export (limited)

Only 2 Yoast fields found in XML postmeta:

- `_yoast_wpseo_content_score` (12 items)
- `_yoast_wpseo_primary_category` (12 items)

**Full Yoast SEO data is in the database** (`wp_yoast_indexable` and related tables). See `migration/reports/seo-migration.md`.

---

## Migration concerns summary

| Risk | Severity | Notes |
|------|----------|-------|
| Missing post status in XML | Medium | Use DB as source of truth |
| No media files locally | **High** | Blocker for offline migration |
| Duplicate/staging pages in export | Medium | Requires content audit |
| Date-based article URLs | Low | Must preserve exactly |
| Bilingual content (EN/FR) | Medium | Scope decision needed |
| Elementor-heavy pages | **High** | All main pages are Elementor-built |
| Leadership pages as individual WP pages | Medium | Consider `Leadership` collection |
| Hash-based nav links to services | Medium | Rebuild as structured anchors or sub-pages |
