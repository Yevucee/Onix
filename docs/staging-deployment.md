# Staging deployment

Private staging environment for the Onix website replacement (Next.js + Payload CMS + PostgreSQL).

## Platform selection

| Environment | Platform | URL | Purpose |
|-------------|----------|-----|---------|
| **QA / automated tests** | Cursor Cloud Agent VM | `http://localhost:3001` | Automated crawl, migration verification, CI-style QA |
| **Recommended reviewer staging** | Self-hosted Docker (Beelink or equivalent) | `https://staging.onixdatacentres.com` (example) | Human review with HTTPS + Basic Auth |

### Why Docker Compose on self-hosted hardware

- Matches production architecture (Node, PostgreSQL, persistent media volume)
- No mandatory proprietary PaaS dependency
- Portable to any Linux host with Docker
- Environment secrets via `.env.staging` (never committed)
- Same repository and build process as production

The Cloud Agent VM used for Phase 5 QA does not have Docker installed; deployment was validated via native Node.js + local PostgreSQL. Production staging should use `docker-compose.staging.yml`.

---

## Prerequisites

- Node.js ≥ 20 (for local/native deploy)
- PostgreSQL 16
- ~2 GB RAM minimum for app + DB
- ~2 GB disk for media (migrated library ~1.5 GB)
- TLS certificate (Let's Encrypt) for HTTPS staging hostname
- Reverse proxy (nginx, Caddy, or Traefik) for HTTPS + optional additional auth

---

## Quick start (Docker — recommended)

```bash
cd new-site
cp .env.example .env.staging
# Edit .env.staging — set all REQUIRED and STAGING_ONLY variables
docker compose -f docker-compose.staging.yml up --build -d
```

### Required `.env.staging` values

```env
SITE_ENV=staging
PAYLOAD_SECRET=<32+ random chars>
NEXT_PUBLIC_SITE_URL=https://staging.onixdatacentres.com
POSTGRES_PASSWORD=<strong password>
STAGING_AUTH_USER=<reviewer username>
STAGING_AUTH_PASSWORD=<strong password>
STAGING_SEND_EMAIL=false
STAGING_ADMIN_EMAIL=<admin email>
STAGING_ADMIN_PASSWORD=<strong password>
```

### Bootstrap database and content

```bash
# Create database (if not using Docker postgres init)
./scripts/staging/setup-database.sh

# Run migrations against staging DB
DATABASE_URL=postgresql://onix_staging:PASSWORD@localhost:5432/onix_staging npm run staging:migrate

# Create secure admin (removes default seed account)
npm run staging:admin

# Verify
npm run staging:verify
```

---

## Native deploy (development / QA VM)

Used during Phase 5 automated QA:

```bash
cd new-site
export DATABASE_URL=postgresql://onix:onix@localhost:5432/onix_staging
export SITE_ENV=staging
export PAYLOAD_SECRET=<secret>
export NEXT_PUBLIC_SITE_URL=http://localhost:3001
export STAGING_AUTH_USER=<user>
export STAGING_AUTH_PASSWORD=<password>
export STAGING_SEND_EMAIL=false
export MEDIA_STORAGE_PATH=./media

npm run build
PORT=3001 npm run start
```

---

## Database

| Item | Value |
|------|-------|
| Database name | `onix_staging` |
| Must NOT use | `onix` (dev), WordPress DB, future production Payload DB |
| Setup script | `scripts/staging/setup-database.sh` |
| Clone from dev (one-time) | `pg_dump onix \| psql onix_staging` |

Schema is managed by Payload on first boot (auto-migrate).

---

## Media storage

| Item | Detail |
|------|--------|
| Method | Local filesystem (`MEDIA_STORAGE_PATH=./media`) |
| Docker | Named volume `media_staging` |
| Backup | `tar czf media-backup.tar.gz media/` |
| Production path | Same volume mount pattern; rsync or object storage optional |

Do not use ephemeral container filesystem without a volume.

---

## Access protection

HTTP Basic Auth is enforced by `src/middleware.ts` when:

- `SITE_ENV=staging`
- `STAGING_AUTH_USER` and `STAGING_AUTH_PASSWORD` are set

Unauthenticated requests return **401**. Credentials must be stored as environment secrets, never in Git.

`robots.txt` and `sitemap.xml` are excluded from auth (still noindex via headers on pages).

---

## Search-engine protection (defence in depth)

1. HTTP Basic Auth
2. `X-Robots-Tag: noindex, nofollow, noarchive` on all pages
3. `<meta name="robots" content="noindex, nofollow">` in layout
4. `robots.txt` → `Disallow: /`
5. No GA4 on staging (`SITE_ENV=staging`)
6. No Search Console submission
7. Canonical URLs point to `onixdatacentres.com` (production), not staging hostname

Verify: `npm run staging:indexing-test` → `phase5/staging-indexing-test.md`

---

## Migration pipeline (staging)

Idempotent — safe to re-run:

```bash
npm run staging:migrate
# Or step by step:
npm run migrate:media
npm run migrate:articles:resolve
npm run migrate:pages          # MIGRATE_PAGES_SKIP_MEDIA=1 if media already imported
npm run migrate:leadership
npm run migrate:redirects
npm run migrate:verify
```

Reconcile counts: `npm run staging:reconcile`

---

## QA scripts

| Command | Output |
|---------|--------|
| `npm run staging:indexing-test` | `phase5/staging-indexing-test.md` |
| `npm run staging:crawl` | `phase5/staging-crawl.csv` |
| `npm run staging:legacy-urls` | `phase5/legacy-url-final-check.csv` |
| `npm run staging:article-warnings` | `phase5/article-warning-final.csv` |
| `npm run staging:qa-reports` | page-visual, SEO, content completeness CSVs |
| `npm run staging:verify` | indexing + crawl + legacy URLs |

Set `STAGING_BASE_URL` to the deployed URL before running QA scripts.

---

## Backup

Before major QA changes:

```bash
# Database
pg_dump $DATABASE_URL > staging-backup-$(date +%Y%m%d).sql

# Media
tar czf media-backup-$(date +%Y%m%d).tar.gz media/
```

---

## Deployment repeatability

1. Clone repository
2. Copy `.env.staging` from secrets manager
3. `docker compose -f docker-compose.staging.yml up --build -d`
4. `npm run staging:migrate` (against staging DB)
5. `npm run staging:admin`
6. `npm run staging:verify`

No hidden manual steps beyond secrets configuration and media archive extraction (`migration/source/media/uploads.zip` → `.migration-work/uploads/`).

---

## Staging URL for reviewers

Configure DNS A/CNAME for `staging.onixdatacentres.com` → staging server IP.  
Do **not** modify production `onixdatacentres.com` DNS.

Provide reviewers credentials via secure channel (not Git). See `docs/staging-review-guide.md`.
