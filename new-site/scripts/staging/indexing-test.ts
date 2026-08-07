#!/usr/bin/env tsx
/**
 * Staging indexing protection test — records headers without credentials.
 * npm run staging:indexing-test
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { MIGRATION_CONFIG } from '../../src/migration/config'

const base = (process.env.STAGING_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const user = process.env.STAGING_AUTH_USER
const pass = process.env.STAGING_AUTH_PASSWORD

async function fetchWithAuth(pathname: string, withAuth: boolean) {
  const headers: HeadersInit = {}
  if (withAuth && user && pass) {
    headers.Authorization = `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`
  }
  const res = await fetch(`${base}${pathname}`, { headers, redirect: 'follow' })
  return {
    path: pathname,
    status: res.status,
    xRobotsTag: res.headers.get('x-robots-tag') || '(none)',
    contentType: res.headers.get('content-type') || '',
  }
}

async function main() {
  const unauth = await fetchWithAuth('/', false)
  const auth = user && pass ? await fetchWithAuth('/', true) : null
  const robots = await fetch(`${base}/robots.txt`)
  const robotsBody = robots.ok ? await robots.text() : ''

  const lines = [
    '# Staging indexing protection test',
    '',
    `**Base URL:** ${base}`,
    `**Tested:** ${new Date().toISOString()}`,
    '',
    '## Unauthenticated request (GET /)',
    '',
    `| Check | Result |`,
    `|-------|--------|`,
    `| HTTP status | ${unauth.status} ${unauth.status === 401 ? '✓ blocked' : unauth.status === 200 ? '✗ content exposed' : ''} |`,
    `| X-Robots-Tag | ${unauth.xRobotsTag} |`,
    '',
  ]

  if (auth) {
    lines.push(
      '## Authenticated request (GET /)',
      '',
      `| HTTP status | ${auth.status} |`,
      `| X-Robots-Tag | ${auth.xRobotsTag} |`,
      '',
    )
  } else {
    lines.push('## Authenticated request', '', 'STAGING_AUTH_USER/PASSWORD not set — skipped', '')
  }

  lines.push(
    '## robots.txt',
    '',
    '```',
    robotsBody.trim(),
    '```',
    '',
    '## Expected (SITE_ENV=staging)',
    '',
    '- [ ] Unauthenticated requests return 401 when auth configured',
    '- [ ] X-Robots-Tag: noindex, nofollow, noarchive',
    '- [ ] robots.txt Disallow: /',
    '- [ ] No GA4 script in page source',
    '- [ ] Canonical URLs point to production domain (not staging) where set',
  )

  const out = path.join(MIGRATION_CONFIG.repoRoot, 'phase5/staging-indexing-test.md')
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, lines.join('\n'))
  console.log(`Wrote ${out}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
