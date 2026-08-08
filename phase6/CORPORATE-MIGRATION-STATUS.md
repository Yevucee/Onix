# Phase 6 — Corporate Migration Status

**Branch:** `cursor/phase6-corporate-pages-28a7`  
**Last updated:** 2026-08-08  
**Staging:** https://onix-staging-web-production.up.railway.app

## Summary

Phase 6 introduces reusable Onix-branded page templates and migrates Group 1 (highest-value) corporate pages to the approved homepage design system. Content remains Payload-editable via block fields.

| Metric | Count |
|--------|-------|
| Group 1 pages | 7 areas — **complete** |
| Total corporate pages inventoried | 52 |
| Onix templates built | 6 |
| Remaining (Groups 2–6) | ~25 pages + news/blog |

---

## Completed (Group 1)

| Page | URL | Template |
|------|-----|----------|
| About Us | `/about-us/` | `CorporatePageTemplate` + leadership grid |
| Our Solutions | `/home/our-solutions/` | `SolutionPageTemplate` |
| Infrastructure | `/home/infrastructure/` | `InfrastructurePageTemplate` |
| Ghana (homepage) | `/` | `OnixHomePage` (approved R2) |
| Senegal DC | `/o-home/senegal/` | `DataCentrePageTemplate` |
| Leadership profiles | `/o-home/*`, `/home/eric-tenkorang/` | `LeadershipPageTemplate` |
| Contact Us | `/contact-us/`, `/home/contact-us/` | `ContactPageTemplate` |

---

## Templates Built (Phase 6A)

| Template | Path | Supports |
|----------|------|----------|
| `CorporatePageTemplate` | `src/components/onix/templates/` | hero, richText, imageText, stats, leadershipGrid, CTA |
| `SolutionPageTemplate` | same | hero, featureCards (navy), stats, CTA |
| `InfrastructurePageTemplate` | same | hero, stats, featureCards, technical sections |
| `DataCentrePageTemplate` | same | facility hero, stats, certifications, connectivity, downloads |
| `LeadershipPageTemplate` | same | photo, name, role, biography |
| `ContactPageTemplate` | same | form, contact details, locations |
| `OnixPageBlocksRenderer` | `src/components/onix/blocks/` | All 11 Payload block types, Onix-styled |

Template routing: `src/lib/page-templates.ts` → `OnixPageTemplate` in catch-all.

---

## Remaining Pages

### Group 2 — Solution detail (auto-routed via catch-all)
- `/home/finance/`, `/home/virtual-machine/`, `/home/o-services/`, `/services/` — **routed**, visual QA pending

### Group 3 — Infrastructure detail
- `/infrastructure-innovation/` — routed, visual QA pending

### Group 4 — Remaining corporate
- `/o-home/certification/` — needs certification grid visual pass
- `/linxaccra/` — specialist layout
- `/home/cfo-roi/` — ROI calculator (existing dedicated route)
- `/o-home/home-v2/`, `/home-english/`, `/elementor-9089/` — low priority

### Group 5 — French
- `/fr/home-francais/` and French navigation — not started

### Group 6 — News/Blog
- `/news/`, article templates — not started (separate task)

---

## Known Issues

| Issue | URL / scope | Status |
|-------|-------------|--------|
| Leadership photos missing in Payload | All profile pages | Photos show initials fallback; source images in WP uploads |
| Certification page icon grid | `/o-home/certification/` | Needs Onix certification component |
| LINX Accra specialist layout | `/linxaccra/` | Still on legacy renderer |
| News listing not Onix-styled | `/news/` | Group 6 |

---

## Missing Assets

| URL | Asset | Source | Recommendation |
|-----|-------|--------|----------------|
| Leadership profiles | Staff photos | WP elementor thumbs / uploads | Import remaining photos to Payload media |
| `/o-home/certification/` | ISO badge images | WP elementor thumbs | Verify migrated media IDs in Payload |

---

## Route Verification

- `/about-us/` → dedicated route ✓
- `/o-home/about-us/` → 301 to `/about-us/` ✓
- `/o-home/senegal/` → catch-all data-centre ✓
- `/senegal/` → 301 to `/o-home/senegal/` ✓
- `/home/contact-us/` → catch-all contact template ✓
- `/contact-us/` → dedicated route ✓
- Leadership paths → catch-all leadership template ✓

---

## Template Improvements (backlog)

1. `OnixCertificationGrid` for certification page
2. Specialist landing template for LINX Accra / CFO ROI
3. French locale template variants
4. News listing + article templates (Group 6)
5. Animated stats on data centre pages (match homepage)

---

## Next Steps

1. Deploy Group 1 to Railway staging and visual QA (desktop + mobile)
2. Group 2–3: visual QA on auto-routed solution/infrastructure pages
3. Group 4: certification grid + LINX Accra
4. Groups 5–6 after English site stable

**Stop condition:** Full English corporate site on staging with correct URLs, design system, Payload content, SEO, and media — then pause for production migration planning.
