# Staging review guide

Use this guide when reviewing the private staging deployment of the new Onix website.

## Access

- Staging URL: provided by deployment (not production DNS)
- HTTP Basic auth: credentials from `STAGING_AUTH_USER` / `STAGING_AUTH_PASSWORD`
- Confirm `SITE_ENV=staging` — page source should include `noindex`

## Desktop review

1. Homepage — hero, services, latest news, CTAs
2. Corporate pages — `/home/our-solutions/`, `/home/infrastructure/`, `/partners/`, `/o-home/certification/`
3. Data centre — `/o-home/senegal/` (via redirect from `/senegal/`)
4. Leadership — sample profile e.g. `/o-home/bretttucker/`
5. News — `/news/` pagination and category filter
6. Article — date-based URL, featured image, body blocks
7. ROI calculator — `/home/cfo-roi/`
8. Contact — `/contact-us/` form validation
9. French — `/fr/contactez-nous/`, `/fr/home-francais/` if imported
10. 404 — visit a non-existent path

## Mobile review (~390px)

- Header menu (`Menu` details element)
- Hero typography
- Article reading experience
- Forms

## CMS review (Payload admin)

- Create draft article — must not appear on `/news/`
- Publish article — appears automatically
- Edit page block in Pages collection
- Upload media with alt text

## URL checks

- Compare `migration/url-map.csv` preserved paths
- Verify redirects: `/blog/` → `/news/`, `/home/` → `/`
- No unexplained 404s for MIGRATE pages

## Known limitations

See `phase4/OPEN-ISSUES.md` and `phase4/SUMMARY.md`
