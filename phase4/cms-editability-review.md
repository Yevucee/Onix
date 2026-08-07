# CMS editability review (Phase 4)

## Editable in Payload without code changes

| Content | Collection / Global |
|---------|---------------------|
| Homepage blocks | Pages (`home`) |
| Corporate page content | Pages (blocks) |
| Articles & news | Articles |
| Leadership profiles | Leadership |
| Data centre details | Data Centres |
| Navigation | Header Navigation global |
| Footer links & copyright | Footer global |
| Site contact & social | Site Settings global |
| SEO defaults | SEO Defaults global |
| Redirects | Redirects collection |

## Intentionally code-controlled

| Item | Reason |
|------|--------|
| Layout / design tokens | Onix design system consistency |
| ROI calculator logic | Validated TypeScript; not editor-modifiable |
| Route structure | URL preservation |
| Staging protections | Security |

## Gaps requiring editorial follow-up

- French `/fr/a-propos/` — import FR locale content after WP page mapping
- Complex Elementor pages may need block tuning in CMS after import
- Leadership photos — re-import when media archive available on staging
