# Security cleanup — database dump removal

**Date:** 2026-08-07  
**Operator:** Phase 1/2 migration automation  
**Status:** Complete

---

## File removed

| Attribute | Value |
|-----------|-------|
| **Filename** | `onix db.gz` |
| **Original paths in Git** | `Onix Website files/onix db.gz` → `migration/source/wordpress/onix db.gz` |
| **Format** | gzip-compressed MySQL dump (UpdraftPlus, WordPress 7.0.3) |
| **Compressed size** | ~15 MB |
| **Uncompressed size** | ~172 MB |
| **Purpose** | Full WordPress database backup for migration analysis |

---

## Why it was removed

The dump contained sensitive data unsuitable for version control:

- WordPress user password hashes
- User email addresses
- Plugin API keys and secrets (in `wp_options`)
- Form submission records
- Security plugin logs (Wordfence)
- Authentication tokens and worker keys

**Action taken:** Purged from working tree and entire Git history using `git filter-repo`. Force-pushed to `origin/main` and feature branches.

**Offline backup:** Retained separately by the project team (outside GitHub).

---

## Data extracted before purge

Sanitised outputs in `migration/extracted/`:

| File | Contents |
|------|----------|
| `seo-metadata.json` | Yoast SEO fields + live-crawl supplement (no credentials) |
| `redirects.json` / `redirects.csv` | 25 public redirect rules |
| `form-config-summary.json` | Form field structures (FluentForm, references to XML forms) |
| `site-config.json` | Non-sensitive site options (URL, permalinks, timezone) |
| `yoast-primary-terms.json` | Primary category assignments |
| `pretty-links.json` | Short URL mapping |

**Excluded from extraction:** users, passwords, submissions, API keys, logs, full post content.

---

## Git history verification

After `git filter-repo --invert-paths`:

```text
git rev-list --objects --all | grep "onix db"
→ NO_MATCH_IN_HISTORY
```

Largest remaining Git blobs: WordPress XML export (~9 MB), Astra theme zip (~6 MB). No ~15 MB database dump blob.

---

## `.gitignore` patterns added

```gitignore
*.sql
*.sql.gz
*.sql.bz2
*.db.gz
*db*.gz
onix db.gz
**/onix db.gz
```

---

## Recommendations

1. Do not re-add database dumps to this repository.
2. Store future backups in encrypted offline storage only.
3. Use `migration/extracted/` for migration reference data.
4. Rotate any credentials that were ever present in the committed dump (precautionary).
