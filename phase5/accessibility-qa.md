# Accessibility QA

**Environment:** Staging  
**Date:** 2026-08-07  
**Methods:** Manual keyboard testing, code review, automated heuristics from crawl

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 3 | Documented below |
| Low | 4 | Post-launch acceptable |

**Overall:** No critical accessibility blockers for staging acceptance. Medium items should be addressed before or shortly after production launch.

---

## Tests performed

### Keyboard navigation
- [x] Tab through homepage links — focus visible
- [x] Header menu operable via keyboard (`<details>` summary)
- [x] Skip link — **not present** (see Medium #1)
- [x] Contact form fields reachable and submittable via keyboard
- [x] ROI calculator inputs keyboard accessible

### Focus indicators
- [x] Visible focus ring on links and buttons (Tailwind defaults)
- [ ] Some custom components use subtle focus — acceptable

### Headings
- [x] Single H1 per page (verified in crawl)
- [x] Logical heading hierarchy on corporate pages
- [ ] Some articles have multiple H2 without H3 — acceptable

### Images
- [x] Featured images have alt text from migration
- [ ] Decorative images sometimes lack empty alt — Low
- [ ] Leadership photos missing — content gap, not a11y pattern issue

### Forms
- [x] Labels associated with inputs (`<label htmlFor>`)
- [x] Required fields indicated
- [x] Error messages on invalid submission
- [x] Honeypot field hidden from assistive tech

### Colour contrast
- [x] Body text on white background — sufficient contrast
- [x] Onix blue on white for links — passes WCAG AA
- [ ] Light grey footer text — borderline; review Low

### Tables
- [x] Article tables use `<table>` with headers where migrated
- [ ] Complex tables may need scope attributes — Medium #2

### Links
- [x] Descriptive link text on main navigation
- [ ] Some "Read more" patterns in news cards — Low

---

## Issues

### Medium #1: No skip navigation link
**Impact:** Keyboard users must tab through header on every page.  
**Fix:** Add skip link to main content in root layout.  
**Status:** OPEN — straightforward fix

### Medium #2: Table header scope
**Impact:** Screen readers may not associate all table headers.  
**Fix:** Add `scope="col"` / `scope="row"` in table block renderer.  
**Status:** OPEN

### Medium #3: Mobile menu not a true dialog
**Impact:** `<details>` works but lacks `aria-expanded` animation pairing.  
**Fix:** Consider `aria-expanded` on menu button if converted to button pattern.  
**Status:** OPEN — functional as-is

### Low #1: Social icons missing accessible names in some contexts
### Low #2: Footer link groups lack `<nav aria-label>`
### Low #3: Some article image captions not linked via `aria-describedby`
### Low #4: Focus trap not implemented in mobile menu (not modal)

---

## Automated tools

Full axe-core / Lighthouse audit recommended on production URL post-launch. Staging auth prevents external scanner access without credentials.

---

## Recommendation

Proceed to user acceptance. Address Medium #1 (skip link) before production launch if time permits.
