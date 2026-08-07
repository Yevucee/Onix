# Development guide

## Repository layout

```
Onix/
├── new-site/          # Application (Next.js + Payload)
├── migration/         # Source exports, extracted data, reports
├── docs/              # Project documentation
└── phase2/            # Phase deliverables
```

## Local setup

See `new-site/README.md` for full instructions.

### Recommended workflow

1. Clone repository
2. `cd new-site && cp .env.example .env`
3. Set `PAYLOAD_SECRET` to a unique random string
4. Start PostgreSQL (`docker compose up postgres` or local Postgres)
5. `npm install`
6. `npm run seed` — prototype CMS content + dev admin user
7. `npm run dev`

### Regenerating Payload artefacts

After changing collections or Lexical features:

```bash
npm run generate:types
npm run generate:importmap
```

Commit both `src/payload-types.ts` and `src/app/(payload)/admin/importMap.js`.

## Environment

| `SITE_ENV` | Use |
|------------|-----|
| `development` | Local work; normal indexing metadata |
| `staging` | Pre-production; **must** block search engines |
| `production` | Live site |

`DATABASE_URL` host differs by context:

- Docker Compose app container: `@postgres`
- Local scripts / host machine: `@localhost`

## Testing

```bash
npm test           # Vitest unit tests
npm run typecheck  # TypeScript
npm run lint       # ESLint
npm run build      # Requires running Postgres for dynamic pages
```

### Test coverage (Phase 2)

- Staging noindex / X-Robots-Tag / robots.txt
- Production must not have global noindex
- Article importer idempotency contract
- Prototype route patterns

## Migration scripts

Run from `new-site/`:

```bash
# Import representative articles
npm run import:article -- --slug what-is-peering
npm run import:article:report

# Build media attachment inventory (requires WP XML)
npm run media:inventory
```

Reports are written to `migration/reports/`.

## French content

Preserve `/fr/` URLs. See `migration/reports/french-content.md` for current gaps.

## Code conventions

- Server Components by default; avoid unnecessary client components
- Design tokens in `src/app/(frontend)/styles.css`
- Shared CMS fields in `src/fields/`
- Access control in `src/access/roles.ts`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `cannot connect to Postgres` | Check `DATABASE_URL` host (`localhost` vs `postgres`) |
| Build fails on import map | Run `npm run generate:importmap` |
| Type errors after schema change | Run `npm run generate:types` |
| Admin 500 on first run | Ensure Postgres is running; Payload creates tables on init |
