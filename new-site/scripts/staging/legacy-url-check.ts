#!/usr/bin/env tsx
/**
 * Legacy URL verification against staging.
 * npm run staging:legacy-urls
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { readCsv, writeCsv } from '../../src/migration/csv'
import { MIGRATION_CONFIG } from '../../src/migration/config'

const base = (process.env.STAGING_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
const user = process.env.STAGING_AUTH_USER
const pass = process.env.STAGING_AUTH_PASSWORD

function authHeaders(): HeadersInit {
  if (!user || !pass) return {}
  return { Authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}` }
}

async function check(pathname: string, action: string) {
  const url = `${base}${pathname}`
  const res = await fetch(url, { headers: authHeaders(), redirect: 'follow' })
  let classification = 'ERROR'
  if (res.status === 200) classification = action === 'preserve' ? '200_PRESERVED' : '200_OK'
  else if (res.status === 404 && action === 'exclude') classification = 'EXCLUDED_OK'
  else if (res.status === 404) classification = '404_ERROR'

  return {
    legacy_url: pathname,
    expected_action: action,
    http_status: res.status,
    redirect_to: res.status >= 300 && res.status < 400 ? res.headers.get('location') || '' : '',
    classification,
    notes: '',
  }
}

async function main() {
  const map = readCsv(MIGRATION_CONFIG.urlMapCsv)
  const batchSize = 20
  const rows: Awaited<ReturnType<typeof check>>[] = []
  const entries = map
    .map((entry) => {
      const p = entry.old_path || entry.old_url?.replace(/^https?:\/\/[^/]+/, '') || ''
      return { path: p.endsWith('/') ? p : `${p}/`, action: entry.action || 'preserve' }
    })
    .filter((e) => e.path)

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize)
    const results = await Promise.all(batch.map((e) => check(e.path, e.action)))
    rows.push(...results)
    process.stdout.write('.')
  }
  console.log()

  const out = path.join(MIGRATION_CONFIG.repoRoot, 'phase5/legacy-url-final-check.csv')
  fs.mkdirSync(path.dirname(out), { recursive: true })
  writeCsv(out, rows)
  const errors = rows.filter((r) => r.classification === '404_ERROR' || r.classification === 'ERROR')
  console.log(`Checked ${rows.length} legacy URLs — ${errors.length} errors`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
