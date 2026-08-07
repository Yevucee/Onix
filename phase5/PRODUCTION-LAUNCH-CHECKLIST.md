# Production launch checklist

**Do not execute until staging has been personally reviewed and approved.**

## BEFORE DNS

### Backups
- [ ] Full WordPress backup (files + database)
- [ ] Export current WordPress content snapshot (date-stamped)
- [ ] Backup new PostgreSQL production database (empty or pre-sync)
- [ ] Backup new media volume

### Content sync
- [ ] Execute final content sync per `content-freeze-and-final-sync.md`
- [ ] Run `npm run staging:migrate` against production DB (or final sync scripts)
- [ ] Verify article count matches WordPress published count
- [ ] Verify corporate pages render correctly
- [ ] Resolve or accept remaining article media warnings

### Configuration
- [ ] `SITE_ENV=production` (not staging)
- [ ] `NEXT_PUBLIC_SITE_URL=https://onixdatacentres.com`
- [ ] `PAYLOAD_SECRET` — new production secret (not staging)
- [ ] Remove `STAGING_AUTH_USER` / `STAGING_AUTH_PASSWORD`
- [ ] `CONTACT_FORM_RECIPIENT` set to production inbox
- [ ] `EMAIL_PROVIDER` configured and tested
- [ ] `NEWSLETTER_PROVIDER` configured (if launching newsletter)
- [ ] `GA4_MEASUREMENT_ID` set
- [ ] Production admin accounts created; no default seed credentials

### Verification (pre-DNS)
- [ ] All legacy URLs return 200 or intended 301 (use production URL map)
- [ ] Contact form sends to production recipient (test message)
- [ ] Newsletter subscription works (test with disposable address)
- [ ] ROI calculator verified
- [ ] French routes verified
- [ ] Sitemap contains all public URLs; no drafts
- [ ] robots.txt allows indexing (`Allow` or standard rules)
- [ ] Remove staging noindex (automatic when `SITE_ENV=production`)
- [ ] HTTPS certificate ready on production server
- [ ] Search Console property verified (DNS or HTML file method)

---

## DNS CUTOVER

### Preparation
- [ ] Lower DNS TTL to 300 seconds (24–48 hours before)
- [ ] Document current DNS records
- [ ] WordPress site remains online (do not disable)

### Change
- [ ] Update A/AAAA record for `onixdatacentres.com` → new server IP
- [ ] Update `www` if applicable
- [ ] Keep WordPress server accessible via direct IP or temporary hostname

### Verification (during propagation)
- [ ] `dig onixdatacentres.com` shows new IP
- [ ] HTTPS works with valid certificate
- [ ] Homepage loads from new stack
- [ ] Sample article URLs load
- [ ] Redirects work (`/blog/` → `/news/`, `/home/` → `/`)

---

## AFTER CUTOVER

### Smoke tests
- [ ] Homepage — desktop and mobile
- [ ] `/contact-us/` form submission
- [ ] `/news/` listing and pagination
- [ ] Sample article with images
- [ ] `/o-home/senegal/` data centre page
- [ ] Leadership profile
- [ ] `/home/cfo-roi/` calculator
- [ ] French pages

### SEO & analytics
- [ ] Submit sitemap to Google Search Console
- [ ] Verify GA4 receiving pageviews
- [ ] Check canonical URLs in page source
- [ ] Monitor Search Console for crawl errors

### Operations
- [ ] Monitor server logs for 24–48 hours
- [ ] Monitor 404 rate
- [ ] Monitor redirect chains
- [ ] Confirm no WordPress content accidentally indexed alongside new site

---

## ROLLBACK TRIGGERS

See `ROLLBACK-PLAN.md`. Roll back if:

- Critical pages return 5xx for > 15 minutes
- Contact form non-functional with no quick fix
- Mass 404s on indexed URLs
- Data loss discovered in content comparison

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Technical lead | | | |
| Content/editorial | | | |
| Business owner | | | |
