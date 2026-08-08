# Phase 6 — Group 1 Visual QA Report

**Audit date:** 2026-08-08  
**Live:** https://onixdatacentres.com  
**Staging:** https://onix-staging-web-production.up.railway.app  
**Viewports:** Desktop 1440px · Mobile 390px  

This checkpoint covers Group 1 template foundations only. Groups 2–6 are **not** started.

---

## Summary

| Page | Status | Priority |
|------|--------|----------|
| About Us | CLOSE | P1 |
| Our Solutions | CLOSE | P2 |
| Infrastructure | CLOSE | P2 |
| Senegal Data Centre | CLOSE | P2 |
| Leadership | CLOSE | P1 |
| Contact Us | CLOSE | P1 |

**Fixes applied this checkpoint:** leadership photos (static + Payload import), About Us content fallback, contact page offices/layout, leadership profile contact details, CTA URL normalisation, duplicate title suffix, production canonical URLs.

---

## 1. About Us

**PAGE:** About Us  
**LIVE:** https://onixdatacentres.com/about-us/  
**STAGING:** https://onix-staging-web-production.up.railway.app/about-us  

**STATUS:** CLOSE  

**Differences (pre-fix → post-fix):**
- Staging previously showed only H1 + CTA; now renders hero, rich text, image/text split, leadership grid, and CTA blocks matching live copy
- Hero and split-section images now served from `/images/about-us/` (static) with Payload media when seeded
- Canonical URL now uses `https://onixdatacentres.com/about-us/` (was `localhost` on staging)
- CTA links normalised to `/contact-us` (was `/about-us` and `/home/contact-us`)

**Priority:** P1  

**Template notes (CorporatePageTemplate):**
- Hero, richText, imageText, leadershipGrid, and cta blocks validated
- Default content fallback in `src/data/group1-about-us.ts` when CMS blocks are sparse

---

## 2. Our Solutions

**PAGE:** Our Solutions  
**LIVE:** https://onixdatacentres.com/home/our-solutions/  
**STAGING:** https://onix-staging-web-production.up.railway.app/home/our-solutions  

**STATUS:** CLOSE  

**Differences:**
- All solution section headings present on staging (Colocation, Virtual Machines, Managed Services, Cyber Security, Internet Exchange, Carrier Neutrality, Cloud and Content, Peering)
- Duplicate `– Onix Data Centre` title suffix fixed via `normalizeTitle()` in SEO helper
- Legacy CTA URLs in CMS blocks rewritten to `/contact-us` at render time
- Live uses H3 for some card titles where staging uses H2 — structural heading level difference only (acceptable at this checkpoint)

**Priority:** P2  

**Template notes (SolutionPageTemplate):**
- Navy/light feature cards, icons, and CTA buttons render correctly
- No missing solution sections identified

---

## 3. Infrastructure

**PAGE:** Infrastructure  
**LIVE:** https://onixdatacentres.com/home/infrastructure/  
**STAGING:** https://onix-staging-web-production.up.railway.app/home/infrastructure  

**STATUS:** CLOSE  

**Differences:**
- All primary infrastructure sections present (Building, Secure Power Supply, Sustainable Operations, Security, Temperature Control, Interconnection, Business Space, Cross Connects)
- Phase 1 / Phase 2 sub-sections from live Elementor layout not yet split as separate H3 blocks — content is present within parent sections
- Infrastructure imagery loading from Payload media on staging (7 images)
- Legacy staging CTA URLs (`myftpupload.com`) normalised to `/contact-us`

**Priority:** P2  

**Template notes (InfrastructurePageTemplate):**
- Technical sections, imagery, and cards functional
- Stats animation block present where CMS provides stats

---

## 4. Senegal Data Centre

**PAGE:** Senegal Data Centre  
**LIVE:** https://onixdatacentres.com/o-home/senegal/  
**STAGING:** https://onix-staging-web-production.up.railway.app/o-home/senegal  

**STATUS:** CLOSE  

**Differences:**
- French headline `1er neutral CLS datacenter en Afrique` now rendered as H1 (was H2)
- All four gallery images present on staging
- Stats/certification copy present
- Legacy `myftpupload.com` Learn more links remain in CMS source — normalised where possible

**Priority:** P2  

**Template notes (DataCentrePageTemplate):**
- Statistics row, rich content sections, certifications, and downloads blocks validated
- Hero uses summary as headline when short enough

---

## 5. Leadership

**PAGE:** Leadership (sample: Brett Tucker)  
**LIVE:** https://onixdatacentres.com/o-home/bretttucker/  
**STAGING:** https://onix-staging-web-production.up.railway.app/o-home/bretttucker  

**STATUS:** CLOSE  

**Differences (pre-fix → post-fix):**
- Photos were missing (initials fallback) — now served from `/images/leadership/` static assets for all 15 profiles, with Payload media linking via `npm run phase6:leadership-photos`
- Profile contact phone and email now displayed (from `src/data/leadership-contacts.ts`)
- Leadership canonical URLs now use production domain
- Eric Tenkorang uses same photo as live production (WP source also references Brett Tucker thumbnail — CMS data issue on live)

**Priority:** P1  

**All 15 profiles verified:**

| # | Name | Legacy path | Photo |
|---|------|-------------|-------|
| 1 | Leonard McKinlay | `/o-home/leonardmckinlay/` | ✓ |
| 2 | Brett Tucker | `/o-home/bretttucker/` | ✓ |
| 3 | Michael Thompson | `/o-home/michaelthompson/` | ✓ |
| 4 | Serwaa Kankam | `/o-home/serwaakankam/` | ✓ |
| 5 | Edem Scott | `/o-home/edemscott/` | ✓ |
| 6 | Kevin Opata | `/o-home/kevinopata/` | ✓ |
| 7 | Stephen Appiah Fordjour | `/o-home/stephenappiah/` | ✓ |
| 8 | Samuel Polley | `/o-home/samuelpolley/` | ✓ |
| 9 | Mamadou KEBE | `/o-home/mamadoukebe/` | ✓ |
| 10 | Bara Awa Fall | `/o-home/senegal/baraawafall/` | ✓ |
| 11 | Paul Richards | `/o-home/paulrichards/` | ✓ |
| 12 | Eric Tenkorang | `/home/eric-tenkorang/` | ✓ |
| 13 | Razak Awudulai | `/o-home/razak-awudulai1/` | ✓ |
| 14 | Samuel Osew-Kwatia | `/o-home/samuel-osew-kwatia/` | ✓ |
| 15 | Razak | `/o-home/razak-awudulai/` | ✓ |

**Template notes (LeadershipPageTemplate):**
- Photo, bio, contact details, and two-column layout validated

---

## 6. Contact Us

**PAGE:** Contact Us  
**LIVE:** https://onixdatacentres.com/contact-us/  
**STAGING:** https://onix-staging-web-production.up.railway.app/contact-us  

**STATUS:** CLOSE  

**Differences (pre-fix → post-fix):**
- Office addresses for London, Ghana, and Senegal now displayed in Stay Connected section
- Heading hierarchy aligned with live: H2 intro, H2 Stay Connected, H1 Send us a message
- Contact form present on staging
- Production canonical URL set

**Priority:** P1  

**Template notes (ContactPageTemplate):**
- Form, office cards, phone/email links, and layout validated

---

## Template Validation Summary

| Template | Validated | Notes |
|----------|-----------|-------|
| CorporatePageTemplate | ✓ | About Us sections, images, CTA blocks |
| SolutionPageTemplate | ✓ | Cards, icons, buttons, dark/light sections |
| InfrastructurePageTemplate | ✓ | Technical sections, imagery, cards |
| DataCentrePageTemplate | ✓ | Stats, certifications, connectivity, downloads |
| LeadershipPageTemplate | ✓ | Photos, bios, contact, layout |
| ContactPageTemplate | ✓ | Form, contact details, layout |

---

## Fixes Applied

1. **Leadership photos** — 15 images in `public/images/leadership/` + Payload import script
2. **About Us content** — default blocks + CMS seed script (`npm run phase6:seed-group1`)
3. **Contact page** — full office details and heading hierarchy
4. **Leadership profiles** — phone/email contact display
5. **SEO** — production canonical URLs, duplicate title suffix removal
6. **CTA URLs** — legacy/staging URLs normalised to `/contact-us`
7. **DataCentre hero** — French tagline as H1

---

## Staging Setup Commands

After deploy, run on Railway (or locally against staging DB):

```bash
npm run phase6:group1-staging
```

This runs:
- `phase6:seed-group1` — About Us CMS blocks
- `phase6:leadership-photos` — Payload media linking

Static leadership photos and About Us images work without DB seeding.

---

## Deferred (not in scope for this checkpoint)

- Pixel-perfect spacing/typography tuning
- Infrastructure Phase 1/Phase 2 as separate H3 sections
- Solution page icon parity with live Elementor icons
- Eric Tenkorang unique photo (live production also uses placeholder)
- Groups 2–6 page migrations

---

## Verification

```
npm run typecheck  ✓
npm test           ✓ (25 tests)
npm run build      ✓
```

**STOP — Groups 2–6 await review of this checkpoint.**
