# Live Homepage Structure — onixdatacentres.com

**URL:** https://onixdatacentres.com/  
**Audit date:** 2026-08-08

---

## SECTION 1 — HERO

- **background/image/video:** Full-width background image (`light-out-hero-wordpress.jpg`, July 2026). Dark gradient overlay.
- **heading:** Welcome to Onix Data Centres
- **body:** Onix is the leading provider of Tier IV Colocation data centre services in Ghana. Our state-of-the-art facility is designed to meet the growing demands of businesses in Ghana and the region. Our carrier-neutral data centre ensures freedom of choice and maximum flexibility for our clients.
- **CTA:** About Us → `/o-home/about-us/`
- **alignment:** Left-aligned text over full-width background
- **height:** ~500–600px desktop, shorter on mobile
- **mobile differences:** Stacked layout, text remains left-aligned, background crops to centre

---

## SECTION 2 — SERVICE SHOWCASE GRID

- **section purpose:** Quick-access cards for all major services
- **background:** White
- **images/video:** None per card (text-only cards with hover state)
- **headings:** Card titles (9 items)
- **body copy:** Short description per service
- **CTA:** "Learn More" link per card
- **layout:** 3-column grid desktop, 2-column tablet, 1-column mobile
- **cards/grid:** 9 cards:
  1. Virtual Machines
  2. Managed Services
  3. Cyber Security
  4. Internet Exchange
  5. Colocation
  6. Cloud and Content
  7. Secure Power Supply
  8. Sustainable Operations
  9. Advanced Security Measures
- **desktop behaviour:** Grid with hover border/shadow
- **mobile behaviour:** Single column stack

---

## SECTION 3 — WHO WE ARE

- **section purpose:** Company introduction with facility credentials
- **background:** Light grey (`#f5f5f5`)
- **images/video:** Image collage (`Images-collage-3.png`) right side
- **headings:** Who we are
- **body copy:** Two paragraphs about Tier IV Accra facility, carrier neutrality, redundancy systems
- **CTA:** None
- **layout:** 2-column split (text left, image right)
- **cards/grid:** 3 statistics below the split:
  - 99.995% — Uptime Guaranteed
  - 15+ — Network Carriers
  - 0.88 — PUE Renewable
- **desktop behaviour:** Side-by-side text/image, stats in 3-column row
- **mobile behaviour:** Image below text, stats stack vertically

---

## SECTION 4 — OUR SOLUTIONS

- **section purpose:** Highlight top 3 solution offerings
- **background:** White
- **images/video:** None
- **headings:** Our Solutions
- **body copy:** We provide a range of options to suit your colocation requirements.
- **CTA:** Learn More per card
- **layout:** 3-column card grid
- **cards/grid:**
  1. Colocation
  2. Cybersecurity
  3. Virtual Machines
- **desktop behaviour:** 3 equal cards with hover
- **mobile behaviour:** Single column

---

## SECTION 5 — INFRASTRUCTURE

- **section purpose:** Highlight infrastructure capabilities
- **background:** Light grey
- **images/video:** None
- **headings:** Infrastucture (live site typo — preserved)
- **body copy:** We provide a range of options to suit your colocation requirements.
- **CTA:** Learn More per card
- **layout:** 3-column card grid
- **cards/grid:**
  1. Secure Power Supply
  2. Sustainable Operations
  3. Advanced Security Measures
- **desktop behaviour:** Same as Section 4
- **mobile behaviour:** Single column

---

## SECTION 6 — NEWS / ARTICLES

- **section purpose:** Latest blog posts / thought leadership
- **background:** White
- **images/video:** Featured image per article card
- **headings:** Article titles (no section heading on live — cards only)
- **body copy:** None (title + image only)
- **CTA:** Implicit (card links to article)
- **layout:** Horizontal scroll or 4-column grid
- **cards/grid:** Recent articles including:
  - The Lights Go Out. Does Your Business?
  - When Financial Data Comes Home: What Nigeria's New Direction Means for Ghana
  - The AI Boom Needs More Than Bigger Data Centres
  - Where Should Ghana's Health Data Live?
  - Your Server Room Is Not a Data Centre
- **desktop behaviour:** Grid/row of article cards with images
- **mobile behaviour:** Horizontal scroll or stacked cards

---

## SECTION 7 — CONTACT CTA

- **section purpose:** Pre-footer call to action
- **background:** Dark navy (`#1c244b`)
- **images/video:** None
- **headings:** Get in touch with us today
- **body copy:** Connecting Africa to the Globe
- **CTA:** Contact button → `/home/contact-us/`
- **layout:** Centred text
- **desktop behaviour:** Full-width dark band
- **mobile behaviour:** Same, reduced padding

---

## SECTION 8 — FOOTER

See `live-navigation-audit.md` — footer is a global component, NOT page body content.

**Critical:** The live homepage Elementor template includes footer widget content (Navigate, Get in touch headings) embedded in the page HTML. This was incorrectly imported into Payload page blocks and rendered as body text on staging. The reconstruction layer must render footer via the dedicated Footer component only.
