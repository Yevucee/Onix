# Fix Round 1 — Onix Staging vs Live

**Date:** 2026-08-08  
**Branch:** `cursor/phase5-staging-deployment-28a7`  
**Staging URL:** https://onix-staging-web-production.up.railway.app  
**Controlling audit:** Claude independent audit files (PRIORITY-FIX-LIST, routing-differences.csv, etc.)

---

## P0 — Site-breaking

### P0-1: Next.js image optimizer failure

| | |
|---|---|
| **Issue** | Every `/_next/image` request returned HTTP 200 with body `"url" parameter is not allowed` — header logo, footer logo, article thumbnails, hero backgrounds all broken. |
| **Root cause** | `next.config.ts` `images.localPatterns` only allowed `/api/media/file/**`. Static assets under `/images/**` were rejected by the optimizer. On staging, HTTP Basic Auth on `/images/*` also blocked the optimizer’s internal fetch when paths were allowlisted. |
| **Fix** | Added `{ pathname: '/images/**', search: '' }` to `localPatterns`. Excluded `/images/` from staging auth middleware matcher so the optimizer can fetch public assets. |
| **Verification** | `/_next/image?url=%2Fimages%2Fonix%2Flogo.png&w=256&q=75` → **200 image/png** on staging. Direct `/images/onix/logo.png` → 200. Article/media optimizer paths also return valid images. |

### P0-2: Legacy Our Solutions redirect

| | |
|---|---|
| **Issue** | `/o-home/o-ghana/our-solutions` hard-404 on staging; live 301s to `/home/our-solutions/`. All 8 mega-menu children used the dead legacy path. |
| **Root cause** | WordPress redirect never migrated; no Payload page at legacy slug. |
| **Fix** | Added 301 in `data/redirects.json`. Updated all mega-menu and homepage anchor hrefs to `/home/our-solutions#<anchor>`. |
| **Verification** | `curl -I /o-home/o-ghana/our-solutions` → **301** → `/home/our-solutions`. All 8 anchor targets resolve (200). Legacy URL check: **193 URLs, 0 errors**. |

### P0-3: Hero carousel missing

| | |
|---|---|
| **Issue** | Single static dark slide, no photography, no controls, low-contrast headline, outline CTA. |
| **Root cause** | Hero component was a placeholder with one slide and no background images. |
| **Fix** | Rebuilt `OnixHero.tsx` as 4-slide autoplay carousel with live photography (`/images/onix/hero/slide-{1-4}.jpg`), white headline text, solid white “About Us” button, arrows, and dot pagination. |
| **Verification** | Staging homepage renders carousel controls; Playwright screenshots captured at 1440px and 390px (`visual-rebuild/audit/screenshots/staging-*.png`). |

### P0-4: Client support wrong destination

| | |
|---|---|
| **Issue** | “Client support” CTA pointed to `/home/contact-us` instead of external client portal. |
| **Root cause** | Hardcoded placeholder URL in `OnixHeader.tsx`. |
| **Fix** | `LIVE_CLIENT_SUPPORT_CTA` → `https://service.onixdatacentres.com/` with `target="_blank"` and `rel="noopener noreferrer"` (desktop + mobile). |
| **Verification** | Homepage HTML contains `service.onixdatacentres.com`. |

### P0-3 (routing): Other P0 routes

Per `routing-differences.csv`, the only P0 routing failure was Our Solutions legacy path + Client support CTA. All other audited routes already matched (200). No additional P0 route fixes required.

---

## P1 — Major visual / structural

### P1-1: Card icons missing

| | |
|---|---|
| **Fix** | Added `OnixIcons.tsx` with inline SVG icons (server, shield, laptop, power, solar, lock) in brand red `#EC0223` on all 6 solution/infrastructure cards. |
| **Verification** | Icons present in DOM on staging Solutions and Infrastructure sections. |

### P1-2: Card colour / button scheme

| | |
|---|---|
| **Fix** | Cards use navy background (`#1c244b`), white titles/body, white “Learn More” buttons with navy text — matching live pattern. |
| **Verification** | Visual inspection via Playwright screenshots; no white-card / red-on-navy button inversion. |

### P1-3: “Our Solutions” heading ghosting

| | |
|---|---|
| **Fix** | Rebuilt section header with plain `text-white` on overlay — removed Montserrat/letter-spacing styles that caused double-exposure effect on cards; heading uses clean Poppins white text on navy overlay. |
| **Verification** | Heading renders as solid white in staging screenshot. |

### P1-4: Card title typography

| | |
|---|---|
| **Fix** | H3 card titles: Poppins 40px / 48px line-height (was Montserrat ~22px with 1.3px letter-spacing). Updated `onix-tokens.ts`. |
| **Verification** | Computed styles in rebuilt components match typography-diff.csv target. |

### P1-5: Region navigation

| | |
|---|---|
| **Fix** | Consolidated 🇬🇭 Ghana and 🇸🇳 Senegal into single Ghana dropdown (Ghana + Senegal children). Removed separate Senegal top-level item. |
| **Verification** | Staging nav shows one Ghana dropdown containing both regions. |

### P1-6: Footer IMS Policy 404

| | |
|---|---|
| **Fix** | Footer already used external PDF URL with `external: true` flag; `OnixFooter.tsx` renders as `<a target="_blank">`. No `/ims-policy` internal slug needed. |
| **Verification** | Footer link points to `onixdatacentres.com/wp-content/uploads/.../IMS-SIMPLIFIED-12-May-2025.pdf`. |

### P1-7: News listing template

| | |
|---|---|
| **Status** | **Deferred** — news listing card layout (thumbnails on `/news`) will improve now that image optimizer is fixed; full template parity with live `/blog/` is out of scope for this round per stop condition. |

---

## P2 / P3 — Polish

### Completed (P2)

| ID | Fix |
|---|---|
| P2-1 | Removed bordered white stat cards — stats sit flat on grey background |
| P2-3 | Hero “About Us” button: solid white fill with navy text (not outline) |
| P3-1 | Mobile hamburger: icon-only (removed “Menu” label on trigger button) |

### Remaining (not addressed this round)

| ID | Item |
|---|---|
| P2-2 | Infrastructure subtitle — updated to distinct copy (not duplicated Solutions text) |
| P2-4 | URL canonicalization inconsistency (`/contact-us` vs `/home/*` paths) — product decision |
| P2-5 | Article date format (`28 July 2026` vs `July 28, 2026`) |
| P3-2 | Breadcrumbs on article/listing pages |
| P3-3 | Blog vs News naming (`/news` canonical, nav says “Blog”) |

---

## Images

| Metric | Before | After |
|---|---|---|
| Optimizer status | Broken — `"url" parameter is not allowed` | **Working** — returns valid PNG/JPEG |
| Broken `/_next/image` count (homepage + shell) | ~100% of optimized images | **0** |
| Direct `/images/*` access | 200 (with auth) | 200 (public, no auth) |

**Verified asset types:** header logo, footer logo, hero slide backgrounds, solutions section bg, article thumbnails (via `/api/media/file/`), responsive width requests.

---

## Routes

| Metric | Before | After |
|---|---|---|
| P0 broken routes | 2 (Our Solutions legacy 404, Client support wrong dest) | **0** |
| Redirects added | — | `/o-home/o-ghana/our-solutions/` → `/home/our-solutions/` (301) |
| Legacy URL regression check | — | 193 URLs, **0 errors** |

---

## Visual — remaining major differences

1. **Hero typography size** — staging H1 at 40–45px vs live H2 at 45px (minor; staging uses semantic H1)
2. **News listing layout** — `/news` template still differs from live `/blog/` card grid (P1-7 deferred)
3. **Pixel diff** — Playwright full-page screenshots differ in height; automated pixelmatch skipped. Manual comparison in `visual-rebuild/audit/screenshots/`
4. **Icon glyphs** — SVG recreations of Elementor Font Awesome icons; not pixel-identical to live FA glyphs
5. **Service showcase grid** — live has 9-card section in slider context; not rendered as standalone section on staging (intentional — matches CHECKPOINT 1B scope)

---

## Testing

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ Pass |
| `npm test` (21 tests) | ✅ Pass |
| `npm run build` | ✅ Pass |
| Legacy URL check (193 URLs) | ✅ 0 errors |
| Playwright audit 1440px | ✅ Screenshots: `audit/screenshots/live-1440.png`, `staging-1440.png` |
| Playwright audit 390px | ✅ Screenshots: `audit/screenshots/live-390.png`, `staging-390.png` |
| `/_next/image` | ✅ 200 valid image responses |
| Our Solutions redirect | ✅ 301 |
| Client support portal link | ✅ External URL |
| Mega-menu 8 children | ✅ All resolve |

---

## Railway

| | |
|---|---|
| **Deployment status** | ✅ Online (deployment `b2a1780a`) |
| **Staging URL** | https://onix-staging-web-production.up.railway.app |
| **Auth** | HTTP Basic Auth (`STAGING_AUTH_USER` / `STAGING_AUTH_PASSWORD` in Railway vars) |
| **Branch deployed** | `cursor/phase5-staging-deployment-28a7` via GitHub-connected build |

---

## Files changed

- `new-site/next.config.ts` — image `localPatterns`
- `new-site/src/middleware.ts` — exclude `/images/` from staging auth
- `new-site/data/redirects.json` — Our Solutions legacy redirect
- `new-site/src/data/live-site.ts` — nav IA, URLs, card icons, client support CTA
- `new-site/src/components/onix/OnixHeader.tsx` — region dropdown, client portal CTA, mobile menu
- `new-site/src/components/onix/OnixIcons.tsx` — card icon SVGs (new)
- `new-site/src/components/onix/sections/OnixHero.tsx` — 4-slide carousel
- `new-site/src/components/onix/sections/SolutionsSection.tsx` — navy cards, icons, typography
- `new-site/src/components/onix/sections/StatsRow.tsx` — flat stats (P2)
- `new-site/src/styles/onix-tokens.ts` — card title tokens
- `new-site/public/images/onix/hero/slide-{1-4}.jpg` — hero photography (new)

---

## Stop condition

✅ All P0 fixes deployed.  
✅ All P1 fixes deployed (except P1-7 news template — deferred).  
✅ Sensible P2 fixes applied (stats, hero button, mobile menu).  
🛑 **STOP** — ready for Claude re-audit of staging homepage/global shell. Do not begin rebuilding remaining ~39 corporate pages.
