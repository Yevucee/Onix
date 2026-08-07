# Staging indexing protection test

**Base URL:** http://localhost:3001
**Tested:** 2026-08-07T21:34:09.778Z

## Unauthenticated request (GET /)

| Check | Result |
|-------|--------|
| HTTP status | 401 ✓ blocked |
| X-Robots-Tag | (none) |

## Authenticated request (GET /)

| HTTP status | 200 |
| X-Robots-Tag | noindex, nofollow, noarchive |

## robots.txt

```
User-Agent: *
Disallow: /
```

Indexing test compliance checkboxes:

- [x] Unauthenticated requests return 401 when auth configured
- [x] X-Robots-Tag: noindex, nofollow, noarchive
- [x] robots.txt Disallow: /
- [x] No GA4 script in page source (SITE_ENV=staging)
- [x] Canonical URLs point to production domain (not staging) where set