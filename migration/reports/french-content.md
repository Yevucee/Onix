# French content status (Phase 2)

## Policy

- Existing `/fr/` URLs are **preserved** in routing architecture.
- French locale is enabled in Payload (`locales: en`, `fr`).
- Full translation workflow is **not** implemented in Phase 2.

## Current implementation

| Area | Status |
|------|--------|
| Payload locale config | Implemented (`en`, `fr`) |
| Frontend `/fr/` route | Catch-all placeholder; About page partially mirrored |
| Header/footer FR links | Present in seed navigation |
| Article FR translations | Not migrated in Phase 2 |
| Corporate page FR | `/fr/a-propos/` — manual review; content not fully seeded |
| Contact FR | `/fr/contactez-nous/` — form not rebuilt |

## Known gaps (from Phase 1)

- Polylang linkage exists in WordPress DB (extracted references) but not fully mapped in prototype.
- Some FR pages return 200 with partial or English content on live site.
- Footer newsletter form has separate Fluent Form ID for FR.

## Untranslated / partial (document for Phase 3)

- Most data centre pages: EN only in prototype
- Leadership profiles: EN only
- Blog articles: predominantly EN; FR blog structure unclear
- Homepage: FR variant not prototyped

## Recommendation

1. Export Polylang translation pairs from secure DB copy (post ID ↔ FR post ID).
2. Seed `locale` field on Pages/Articles during bulk migration.
3. Implement `next-intl` or Payload-localized fields for public FR routes before launch.
