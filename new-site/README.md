# Onix website — Phase 2 application

Next.js + Payload CMS + PostgreSQL replacement for onixdatacentres.com.

## Prerequisites

- Node.js 20+
- Docker (recommended) or local PostgreSQL 16
- Git

## Quick start (Docker)

```bash
git clone <repo-url>
cd Onix/new-site
cp .env.example .env
# Edit PAYLOAD_SECRET to a random 32+ character string
docker compose up
```

In a second terminal (or after Postgres is healthy):

```bash
cd new-site
npm install
npm run seed
npm run dev
```

- **Site:** http://localhost:3000  
- **Admin:** http://localhost:3000/admin  
- **Default dev admin** (created by seed): `admin@onix.local` — change password immediately

## Quick start (local PostgreSQL)

```bash
cd new-site
cp .env.example .env
# Ensure DATABASE_URL points to localhost (default in .env.example)
npm install
npm run seed
npm run dev
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SITE_ENV` | Yes | `development`, `staging`, or `production` |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Yes | Payload encryption secret (32+ chars) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL (no trailing slash) |
| `MEDIA_STORAGE_PATH` | No | Local media directory (default `./media`) |
| `WP_EXPORT_PATH` | No | WordPress XML path for migration scripts |

Never commit `.env` or secrets.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run seed` | Seed prototype CMS content |
| `npm run import:article -- --slug <slug>` | Import one WordPress article |
| `npm run import:article:report` | Import test articles + write report |
| `npm run media:inventory` | Build media migration map CSV |
| `npm test` | Run Vitest tests |
| `npm run typecheck` | TypeScript check |
| `npm run generate:types` | Regenerate Payload types |
| `npm run generate:importmap` | Regenerate admin import map |

## Staging protection

When `SITE_ENV=staging`:

- Global `noindex,nofollow,noarchive` metadata
- `X-Robots-Tag` response header
- Restrictive `robots.txt`

Automated tests in `tests/staging.test.ts` verify staging and production behaviour.

## Phase 2 prototype routes

- `/` — Homepage
- `/about-us` — Corporate page
- `/senegal` — Data centre page
- `/2025/11/13/what-is-peering/` — Standard imported article
- `/fr/` — French route placeholder (selected pages)

## Documentation

- `../docs/architecture.md`
- `../docs/development.md`
- `../docs/cms-guide.md`
- `../docs/deployment.md`
- `../phase2/SUMMARY.md`

## Migration tooling

Migration scripts and reports live outside this app under `../migration/`. The application does not bundle WordPress source files.
