# Elementor Analysis

**Sources:** WordPress XML export, database dump, live site crawl  
**Elementor Pro:** Confirmed active (`elementor-pro/elementor-pro.php`)

No standalone Elementor kit export was supplied. All template data is embedded in postmeta (`_elementor_data`) within the XML export and database.

---

## Usage extent

| Content type | Total | With Elementor data | % |
|--------------|-------|---------------------|---|
| Pages | 53 | 51 | 96% |
| Posts | 90 | 9 (full builder) / 45 (any meta) | 10% / 50% |
| Elementor library templates | 46 | 46 | 100% |
| Attachments with Elementor meta | 89 | — | Screenshots/cache |

**Verdict:** The site is **heavily dependent on Elementor** for all marketing pages. Articles primarily use a shared single-post template, not per-article page building.

---

## Global design kit (`default-kit`)

Extracted from Elementor Site Settings in XML:

### Global colours

| Token | Hex | Usage |
|-------|-----|-------|
| global red | `#EC0223` | Primary brand red |
| Heading colour | `#1C244B` | Dark navy headings |
| Primary | `#FFFFFF` | Backgrounds |
| Secondary | `#54595F` | Secondary text |
| Text | `#7A7A7A` | Body text |
| Accent | `#61CE70` | Accent green |

Astra theme inline CSS also references `#ff0000`, `#ec0223`, `#f00000` for links/buttons — slight inconsistency between Astra Customizer and Elementor kit.

### Global typography

| Token | Font | Weight |
|-------|------|--------|
| Primary | Roboto | 600 |
| Secondary | Roboto Slab | 400 |
| Text | Roboto | 400 |
| Accent | Roboto | 500 |
| Body text (custom) | Poppins | 300, 16px / 22.4px line-height |

Additional fonts observed on live site and in custom code:

- **Poppins** — body text in Elementor kit
- **Inter** + **Space Grotesk** — CFO ROI Calculator widget

---

## Templates inventory (46 `elementor_library` items)

### Site structure templates

| Type | Slug | Title |
|------|------|-------|
| kit | `default-kit` | Default Kit |
| header | `header-01` | Header 01 |
| footer | `footer-onix` | Footer - Onix |
| footer | (unnamed) | Footer - Onix |
| single-post | `onix-blog-template` | Onix Blog template |
| single-post | (unnamed) | Elementor Single Post #9713 |
| single-page | `i-run-a-network` | I run a network |
| single-page | `im-a-business-or-user` | I'm a business or user |

### Reusable section templates

| Slug | Title | Likely use |
|------|-------|------------|
| `hero-image-background` | Hero - Image Background | Page heroes |
| `hero-inline-video` | Hero - Inline Video | Video heroes |
| `call-to-action` / `-2` / `-3` | Call to Action | CTAs (3 variants) |
| `services` / `-2` through `-5` | Services | Service grids (5 variants) |
| `onix-services` | Onix - Services | Branded services section |
| `colocation` | Colocation | Service detail |
| `connectivity-services` | Connectivity Services | Service detail |
| `office-space` | Office Space | Service detail |
| `featured-product` | Featured Product | Product highlight |
| `focus-boxes` / `-2` | Focus Boxes | Feature highlights |
| `features-benefit-list` | Features & Benefit - List | Benefits |
| `features-benefit-slider` | Features & Benefit - Slider | Benefits carousel |
| `about-image-heading-copy` | About - Image, Heading & Copy | About sections |
| `about-one-column-heading-copy` | About - One Column | About sections |
| `about-video-heading-copy` / `-2` | About - Video, Heading & Copy | About with video |
| `contact-with-map` / `-2` / `-3` | Contact (with Map) | Contact sections |
| `team-grid` / `-2` / `-3` / `-4` | Team - Grid | Leadership grids |
| `team-members-grid` | Team Members – Grid | Leadership |
| `testimonial-slider` | Testimonial Slider | Social proof |
| `onix-footer` | ONIX-Footer | Footer variant |
| `tabs-01` / `-2` | tabs 01 | Tabbed content |
| `slits` / `slits2` | slits | Decorative dividers |

### Header/footer builder

1 `elementor-hf` post type item — Header Footer Elementor plugin integration.

---

## Widget usage (from `_elementor_data` parsing)

Top widgets by frequency across all Elementor content:

| Widget | Count | Source |
|--------|-------|--------|
| heading | 528 | Elementor core |
| icon-box | 229 | Elementor core |
| spacer | 209 | Elementor core |
| text-editor | 194 | Elementor core |
| image | 97 | Elementor core |
| button | 82 | Elementor core |
| icon-list | 52 | Elementor core |
| divider | 47 | Elementor core |
| icon | 32 | Elementor core |
| call-to-action | 26 | Elementor Pro |
| animated-headline | 25 | Elementor Pro |
| social-icons | 20 | Elementor core |
| html | 19 | Elementor core |
| nav-menu | 13 | Elementor Pro |
| counter | 9 | Elementor core |
| video | 7 | Elementor core |
| google_maps | 4 | Elementor core |
| form | 6 | Elementor Pro / Forminator |
| wpr-magazine-grid | 4 | Royal Elementor Addons |
| wpr-advanced-slider | 3 | Royal Elementor Addons |
| ha-advanced-tabs | 2 | Happy Addons |
| eael-simple-menu | 2 | Essential Addons |
| eael-image-accordion | 2 | Essential Addons |
| testimonial-carousel | 2 | Elementor Pro |
| theme-post-title | 2 | Elementor Pro (Theme Builder) |
| theme-post-content | 1 | Elementor Pro (Theme Builder) |
| jkit_post_date | 1 | Jeg Elementor Kit |

### Layout structure

| Element type | Count |
|--------------|-------|
| widget | 1,674 |
| column | 1,299 |
| section | 724 |
| container | 103 |

Flexbox containers are in use (103) alongside legacy sections — mixed Elementor versions/patterns.

---

## Third-party Elementor dependencies

Active plugins with Elementor widgets (from DB `active_plugins`):

| Plugin | Impact |
|--------|--------|
| Elementor Pro | Theme builder, forms, CTA, animated headlines, nav menu |
| Essential Addons for Elementor | Menus, image accordion, content protection |
| Royal Elementor Addons | Magazine grid, advanced slider, data table |
| Jeg Elementor Kit | Post date widgets |
| Header Footer Elementor | Global header/footer |
| Connect Polylang Elementor | Multilingual template support |
| Elementor Widgets Megapack | Additional widgets |
| The Plus Addons for Elementor | Extended widgets |
| Envato Elements | Template kit imports |
| Happy Addons | Advanced tabs |

**None of these will be carried into the new site.** Widget functionality must be mapped to custom React components.

---

## Custom CSS in Elementor

Repeated custom CSS across header templates (sticky header behaviour):

- Sticky header background transition to white
- Logo resize on scroll (max-width 140px → height 70px)
- Nav link colour change on sticky (black → red `#ec0223` on hover)

Additional custom CSS post (`custom_css` post type) in export.

---

## Pop-ups

No dedicated Elementor popup templates identified in the `elementor_library` inventory. Floating button plugin is active (`floating-button`, `sticky-button`) — may render CTAs outside Elementor template system.

---

## Repeated visual patterns

1. **Sticky header** with logo shrink and colour change
2. **Hero sections** — image background or inline video variants
3. **Icon-box service grids** — 3–4 column layouts
4. **CTA bands** — red/white contrast sections
5. **Team/leadership grids** — image + name + role cards
6. **Contact with embedded Google Map**
7. **Testimonial carousels**
8. **Tabbed service detail** (solutions page anchors)
9. **Animated headlines** on hero sections
10. **Blog single template** — featured image + title + content layout

---

## Recommended reusable components

Based on actual template inventory and widget usage — components to build in Next.js:

| Component | Evidence | Priority |
|-----------|----------|----------|
| **Header** | `header-01`, sticky CSS, nav-menu widgets | P0 |
| **Footer** | `footer-onix`, `onix-footer`, social-icons | P0 |
| **Hero (image background)** | `hero-image-background` template | P0 |
| **Hero (inline video)** | `hero-inline-video` template | P1 |
| **Service card / icon-box grid** | 229 icon-box widgets, 5 service templates | P0 |
| **CTA band** | 3 CTA templates, 26 CTA widgets | P0 |
| **Leadership / team card** | 4 team-grid templates, 15 leadership pages | P1 |
| **Contact block with map** | 3 contact-with-map templates | P1 |
| **Article card** | Blog/news listing pages, wpr-magazine-grid | P0 |
| **Article layout (single)** | `onix-blog-template` | P0 |
| **Testimonial carousel** | `testimonial-slider` template | P2 |
| **Feature/benefit list** | `features-benefit-list` template | P1 |
| **Feature/benefit slider** | `features-benefit-slider` template | P2 |
| **Counter / stat block** | 9 counter widgets (data centre stats) | P1 |
| **Certification grid** | `/certification/` page (icon-box pattern) | P1 |
| **Infrastructure section** | `/infrastructure/` page patterns | P1 |
| **Tabbed content panel** | `tabs-01`, `ha-advanced-tabs` | P1 |
| **Animated headline** | 25 instances — evaluate if needed | P2 |
| **ROI Calculator** | `CFO ROI Calculator.html` custom code | P1 |
| **Download / brochure CTA** | PDF brochure links | P1 |
| **Country selector** | Ghana/Senegal nav menus | P1 |
| **Cookie/consent banner** | Complianz tables in DB | P1 |

---

## Migration approach (not implementation)

1. **Do not import Elementor JSON** into the new site
2. Use templates as **visual specification** — rebuild each as typed React components
3. Extract text content, images, and links from `_elementor_data` via parser script
4. Map global kit tokens to CSS variables / Tailwind config
5. Leadership pages → `Leadership` CMS collection with shared detail template
6. Service anchor sections → structured `Services` content or page blocks
