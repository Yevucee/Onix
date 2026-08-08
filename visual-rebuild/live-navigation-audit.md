# Live Navigation Audit — onixdatacentres.com

**Audit date:** 2026-08-08  
**Method:** Read-only HTML crawl of https://onixdatacentres.com (production)  
**Authoritative source:** Live rendered site (not WordPress XML export or staging)

---

## HEADER

### Logo
- **Image:** `https://onixdatacentres.com/wp-content/uploads/2021/10/ONIX-logo-png-300x196.png`
- **Alt:** Onix Data Centres
- **Link:** `/` (homepage)
- **Staging asset:** `/images/onix-logo.png`

### Top-level menu items (desktop, left-to-right order)

| # | Label | URL | Dropdown |
|---|-------|-----|----------|
| 1 | 🇬🇭 Ghana | `/` | Yes (single child: 🇬🇭 Ghana → `/`) |
| 2 | 🇸🇳 Senegal | `/o-home/senegal/` | No |
| 3 | Our Solutions | `/home/our-solutions/` | Yes (9 children) |
| 4 | Infrastructure | `/home/infrastructure/` | No |
| 5 | Blog | `/blog/` | No |
| 6 | Contact Us | `/home/contact-us/` | No |

### Our Solutions dropdown children

| Label | URL |
|-------|-----|
| Colocation | `/o-home/o-ghana/our-solutions/#tangor` |
| Virtual machines | `/o-home/o-ghana/our-solutions/#virtualmachines` |
| Managed Services | `/o-home/o-ghana/our-solutions/#managedservices` |
| Cyber Security | `/o-home/o-ghana/our-solutions/#cybersecurity` |
| Internet Exchange | `/o-home/o-ghana/our-solutions/#internetexchange` |
| Carrier Neutrality | `/o-home/o-ghana/our-solutions/#carriern` |
| Cloud and Connect | `/o-home/o-ghana/our-solutions/#candc` |
| Peering | `/o-home/o-ghana/our-solutions/#peering` |
| Finance | `/home/finance/` |

### CTA button
- **Label:** Contact Us
- **URL:** `/home/contact-us/`
- **Position:** Right side of header (desktop)

### Language / region switch
- **Type:** Country flag dropdown in header
- **Options:** 🇬🇭 Ghana (homepage), 🇸🇳 Senegal (`/o-home/senegal/`)
- **French site:** `/fr/home-francais/` exists but is not in the main header switcher on English homepage

### External links
- None in primary header navigation

### Sticky behaviour
- Header is sticky/fixed at top on scroll (Astra theme + Elementor header template)

### Desktop behaviour
- Horizontal nav with hover dropdowns for Ghana and Our Solutions
- SmartMenus jQuery plugin handles dropdown interaction
- Logo left, nav centre-right, CTA button far right

---

## MOBILE

### Menu trigger
- Hamburger "Menu" button (visible below desktop breakpoint)

### Menu items
- Same order as desktop: Ghana, Senegal, Our Solutions, Infrastructure, Blog, Contact Us

### Submenu behaviour
- Accordion/expandable submenus for Ghana and Our Solutions
- Full-screen or slide-in panel overlay

### CTA
- Contact Us button present in mobile menu

### Language behaviour
- Ghana/Senegal items accessible in mobile menu with same URLs

---

## FOOTER

### Structure
Two-column layout below a full-width CTA band.

### CTA band (top of footer)
- **Heading:** Get in touch with us today
- **Tagline:** Connecting Africa to the Globe

### Column 1 — Logo + Social
- White Onix logo (`Onix_white_logo.png`)
- **Social links:**
  - Twitter: https://twitter.com/ONIXDCdata
  - LinkedIn: https://www.linkedin.com/company/onixdc

### Column 2 — Navigate
| Link | URL |
|------|-----|
| About Us | `/o-home/about-us/` |
| Certification | `/o-home/certification/` |
| Sustainability | `/o-home/sustainability/` (live links to `/o-ghana/sustainability/`) |
| Privacy Policy | `/o-home/privacy-policy/` |
| IMS Policy | PDF: `/wp-content/uploads/2025/05/IMS-SIMPLIFIED-12-May-2025.pdf` |

### Column 3 — Get in touch
| Item | Value |
|------|-------|
| Email | info@onixdatacentres.com |
| Phone (Ghana) | +233 50 086 5266 |
| Phone (Senegal) | +221 77 668 41 10 |

### Legal
- © 2026 All Rights Reserved.

### Badges / certifications
- None visible in footer (certification is a nav link, not a badge image)

### Newsletter
- **Not present** on live footer (staging incorrectly showed newsletter form)
