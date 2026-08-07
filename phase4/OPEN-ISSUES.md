# Phase 4 Open Issues

Carried forward from Phase 3 and tracked through Phase 4 corporate rebuild.

| Item | URL / Content | Issue type | Severity | Proposed resolution | Status | Notes |
|------|---------------|------------|----------|---------------------|--------|-------|
| Inline media warnings | 59 articles (`article-migration-results.csv`) | Media mapping | Medium | Improved `resolveLegacyMediaUrl` with attachment ID, base filename, WP size suffix stripping; rerun article import + QA | IN_PROGRESS | Dimension-suffix filename mismatches were primary cause |
| Elementor article: Africa digital cloud resilience | `/2025/10/28/africa-digital-cloud-resilience/` | Elementor migration | High | Map `image-carousel` to gallery block; strip theme widgets; manual visual QA | IN_PROGRESS | Theme widgets (`theme-post-title`, etc.) intentionally dropped |
| Elementor article: Azure Stack partnership | `/2022/11/17/onix-data-centre-announces-azure-stack-partnership-following-africa-tech-festival/` | Elementor migration | High | `image-carousel` → gallery block; visual QA | IN_PROGRESS | Featured image mapped; carousel images need gallery |
| French homepage | `/fr/home-francais/` | French content | High | Import FR homepage page + route preservation | IN_PROGRESS | Phase 3 deferred |
| French contact | `/fr/contactez-nous/` | French content | Medium | FR contact page + localized form labels | IN_PROGRESS | |
| French about | `/fr/a-propos/` | French content | Medium | Map to localized Payload page content | OPEN | No WP export page slug confirmed — may use live crawl |
| FR author archives | `/fr/author/*` (3 URLs) | French content | Low | Redirect to `/news/` or exclude with approved redirect | ACCEPTED_LIMITATION | Author archives not editorial content |
| Lexical gallery/table renderers | Article bodies | Frontend renderer | Medium | `ArticleBlocksRenderer` for gallery, table, video, download, CTA | IN_PROGRESS | |
| Newsletter signup | Footer EN/FR | Forms | Medium | Rebuild Fluent Form subscription; provider via env | IN_PROGRESS | Form id 2 in `fluentform-config.json` |
| ROI calculator | `/home/cfo-roi/` | Functionality | Medium | TypeScript port from `CFO ROI Calculator.html` | IN_PROGRESS | Preserve `/home/cfo-roi/` path |
| Contact form email | `/contact-us/` | Forms / ops | High | `CONTACT_FORM_RECIPIENT` + `EMAIL_PROVIDER` server-side | IN_PROGRESS | Staging must not email production recipients |
| Leadership photos | 15 profiles | Media | Low | Re-run media import when archive available; flag missing | OPEN | All profiles imported; photos missing in Phase 3 run |
| Corporate page content fidelity | 39 MIGRATE pages | Content migration | Medium | WP page importer + block renderer; editorial review on complex Elementor pages | IN_PROGRESS | |
| `/home/` vs `/` | `/home/` | URL | Low | 301 redirect `/home/` → `/` | RESOLVED | Via redirects |
| `/o-home/senegal/` vs `/senegal/` | Data centre URLs | URL | Low | Preserve both; `/senegal/` canonical, redirect legacy path | IN_PROGRESS | |
| `/blog/` vs `/news/` | Blog listing | URL | Low | 301 `/blog/` → `/news/` | RESOLVED | In redirects |
| Production analytics | Site-wide | Analytics | Low | GA4 via env; disabled on staging | IN_PROGRESS | |
| Staging HTTP auth | Staging deploy | Security | High | `STAGING_AUTH_USER` / `STAGING_AUTH_PASSWORD` middleware | IN_PROGRESS | Required for private staging |
| Search Console verification | Production launch prep | SEO ops | Low | Document verification options in `docs/seo.md` | OPEN | No credentials assumed |
| Cookie / privacy consent | Analytics + embeds | Legal/compliance | Low | Document in privacy review; no legal conclusion | OPEN | Flag for legal review |

## Status legend

- **OPEN** — not started
- **IN_PROGRESS** — actively being addressed in Phase 4
- **RESOLVED** — fixed and verified
- **ACCEPTED_LIMITATION** — documented deliberate scope limit
