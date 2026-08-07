# Media source material

## Archive

| Item | Value |
|------|-------|
| **Path** | `migration/source/media/uploads.zip` |
| **Tracking** | Git LFS |
| **Compressed size** | ~1.4 GB (1,505,051,521 bytes) |
| **Contents** | WordPress `wp-content/uploads/` tree |

## Extraction

Extract to a **gitignored** working directory (not committed):

```bash
mkdir -p .migration-work
unzip -q migration/source/media/uploads.zip -d .migration-work/ -x '__MACOSX/*'
```

Expected structure: `.migration-work/uploads/YYYY/MM/...` plus plugin directories (`elementor/`, etc.).

## Migration

- Inventory: `npm run media:inventory` (from `new-site/`)
- Reconciliation: `npm run migrate:reconcile-media`
- Import: `npm run migrate:media`

See `docs/migration.md` for the full workflow.

**Do not** commit extracted files or modify the source ZIP.
