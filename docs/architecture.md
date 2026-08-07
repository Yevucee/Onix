# Architecture — Onix website (Phase 2)

## Overview

The replacement application lives in `new-site/` and uses:

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| CMS | Payload CMS 3 with Lexical editor |
| Database | PostgreSQL 16 via `@payloadcms/db-postgres` |
| Images | Sharp (Payload media pipeline) |
| Styling | Tailwind CSS v4 + design tokens in CSS variables |
| Runtime | Node.js 20+, Docker-compatible |

Legacy WordPress material remains in `migration/` and is **not** part of the application runtime.

```
┌─────────────────────────────────────────────────────────┐
│                     Reverse proxy (future)              │
└───────────────────────────┬─────────────────────────────┘
                            │
              ┌─────────────▼─────────────┐
              │   Next.js (new-site)      │
              │  ┌──────────┬───────────┐ │
              │  │ Frontend │  /admin   │ │
              │  │  routes  │  Payload  │ │
              │  └────┬─────┴─────┬─────┘ │
              └───────┼───────────┼───────┘
                      │           │
              ┌───────▼───────────▼───────┐
              │      PostgreSQL           │
              └───────────────────────────┘
                      │
              ┌───────▼───────┐
              │  Media volume  │
              │  (local/S3)    │
              └───────────────┘
```

## Routing

| Route pattern | Purpose |
|---------------|---------|
| `/` | Homepage (CMS-driven blocks) |
| `/about-us`, `/senegal` | Prototype corporate / data centre pages |
| `/[year]/[month]/[day]/[slug]` | WordPress-compatible article URLs |
| `/fr/[[...slug]]` | French URL preservation (Phase 2 placeholder) |
| `/admin` | Payload CMS |
| `/api/*`, `/api/graphql` | Payload REST/GraphQL |

Frontend routes use `force-dynamic` rendering because content is fetched from Payload at request time.

## Multilingual

Payload is configured with locales `en` (default) and `fr` with fallback. Phase 2 implements routing scaffolding for `/fr/`; full translation workflow is deferred to Phase 3.

## Staging vs production

`SITE_ENV` controls indexing behaviour:

- **staging:** global noindex, `X-Robots-Tag`, disallow-all robots.txt, no production analytics
- **production:** normal indexing; safety tests ensure no accidental global noindex

Middleware applies `X-Robots-Tag` on all non-static routes when staging.

## Content model (summary)

**Collections:** Users, Media, Categories, Articles, Pages, Data Centres, Leadership, Redirects

**Globals:** Site Settings, Header Navigation, Footer, SEO Defaults

Articles use Lexical rich text with controlled custom blocks (image, gallery, CTA, quote, etc.). Pages use structured block fields — not a visual page builder.

## Migration architecture

| Tool | Location | Purpose |
|------|----------|---------|
| Article importer v1 | `new-site/scripts/import-article.ts` | Standard WP posts → Payload |
| Media inventory | `new-site/scripts/media-inventory.ts` | Attachment map for uploads archive |
| SEO data | `migration/extracted/seo-metadata.json` | Sanitised Yoast + live crawl |
| Redirects | `migration/extracted/redirects.json` | Public redirect rules |

Idempotency uses `legacy.wordpressId` on Articles (and similar legacy fields elsewhere).

## Analytics (planned)

Architecture supports future GA4, Search Console, and event tracking. **Not implemented in Phase 2.** Staging must never send data to production analytics properties.

## Security

- CMS authentication via Payload Users (`admin` / `editor` roles)
- No secrets in Git; database dump purged from history (see `migration/reports/security-cleanup.md`)
- Staging HTTP basic auth prepared via env vars for host configuration

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs install, typecheck, lint, test, and production build against a Postgres service container.
