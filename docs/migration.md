# Migration guide

Phase 3 migration tooling lives in `new-site/scripts/migrate/` with shared libraries in `new-site/src/migration/`.

## Prerequisites

1. PostgreSQL running (`DATABASE_URL` pointing to `localhost` for local scripts)
2. `PAYLOAD_SECRET` and `NEXT_PUBLIC_SITE_URL` set in `.env`
3. WordPress XML at `migration/source/wordpress/onixdatacentre.WordPress.2026-08-07.xml`
4. Media archive at `migration/source/media/uploads.zip` (Git LFS)
5. Extracted uploads at `.migration-work/uploads/` (gitignored)

### Extract uploads (one-time)

```bash
mkdir -p .migration-work
unzip -q migration/source/media/uploads.zip -d .migration-work/ -x '__MACOSX/*'
```

Or: `git lfs pull` then copy LFS object to working tree if pointer file only.

## Commands

Run from `new-site/`:

| Command | Purpose |
|---------|---------|
| `npm run migrate:validate-uploads` | Validate ZIP and extraction |
| `npm run migrate:reconcile-media` | Reconcile attachments → `media-reconciliation.csv` |
| `npm run migrate:analyze-derivatives` | Derivative analysis report |
| `npm run migrate:scope-media` | Production media scope CSV |
| `npm run migrate:media` | Import master media to Payload (idempotent) |
| `npm run migrate:articles:sample` | Test import on representative sample |
| `npm run migrate:articles:all` | Bulk import all published articles |
| `npm run migrate:leadership` | Import leadership profiles |
| `npm run migrate:redirects` | Import redirects + generate `data/redirects.json` |
| `npm run migrate:verify` | URL/SEO/QA reports |

### Recommended order

```bash
npm run migrate:validate-uploads
npm run migrate:reconcile-media
npm run migrate:scope-media
npm run migrate:media
npm run migrate:articles:sample   # verify before bulk
npm run migrate:articles:all
npm run migrate:leadership
npm run migrate:redirects
npm run migrate:verify
```

## Idempotency

- **Media:** keyed on `legacy.wordpressId`
- **Articles:** keyed on `legacy.wordpressId`
- **Leadership:** keyed on `legacy.legacyPath`
- **Redirects:** keyed on `sourcePath`

Re-running commands updates existing records rather than duplicating.

## Reports

All reports written to `migration/reports/`:

- `uploads-archive-validation.md`
- `media-reconciliation.csv`
- `media-derivatives-summary.md`
- `media-production-scope.csv`
- `article-migration-results.csv`
- `article-media-errors.csv`
- `article-content-qa.csv`
- `seo-import-results.csv`
- `url-reconciliation.csv`
- `legacy-media-hotlinks.csv`
- `leadership-migration.csv`
- `elementor-widget-support.md`

## CI note

Normal CI does **not** download the 1.5 GB LFS archive. Migration unit tests run without extraction. Full migration verification is a manual/heavyweight step.

## Security

- Do not commit `.migration-work/`, extracted uploads, or `.env`
- Do not commit raw database dumps
- Media map cache: `.migration-work/media-map.json` (gitignored via parent dir)
