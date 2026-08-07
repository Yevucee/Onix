# CMS guide (Phase 2)

Payload admin: `/admin`

## Authentication

| Role | Permissions |
|------|-------------|
| **admin** | Full access including user management and role assignment |
| **editor** | Create/edit/publish content collections |

Dev seed creates `admin@onix.local` — **change this password before any shared environment**.

## Collections

### Articles

Blog/news content with WordPress-compatible date URLs.

**Key fields:** title, slug, publishedAt, author, categories, tags, excerpt, featured image, Lexical content, SEO group, legacy identifiers.

**Lexical blocks:** image, image with caption, gallery, external video, quote, CTA, download, table, divider, related article.

**Drafts:** Enabled (`_status`: draft / published).

**Migration:** `npm run migrate:articles` (see `docs/migration.md`). Deduplication by `legacy.wordpressId`.

### Editor workflow (articles)

1. Log in to `/admin` → Articles → Create
2. Enter **title** (slug auto-generated or set manually)
3. Set **published date** and choose **category/categories**
4. Add **excerpt** (used on `/news` listing)
5. Upload or select **featured image** — enter **alt text** on the Media record
6. Write body in **Lexical editor**: headings, lists, bold/italic, links
7. Insert blocks via toolbar: image, gallery, video, CTA, download, table, divider
8. Open **SEO** tab: title, description, canonical, social image
9. **Save as draft** or **Publish**
10. Published articles appear automatically at `/news` and their legacy date URL

Draft articles do not appear in public listings or sitemap.

### Pages

Structured corporate pages — **not** a free-form page builder.

**Block types:** hero, rich text (textarea HTML in Phase 2), image+text, CTA, stats.

**Page types:** standard, homepage, corporate.

### Data Centres

Facility pages with structured fields: location, summary, hero, stats, certifications, connectivity, infrastructure, sustainability, downloads, CTA, SEO.

Prototype: Senegal (`/senegal`).

### Media

Uploads with title, alt text, caption, focal point. Image sizes: hero, article, card, thumbnail.

**Phase 2 note:** Media files are not yet migrated. Attachment inventory is prepared in `migration/reports/media-migration-map.csv`.

### Categories

Article taxonomy. Seed includes News, Technology, Data.

### Leadership

Team profiles: name, title, photo, biography, LinkedIn, sort order, visibility, legacy path.

*Not populated in Phase 2 prototype.*

### Redirects

Source path, destination, 301/302, active state, notes.

*Collection exists; bulk import from `migration/extracted/redirects.json` is Phase 3.*

### Users

Email auth with admin/editor roles.

## Globals

| Global | Purpose |
|--------|---------|
| Site Settings | Site name, tagline, contact email |
| Header Navigation | Logo, nav items, CTA button |
| Footer | Columns, copyright, legal links |
| SEO Defaults | Default title template, description, social image |

## SEO fields

Available on Articles, Pages, Data Centres (and extensible elsewhere):

- SEO title, meta description, canonical URL
- Open Graph title, description, image
- Robots override (index/noindex)

Defaults can be generated on the frontend; manual CMS values override.

## Localization

Payload locales: `en`, `fr`. Localized fields are marked in the schema. Phase 2 seeds primarily English content.

## Workflow

1. Log in to `/admin`
2. Edit content in relevant collection
3. Save as draft or publish
4. View on frontend (dynamic server render)

## Not in scope (Phase 2)

- Forms (see `docs/forms-technical-spec.md`)
- Bulk page migration
- Leadership population
- Redirect activation
- Production analytics
