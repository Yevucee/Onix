# Staging review guide

Use this guide when reviewing the private staging deployment of the new Onix website.

## Access

| Item | Detail |
|------|--------|
| **Staging URL** | `https://staging.onixdatacentres.com` (when deployed via Docker on your server) |
| **QA environment** | Phase 5 automated QA ran against `http://localhost:3001` on the build VM |
| **Authentication** | HTTP Basic Auth — username and password provided separately via secure channel |
| **CMS admin** | `{STAGING_URL}/admin` — use Payload credentials (not Basic Auth password) |
| **Indexing** | Staging is `noindex` — do not share URLs publicly |

### How authentication works

1. Browser prompts for username/password (Basic Auth)
2. After auth, browse the site normally
3. Payload admin requires a second login at `/admin`

Credentials are set via `STAGING_AUTH_USER` and `STAGING_AUTH_PASSWORD` environment variables. They are **not** stored in the repository.

---

## Recommended review sequence

### 1. First impressions (15 min)
1. Homepage — hero, services, news teaser, CTAs
2. Mobile view (~390px) — header menu, hero, footer
3. Confirm page source shows `noindex`

### 2. Corporate pages (30 min)
- `/about-us/`
- `/home/our-solutions/`
- `/home/infrastructure/`
- `/home/sustainability/`
- `/partners/`
- `/services/`
- `/o-home/certification/`
- `/o-home/privacy-policy/`
- `/linxaccra/`

Check: content completeness, images, links, spacing, headings.

### 3. Data centre (10 min)
- `/senegal/` (redirects to `/o-home/senegal/`)
- Facility specs, statistics, imagery

### 4. Leadership (10 min)
- `/o-home/bretttucker/` (sample profile)
- Note: profile photos may be missing (known media gap)

### 5. News & articles (30 min)
- `/news/` — count, pagination, categories
- Open 3–5 articles including:
  - Standard HTML article
  - `/2025/10/28/africa-digital-cloud-resilience/` (Elementor migration)
  - `/2022/11/17/onix-data-centre-announces-azure-stack-partnership-following-africa-tech-festival/` (Elementor migration)
- Verify featured images, galleries, captions

### 6. Functionality (20 min)
- `/home/cfo-roi/` — calculator with various inputs
- `/contact-us/` — form validation (safe on staging; emails not sent to production)
- Footer newsletter signup
- French: `/fr/home-francais/`, `/fr/contactez-nous/`

### 7. CMS test (20 min)
- Log into `/admin`
- Edit a page heading — confirm front-end update
- Create draft article — confirm NOT on `/news/`
- Publish test article — confirm appears
- Delete test article

### 8. URL & SEO check (15 min)
- `/blog/` → should redirect to `/news/`
- `/home/` → should redirect to `/`
- View page source: canonical should be `onixdatacentres.com` (not staging hostname)

---

## What is intentionally NOT enabled on staging

| Feature | Staging behaviour |
|---------|-------------------|
| Google Analytics | Disabled |
| Search Console | Not submitted |
| Contact email delivery | Logged/suppressed (`STAGING_SEND_EMAIL=false`) |
| Newsletter provider | Mock/log mode |
| Public indexing | Blocked (auth + noindex) |
| Production DNS | Unchanged |

---

## How to report issues

1. Note the **URL** and **viewport** (desktop/mobile)
2. Describe expected vs actual behaviour
3. Attach screenshot if visual
4. Classify: **blocking** / **high** / **medium** / **low**
5. Reference `phase5/STAGING-ACCEPTANCE.md` open issues list

---

## Known limitations (pre-documented)

See `phase5/STAGING-READINESS.md` and `phase4/OPEN-ISSUES.md`:

- 14 articles with residual inline media URL references (dimension-suffix filenames)
- Leadership profile photos missing from archive
- `/fr/a-propos/` content not fully imported
- Newsletter production provider not configured

---

## Review sign-off

| Reviewer | Date | Outcome |
|----------|------|---------|
| | | APPROVED / APPROVED WITH NOTES / REJECTED |
