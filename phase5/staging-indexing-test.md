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

## Expected (SITE_ENV=staging)

- [ ] Unauthenticated requests return 401 when auth configured
- [ ] X-Robots-Tag: noindex, nofollow, noarchive
- [ ] robots.txt Disallow: /
- [ ] No GA4 script in page source
- [ ] Canonical URLs point to production domain (not staging) where set