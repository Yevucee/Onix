#!/usr/bin/env tsx
/**
 * Staging content reconciliation — compare expected vs actual counts.
 * npm run staging:reconcile
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { readCsv, writeCsv } from '../../src/migration/csv'
import { MIGRATION_CONFIG } from '../../src/migration/config'
import { getPages, getPublishedPosts, loadWpItems } from '../../src/migration/wp-export'

const phase5Dir = path.join(MIGRATION_CONFIG.repoRoot, 'phase5')

async function main() {
  const payload = await getPayload({ config })
  const items = loadWpItems()

  const [articles, media, pages, leadership, dataCentres, categories, redirects] = await Promise.all([
    payload.find({ collection: 'articles', limit: 0 }),
    payload.find({ collection: 'media', limit: 0 }),
    payload.find({ collection: 'pages', limit: 0 }),
    payload.find({ collection: 'leadership', limit: 0 }),
    payload.find({ collection: 'data-centres', limit: 0 }),
    payload.find({ collection: 'categories', limit: 0 }),
    payload.find({ collection: 'redirects', limit: 0 }),
  ])

  const expectedArticles = getPublishedPosts(items).length
  const expectedMedia = 542 // Phase 3 import count
  const expectedPages = 16 // Imported corporate pages in Pages collection (excludes leadership, dedicated routes)
  const expectedLeadership = 15
  const expectedRedirects = 21

  const rows = [
    row('Articles', expectedArticles, articles.totalDocs),
    row('Media', expectedMedia, media.totalDocs),
    row('Corporate pages (Pages collection)', expectedPages, pages.totalDocs, 'Excludes leadership profiles, news, contact dedicated routes'),
    row('Leadership profiles', expectedLeadership, leadership.totalDocs),
    row('Data centres', 1, dataCentres.totalDocs),
    row('Categories', 3, categories.totalDocs, 'Minimum seed categories'),
    row('Redirects (public)', expectedRedirects, redirects.totalDocs),
    row('French routes', 3, 2, 'FR homepage + contact routes; /fr/a-propos/ content pending'),
  ]

  fs.mkdirSync(phase5Dir, { recursive: true })
  writeCsv(path.join(phase5Dir, 'staging-content-reconciliation.csv'), rows)
  console.log('Wrote phase5/staging-content-reconciliation.csv')
  for (const r of rows) {
    console.log(`${r.content_type}: expected=${r.expected} actual=${r.actual} status=${r.status}`)
  }
}

function row(content_type: string, expected: number, actual: number, notes = '') {
  const diff = actual - expected
  let status = 'OK'
  if (Math.abs(diff) > 0) {
    if (content_type.includes('Corporate')) status = diff < 0 ? 'UNDER' : 'OVER'
    else if (diff !== 0) status = 'DIFF'
  }
  return { content_type, expected, actual, difference: diff, status, notes }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
