# Rollback plan

Production launch must be reversible. WordPress remains available until the new site is confirmed stable.

## Principles

1. **Do not disable WordPress** during initial launch window (minimum 2 weeks recommended)
2. **DNS rollback** is the fastest recovery path
3. **Database rollback** only needed if production Payload data was written post-launch
4. **Media** on new stack is additive; WordPress media unchanged

---

## Pre-launch preparation

| Item | Action |
|------|--------|
| WordPress hosting | Keep active; note direct IP or `old.onixdatacentres.com` access |
| WordPress backup | Fresh backup immediately before DNS change |
| DNS documentation | Record all current records with TTL values |
| New stack backup | DB dump + media archive before cutover |
| Rollback decision makers | Name contacts and criteria (below) |

---

## Rollback procedure

### Step 1: Decision (target: within 30 minutes of incident)

**Triggers:**
- Sustained 5xx errors on critical pages
- Contact form completely broken
- > 10% of top legacy URLs returning 404
- Security incident on new stack
- Business decision to abort launch

### Step 2: DNS rollback (target: 5–15 minutes + propagation)

1. Restore previous DNS A/AAAA records pointing to WordPress server
2. Verify propagation: `dig onixdatacentres.com`
3. Confirm WordPress site loads at production URL
4. Post status update if public impact

**Propagation:** With TTL=300, most users revert within 5–30 minutes. Some resolvers may cache up to previous TTL (up to 24h if TTL was not lowered).

### Step 3: New stack handling

| Component | Action |
|-----------|--------|
| New app server | Stop or leave running (no DNS traffic) |
| New PostgreSQL | Preserve for investigation; do not delete |
| New media | Preserve |
| Payload admin | Disable public access if server remains up |

### Step 4: Post-rollback

1. Document incident and root cause
2. Fix issues on staging
3. Re-run full QA suite
4. Schedule new launch window

---

## Partial rollback options

| Scenario | Action |
|----------|--------|
| Single page broken | Hotfix on new stack; no DNS rollback |
| Forms broken | Enable maintenance page + fix; or DNS rollback if prolonged |
| Redirect errors | Fix redirect rules in `data/redirects.json`; redeploy |
| Analytics only broken | Fix env vars; no DNS rollback |

---

## Database considerations

- **Pre-launch:** Production Payload DB is empty or staging copy — no user data loss on rollback
- **Post-launch:** If contact form submissions or CMS edits exist on new stack, export before rollback:
  - Contact submissions from logs/DB
  - CMS changes since launch (re-import to WordPress manually if needed)

---

## Media considerations

- New stack media is a copy of WordPress uploads
- Rollback does not affect WordPress media library
- Any new uploads post-launch on Payload only exist on new stack — export if needed

---

## Communication template

> We have temporarily reverted DNS to the previous website while we resolve [issue]. The site at onixdatacentres.com is serving the established WordPress site. We expect [timeline] before re-attempting the migration launch.

---

## Testing rollback (recommended)

Before launch, perform a dry run:

1. Point a test hostname to new stack
2. Practice DNS switch on test hostname
3. Practice restore to WordPress
4. Document actual propagation time observed

---

## WordPress decommission (post-stability)

Only after **minimum 30 days** stable operation:

1. Final WordPress backup archived
2. Business sign-off
3. Reduce WordPress hosting (do not delete immediately)
4. Archive WordPress files offline

**Do not decommission WordPress during Phase 5 or initial launch window.**
