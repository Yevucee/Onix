# French content status (Phase 3)

## Policy

Existing `/fr/` URLs are preserved. No translation project was performed — only existing French content is represented.

## URLs identified

| URL | Status | Notes |
|-----|--------|-------|
| `/fr/home-francais/` | Partial | WordPress page exists; Phase 3 route scaffold at `/fr/` |
| `/fr/contactez-nous/` | Not migrated | Contact form implemented at `/contact-us` (EN); FR form Phase 4 |
| `/fr/a-propos/` | Not migrated | Corporate page reconstruction is Phase 4 |
| `/fr/author/*` | Not migrated | Author archive URLs — low priority |

## Migrated in Phase 3

- Payload locale config (`en`, `fr`) — unchanged from Phase 2
- `/fr/` catch-all route preserved for homepage, about-us, senegal mirrors
- No French blog articles (none exist in WordPress export)

## Partial / manual review

- French homepage (`home-francais`) is Elementor-built — requires Phase 4 page migration
- Footer newsletter FR form not rebuilt
- Polylang translation pairs not fully mapped (requires secure DB copy if needed)

## English-only equivalents

Most production content is English-only. Data centre pages, leadership, and articles have no FR counterparts in the export.

## Architecture

Payload localized fields and `/fr/` routing support future French expansion without a separate translation platform.
