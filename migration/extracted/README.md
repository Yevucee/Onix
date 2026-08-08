# Sanitised database extraction

**Created:** 2026-08-07  
**Source:** Extracted from `onix db.gz` before the raw dump was purged from Git history.

The raw MySQL database dump has been **removed** from this repository and from all Git history. These files contain only non-sensitive migration data.

## Files

| File | Description | Records |
|------|-------------|---------|
| `extraction-metadata.json` | Extraction manifest, counts, exclusions | — |
| `yoast-seo.json` / `.csv` | Yoast SEO postmeta joined to public post fields | 12 posts |
| `seo-from-live-crawl.json` | Supplementary SEO from live site crawl (titles, descriptions, canonicals) | 154 URLs |
| `redirects.json` / `.csv` | Redirection plugin rules (public paths only) | 25 rules |
| `pretty-links.json` | Pretty Links short URL mappings | 1 link |
| `fluentform-config.json` | FluentForm field structure (no submissions) | 4 forms |
| `site-config.json` | Non-sensitive WordPress options (site URL, permalink structure, etc.) | 13 options |
| `yoast-primary-terms.json` | Yoast primary category assignments | 8 terms |

## What was excluded

- User accounts, password hashes, emails
- API keys, secrets, SMTP credentials
- Form submissions and entry data
- Security logs (Wordfence), Jetpack sync queues
- `wp_yoast_indexable` table (contained only stale `dev.onixdc.com` URLs)
- Full `post_content` from `wp_posts`

## Related sources

- **Forminator and Contact Form 7** form definitions: `migration/source/wordpress/onixdatacentre.WordPress.2026-08-07.xml`
- **Full post/page content**: WordPress XML export (same path)
- **Raw database backup**: retained offline separately (not in GitHub)
