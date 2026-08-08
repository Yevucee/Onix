# Fix Round 2 — Onix Staging vs Live

**Date:** 2026-08-08  
**Branch:** `cursor/phase5-staging-deployment-28a7`  
**Staging URL:** https://onix-staging-web-production.up.railway.app  
**Controlling audit:** Claude Round 2 audit files

---

## IMS POLICY

| | |
|---|---|
| **Live destination** | `https://onixdatacentres.com/wp-content/uploads/2025/05/IMS-SIMPLIFIED-12-May-2025.pdf` (external PDF, `target="_blank"`) |
| **Previous staging behaviour** | Footer href pointed at live production URL; `/ims-policy` path returned 404 when tested directly |
| **Root cause** | PDF not hosted on staging; no redirect alias for `/ims-policy` |
| **Fix** | Copied migrated PDF to `public/documents/IMS-SIMPLIFIED-12-May-2025.pdf` (source: `new-site/media/IMS-SIMPLIFIED-12-May-2025.pdf`). Updated footer link to `/documents/IMS-SIMPLIFIED-12-May-2025.pdf`. Added 301 redirects from `/ims-policy` and `/ims-policy/`. Excluded `/documents/` from staging auth middleware. |
| **Verification** | PDF serves 200 from staging. Footer link resolves to hosted document. `/ims-policy` → 301 → PDF. |

---

## HERO VIDEO

| | |
|---|---|
| **Production video asset** | YouTube embed `https://www.youtube.com/embed/XNjRm7W4OvA` — title: *"Onix Data Centre, Ghana, from Above."* (Onix Data Center channel). Configured in WordPress Elementor `background_video_link: https://youtu.be/XNjRm7W4OvA` |
| **Local/migrated destination** | Embedded directly from YouTube (same as live — not self-hosted). Mobile fallback poster: `public/images/onix/hero/mobile-poster.jpg` (from migrated `DJI_0721.jpg` — drone eye view of Onix Data Centre) |
| **Poster/fallback** | Mobile uses compressed DJI drone still (`512KB`). Desktop uses live YouTube drone video. |
| **Implementation** | Rebuilt `OnixHero.tsx`: YouTube iframe background (autoplay, mute, loop, playsinline, controls=0) + 4-slide text carousel overlay with arrows/dots/autoplay. Removed incorrect image-carousel backgrounds (wireframe + T-shirt stock photos). |
| **Desktop verification** | YouTube iframe present (`md:block`). Black overlay 45%. White headline via `.onix-heading-light`. Per-slide CTAs match live labels. |
| **Mobile verification** | Video hidden; DJI drone poster background. Same 4-slide carousel and white CTA buttons. |

---

## HERO CONTENT

| Item | Live | Staging (after fix) |
|---|---|---|
| Headline slides | Welcome → Virtual Machines → Managed Services → Cyber Security | Same 4 slides, same order |
| CTAs | About Us / Our Solutions / Learn More / Learn More | Same labels; canonical internal URLs |
| Overlay | Dark over video | `bg-black/45` |
| Background | YouTube drone video (desktop) | Same YouTube ID |
| Differences remaining | Live uses Elementor/WPR slider plugin; minor timing/transition easing may differ | Structural parity achieved |

---

## BUTTON AUDIT

| | |
|---|---|
| **Audit file** | `visual-rebuild/button-audit.csv` |
| **Variants identified on live** | `header-support` (red/white), `solid-white` (hero + cards), `primary-red` (Learn more, Contact us), `navy-pill` (Latest News) |
| **Component implemented** | `src/components/onix/OnixButton.tsx` with 4 variants |
| **Buttons corrected** | Header Client support, hero CTAs, Who We Are Learn more, card Learn More, Latest News, Contact us CTA |
| **URLs corrected** | Client support → `https://service.onixdatacentres.com/` (external). Hero/card CTAs use canonical `/home/our-solutions` and `/o-home/about-us`. |
| **Remaining differences** | Card-level hover on live uses full-card click target; staging uses explicit button — visually equivalent |

---

## COLOUR BUG

| | |
|---|---|
| **Root cause** | Unlayered `h1–h4 { color: var(--onix-heading) }` in `styles.css` overrode Tailwind `text-white` utilities |
| **Components affected** | Hero H1, Our Solutions H2, Solutions card H3 titles |
| **Fix** | Removed global heading colour. Added `.onix-heading-dark` and `.onix-heading-light` semantic classes. Applied `.onix-heading-light` on all dark-background headings. |
| **Verification** | Hero and card titles now render white on dark backgrounds |

---

## SOLUTIONS / INFRASTRUCTURE

| Area | Status |
|---|---|
| Icons | Red SVG icons retained (`OnixIcons.tsx`) |
| Typography | Poppins 40px card titles with `.onix-heading-light` on navy cards |
| Buttons | `OnixButton` solid-white variant on all cards |
| Layout | 3-column grid, navy section header with facility photo |
| Remaining | Live card icons are Font Awesome glyphs — SVG recreations are close but not pixel-identical |

---

## IMAGES / VIDEO

| Metric | Before R2 | After R2 |
|---|---|---|
| Failed assets | 2 hero placeholder images (wireframe + T-shirt) | **0** |
| Optimizer status | Working (R1 fix intact) | Working |
| Video status | No video — image carousel only | YouTube drone video on desktop; DJI poster on mobile |

---

## ROUTES

| Check | Result |
|---|---|
| Broken route count | **0** P0 |
| IMS Policy `/documents/...pdf` | 200 |
| IMS Policy `/ims-policy` | 301 → PDF |
| Our Solutions redirect | 301 → `/home/our-solutions/` (unchanged) |
| Client support | External portal URL |
| CTA links | Verified in component data |

---

## TESTING

| Check | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm test` (25 tests incl. 4 new R2 tests) | Pass |
| `npm run build` | Pass |
| Playwright 1440px + 390px | Screenshots updated in `visual-rebuild/audit/screenshots/` |
| Runtime errors | No new errors introduced in build |

---

## RAILWAY

| | |
|---|---|
| **Deployment status** | Deployed via GitHub push to `cursor/phase5-staging-deployment-28a7` |
| **Staging URL** | https://onix-staging-web-production.up.railway.app |

---

## Visual comparison (self-assessment)

| Section | Classification |
|---|---|
| Header | MATCH |
| Hero video | MATCH (YouTube drone + carousel) |
| Hero CTA | MATCH |
| Who We Are | CLOSE |
| Stats | MATCH |
| Our Solutions | CLOSE (icons approximate) |
| Infrastructure | CLOSE |
| Latest News | MATCH |
| Contact CTA | MATCH |
| Footer | MATCH (IMS Policy fixed) |

---

## Stop condition

All Round 2 P0/P1 fixes deployed. Homepage/global shell ready for Claude final approval audit. **STOP** — no corporate pages or `/news` template work begun.
