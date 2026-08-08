# Elementor widget support (Phase 3)

Based on analysis of **8 published Elementor articles** during bulk migration.

## SUPPORTED

| Widget | Mapping |
|--------|---------|
| `heading` | Lexical H2–H5 |
| `text-editor` | Lexical paragraphs (HTML stripped to text; inline links preserved where possible) |
| `image` | Image block / featured image reference |
| `image-gallery` | Gallery block |
| `video` | External video block (YouTube/Vimeo URL) |
| `button` | CTA block |
| `divider` | Divider block |
| `icon-list` | Bulleted paragraph (simplified) |

## PARTIALLY_SUPPORTED

| Widget / structure | Behaviour |
|--------------------|-----------|
| `container`, `section`, `column` | Traversed; children extracted |
| `nested-elements` | Layout wrappers — content flattened |
| `spacer` | Ignored (no visual equivalent required) |
| `icon` | Decorative — skipped unless paired with text |
| `html` | Sanitised text extraction only |

## UNSUPPORTED (encountered in production articles)

| Widget | Articles affected | Action |
|--------|-------------------|--------|
| `image-carousel` | Azure Stack partnership article | Manual review — use gallery block |
| `theme-post-title` | africa-digital-cloud-resilience | Redundant — title from CMS |
| `post-info` | africa-digital-cloud-resilience | Metadata from CMS fields |
| `theme-post-featured-image` | africa-digital-cloud-resilience | Mapped via featured image field |
| `adte-social-share` | africa-digital-cloud-resilience | Not migrated — add native share in Phase 4 if needed |
| `wpr-magazine-grid` | africa-digital-cloud-resilience | Related posts — use related-article block manually |

## NOT REQUIRED

| Widget | Reason |
|--------|--------|
| Elementor Pro forms | Replaced by new contact form |
| Elementor popups | Not part of article body |
| `shortcode` | No article dependency found |

## Recommendation

- **7 of 8** Elementor articles imported without manual review flags.
- **2 articles** need editorial review (`africa-digital-cloud-resilience`, Azure Stack partnership).
- Do **not** build a generic Elementor runtime — continue mapping only encountered widgets.
