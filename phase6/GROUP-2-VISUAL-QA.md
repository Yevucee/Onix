# Phase 6 — Group 2 Visual QA Report

**Audit date:** 2026-08-08  
**Live:** https://onixdatacentres.com  
**Staging:** https://onix-staging-web-production.up.railway.app  
**Viewports:** Desktop 1440px · Mobile 390px  

---

## Pages Migrated

| Page | Live URL | Staging URL | Status |
|------|----------|-------------|--------|
| Finance | `/home/finance/` | `/home/finance/` | CLOSE |
| Virtual Machines | `/home/virtual-machine/` | `/home/virtual-machine/` | CLOSE |
| Services | `/services/` | `/services/` | CLOSE |

**Note:** `/home/o-services/` redirects to `/services/` (French service-focused page).

---

## Representative QA (completed before bulk migration)

### 1. Finance (`/home/finance/`)

**STATUS:** CLOSE  

**Live structure:**
- Hero: "Elevate Your Financial Services with Onix Data Centres"
- Intro copy on financial sector colocation
- 5 navy feature cards: Physical Security, Connectivity, Power, Cooling, Certifications
- CTA: "Talk to Us Today"

**Fixes applied:**
- `SolutionPageTemplate` enriched with `resolveSolutionBlocks()` fallback from `src/data/group2-solutions.ts`
- Navy `featureCards` block variant matches live card grid
- CTA URLs normalised to `/contact-us`
- CMS seed via `npm run phase6:seed-groups-2-4`

**Priority:** P1  

---

### 2. Virtual Machines (`/home/virtual-machine/`) — technical solution

**STATUS:** CLOSE  

**Live structure:**
- Hero with VM intro + CTA
- 4 use-case cards (Development, Server Consolidation, Disaster Recovery, Remote Work)
- Bulleted feature sections (Key Features, Security, DR, Cost Efficiency, Flexibility)
- Promo CTA with GH₵2000 free credits

**Fixes applied:**
- New `bulletedFeatures` block type + `OnixBulletedFeatures` component
- Structured VM content in group2-solutions data file
- Navy feature cards for use cases

**Priority:** P1  

---

### 3. Services (`/services/`) — service-focused page

**STATUS:** CLOSE  

**Live structure:**
- French-language service sections: Colocation, Carrier Neutrality, Cloud & Content, Interconnection
- Feature card layout per service area

**Fixes applied:**
- French copy preserved from live production
- Navy feature cards with full service descriptions
- Hero + CTA blocks

**Priority:** P2  

---

## Template Validation (SolutionPageTemplate)

| Check | Status |
|-------|--------|
| Hero patterns | ✓ |
| Navy feature cards | ✓ |
| Bulleted feature sections | ✓ (new) |
| OnixButton CTAs | ✓ |
| Breadcrumbs | ✓ |
| CMS editability | ✓ (Payload blocks) |
| URL preservation | ✓ |
| SEO canonical | ✓ |

---

## Regression Check (Group 1)

Group 1 pages re-verified after template changes — no regressions detected in typecheck/tests/build.

---

## Commands

```bash
npm run phase6:seed-groups-2-4   # Seed CMS blocks
npx tsx scripts/visual-audit/groups234-qa.ts
```

---

**STOP — Groups 3–4 documented separately. French/news not started.**
