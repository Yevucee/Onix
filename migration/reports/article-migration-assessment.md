# Article Migration Assessment

**Source:** WordPress XML export, database dump, live site crawl

---

## Article count

| Metric | Count |
|--------|-------|
| Posts in XML export | 90 |
| Posts in live sitemap | 85 |
| Discrepancy | 5 posts — likely drafts, trashed, or not indexed |
| Date range | 2019-12 to 2026-07 |
| Categories used | 6 |
| Tags used | 13 |

---

## URL structure

All articles use WordPress date-based permalinks:

```
https://onixdatacentres.com/{YYYY}/{MM}/{DD}/{slug}/
```

**Examples:**
- `/2026/07/28/what-happens-inside-a-tier-iv-data-centre-during-a-power-cut/`
- `/2020/11/21/why-africa-corporations-should-host-their-data-in-carrier-neutral-data-centres-not-in-house/`

**Requirement:** These URLs must be preserved exactly in the new Next.js routing.

---

## Content structure

### Editor experience today

Articles are authored in WordPress with:

- Standard post editor content (`content:encoded` in XML)
- Elementor single-post template (`onix-blog-template`) for layout wrapper
- Featured image via `_thumbnail_id`
- Categories and tags
- Limited Yoast SEO fields in XML (full data in DB)

### Elementor involvement

| Type | Count | Notes |
|------|-------|-------|
| Posts with full `_elementor_data` (page builder) | 9 | These articles have custom Elementor layouts |
| Posts with any Elementor metadata | 45 | Template assignment, cache, etc. |
| Standard editor content only | 81 | Majority — content in HTML |

**Key finding:** Article migration is **moderate complexity**, not high. Most content is standard HTML in `content:encoded`, not Elementor widget trees.

The 9 fully Elementor-built articles need manual or semi-automated conversion.

---

## Content elements found

| Element | Present | Count/notes |
|---------|---------|-------------|
| Featured images | Yes | 93 thumbnail references (some on pages) |
| Inline images | Yes | In `content:encoded` HTML |
| Embedded video | Yes | 18 items with YouTube/Vimeo/iframe |
| PDF downloads | Yes | 5 items with PDF links |
| Headings (H2–H4) | Yes | Standard HTML |
| Lists | Yes | Standard HTML |
| Links (internal/external) | Yes | Standard HTML |
| Blockquotes | Likely | Standard WP formatting |
| CTAs | Some | Inline links and buttons in HTML |
| Captions | Some | WP image caption markup |
| Excerpts | Partial | Not on all posts |

---

## Required editor capabilities (mapped to findings)

| Editor requirement | Current WP support | Migration notes |
|--------------------|-------------------|-----------------|
| Create articles | Yes | Standard |
| Featured images | Yes | Map `_thumbnail_id` → Media relationship |
| Images inside articles | Yes | Parse `<img>` tags, migrate media |
| Video | Yes | YouTube/Vimeo embeds — preserve oEmbed or iframe |
| Captions | Partial | Parse `wp-caption` markup |
| Headings | Yes | HTML headings |
| Links | Yes | Standard |
| Lists | Yes | Standard |
| Downloadable files | Yes | PDF links — migrate files + track downloads |
| CTAs | Partial | Inline HTML — may need block component |
| SEO title | Yes (DB) | From Yoast indexables |
| Meta description | Yes (DB) | From Yoast indexables |
| Social image | Yes (DB) | From Yoast OG image |
| Canonical URL | Yes (DB) | From Yoast |
| Categories | Yes | 6 categories |
| Drafts | Yes (DB) | XML missing status — use DB |
| Preview | Yes (WP) | Rebuild with Payload preview |
| Publish | Yes | Standard workflow |

---

## Unusual formatting / risks

| Risk | Severity | Details |
|------|----------|---------|
| 9 Elementor-built articles | Medium | Need widget-to-richText conversion |
| Embedded iframes | Medium | Video embeds may break if URLs change |
| Inline styles | Low | WP/HTML inline styles in content |
| Shortcodes in content | Low | 2 shortcode widgets site-wide — check articles |
| Missing post status in XML | Medium | Use DB for draft identification |
| Featured image not in content | Low | Separate field — standard migration |
| Date in URL vs `publishedAt` mismatch | Low | Verify date matches slug path |
| French articles | Unknown | Polylang may link translations — scope TBD |
| Empty meta descriptions | Medium | Many articles lack descriptions in crawl |

---

## Media usage in articles

- Images reference `wp-content/uploads/` paths in HTML
- Must download and re-upload to Payload Media
- Update content HTML with new media URLs (or use relative paths)
- 106 attachments confirmed referenced in content site-wide

---

## Proposed automated import strategy

### Phase 1: Data extraction

1. Export posts from `wp_posts` WHERE `post_type = 'post'` (DB — authoritative for status)
2. Join `wp_yoast_indexable` for SEO fields
3. Join `wp_postmeta` for `_thumbnail_id`, featured image
4. Parse `content:encoded` from XML or DB `post_content`
5. Map categories via `wp_term_relationships`
6. Output normalised JSON per article

### Phase 2: Media

1. Extract all image/PDF URLs from post content + featured images
2. Download from production
3. Upload to Payload Media
4. Build URL mapping table (old → new media URL)

### Phase 3: Import

1. Payload import script (or REST API batch create)
2. Set `slug`, `publishedAt`, `title`, `content`, `seo`, `categories`
3. Link featured image
4. Rewrite content HTML media URLs
5. Set status (draft/published)

### Phase 4: Validation

1. Compare article count: 85 published
2. Spot-check 10 articles: content, images, video, SEO
3. Verify all 85 URLs return 200 with correct canonical
4. Check date-based routing matches exactly

### Phase 5: Elementor articles (9 items)

1. Identify the 9 posts with `_elementor_data`
2. Manual review — likely faster than automated Elementor JSON parsing
3. Rebuild in rich text editor or article blocks

---

## Migration difficulty rating

| Aspect | Rating | Reason |
|--------|--------|--------|
| Overall | **Moderate** | Most articles are standard HTML |
| Volume | Low | 85 articles — manageable batch |
| URL preservation | Low risk | Well-defined date pattern |
| Content format | Low–Medium | HTML parsing straightforward |
| Elementor articles | Medium | 9 articles need special handling |
| Media dependency | **High** | Blocked until uploads downloaded |
| SEO | Low | Automatable from Yoast DB |
| Editor UX rebuild | Medium | Payload rich text + custom blocks |

---

## Articles publishing experience (target)

The new Payload CMS Articles collection should provide:

- Rich text editor (Lexical or Slate) with: headings, bold, italic, links, lists, blockquotes
- Media embed (upload + inline image with alt/caption)
- Video embed (YouTube/Vimeo URL field)
- File attachment block (PDF download with tracking)
- CTA block (optional predefined styles)
- SEO sidebar: title, description, social image, canonical override
- Category multi-select
- Featured image picker
- Draft / publish workflow with preview URL
- Scheduled publishing (optional, not currently used)

This exceeds current WordPress capabilities and aligns with project requirements.
