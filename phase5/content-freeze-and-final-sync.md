# Content freeze and final sync strategy

The live WordPress site may receive content changes while staging is reviewed. Before production DNS cutover, differences must be reconciled.

## Recommended approach: differential sync

### Automated (preferred)

1. **Record sync timestamp** at staging approval (`T0`)
2. **Before launch**, export WordPress content modified after `T0`:
   - Query `wp_posts` where `post_modified > T0` and `post_status = 'publish'`
   - Or re-export full WordPress XML and diff by `wp:post_id` + `wp:post_modified`
3. **Run targeted import** on production Payload DB:
   ```bash
   npm run migrate:articles:resolve   # idempotent — updates changed articles
   npm run migrate:pages              # idempotent — updates changed pages
   npm run migrate:leadership         # if leadership changed
   ```
4. **Verify counts** with `npm run staging:reconcile`

Migration scripts are idempotent — re-running against production DB updates existing records by WordPress ID / legacy path.

### Media changes

If new images were uploaded to WordPress after `T0`:

1. Obtain updated `uploads.zip` or incremental upload folder
2. Extract to `.migration-work/uploads/`
3. Run `npm run migrate:media` (skips existing; imports new)

---

## Alternative: content freeze window

If automated differential sync is not feasible:

| Phase | Duration | Action |
|-------|----------|--------|
| Freeze announcement | T-7 days | Notify editors: no new articles/pages during freeze |
| Freeze start | T-0 | WordPress editing locked (editor role removed or maintenance plugin) |
| Final export | T+0 | Full WordPress XML + media export |
| Final import | T+1 | Run full `staging:migrate` on production DB |
| Launch | T+2 | DNS cutover |

**Downside:** Requires editorial coordination; not ideal for active news site.

---

## What to sync

| Content type | Sync method | Priority |
|--------------|-------------|----------|
| Articles | `migrate:articles:resolve` | Critical |
| Corporate pages | `migrate:pages` | Critical |
| Leadership | `migrate:leadership` | High |
| Redirects | `migrate:redirects` | High |
| Media | `migrate:media` | High |
| Data centres | Manual CMS or re-import | Medium |
| Categories | Usually stable | Low |

---

## Verification before launch

```bash
# On production DB (pre-DNS, via production URL in env)
npm run staging:reconcile
npm run staging:legacy-urls
```

Compare:
- Article count: WordPress published posts = Payload articles
- No new 404s on legacy URL check
- Spot-check any content modified during review period

---

## Post-launch ongoing sync

After launch, WordPress is decommissioned. All editing happens in Payload CMS. No further WordPress sync required.

If WordPress remains as archive read-only, do not sync back to Payload after launch.

---

## Timeline recommendation

| Day | Action |
|-----|--------|
| Staging approval | Record `T0` timestamp |
| Launch -2 days | Announce content freeze OR prepare differential export |
| Launch -1 day | Final sync + QA |
| Launch day | DNS cutover |
| Launch +7 days | Review analytics and 404s; address stragglers |
