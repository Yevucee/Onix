# Elementor-heavy article assessment

**Test case:** `africa-digital-cloud-resilience`  
**URL:** `/2025/10/28/africa-digital-cloud-resilience/`  
**Date assessed:** 2026-08-07 (Phase 2)

## Summary

This article is built with Elementor (`_elementor_data` present in WordPress export). The Phase 2 importer v1 **stores metadata and a plain-text fallback** but does **not** faithfully reproduce Elementor layout.

## Import results

| Aspect | Status |
|--------|--------|
| Title, slug, dates | Preserved |
| Legacy path / WordPress ID | Preserved |
| SEO (Yoast in XML) | Not in export; live crawl title mapped via `seo-metadata.json` |
| HTML structure | Stripped to plain text in Lexical paragraph |
| Elementor widgets | Flagged as `elementor_page_builder` |
| Gutenberg comments | Flagged as `gutenberg_blocks` |
| Images | Detected but missing locally (uploads archive not supplied) |

## Elementor complexity observed

- Multi-column layouts and nested sections
- Custom spacing and responsive visibility per widget
- Embedded images with Elementor-specific markup
- Likely icon lists, dividers, and styled CTAs not mapped to Payload blocks

## Recommended Phase 3 handling

1. **Parser tier:** Classify articles as `standard-html`, `gutenberg`, `elementor-light`, `elementor-heavy`
2. **Elementor JSON parser:** Map common widgets (heading, text-editor, image, button, icon-list) to Payload Lexical blocks
3. **Manual review queue:** Articles with unsupported widgets (tabs, accordion, forms, sliders)
4. **Layout normalisation:** Accept visual simplification — design system components replace Elementor styling
5. **Media dependency:** Complete only after uploads archive import

## Articles affected

Phase 1 audit identified **9 Elementor-built articles** among 85 live posts. Bulk import should not proceed until parser coverage is validated against all nine.

## Phase 2 decision

Importer v1 intentionally warns and continues with degraded content for Elementor posts. This proves the pipeline without falsely claiming automated conversion quality.
