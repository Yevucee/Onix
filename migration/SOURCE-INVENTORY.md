# Source Inventory — Onix Data Centres Website Migration

**Audit date:** 2026-08-07  
**Production site:** https://onixdatacentres.com  
**Repository state at audit:** Four legacy source files, now reorganised under `migration/source/`

---

## Summary

| Category | Supplied? | Location | Migration usefulness |
|----------|-----------|----------|-------------------|
| WordPress WXR export | Yes | `migration/source/wordpress/onixdatacentre.WordPress.2026-08-07.xml` | **Critical** — primary structured content source |
| Database dump | Yes | `migration/source/wordpress/onix db.gz` | **High** — SEO (Yoast), redirects, forms, full postmeta |
| Elementor kit export | **No** | Data embedded in XML + DB | **High** — requires parsing, not direct import |
| Active theme | Partial | `migration/source/themes/astra theme.zip` | **Low** — stock Astra, no child theme |
| Child theme | **No** | — | N/A |
| Custom PHP | **No** | — | Customisation is plugin/Elementor-based |
| Custom CSS | Partial | In Elementor `_elementor_data` + 1 `custom_css` post in XML | **Medium** |
| Custom JavaScript | Partial | CFO ROI Calculator + inline Elementor HTML widgets | **Medium** |
| Custom plugins | **No** source code | Plugin list recoverable from DB | **Low** for code; **High** for behaviour mapping |
| Media/uploads archive | **No** | Metadata only in XML | **Critical gap** — must be obtained separately |
| Screenshots | **No** | — | Use live site as reference |
| Documentation | **No** prior docs | This audit creates the docs | — |
| SEO data | Partial | Yoast tables in DB; minimal Yoast fields in XML | **High** — DB is primary SEO source |
| Sitemap | Live only | Crawled → `migration/reports/site-inventory.csv` | **High** |

---

## File-by-file inventory

### 1. WordPress XML export

| Field | Value |
|-------|-------|
| **Path** | `migration/source/wordpress/onixdatacentre.WordPress.2026-08-07.xml` |
| **Size** | ~9.1 MB |
| **Contains** | 789 content items: 53 pages, 90 posts, 563 attachments, 46 Elementor library templates, 31 nav menu items, 2 Forminator forms, 1 Contact Form 7 form, categories, tags, authors |
| **Usefulness** | **Critical** — pages, posts, slugs, categories, attachment references, Elementor JSON, menu structure |
| **Remain in Git?** | Yes — core migration source (redact author emails if repo becomes public) |
| **Sensitive?** | **Yes** — author email addresses in `<wp:author>` blocks |
| **Missing** | `wp:post_status` values (all empty — unusual export); most Yoast SEO fields; actual media files |
| **Further extraction** | Parse `_elementor_data` JSON; map featured images; cross-reference with DB for SEO |

### 2. Database dump

| Field | Value |
|-------|-------|
| **Path** | `migration/source/wordpress/onix db.gz` |
| **Size** | ~15 MB compressed / ~172 MB uncompressed |
| **Format** | UpdraftPlus MySQL dump (MariaDB 11.8, WordPress 7.0.3) |
| **Contains** | Full WordPress database: posts, postmeta, users, options, Yoast indexables, redirection rules, form submissions, Polylang/TranslatePress tables, plugin configuration |
| **Usefulness** | **High** — supplements XML for SEO titles/descriptions, redirects, form definitions, plugin settings |
| **Remain in Git?** | **Recommend removal from Git** before any public access; keep in secure offline storage |
| **Sensitive?** | **Yes — HIGH** — user password hashes, user emails, API/plugin keys, form submission data, IP logs (Wordfence tables present) |
| **Missing** | Nothing structurally — this is a complete DB backup |
| **Further extraction** | Export Yoast indexables to CSV; export redirection rules; inventory active plugins from `wp_options` |

### 3. Astra theme archive

| Field | Value |
|-------|-------|
| **Path** | `migration/source/themes/astra theme.zip` |
| **Size** | ~6.3 MB |
| **Contains** | Stock Astra theme v4.x (746 files) — standard theme, no child theme, no Onix-specific PHP |
| **Usefulness** | **Low** — confirms theme choice; design is overwhelmingly Elementor-driven |
| **Remain in Git?** | Optional — could be replaced with a version pin note; not required for rebuild |
| **Sensitive?** | No |
| **Missing** | Child theme, `custom.css` from Customizer (may be in DB `wp_options`) |
| **Further extraction** | Check DB for Astra Customizer settings if needed |

### 4. CFO ROI Calculator

| Field | Value |
|-------|-------|
| **Path** | `migration/source/custom-code/CFO ROI Calculator.html` |
| **Size** | ~100 KB |
| **Contains** | Self-contained HTML/CSS/JS calculator widget (scoped to `#onix-roi-calc`); fonts: Inter, Space Grotesk; Onix brand colours |
| **Usefulness** | **High** — must be rebuilt as a React component for `/cfo-roi/` page |
| **Remain in Git?** | Yes — reference implementation |
| **Sensitive?** | No |
| **Missing** | Integration context (which WP page embeds it) — likely `/cfo-roi/` |
| **Further extraction** | Extract calculation logic and design tokens into new component |

### 5. Elementor kit export

| Field | Value |
|-------|-------|
| **Path** | `migration/source/elementor/` (empty — see README) |
| **Contains** | Nothing as a standalone export |
| **Usefulness** | Elementor template data is in XML (`elementor_library` post type, 46 items) and DB |
| **Remain in Git?** | N/A |
| **Sensitive?** | No |
| **Missing** | Standalone `.zip` kit export would simplify template inventory |
| **Further extraction** | Parse all `elementor_library` items from XML; extract global kit colours/typography from `default-kit` |

### 6. Media files

| Field | Value |
|-------|-------|
| **Path** | `migration/source/media/` (empty — see README) |
| **Contains** | Nothing — no local copies |
| **Usefulness** | **Critical gap** |
| **Remain in Git?** | Directory placeholder only |
| **Sensitive?** | N/A |
| **Missing** | Entire `wp-content/uploads` tree (~563 files referenced) |
| **Further extraction** | Download from production URLs listed in `media-inventory.csv` |

### 7. Screenshots / visual reference

| Field | Value |
|-------|-------|
| **Path** | `migration/reference/screenshots/` (empty) |
| **Contains** | Nothing supplied |
| **Usefulness** | Live site used as canonical visual reference during crawl |
| **Further extraction** | Optional: capture key page screenshots before rebuild |

---

## Items NOT supplied (confirmed absent)

- Elementor Pro kit `.zip` export
- Child theme or custom theme PHP
- `wp-content/uploads` media archive
- `wp-config.php`
- Plugin source code
- Elementor Pro license/API credentials (present in DB — sensitive)
- Staging environment access
- Google Search Console / Analytics admin access
- DNS/hosting configuration
- Email/SMTP configuration (may be in DB — sensitive)

---

## Repository reorganisation performed

Original flat folder `Onix Website files/` reorganised to:

```
migration/source/wordpress/     ← XML + DB dump
migration/source/themes/        ← Astra theme zip
migration/source/custom-code/   ← CFO ROI Calculator
migration/source/elementor/     ← placeholder (data in XML/DB)
migration/source/media/         ← placeholder (not supplied)
migration/reference/screenshots/← placeholder
migration/reports/              ← audit outputs
docs/                           ← design system + CMS model
new-site/                       ← future application (empty)
```

Files moved with `git mv` to preserve Git history.

---

## Recommended actions before Phase 2

1. **Obtain `wp-content/uploads` archive** from production or hosting backup
2. **Remove `onix db.gz` from Git history** if repository visibility changes; store securely offline
3. **Redact author emails** from XML export if publishing repository
4. **Confirm French (`/fr/`) content scope** — Polylang active; partial French pages in sitemap
5. **Confirm which pages are production vs staging** — export contains `staging-tab`, `staging123`, `home-v2`, duplicate slugs
6. **Export Yoast SEO data** from DB into migration-friendly format
7. **Document active form endpoints** and where submissions should route in new stack
