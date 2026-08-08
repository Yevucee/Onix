# Global Template Migration Bug

**Date:** 2026-08-08  
**Severity:** High — causes structural misrepresentation of homepage and potentially other pages

---

## Symptom

On staging, the homepage displayed:
- A generic prototype hero ("Carrier-neutral data centre infrastructure for Africa")
- Followed by unstyled migrated text blocks: "Who we are", "Our Solutions", "Infrastructure", "Get in touch with us today", "Navigate", "Get in touch"
- Footer/navigation content appearing inside the page body
- Header showing only 5 flat menu items without dropdowns or language switcher

---

## Root cause

### 1. Elementor page import flattens template content into page blocks

**File:** `new-site/src/migration/import-pages.ts`

The `elementorToPageBlocks()` function parses the entire `_elementor_data` JSON for a page, including widgets that belong to Elementor **header**, **footer**, and **theme builder** template sections. WordPress stores the homepage as a single Elementor document that includes:

- Page body sections (hero, service cards, who we are, etc.)
- Footer template widgets (Navigate links, Get in touch contact details, copyright)

The parser (`elementor-parser.ts`) walks all widgets and converts headings + text-editor widgets into a single `richText` block. Footer headings ("Navigate", "Get in touch") and contact details end up in page body content.

### 2. Homepage renderer used migrated blocks

**File:** `new-site/src/app/(frontend)/page.tsx` (before fix)

The homepage rendered:
1. A hardcoded generic `Hero` component (from seed prototype, not live content)
2. `PageBlocksRenderer` with all migrated CMS blocks (including footer text)

This produced duplicate and misplaced content.

### 3. Incomplete header navigation seed

**File:** `new-site/scripts/seed-prototype.ts` (before fix)

The `header-navigation` global was seeded with only 4 flat items:
- Our Solutions → `/about-us` (wrong URL)
- Senegal → `/senegal` (wrong path)
- Infrastructure → `/about-us` (wrong URL)
- Blog → article URL (wrong — should be `/blog`)

Missing: Ghana language switch, Our Solutions dropdown (9 children), correct URLs.

### 4. Footer rendered from incomplete CMS global + newsletter

**File:** `new-site/src/app/(frontend)/layout.tsx` (before fix)

Footer used Payload `footer` global which was never properly seeded with live structure. A newsletter form was added that does not exist on the live site.

### 5. Globals not separated from page content in import pipeline

There is no step in the migration that:
- Detects Elementor theme-builder / footer template sections
- Extracts navigation into `header-navigation` global
- Extracts footer into `footer` global
- Strips template content before saving page blocks

---

## Affected pages

| Page | Impact |
|------|--------|
| Homepage (`/`) | Footer text in body, wrong hero, missing sections |
| `/home/*` corporate pages | May contain duplicated nav/footer text in blocks |
| Any Elementor page using shared footer template | Same flattening issue |

Homepage is the most visible; other pages may have footer fragments in `richText` blocks.

---

## Correction applied (CHECKPOINT 1B)

1. **Homepage:** `page.tsx` now renders `HomePageView` — a dedicated component built from live-site structure (`src/data/live-site.ts`). Migrated CMS blocks are NOT rendered on homepage.

2. **Header:** `Header.tsx` rebuilt with full live navigation (language switch, dropdowns, mobile accordion). `layout.tsx` uses `LIVE_HEADER_NAV` as source of truth.

3. **Footer:** `Footer.tsx` rebuilt as dedicated component from `LIVE_FOOTER` data. Newsletter removed. No CMS body content.

4. **Seed:** `seed-prototype.ts` updated with correct nav/footer globals for future CMS population.

---

## Whether content needs re-importing

**Pages:** No full re-import required for CHECKPOINT 1B. Homepage bypasses migrated blocks. Other corporate pages still use `PageBlocksRenderer` — they may need block cleaning in a later phase.

**Globals:** `header-navigation` and `footer` globals should be updated on staging DB (via seed script or manual CMS edit). The frontend currently uses hardcoded live-site data as override.

**Recommended future work:**
- Add Elementor template detection to `elementor-parser.ts` — skip `nav-menu`, `icon-list` widgets in footer template sections
- Add `import-globals.ts` migration script to extract nav/footer from WordPress theme mods or Elementor templates
- Clean homepage `blocks` array in Payload (remove footer richText content) to prevent accidental re-rendering

---

## Whether existing Payload records need cleaning

| Record | Action |
|--------|--------|
| `pages` slug=`home` | Blocks contain footer text — safe to ignore (not rendered) but should be cleaned in CMS |
| `header-navigation` global | Update with full nav (seed script provides correct data) |
| `footer` global | Update with live structure (seed script provides correct data) |
| Other `pages` | Audit `blocks` for "Navigate", "Get in touch" headings — strip in later phase |
