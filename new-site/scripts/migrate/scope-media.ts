#!/usr/bin/env tsx
/**
 * Determine which master media assets are required for production migration.
 * npm run migrate:scope-media
 */
import path from 'path'
import { MIGRATION_CONFIG } from '../../src/migration/config'
import { readCsv, writeCsv } from '../../src/migration/csv'
import {
  buildArchiveIndex,
  getMasterKey,
  groupFilesByMaster,
  isDerivativeFilename,
  resolveArchivePath,
  selectMasterFile,
} from '../../src/migration/media-utils'
import {
  buildAttachmentIndex,
  extractUploadPathsFromHtml,
  getAttachmentFile,
  getMeta,
  getPages,
  getPublishedPosts,
  loadWpItems,
} from '../../src/migration/wp-export'
import { readFileSync } from 'fs'

function loadMigratePaths(): Set<string> {
  const rows = readCsv(MIGRATION_CONFIG.pageScopeCsv)
  return new Set(rows.filter((r) => r.recommendation === 'MIGRATE').map((r) => r.path))
}

function main() {
  const items = loadWpItems()
  const archive = buildArchiveIndex()
  const { byId } = buildAttachmentIndex(items)
  const migratePaths = loadMigratePaths()
  const requiredPaths = new Set<string>()

  const leadershipSlugs = new Set([
    'leonardmckinlay', 'bretttucker', 'michaelthompson', 'serwaakankam', 'edemscott',
    'kevinopata', 'stephenappiah', 'samuelpolley', 'mamadoukebe', 'baraawafall',
    'paulrichards', 'eric-tenkorang', 'razak-awudulai1', 'samuel-osew-kwatia', 'razak-awudulai',
  ])

  function markAttachment(id: number, reason: string, bucket: Map<number, string>) {
    if (id) bucket.set(id, reason)
  }

  const reasons = new Map<number, string>()

  for (const post of getPublishedPosts(items)) {
    markAttachment(Number(getMeta(post, '_thumbnail_id')), 'article_featured_image', reasons)
    for (const p of extractUploadPathsFromHtml(String(post['content:encoded'] || ''))) {
      for (const [aid, att] of byId) {
        if (getAttachmentFile(att) === p) markAttachment(aid, 'article_inline', reasons)
      }
    }
  }

  for (const page of getPages(items)) {
    const slug = String(page['wp:post_name'] || '')
    const link = getLegacyPostPath(page)
    if (!migratePaths.has(link) && !leadershipSlugs.has(slug) && !link.startsWith('/fr/')) continue
    markAttachment(Number(getMeta(page, '_thumbnail_id')), 'page_featured_image', reasons)
    for (const p of extractUploadPathsFromHtml(String(page['content:encoded'] || ''))) {
      for (const [aid, att] of byId) {
        if (getAttachmentFile(att) === p) markAttachment(aid, 'page_inline', reasons)
      }
    }
    if (leadershipSlugs.has(slug)) {
      const id = Number(page['wp:post_id'])
      markAttachment(id, 'leadership_page', reasons)
    }
  }

  const seo = JSON.parse(readFileSync(MIGRATION_CONFIG.seoMetadataJson, 'utf-8')) as {
    live_crawl_supplement?: Array<{ path?: string; og_image?: string }>
  }
  for (const entry of seo.live_crawl_supplement || []) {
    if (!entry.path) continue
    const html = entry.og_image || ''
    for (const p of extractUploadPathsFromHtml(html)) {
      for (const [aid, att] of byId) {
        if (getAttachmentFile(att) === p) markAttachment(aid, 'seo_social_image', reasons)
      }
    }
  }

  const contentFiles = archive.allFiles.filter((f) => /^\d{4}\//.test(f))
  const groups = groupFilesByMaster(contentFiles)
  const masterRows: Record<string, unknown>[] = []

  for (const [groupKey, files] of groups) {
    const sel = selectMasterFile(files)
    const masterRel = sel.master
    if (!masterRel) continue
    const full = resolveArchivePath(masterRel, archive)
    const matchingAtt = [...byId.values()].find((a) => {
      const p = getAttachmentFile(a)
      return p === masterRel || getMasterKey(path.basename(p)) === getMasterKey(path.basename(masterRel))
    })
    const attId = matchingAtt ? Number(matchingAtt['wp:post_id']) : 0
    const reason = reasons.get(attId)

    let status = 'ORPHANED'
    if (reason) status = 'REQUIRED'
    else if (matchingAtt) status = 'POSSIBLY_REQUIRED'
    else if (files.some((f) => f.includes('elementor') || f.includes('forminator'))) status = 'EXCLUDED_CONTENT_ONLY'

    masterRows.push({
      master_relative_path: masterRel,
      wordpress_attachment_id: attId || '',
      filename: path.basename(masterRel),
      derivative_count: sel.derivatives.length,
      referenced_reason: reason || '',
      status,
      file_exists: full ? 'yes' : 'no',
      notes: sel.notes,
    })
  }

  writeCsv(path.join(MIGRATION_CONFIG.reportsDir, 'media-production-scope.csv'), masterRows)
  const summary: Record<string, number> = {}
  for (const row of masterRows) {
    const key = String(row.status)
    summary[key] = (summary[key] || 0) + 1
  }
  console.log(`Wrote ${masterRows.length} master assets. Summary:`, summary)
}

function getLegacyPostPath(item: Record<string, unknown>): string {
  const slug = String(item['wp:post_name'] || '')
  return `/${slug}/`
}

main()
