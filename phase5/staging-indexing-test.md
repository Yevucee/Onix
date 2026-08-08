# Staging indexing protection test

**Base URL:** https://onix-staging-web-production.up.railway.app
**Tested:** 2026-08-08T01:10:14.162Z

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

Indexing test compliance:

- [x] Unauthenticated requests return 401 when auth configured
- [x] X-Robots-Tag: noindex, nofollow, noarchive
- [x] robots.txt Disallow: /
- [x] No GA4 script in page source (SITE_ENV=staging)
- [x] Canonical URLs point to production domain where set