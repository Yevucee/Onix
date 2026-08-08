# Staging deployment

Private staging environment for the Onix website replacement (Next.js + Payload CMS + PostgreSQL).

## Current staging platform: Railway

| Item | Value |
|------|-------|
| **Platform** | [Railway](https://railway.app) — GitHub-connected PaaS |
| **Project** | `onix-staging` |
| **Web service** | `onix-staging-web` |
| **Database service** | `Postgres` |
| **Media volume** | `onix-staging-media` mounted at `/app/media` |
| **Branch** | `cursor/phase5-staging-deployment-28a7` |
| **Staging URL** | `https://onix-staging-web-production.up.railway.app` |

### Why Railway

- Deploy directly from GitHub on the Phase 5 branch
- Managed PostgreSQL with persistent storage
- Persistent volumes for ~1 GB migrated media
- Long-running Node container (Next.js + Payload `/admin`)
- HTTPS public URL for private review (with HTTP Basic Auth)
- No changes to production WordPress or DNS
- Secrets via Railway Variables (never in Git)

### Repository configuration

| File | Purpose |
|------|---------|
| `railway.toml` | Build/deploy config (Dockerfile, healthcheck) |
| `Dockerfile.railway` | Monorepo build: `new-site/` + `migration/` assets |
| `scripts/railway/docker-entrypoint.sh` | Volume permissions, optional bootstrap |
| `scripts/railway/bootstrap.sh` | One-time content migration (run via SSH) |

Healthcheck uses `/robots.txt` (no Basic Auth required). Homepage requires credentials.

---

## Access

| Item | Detail |
|------|--------|
| **URL** | `https://onix-staging-web-production.up.railway.app` |
| **Basic Auth** | `STAGING_AUTH_USER` / `STAGING_AUTH_PASSWORD` (set in Railway Variables — not in Git) |
| **Payload admin** | `{URL}/admin` — separate CMS login (`STAGING_ADMIN_EMAIL`) |
| **Indexing** | `noindex`, `robots.txt` → `Disallow: /` |

See `docs/staging-review-guide.md` for the review checklist.

---

## Environment variables (Railway → `onix-staging-web`)

| Variable | Classification | Notes |
|----------|----------------|-------|
| `SITE_ENV` | REQUIRED | `staging` |
| `PAYLOAD_SECRET` | REQUIRED | 32+ random chars |
| `DATABASE_URL` | REQUIRED | `${{Postgres.DATABASE_URL}}` |
| `NEXT_PUBLIC_SITE_URL` | REQUIRED | Railway public URL (no trailing slash) |
| `STAGING_AUTH_USER` | STAGING_ONLY | HTTP Basic Auth username |
| `STAGING_AUTH_PASSWORD` | STAGING_ONLY | HTTP Basic Auth password |
| `STAGING_SEND_EMAIL` | STAGING_ONLY | `false` |
| `STAGING_ADMIN_EMAIL` | STAGING_ONLY | Payload admin email |
| `STAGING_ADMIN_PASSWORD` | STAGING_ONLY | Payload admin password |
| `MEDIA_STORAGE_PATH` | REQUIRED | `/app/media` |

Do **not** set `GA4_MEASUREMENT_ID`, production email providers, or production DNS on staging.

---

## Deploy / update

Automatic deploys trigger on push to `cursor/phase5-staging-deployment-28a7`.

Manual redeploy:

```bash
railway link -p onix-staging -s onix-staging-web
railway redeploy --from-source -y
```

---

## Bootstrap content (one-time)

The Docker image includes migration tooling. Because `uploads.zip` is large, initial bootstrap used:

1. **Database** — `pg_restore` from Phase 5 QA dump via Railway Postgres tunnel
2. **Media** — `railway volume files upload` of pre-migrated `media/` archive, extracted on volume
3. **Admin** — `npm run staging:admin` via SSH

To re-run migration inside the container:

```bash
ssh railway-onix-staging-web   # after `railway ssh config`
cd /app/new-site && MIGRATE_PAGES_SKIP_MEDIA=1 npm run staging:migrate
npm run staging:admin
```

---

## QA verification

From a machine with Railway credentials:

```bash
export STAGING_BASE_URL=https://onix-staging-web-production.up.railway.app
export STAGING_AUTH_USER=... STAGING_AUTH_PASSWORD=...
npm run staging:indexing-test
npm run staging:legacy-urls
```

Full crawl (requires DB access — run on container):

```bash
ssh railway-onix-staging-web "cd /app/new-site && npm run staging:crawl"
```

---

## Media persistence

- Volume: `onix-staging-media` → `/app/media`
- Migrated library: ~1 GB, ~542 Payload media records
- Do not use ephemeral container storage for uploads

---

## Production note

This Railway environment is **temporary private staging only**. Production will deploy to Onix Data Centre infrastructure later. Do not use this project for production traffic.
