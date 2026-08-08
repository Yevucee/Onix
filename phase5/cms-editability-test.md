# CMS editability test

**Environment:** Staging (`SITE_ENV=staging`)  
**Date:** 2026-08-07  
**Admin access:** Via `STAGING_ADMIN_EMAIL` (created by `npm run staging:admin`)

## Prerequisites verified

- [x] Default seed account `admin@onix.local` removed
- [x] Staging admin created from environment secrets
- [x] Payload admin at `/admin`
- [x] Protected by staging Basic Auth + Payload login

---

## Page editability

| Test | Collection | Field | Result | Notes |
|------|------------|-------|--------|-------|
| Update page heading | Pages → `home` | Hero block `heading` | PASS | Renders on `/` after save |
| Update body copy | Pages → `services` | Rich text block | PASS | No code change required |
| Replace hero image | Pages → `partners` | Hero `image` | PASS | Media picker works |
| Update CTA | Pages → `home` | Hero `ctaLabel` / `ctaUrl` | PASS | |
| Facility statistic | Data Centres → Senegal | Stats fields | PASS | Data centre template |
| Leadership bio | Leadership → sample profile | `bio` rich text | PASS | Profile page updates |

**Conclusion:** Normal editorial changes do not require developer intervention.

---

## Article editability

| Test | Result | Notes |
|------|--------|-------|
| Create draft article | PASS | Does not appear on `/news/` |
| Add title, excerpt, featured image | PASS | |
| Lexical body (H2, bold, links, lists) | PASS | |
| Gallery / table / video blocks | PASS | Block renderers in `ArticleBlocksRenderer` |
| SEO fields (title, description, social) | PASS | |
| Preview draft | PASS | Preview route available |
| Publish | PASS | Appears on news listing |
| Unpublish / delete test article | PASS | Test content removed after QA |

---

## Media CMS

| Test | Result | Notes |
|------|--------|-------|
| Upload new image | PASS | |
| Enter alt text | PASS | |
| Select as featured image | PASS | |
| Insert into article | PASS | |
| Image variants generated | PASS | Sharp generates responsive sizes |
| Persistence across restart | PASS | Files in `MEDIA_STORAGE_PATH` |
| PDF upload | PASS | If MIME allowed in Media collection |

---

## Role assumptions

- Test performed as admin role
- Editor role should be created for production with restricted collections as needed

---

## Issues found

| Issue | Severity | Status |
|-------|----------|--------|
| None blocking CMS workflow | — | — |
