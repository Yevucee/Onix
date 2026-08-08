# Visual Front-End Checkpoint

**Date:** 2026-08-08  
**Method:** Playwright read-only audit of https://onixdatacentres.com + clean React recreation  
**Staging URL:** https://onix-staging-web-production.up.railway.app

---

## Screenshots

| Viewport | Live | Staging |
|----------|------|---------|
| Desktop 1440px | `visual-rebuild/audit/screenshots/live-1440.png` | `visual-rebuild/audit/screenshots/staging-1440.png` |
| Mobile 390px | `visual-rebuild/audit/screenshots/live-390.png` | `visual-rebuild/audit/screenshots/staging-390.png` |

Diff images: `visual-rebuild/audit/screenshots/diff-1440.png`, `diff-390.png`

---

## Section Comparison

| Section | Classification | Notes |
|---------|---------------|-------|
| Header — logo | CLOSE | ONIX logo image, correct sizing |
| Header — nav links | EXCELLENT_MATCH | Red (#ec0223) Poppins 16px/500, correct items + dropdowns |
| Header — CTA | EXCELLENT_MATCH | "Client support" red button (not Contact Us) |
| Header — mobile menu | CLOSE | Accordion panel, same items |
| Hero | CLOSE | Dark bg, centered white text, About Us outlined button; live uses multi-slide carousel |
| Who we are | CLOSE | Split layout, collage image, Learn more red button |
| Stats row | CLOSE | 99.995% / 15+ / 0.88 animated counters, #f3f3f3 bg |
| Our Solutions band | CLOSE | Navy overlay on bg image, white heading |
| Solutions cards | CLOSE | 3 CTA cards with hover-to-navy pattern |
| Infrastructure | CLOSE | White heading section + 3 CTA cards |
| Latest News | VISIBLE_DIFFERENCE | Magazine grid layout; some articles may lack featured images |
| Contact CTA | CLOSE | Centered heading, red divider, Contact us button |
| Footer | CLOSE | Black bg, white logo, social icons, Navigate + Get in touch |

---

## Production Typography (from computed styles)

| Element | Font | Size | Weight | Line-height |
|---------|------|------|--------|-------------|
| Body | Poppins | 16px | 400 | 22.4px |
| Nav links | Poppins | 16px | 500 | 20px |
| H1/H2 | Poppins | 40px | 600 | 48px / 1.2em |
| Stat numbers | Montserrat | ~48px | 600 | — |
| Card titles | Montserrat | 1.4em | 600 | letter-spacing 2.5px |
| Footer headings | Poppins | 22px | 600 | — |
| CTA button | Poppins | 15px | 400 | — |

---

## Assets

| Production URL | Local path | Status |
|----------------|------------|--------|
| ONIX-logo-png-300x196.png | `/images/onix/logo.png` | ✅ Matched |
| Onix_white_logo.png | `/images/onix/logo-white.png` | ✅ Matched |
| Images-collage-3.png | `/images/onix/collage.png` | ✅ Matched (migrated archive) |
| IMG_9788-scaled.jpg | `/images/onix/solutions-bg.jpg` | ✅ Downloaded |
| Hero slider images | — | ⚠️ Live uses wpr-slider with multiple slides; staging uses single dark slide |
| Service showcase icons | — | ⚠️ Live CTA cards have icons; staging text-only |
| Article featured images | Payload media | ⚠️ Some articles may lack images on staging |

---

## Remaining Visible Differences

1. **Hero carousel** — Live has multi-slide Royal Slider with background images per slide; staging has single dark slide
2. **Service showcase (9 cards)** — On live these appear in slider slides, not as a separate section; not rendered as standalone grid on staging
3. **News grid asymmetry** — Live wpr-magazine-grid has specific asymmetric layout; staging approximates with CSS grid
4. **Article images** — Some Payload articles may not have featured images resolved
5. **Exact spacing/padding** — Minor differences in section padding (live uses 80-100px, staging close but not pixel-perfect)
6. **Sticky header shrink** — Live header shrinks logo on scroll; staging sticky without shrink animation
7. **Hover animations** — Live Elementor transitions are smoother/longer (1500ms CTA bg transitions)

---

## Build / Test Status

- `npm run build` — ✅ Pass
- Playwright live audit — ✅ `scripts/visual-audit/live-site-audit.ts`
- Railway deploy — Pending push trigger

---

## Architecture

```
src/components/onix/
├── OnixHeader.tsx      — Production nav (red links, Client support CTA)
├── OnixFooter.tsx      — Black footer, white logo, social
├── OnixHomePage.tsx    — Section orchestrator
└── sections/
    ├── OnixHero.tsx
    ├── WhoWeAre.tsx
    ├── StatsRow.tsx
    ├── SolutionsSection.tsx
    ├── LatestNews.tsx
    └── ContactCTA.tsx
```

Payload CMS, articles, media, SEO, redirects, Railway staging — unchanged.

---

## STOP — awaiting homepage review

Other 39 corporate pages NOT touched.
