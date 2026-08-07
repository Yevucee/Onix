# Proposed Payload CMS Model

Based on audit of existing WordPress/Elementor content at onixdatacentres.com.

---

## Collections

### Pages

**Purpose:** All static marketing pages (homepage, services, about, contact, legal, country pages)

| Field | Type | Notes |
|-------|------|-------|
| `title` | text | Required |
| `slug` | text | Unique, matches existing paths |
| `status` | select | draft / published |
| `layout` | blocks | Flexible content blocks (hero, services, CTA, etc.) |
| `locale` | select | `en`, `fr` — if multilingual confirmed |
| `seo` | group | See SEO group below |
| `publishedAt` | date | |
| `parent` | relationship → Pages | For hierarchical pages if needed |

**Evidence:** 46 live pages, all Elementor-built. Leadership pages may move to separate collection.

---

### Articles

**Purpose:** News/blog posts with date-based URLs

| Field | Type | Notes |
|-------|------|-------|
| `title` | text | Required |
| `slug` | text | Used in `/YYYY/MM/DD/{slug}/` URL |
| `publishedAt` | date | Drives URL date segments |
| `status` | select | draft / published |
| `author` | relationship → Users | |
| `featuredImage` | upload → Media | |
| `content` | richText | Headings, lists, links, images, video embeds |
| `excerpt` | textarea | |
| `categories` | relationship → Categories | many |
| `tags` | relationship → Tags | many — optional |
| `seo` | group | SEO fields |
| `locale` | select | `en`, `fr` |

**Evidence:** 90 posts, 85 live. Rich text editor required with video, captions, downloads, CTAs.

---

### Media

**Purpose:** Centralised asset management

| Field | Type | Notes |
|-------|------|-------|
| `alt` | text | Accessibility |
| `caption` | text | |
| `credit` | text | Optional |
| Standard upload fields | | filename, mimeType, filesize, width, height |

**Evidence:** 563 attachments in export. PDFs need download tracking.

---

### Leadership

**Purpose:** Team member profiles (currently 15 individual WordPress pages)

| Field | Type | Notes |
|-------|------|-------|
| `name` | text | |
| `slug` | text | Preserve existing paths e.g. `/samuel-osew-kwatia/` |
| `role` | text | Job title |
| `photo` | upload → Media | |
| `bio` | richText | |
| `email` | text | Optional |
| `linkedin` | text | Optional |
| `order` | number | Display order |
| `country` | select | Ghana / Senegal / Global |
| `status` | select | draft / published |
| `seo` | group | |

**Evidence:** `/baraawafall/`, `/bretttucker/`, etc. — 15 leadership pages, team-grid Elementor templates.

**Alternative:** Keep as Pages with a `pageType: leadership` field if collection feels premature.

---

### Data Centres

**Purpose:** Ghana and Senegal facility information

| Field | Type | Notes |
|-------|------|-------|
| `name` | text | e.g. "Ghana", "Senegal" |
| `slug` | text | `/senegal/` etc. |
| `country` | text | |
| `flag` | text | Emoji or icon |
| `description` | richText | |
| `specifications` | array | Power, tier, connectivity stats |
| `images` | upload → Media | many |
| `services` | relationship → Services | many |
| `seo` | group | |

**Evidence:** `/senegal/` page, Ghana-focused default content, country nav menus.

---

### Services (optional — could be page blocks)

**Purpose:** Structured service offerings currently as page sections with anchor links

| Field | Type | Notes |
|-------|------|-------|
| `title` | text | Colocation, Virtual Machines, etc. |
| `slug` | text | Anchor ID e.g. `tangor`, `peering` |
| `summary` | textarea | |
| `icon` | upload → Media | |
| `description` | richText | |
| `dataCentre` | relationship → Data Centres | |
| `order` | number | |

**Evidence:** Nav menu anchor links to `#tangor`, `#virtualmachines`, `#peering`, etc.

---

### Categories

| Field | Type | Notes |
|-------|------|-------|
| `name` | text | |
| `slug` | text | Preserve: africa, blog, data, news, technology |
| `description` | textarea | |
| `seo` | group | |

**Evidence:** 6 categories in export. Category archive pages exist in sitemap.

---

### Tags (optional)

| Field | Type | Notes |
|-------|------|-------|
| `name` | text | |
| `slug` | text | 13 tags in export |

Lower priority — tags appear lightly used.

---

### Users

| Field | Type | Notes |
|-------|------|-------|
| `name` | text | |
| `email` | email | |
| `role` | select | admin / editor / author |
| `bio` | textarea | Optional |
| `photo` | upload → Media | Optional |

**Evidence:** 3 authors in export. Author archive pages exist (3 URLs) — decide if public author pages needed.

---

### Redirects

| Field | Type | Notes |
|-------|------|-------|
| `from` | text | Old path |
| `to` | text | New path or URL |
| `type` | select | 301 / 302 |
| `notes` | textarea | |

**Evidence:** Redirection plugin + Pretty Links in DB. Legacy `/o-home/` paths.

---

### Forms (optional — or use external service)

| Field | Type | Notes |
|-------|------|-------|
| `name` | text | |
| `fields` | blocks | Form field definitions |
| `notificationEmail` | email | |
| `successMessage` | richText | |

**Evidence:** Forminator (2), FluentForm, CF7, Elementor forms. Consider Payload form builder vs external (e.g. Formspark, custom API route).

---

## Globals

### Site Settings

| Field | Type | Notes |
|-------|------|-------|
| `siteName` | text | "Onix Data Centre" |
| `tagline` | text | "Connecting Africa to the Globe" |
| `defaultOgImage` | upload → Media | |
| `contactEmail` | email | |
| `phone` | text | |
| `address` | richText | |
| `socialLinks` | array | Platform + URL |
| `analytics` | group | GA4 ID, GTM ID (env override) |
| `stagingMode` | checkbox | Enables noindex globally |

---

### Header Navigation

| Field | Type | Notes |
|-------|------|-------|
| `logo` | upload → Media | |
| `logoWhite` | upload → Media | For transparent header |
| `menuItems` | array | label, url, children[], country filter |
| `ctaButton` | group | label, url |
| `countrySelector` | array | Ghana, Senegal options |

**Evidence:** 6 menus, complex country/anchor structure.

---

### Footer

| Field | Type | Notes |
|-------|------|-------|
| `columns` | array | heading + links[] |
| `copyright` | text | |
| `socialLinks` | array | |
| `legalLinks` | array | Privacy, Cookie policy |

---

### SEO Defaults

| Field | Type | Notes |
|-------|------|-------|
| `titleTemplate` | text | `%s – Onix Data Centre` |
| `defaultDescription` | textarea | |
| `defaultOgImage` | upload → Media | |
| `robotsTxt` | textarea | Generated + override |
| `structuredData` | json | Organization schema |

---

## Blocks (for Pages layout field)

Reusable content blocks matching Elementor sections:

| Block | Maps from |
|-------|-----------|
| `heroImage` | hero-image-background |
| `heroVideo` | hero-inline-video |
| `serviceGrid` | services templates |
| `iconBoxGrid` | icon-box widgets |
| `ctaBand` | call-to-action templates |
| `teamGrid` | team-grid templates |
| `contactMap` | contact-with-map |
| `testimonialSlider` | testimonial-slider |
| `featureList` | features-benefit-list |
| `counterStats` | counter widgets |
| `tabbedContent` | tabs-01 |
| `richText` | text-editor |
| `imageText` | about-image-heading-copy |
| `videoText` | about-video-heading-copy |
| `roiCalculator` | CFO ROI Calculator |
| `downloadCta` | PDF brochure links |

---

## Access control

| Role | Permissions |
|------|-------------|
| Admin | Full access |
| Editor | Pages, Articles, Media, Leadership |
| Author | Own articles only, draft/publish |

---

## Localisation decision required

If French content is in scope:

- Add `locale` field to Pages, Articles
- URL prefix `/fr/` preserved
- Payload localization plugin or manual locale field
- Polylang data in DB for reference

If English only: hide/archive FR content, redirect `/fr/*` as needed.

---

## Not recommended

- Page builder with unrestricted layout (per requirements)
- Importing Elementor JSON
- WordPress-style revisions (Payload has built-in versions)
- Separate collections for every Elementor template (use blocks instead)
