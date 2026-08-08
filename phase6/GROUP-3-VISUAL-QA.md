# Phase 6 — Group 3 Visual QA Report

**Audit date:** 2026-08-08  
**Live:** https://onixdatacentres.com  
**Staging:** https://onix-staging-web-production.up.railway.app  

---

## Pages

| Page | Live URL | Staging URL | Status |
|------|----------|-------------|--------|
| Infrastructure (landing) | `/home/infrastructure/` | `/home/infrastructure/` | CLOSE (Group 1) |
| Infrastructure Innovation | `/infrastructure-innovation/` | `/infrastructure-innovation/` | N/A — draft on live |

---

## Infrastructure Landing (`/home/infrastructure/`)

**STATUS:** CLOSE (validated in Group 1 checkpoint)

**Template:** `InfrastructurePageTemplate` with `featureCardVariant="light"`

**Validated elements:**
- Technical sections (Building, Secure Power Supply, Sustainable Operations, Security, Temperature, Interconnection, Business Space, Cross Connects)
- Infrastructure imagery from Payload media (7 images)
- Light feature cards
- CTA blocks normalised to `/contact-us`
- Downloads block support where CMS provides files

**Priority:** P2  

---

## Infrastructure Innovation (`/infrastructure-innovation/`)

**STATUS:** N/A — not published on live production (WP export status: draft, returns 404)

**Staging behaviour:**
- Page exists in Payload from migration import
- Renders via `InfrastructurePageTemplate` with light cards
- Event/form content from WP draft preserved in CMS blocks

**Action:** No live URL to match. Page available on staging for future publication. Not reduced to generic text — retains richText, featureCards, gallery blocks from import.

**Priority:** P3  

---

## Template Validation (InfrastructurePageTemplate)

| Check | Status |
|-------|--------|
| Technical sections | ✓ |
| Imagery | ✓ |
| Light feature cards | ✓ |
| Stats animation | ✓ |
| Downloads | ✓ (block support) |
| CTAs | ✓ |
| CMS editability | ✓ |

---

## Issues Found & Fixes

| Issue | Fix |
|-------|-----|
| Legacy CTA URLs in CMS blocks | `normalizeCtaUrl()` in OnixPageBlocksRenderer |
| Phase 1/Phase 2 as separate H3s | Deferred — content present in parent sections (P3) |

---

## Regression Check

Group 1 infrastructure landing re-validated — no regressions from Groups 2–4 template work.
