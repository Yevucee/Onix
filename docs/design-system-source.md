# Design System Source Audit

**Sources:** Elementor `default-kit` settings, Astra Customizer CSS (live site), CFO ROI Calculator, live site crawl

This document records the **current** visual system as implemented on the existing site. It is a source audit, not a redesign specification.

---

## Brand colours

### Elementor global kit

| Name | Hex | Role |
|------|-----|------|
| global red | `#EC0223` | Primary brand colour, CTAs, accents |
| Heading colour | `#1C244B` | Primary heading text (dark navy) |
| Primary | `#FFFFFF` | White backgrounds |
| Secondary | `#54595F` | Secondary text |
| Text | `#7A7A7A` | Body copy |
| Accent | `#61CE70` | Green accent (limited use) |

### Astra Customizer (live site — slight inconsistencies)

| Usage | Hex |
|-------|-----|
| Links | `#ff0000` |
| Link hover | `#f00000` |
| Buttons | `#ec0223` |
| Button hover | `#f00000` |
| Selection highlight | Astra global color 0 (`#0170B9` — blue, conflicts with red brand) |

**Note:** Astra default blue (`#0170B9`) appears in some global color slots but brand execution is predominantly red (`#EC0223`). New site should standardise on `#EC0223`.

### CFO ROI Calculator tokens

| Token | Value |
|-------|-------|
| `--orc-primary` | `hsl(216, 58%, 34%)` — navy blue |
| `--orc-accent` | `hsl(4, 66%, 42%)` — red accent |
| `--orc-bg` | `hsl(210, 20%, 98%)` |
| `--orc-fg` | `hsl(215, 25%, 15%)` |

Calculator uses a slightly different palette — reconcile with main site during rebuild.

---

## Typography

### Font families

| Role | Font | Weight | Size |
|------|------|--------|------|
| Headings (Elementor primary) | Roboto | 600 | varies |
| Headings alt | Roboto Slab | 400 | — |
| Body (Elementor text) | Roboto | 400 | — |
| Body (custom) | Poppins | 300 | 16px / 22.4px line-height |
| Calculator display | Space Grotesk | 500–700 | — |
| Calculator body | Inter | 400–800 | — |
| Astra fallback | System sans-serif | inherit | 15px (93.75% root) |

### Heading scale (Astra live site)

| Level | Desktop size | Mobile size |
|-------|-------------|-------------|
| H1 | 40px | 30px |
| H2 | 32px | 25px |
| H3 | 26px | 20px |
| H4 | 24px | — |
| H5 | 20px | — |
| H6 | 16px | — |

All headings: font-weight 600, colour `#1C244B` / `var(--ast-global-color-2)`.

---

## Spacing conventions

| Context | Value |
|---------|-------|
| Astra container max-width | 1240px |
| Elementor content width | 1200px |
| Astra narrow container | 750px |
| Section padding (Elementor groups) | 4em vertical (3em tablet, 2em mobile) |
| Header min-height | 70px (100px Elementor header section) |
| Button padding | 15px 30px (14px/28px tablet, 12px/24px mobile) |
| Card border-radius (ROI calc) | 0.625rem (10px) |

---

## Button styles

| Property | Value |
|----------|-------|
| Background | `#ec0223` |
| Text | `#ffffff` |
| Hover background | `#f00000` |
| Border | none (0 width) |
| Border-radius | 0 (Astra) / 0.625rem (ROI calc) |
| Font weight | inherit / 600 |
| Outline variant border | `#ec0223` text, transparent background |

---

## Card styles

- White background (`#FFFFFF`)
- Subtle box shadow: `0 4px 16px -2px hsl(216 20% 15% / 0.1)`
- Border: `1px solid hsl(215, 20%, 88%)`
- Border-radius: 0.625rem
- Used in: service icon-boxes, team cards, ROI calculator

---

## Image treatment

| Pattern | Details |
|---------|---------|
| Logo | Max-width 110px (Astra) / 140px (sticky header CSS) |
| Team photos | Grid layout, border-radius on some variants |
| Hero images | Full-width background, min-height sections |
| Blog featured | Full-width above content, overlap card on desktop |
| Hover | `hover_animation` on some image widgets |

---

## Header / navigation

| Property | Value |
|----------|-------|
| Position | Sticky top |
| Background | Transparent → white on scroll |
| Height | 70–100px |
| Logo behaviour | Shrinks on scroll (140px → 70px height) |
| Nav link colour | White/dark → black on sticky, red on hover |
| Mobile | Hamburger menu below 922px breakpoint |
| Breakpoint | 922px (Astra `ast-header-break-point`) |

---

## Footer

- Dark/coloured background sections in Elementor footer templates
- Social icons widget (20 instances across site)
- Copyright text centred
- Multi-column link groups

---

## Common layouts

| Layout | Columns | Usage |
|--------|---------|-------|
| Full-width hero | 1 | Homepage, landing pages |
| 3-column service grid | 3 | Services, solutions |
| 4-column icon-box | 4 | Features, certifications |
| 2-column image + text | 2 | About sections |
| Team grid | 3–4 | Leadership pages |
| Sidebar none | Full width | All Elementor pages (`ast-no-sidebar`) |

---

## Mobile behaviour

| Breakpoint | Behaviour |
|------------|-----------|
| 922px | Desktop/mobile header swap |
| 768px | Typography scale reduction |
| 544px | Further padding/size reduction |
| Mobile nav | Slide-out popup drawer, white background |
| Stacked columns | Elementor responsive column stacking |

---

## Decorative elements

- Animated headlines (25 instances) — rotating/word animation
- Divider widgets between sections
- Spacer widgets for vertical rhythm (209 instances)
- "Slits" templates — decorative section dividers
- Counter widgets for statistics

---

## Inconsistencies to resolve in new design system

1. Red values: `#EC0223` vs `#ff0000` vs `#f00000` vs `#ec0223`
2. Heading font: Roboto vs Poppins vs Space Grotesk across sections
3. Astra blue (`#0170B9`) in global color slots vs red brand
4. Calculator page uses different token system than main site
5. Border-radius: 0 on Astra buttons vs 10px on calculator cards

---

## Recommended token extraction for new site

```css
/* Proposed starting tokens — subject to design review */
--color-brand-red: #EC0223;
--color-brand-red-hover: #C9021E;
--color-heading: #1C244B;
--color-body: #7A7A7A;
--color-body-dark: #54595F;
--color-background: #FFFFFF;
--color-background-alt: #F5F5F5;
--font-heading: 'Poppins', sans-serif;
--font-body: 'Poppins', sans-serif;
--container-max: 1200px;
--header-height: 70px;
--radius-card: 10px;
```

Final tokens should be confirmed after stakeholder review — this audit captures source material only.
