#!/usr/bin/env tsx
/**
 * Authenticated staging crawl — generates phase5/staging-crawl.csv
 * npm run staging:crawl
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { writeCsv } from '../../src/migration/csv'
import { MIGRATION_CONFIG } from '../../src/migration/config'
import { readCsv } from '../../src/migration/csv'

const base = (process.env.STAGING_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
const user = process.env.STAGING_AUTH_USER
const pass = process.env.STAGING_AUTH_PASSWORD

function authHeaders(): HeadersInit {
  if (!user || !pass) return {}
  const token = Buffer.from(`${user}:${pass}`).toString('base64')
  return { Authorization: `Basic ${token}` }
}

async function fetchPath(urlPath: string) {
  const normalized = urlPath.endsWith('/') || urlPath.includes('.') ? urlPath : `${urlPath}/`
  const url = `${base}${normalized.startsWith('/') ? normalized : `/${normalized}`}`
  try {
    const res = await fetch(url, { headers: authHeaders(), redirect: 'follow' })
    const finalUrl = res.url.replace(base, '')
    const html = res.status === 200 ? await res.text() : ''
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || ''
    const h1 = html.match(/<h1[^>]*>([^<]*)<\/h1>/i)?.[1]?.trim() || ''
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] || ''
    const robots = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)?.[1] || ''
    const xRobots = res.headers.get('x-robots-tag') || ''
    const imgCount = (html.match(/<img /gi) || []).length
    const linkCount = (html.match(/<a /gi) || []).length
    return {
      url: urlPath,
      status: res.status,
      redirect: '',
      title,
      h1,
      canonical,
      robots: robots || xRobots,
      images: imgCount,
      internal_links: linkCount,
      notes: '',
    }
  } catch (e) {
    return { url: urlPath, status: 0, redirect: '', title: '', h1: '', canonical: '', robots: '', images: 0, internal_links: 0, notes: String(e) }
  }
}

async function main() {
  const payload = await getPayload({ config })
  const urls = new Set<string>(['/'])

  const scope = readCsv(MIGRATION_CONFIG.pageScopeCsv).filter((r) => r.recommendation === 'MIGRATE')
  for (const r of scope) urls.add(r.path)

  const articles = await payload.find({ collection: 'articles', where: { _status: { equals: 'published' } }, limit: 200 })
  for (const a of articles.docs) {
    if (a.legacy?.legacyPath) urls.add(a.legacy.legacyPath)
  }

  const leadership = await payload.find({ collection: 'leadership', where: { visible: { equals: true } }, limit: 50 })
  for (const p of leadership.docs) {
    if (p.legacy?.legacyPath) urls.add(p.legacy.legacyPath)
  }

  urls.add('/news/')
  urls.add('/contact-us/')
  urls.add('/home/cfo-roi/')
  urls.add('/fr/contactez-nous/')
  urls.add('/fr/')

  const rows = []
  for (const url of [...urls].sort()) {
    rows.push(await fetchPath(url))
    process.stdout.write('.')
  }
  console.log()

  const out = path.join(MIGRATION_CONFIG.repoRoot, 'phase5/staging-crawl.csv')
  fs.mkdirSync(path.dirname(out), { recursive: true })
  writeCsv(out, rows)
  const errors = rows.filter((r) => r.status !== 200)
  console.log(`Crawled ${rows.length} URLs — ${errors.length} errors`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
