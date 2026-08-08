# Deployment guide (Phase 2 foundation)

Phase 2 prepares self-hosted deployment; full production infrastructure is not yet deployed.

## Components

| Component | Image / service |
|-----------|-----------------|
| Application | `new-site/Dockerfile` (Next.js standalone output) |
| Database | PostgreSQL 16 |
| Media | Persistent volume at `MEDIA_STORAGE_PATH` (default `./media`) |

## Docker Compose (development / staging template)

```bash
cd new-site
cp .env.example .env
# Configure secrets and SITE_ENV
docker compose up --build
```

Services:

- `postgres` — database with named volume `pgdata`
- `app` — Next.js dev server (development) or adapt command for production

## Environment checklist

### All environments

- [ ] `PAYLOAD_SECRET` — unique 32+ character secret
- [ ] `DATABASE_URL` — PostgreSQL connection string
- [ ] `NEXT_PUBLIC_SITE_URL` — public URL (no trailing slash)

### Staging

- [ ] `SITE_ENV=staging`
- [ ] Verify robots/noindex (run `npm test` in CI)
- [ ] Optional: `STAGING_BASIC_AUTH_USER` / `STAGING_BASIC_AUTH_PASSWORD` on reverse proxy
- [ ] Separate analytics property (or none)

### Production

- [ ] `SITE_ENV=production`
- [ ] TLS termination at reverse proxy (nginx, Caddy, Traefik, etc.)
- [ ] Persistent media storage (volume or object storage — S3 adapter can be added in Phase 3)
- [ ] Database backups
- [ ] Change default admin credentials

## Production build

```bash
npm ci
npm run build
npm run start
```

Requires PostgreSQL reachable at build time for Payload initialization during static analysis of dynamic routes.

## Reverse proxy assumptions

- Proxy forwards `Host`, `X-Forwarded-Proto`, `X-Forwarded-For`
- Admin panel at `/admin`
- Large upload support for media (adjust `client_max_body_size` or equivalent)
- Staging basic auth at proxy layer is acceptable and recommended

## Media strategy

1. **Phase 2:** Local `./media` directory (Docker volume)
2. **Phase 3:** Import selected master assets from `migration/source/media/uploads.zip` via `npm run migrate:media` (see `docs/migration.md`). Extracted archive lives in gitignored `.migration-work/`.
3. **Production:** Persistent volume or S3-compatible object storage — configure Payload storage adapter; do not rely on ephemeral container filesystem.

Do not depend on production WordPress URLs for media in the final site.

## CI/CD

GitHub Actions validates install, typecheck, lint, test, and build on push/PR.

**No automatic production deployment** in Phase 2.

## Health checks

- `GET /` — frontend responds
- `GET /admin` — Payload admin loads
- Database connectivity via Payload init logs

## Rollback

- Database migrations managed by Payload/Postgres adapter
- Keep database snapshots before bulk content imports (Phase 3)

## Monitoring (future)

- Application logs (stdout)
- Postgres metrics
- Uptime checks on `/` and `/admin`
- Error tracking (Sentry or similar) — not configured in Phase 2
