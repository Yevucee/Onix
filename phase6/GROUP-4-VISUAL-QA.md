# Phase 6 — Group 4 Visual QA Report

**Audit date:** 2026-08-08  
**Live:** https://onixdatacentres.com  
**Staging:** https://onix-staging-web-production.up.railway.app  

---

## Pages Completed

| Page | Live URL | Staging URL | Status |
|------|----------|-------------|--------|
| Certification | `/o-home/certification/` | `/o-home/certification/` | CLOSE |
| LINX Accra | `/linxaccra/` | `/linxaccra/` | CLOSE |
| CFO ROI Calculator | `/home/cfo-roi/` | `/home/cfo-roi/` | CLOSE |

---

## 1. Certification (`/o-home/certification/`)

**STATUS:** CLOSE  

**Live structure:**
- Intro paragraph on security and quality commitment
- 4-column certification grid: Tier IV, ISO 27001, ISO 9001, PCI-DSS with badge images
- Long-form ISO commitment copy
- CTA block

**Fixes applied:**
- **New `OnixCertificationGrid` component** with badge images
- **New `certificationGrid` Payload block** for CMS editability
- **`CertificationPageTemplate`** dedicated template (not generic corporate)
- Static badge images in `/images/certification/` + CMS seed support
- Content fallback via `resolveCertificationBlocks()` in `src/data/certification-content.ts`

**Priority:** P1  

---

## 2. LINX Accra (`/linxaccra/`)

**STATUS:** CLOSE  

**Live structure:**
- Hero with IXP positioning statement
- Tab switcher: "I run a network" / "I'm a business or user"
- Feature cards per audience
- Pricing highlight: $130/month
- Peering explainer copy
- CTAs to contact

**Fixes applied:**
- **Dedicated route** at `src/app/(frontend)/linxaccra/page.tsx` — no longer uses legacy/catch-all renderer
- **`SpecialistPageTemplate`** + **`LinxAccraContent`** client component with tab switching
- Onix design system: breadcrumbs, typography, navy pricing band, OnixButton CTAs
- Hero image at `/images/linx/hero.jpg`

**Priority:** P1  

---

## 3. CFO ROI Calculator (`/home/cfo-roi/`)

**STATUS:** CLOSE  

**Live structure:**
- ROI calculator tool with input form and results
- CFO-focused messaging

**Fixes applied:**
- Migrated from legacy `Container`/`Section`/`PageHero` to Onix breadcrumbs and typography
- `RoiCalculator` restyled with `onix-container`, `onix-heading-dark`, Onix colour tokens
- Added "Discuss your requirements" OnixButton CTA
- Production canonical URL via `productionCanonical()`

**Priority:** P1  

---

## Other Group 4 Pages (already complete)

| Page | Template | Status |
|------|----------|--------|
| `/home/sustainability/` | CorporatePageTemplate | Complete |
| `/home/cfo/` | CorporatePageTemplate | Complete |
| `/home/feedback/` | CorporatePageTemplate | Complete |
| `/o-home/partners/` | CorporatePageTemplate | Complete |
| `/o-home/privacy-policy/` | CorporatePageTemplate | Complete |

---

## Leadership / Media Cleanup

- Leadership photos: `npm run phase6:leadership-photos` links all 15 profiles to Payload Media
- Static fallbacks in `/images/leadership/` retained for fresh deploy resilience
- CMS owns editable content; Payload `photo` field is primary after import script runs

---

## Template Validation

| Component | Status |
|-----------|--------|
| OnixCertificationGrid | ✓ New |
| CertificationPageTemplate | ✓ New |
| SpecialistPageTemplate | ✓ New |
| LinxAccraContent (tabs, pricing) | ✓ New |
| CFO ROI Onix styling | ✓ |

---

## Regression Check

Group 1 pages re-verified after Group 4 template additions — typecheck, tests, and build pass.

---

## Commands

```bash
npm run phase6:seed-groups-2-4
npm run phase6:leadership-photos
npx tsx scripts/visual-audit/groups234-qa.ts
```

---

**STOP — French pages and news/blog not started. Awaiting review before production cutover planning.**
