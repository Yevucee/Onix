#!/usr/bin/env tsx
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { MIGRATION_CONFIG } from '../../src/migration/config'
import { writeCsv } from '../../src/migration/csv'
import { getMeta, getPages, loadWpItems } from '../../src/migration/wp-export'
import { importRequiredMedia, loadMediaMap } from '../../src/migration/import-media'
import { textToLexical } from '../../src/lib/lexical'

const LEADERSHIP_SLUGS: Array<{ slug: string; legacyPath: string; sort: number }> = [
  { slug: 'leonardmckinlay', legacyPath: '/o-home/leonardmckinlay/', sort: 1 },
  { slug: 'bretttucker', legacyPath: '/o-home/bretttucker/', sort: 2 },
  { slug: 'michaelthompson', legacyPath: '/o-home/michaelthompson/', sort: 3 },
  { slug: 'serwaakankam', legacyPath: '/o-home/serwaakankam/', sort: 4 },
  { slug: 'edemscott', legacyPath: '/o-home/edemscott/', sort: 5 },
  { slug: 'kevinopata', legacyPath: '/o-home/kevinopata/', sort: 6 },
  { slug: 'stephenappiah', legacyPath: '/o-home/stephenappiah/', sort: 7 },
  { slug: 'samuelpolley', legacyPath: '/o-home/samuelpolley/', sort: 8 },
  { slug: 'mamadoukebe', legacyPath: '/o-home/mamadoukebe/', sort: 9 },
  { slug: 'baraawafall', legacyPath: '/o-home/senegal/baraawafall/', sort: 10 },
  { slug: 'paulrichards', legacyPath: '/o-home/paulrichards/', sort: 11 },
  { slug: 'eric-tenkorang', legacyPath: '/home/eric-tenkorang/', sort: 12 },
  { slug: 'razak-awudulai1', legacyPath: '/o-home/razak-awudulai1/', sort: 13 },
  { slug: 'samuel-osew-kwatia', legacyPath: '/o-home/samuel-osew-kwatia/', sort: 14 },
  { slug: 'razak-awudulai', legacyPath: '/o-home/razak-awudulai/', sort: 15 },
]

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

async function main() {
  const payload = await getPayload({ config })
  await importRequiredMedia(payload)
  const mediaMap = loadMediaMap()
  const items = loadWpItems()
  const pages = getPages(items)
  const rows: Record<string, unknown>[] = []

  for (const entry of LEADERSHIP_SLUGS) {
    const page = pages.find((p) => p['wp:post_name'] === entry.slug)
    if (!page) {
      rows.push({ slug: entry.slug, status: 'missing_source', legacy_path: entry.legacyPath })
      continue
    }

    const title = String(page.title || entry.slug)
    const content = stripHtml(String(page['content:encoded'] || ''))
    const thumbId = Number(getMeta(page, '_thumbnail_id'))
    const photoId = thumbId ? (Number(mediaMap[String(thumbId)]?.payloadMediaId) || undefined) : undefined

    const existing = await payload.find({
      collection: 'leadership',
      where: { 'legacy.legacyPath': { equals: entry.legacyPath } },
      limit: 1,
    })

    const data = {
      name: title,
      title: getMeta(page, 'job_title') || 'Leadership',
      biography: textToLexical(content.slice(0, 5000)),
      photo: photoId,
      sortOrder: entry.sort,
      visible: true,
      legacy: { legacyPath: entry.legacyPath, wordpressId: Number(page['wp:post_id']) },
    }

    if (existing.docs[0]) {
      await payload.update({ collection: 'leadership', id: existing.docs[0].id, data })
      rows.push({ slug: entry.slug, status: 'updated', legacy_path: entry.legacyPath, photo: photoId ? 'yes' : 'missing' })
    } else {
      await payload.create({ collection: 'leadership', data })
      rows.push({ slug: entry.slug, status: 'imported', legacy_path: entry.legacyPath, photo: photoId ? 'yes' : 'missing' })
    }
  }

  writeCsv(path.join(MIGRATION_CONFIG.reportsDir, 'leadership-migration.csv'), rows)
  console.log(`Migrated ${rows.filter((r) => r.status === 'imported' || r.status === 'updated').length} leadership profiles`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
