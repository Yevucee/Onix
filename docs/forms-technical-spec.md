# Forms technical specification (Phase 2)

Production forms are **not** rebuilt in Phase 2. This document captures requirements from Phase 1 analysis and sanitised `migration/extracted/form-config-summary.json` for Phase 3 implementation.

## Summary

| Form | Location | Plugin | Status |
|------|----------|--------|--------|
| Contact Us | `/contact-us/` | Fluent Forms | Spec only |
| Contact Us (FR) | `/fr/contactez-nous/` | Fluent Forms | Spec only |
| Newsletter | Footer (site-wide) | Fluent Forms | Spec only |
| Newsletter (FR) | Footer FR | Fluent Forms | Spec only |
| ROI Calculator | `/cfo-roi-calculator/` | Custom HTML/JS | Spec only |

**Do not migrate** historical form submissions (PII).

---

## 1. Contact Us (`form_id: 1`)

**Pages:** `/contact-us/`, linked from header/footer.

**Fields (from Fluent Forms config):**
- First name (required)
- Last name (required)
- Company (required)
- Email (required, validated)
- Phone (optional)
- Message (textarea, required)

**Validation:** HTML5 + Fluent Forms server rules.

**Behaviour:**
- Email notification to configured recipients (extract from production when deploying — not stored in repo).
- Success message inline; no redirect documented in export.

**Integrations:** None in exported config (no CRM webhook in JSON).

**Spam protection:** Not documented in export — verify reCAPTCHA/honeypot on live site in Phase 3.

**Storage:** Fluent Forms stored submissions in WordPress DB — **do not import** into Payload.

**Phase 3 recommendation:** Payload form collection or API route + email (SMTP/transactional provider); optional Fluent Forms parity testing.

---

## 2. Contact Us French (`form_id: 2`)

Same field structure as form 1 with French labels. Linked from `/fr/contactez-nous/`.

---

## 3. Newsletter (`form_id: 3`)

**Location:** Footer widget (EN).

**Fields:** Email (required).

**Behaviour:** Subscription — integration target unknown from export (likely email marketing). Confirm provider in Phase 3.

---

## 4. Newsletter French (`form_id: 4`)

French-labelled newsletter; footer on FR pages.

---

## 5. CFO ROI Calculator

**Location:** `/cfo-roi-calculator/`

**Source:** `migration/source/custom-code/CFO ROI Calculator.html` — standalone widget with:
- Sliders/inputs for cost assumptions
- Client-side calculation
- No server submission in static export

**Phase 3:** Port as React component or isolated client bundle; no Payload form storage unless lead capture is added deliberately.

---

## Analytics events (planned, not implemented)

When forms ship, track: `contact_submit`, `newsletter_signup`, `roi_calculator_interaction` — **disabled on staging** (`SITE_ENV=staging`).

---

## Security notes

- Rate limiting on public POST endpoints
- Honeypot or CAPTCHA on contact form
- Never log full PII in application logs
- Staging forms should not notify production inboxes
