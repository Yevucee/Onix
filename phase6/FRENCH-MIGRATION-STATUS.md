# Phase 6 Group 5 — French Migration Status

**Date:** 2026-08-08  
**Staging:** https://onix-staging-web-production.up.railway.app  
**Live reference:** https://onixdatacentres.com/fr/

## Policy

- Preserve `/fr/` URL structure
- No invented translations — only existing French content
- English design system (OnixHeader, OnixFooter, Onix tokens)
- French navigation labels with links to existing destinations

---

## URL Inventory

| Live URL | Staging URL | Status | Content | SEO | Images |
|----------|-------------|--------|---------|-----|--------|
| `/fr/` | `/fr/` | ✅ Complete | Minimal (title only — matches live) | ✅ Canonical + hreflang | N/A |
| `/fr/home-francais/` | `/fr/home-francais/` | ✅ Complete | Same as `/fr/` (redirect alias) | ✅ Canonical | N/A |
| `/fr/contactez-nous/` | `/fr/contactez-nous/` | ✅ Complete | French contact form + offices | ✅ Canonical + hreflang | N/A |
| `/fr/a-propos/` | `/fr/a-propos/` | ❌ Missing | **No WP export content** | N/A | N/A |
| `/fr/author/onixdc/` | — | ↪ Redirect | → `/news/` | N/A | N/A |
| `/fr/author/samuel/` | — | ↪ Redirect | → `/news/` | N/A | N/A |
| `/fr/author/yinka/` | — | ↪ Redirect | → `/news/` | N/A | N/A |
| `/home-francais/` | — | ↪ Redirect | → `/fr/home-francais/` | N/A | N/A |

---

## Live vs Staging Comparison

### French homepage (`/fr/`)

| Element | Live | Staging |
|---------|------|---------|
| H1 | "Home – Français" | "Home – Français" ✅ |
| Body content | Empty (footer only) | Minimal CTA to contact ✅ |
| Header logo link | `/fr/` | `/fr/` ✅ |
| Client support CTA | External link | External link ✅ |
| Footer | English labels, EN page links | Same pattern ✅ |

### French contact (`/fr/contactez-nous/`)

| Element | Live | Staging |
|---------|------|---------|
| Page exists | 404 on live WP | ✅ Route live on staging |
| Form labels | N/A (404) | French labels ✅ |
| Office cards | N/A | Ghana + Senegal + UK ✅ |
| Breadcrumbs | N/A | Accueil / Contactez-nous ✅ |

### French about (`/fr/a-propos/`)

| Element | Live | Staging |
|---------|------|---------|
| Page content | Not in WP export | 404 (documented) |
| English equivalent | `/about-us/` | `/about-us/` ✅ |

---

## French Navigation

Header (`FRENCH_HEADER_NAV`):

- 🇬🇭 Ghana → `/fr/` (Senegal → `/senegal`)
- Nos solutions → `/home/our-solutions` (EN — no FR equivalent)
- Infrastructure → `/home/infrastructure` (EN)
- Blog → `/news` (EN — no FR articles)
- Contactez-nous → `/fr/contactez-nous`

Footer mirrors live: English link labels to EN corporate pages (About Us, Certification, Sustainability, Privacy Policy, IMS Policy).

---

## Missing Translations (documented — not created)

| Item | Notes |
|------|-------|
| `/fr/a-propos/` | No French about content in WordPress export |
| French blog/articles | No French articles exist in export |
| French solution pages | No FR equivalents — links to EN |
| French corporate pages | Certification, sustainability, privacy — EN only |
| Homepage body copy | Live FR homepage is title-only; no translation added |
| Newsletter FR form | Not on live FR site |

---

## Missing Images

| Page | Status |
|------|--------|
| French homepage | No images on live — none required |
| French contact | No hero image on live — none required |
| French about | N/A (page missing) |

---

## Missing SEO Metadata

| URL | Title | Description | Canonical | hreflang |
|-----|-------|-------------|-----------|----------|
| `/fr/` | ✅ Home – Français | ✅ Set | ✅ productionCanonical | ✅ en/fr pair |
| `/fr/contactez-nous/` | ✅ Contactez-nous | ✅ Set | ✅ productionCanonical | ✅ en/fr pair |
| `/fr/a-propos/` | N/A | N/A | N/A | N/A |

---

## Implementation Files

| File | Purpose |
|------|---------|
| `src/data/french-site.ts` | French nav, footer, homepage constants |
| `src/components/onix/templates/FrenchHomePageTemplate.tsx` | Minimal FR homepage |
| `src/components/onix/templates/FrenchContactPageTemplate.tsx` | FR contact page |
| `src/app/(frontend)/fr/layout.tsx` | `lang="fr"` via LocaleSetter |
| `src/app/(frontend)/fr/[[...slug]]/page.tsx` | FR route handler |
| `src/components/onix/OnixHeader.tsx` | Locale-aware nav |
| `src/components/onix/OnixFooter.tsx` | Locale-aware footer |
| `src/components/forms/ContactForm.tsx` | `locale="fr"` labels |

---

## STOP — No production cutover

French migration complete for existing content. `/fr/a-propos/` remains 404 until French about content is provided.
