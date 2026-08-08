# CHECKPOINT 1B — Live Site Reconstruction

**Date:** 2026-08-08  
**Branch:** `cursor/phase5-staging-deployment-28a7`  
**Staging URL:** https://onix-staging-web-production.up.railway.app  
**Auth:** HTTP Basic Auth (`STAGING_AUTH_USER` / `STAGING_AUTH_PASSWORD` in Railway Variables)

---

## 1. Full live navigation found

Production header (https://onixdatacentres.com):

| # | Item | URL | Dropdown |
|---|------|-----|----------|
| 1 | 🇬🇭 Ghana | `/` | Yes |
| 2 | 🇸🇳 Senegal | `/o-home/senegal/` | No |
| 3 | Our Solutions | `/home/our-solutions/` | Yes (9 children) |
| 4 | Infrastructure | `/home/infrastructure/` | No |
| 5 | Blog | `/blog/` | No |
| 6 | Contact Us | `/home/contact-us/` | No |

**Our Solutions dropdown:** Colocation, Virtual machines, Managed Services, Cyber Security, Internet Exchange, Carrier Neutrality, Cloud and Connect, Peering, Finance

**CTA:** Contact Us → `/home/contact-us/`

**Footer:** Navigate (About Us, Certification, Sustainability, Privacy Policy, IMS Policy) + Get in touch (email, 2 phones) + social (Twitter, LinkedIn)

See: `visual-rebuild/live-navigation-audit.md`

---

## 2. Missing staging navigation items found (before fix)

| Item | Issue |
|------|-------|
| 🇬🇭 Ghana language switch | Missing entirely |
| Our Solutions dropdown (9 items) | Flat link only, no children |
| Senegal URL | Wrong path (`/senegal` vs `/o-home/senegal`) |
| Contact Us CTA | Pointed to `/about-us` |
| Footer Navigate column | Missing |
| Footer contact details | Missing |
| Footer social links | Missing |
| Newsletter form | Present on staging but NOT on live site |

See: `visual-rebuild/navigation-gap-analysis.csv`

---

## 3. Navigation fixed

- `new-site/src/data/live-site.ts` — canonical nav from live crawl
- `new-site/src/components/layout/Header.tsx` — rebuilt with dropdowns, language switch, mobile accordion
- `new-site/src/app/(frontend)/layout.tsx` — uses `LIVE_HEADER_NAV` as source of truth
- `new-site/scripts/seed-prototype.ts` — corrected CMS globals for future population

**Staging verification:** Header now shows 🇬🇭 Ghana, 🇸🇳 Senegal, Our Solutions (with dropdown), Infrastructure, Blog, Contact Us + CTA button.

---

## 4. Live page tree

Documented in `visual-rebuild/live-page-tree.md` — 45+ public pages across Ghana, Senegal, leadership, blog, French, and specialist landing pages.

---

## 5. Footer issue diagnosed

**Cause:** Elementor footer template widgets were flattened into homepage page blocks during migration. Footer was also rendered from incomplete Payload global with a non-live newsletter form.

See: `visual-rebuild/global-template-migration-bug.md`

---

## 6. Footer fixed

- `new-site/src/components/layout/Footer.tsx` — dedicated component from `LIVE_FOOTER` data
- Newsletter form removed (not on live site)
- Navigate + Get in touch columns with correct links and contact details
- Social links (Twitter, LinkedIn)
- CTA band: "Get in touch with us today"

**Staging verification:** "Navigate" and "Get in touch" now render in `<footer>` only — NOT in `<main>` body.

---

## 7. Homepage migration/template bug diagnosed

**Root cause chain:**
1. `import-pages.ts` → `elementorToPageBlocks()` imports entire Elementor document including footer widgets
2. `page.tsx` rendered both generic Hero AND migrated blocks containing footer text
3. `seed-prototype.ts` had incomplete/wrong navigation data

**Fix:** Homepage now uses `HomePageView` component; migrated CMS blocks are NOT rendered on `/`.

---

## 8. Homepage sections found (live)

| # | Section | Key content |
|---|---------|-------------|
| 1 | Hero | Welcome to Onix Data Centres + background image + About Us CTA |
| 2 | Service showcase | 9 service cards |
| 3 | Who we are | Text + image collage + 3 stats (99.995%, 15+, 0.88) |
| 4 | Our Solutions | 3 cards (Colocation, Cybersecurity, Virtual Machines) |
| 5 | Infrastructure | 3 cards (Power, Sustainability, Security) |
| 6 | News/articles | Latest blog posts |
| 7 | Contact CTA | Get in touch with us today |

See: `visual-rebuild/live-homepage-structure.md`

---

## 9. Homepage sections reconstructed

- `new-site/src/components/home/HomePageView.tsx` — all 7 sections
- `new-site/src/app/(frontend)/page.tsx` — renders HomePageView only
- Live images downloaded to `new-site/public/images/`

---

## 10. Desktop comparison (1440px)

| Area | Live | Staging (after fix) | Match |
|------|------|---------------------|-------|
| Logo | ONIX red logo | ONIX logo image | ✅ Close |
| Nav items | 6 top-level + dropdowns | 6 top-level + dropdowns | ✅ |
| Language switch | 🇬🇭 Ghana / 🇸🇳 Senegal | Present | ✅ |
| Hero | Full-width bg image | Full-width bg image | ✅ Close |
| Service cards | 9 cards | 9 cards | ✅ |
| Who we are | Text + collage + stats | Text + collage + stats | ✅ Close |
| Solutions | 3 cards | 3 cards | ✅ |
| Infrastructure | 3 cards | 3 cards | ✅ |
| News | Article cards with images | Article cards (from Payload) | ⚠️ Partial |
| Footer | Dark, 3 columns | Dark, 3 columns | ✅ Close |

Screenshots: `/opt/cursor/artifacts/screenshots/live-desktop-1440.png`, `staging-desktop-1440-v2.png`

---

## 11. Mobile comparison (~390px)

| Area | Live | Staging (after fix) | Match |
|------|------|---------------------|-------|
| Menu button | Hamburger | Hamburger with slide-in panel | ✅ |
| Submenus | Accordion expand | Accordion expand | ✅ |
| Hero | Stacked text | Stacked text | ✅ Close |
| Sections | Single column | Single column | ✅ |
| Footer | Stacked columns | Stacked columns | ✅ Close |

Screenshots: `/opt/cursor/artifacts/screenshots/live-mobile-390.png`, `staging-mobile-390-v2.png`

---

## 12. Remaining differences

| Item | Notes |
|------|-------|
| Visual polish | Live uses Elementor animations, exact spacing, hover effects — staging uses clean Tailwind approximation |
| Hero video | Live may use background video on some breakpoints — staging uses static image |
| Service card icons | Live has icon/image per card — staging is text-only cards |
| News section images | Staging article cards may lack featured images for some posts |
| Typography exact match | Poppins loaded but sizes/weights may differ slightly |
| French site | Not in scope for this checkpoint |
| Other 39 corporate pages | Not touched — still use migrated blocks |
| Payload globals | Frontend overrides with live-site data; CMS records should be cleaned |

---

## 13. Railway deploy status

| Item | Status |
|------|--------|
| Branch pushed | ✅ `cursor/phase5-staging-deployment-28a7` @ `28c0ff5` |
| Railway build | ✅ Deployed to `onix-staging-web` |
| Staging URL | ✅ https://onix-staging-web-production.up.railway.app |
| New content verified | ✅ "Welcome to Onix Data Centres", onix-logo, 🇬🇭 Ghana in HTML |
| Footer-in-body bug | ✅ Fixed — Navigate not in `<main>` |

---

## 14. Files changed

| File | Change |
|------|--------|
| `new-site/src/data/live-site.ts` | Live nav/footer/homepage data |
| `new-site/src/components/layout/Header.tsx` | Full nav rebuild |
| `new-site/src/components/layout/Footer.tsx` | Live footer rebuild |
| `new-site/src/components/home/HomePageView.tsx` | Homepage sections |
| `new-site/src/app/(frontend)/page.tsx` | Use HomePageView, skip CMS blocks |
| `new-site/src/app/(frontend)/layout.tsx` | Live nav source of truth |
| `new-site/scripts/seed-prototype.ts` | Correct nav/footer seed |
| `new-site/public/images/*` | Logo, hero, collage images |
| `visual-rebuild/*` | Audit docs (5 files) |

---

## 15. STOP — awaiting review

This checkpoint covers ONLY:
- ✅ Live navigation audit
- ✅ Live page tree
- ✅ Header + mobile navigation
- ✅ Footer
- ✅ Homepage structure documentation
- ✅ Homepage visual reconstruction
- ✅ Global template migration bug diagnosis
- ✅ Railway deploy

**NOT in scope (deferred):**
- Other 39 corporate pages
- French site
- Full visual pixel-match polish
- Payload CMS record cleanup

**Review at:** https://onix-staging-web-production.up.railway.app
