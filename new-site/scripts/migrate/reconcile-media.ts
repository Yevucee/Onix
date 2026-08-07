#!/usr/bin/env tsx
/**
 * Reconcile WordPress attachments against extracted uploads archive.
 * npm run migrate:reconcile-media
 */
import fs from 'fs'
import path from 'path'
import { MIGRATION_CONFIG } from '../../src/migration/config'
import { writeCsv } from '../../src/migration/csv'
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
  getAttachments,
  getMeta,
  getPages,
  getPublishedPosts,
  loadWpItems,
} from '../../src/migration/wp-export'

function main() {
  const items = loadWpItems()
  const attachments = getAttachments(items)
  const archive = buildArchiveIndex()
  const { byId } = buildAttachmentIndex(items)

  const referencedIds = new Set<number>()
  for (const post of [...getPublishedPosts(items), ...getPages(items)]) {
    const thumb = getMeta(post, '_thumbnail_id')
    if (thumb) referencedIds.add(Number(thumb))
    const html = String(post['content:encoded'] || '')
    for (const p of extractUploadPathsFromHtml(html)) {
      for (const [, att] of byId) {
        if (getAttachmentFile(att) === p) referencedIds.add(Number(att['wp:post_id']))
      }
    }
  }

  const pathCounts = new Map<string, number>()
  for (const att of attachments) {
    const p = getAttachmentFile(att)
    if (p) pathCounts.set(p, (pathCounts.get(p) || 0) + 1)
  }

  const masterGroups = groupFilesByMaster(archive.allFiles.filter((f) => /^\d{4}\//.test(f)))

  const rows = attachments.map((att) => {
    const id = Number(att['wp:post_id'])
    const uploadPath = getAttachmentFile(att)
    const filename = uploadPath.split('/').pop() || ''
    const legacyUrl = `${MIGRATION_CONFIG.uploadsUrlPrefix}${uploadPath}`
    const alt = getMeta(att, '_wp_attachment_image_alt')
    const caption = String(att['excerpt:encoded'] || att.description || '')
    const mime = String(att['wp:post_mime_type'] || '')

    const archivePath = uploadPath ? resolveArchivePath(uploadPath, archive) : null
    let status = 'MISSING'
    let notes = ''

    if ((pathCounts.get(uploadPath) || 0) > 1) {
      status = 'DUPLICATE'
      notes = 'duplicate attachment path in WordPress export'
    } else if (archivePath) {
      status = 'FOUND'
    } else {
      const basename = path.basename(uploadPath)
      const dir = path.dirname(uploadPath)
      const groupKey = dir === '.' ? getMasterKey(basename) : `${dir}/${getMasterKey(basename)}`
      const group = masterGroups.get(groupKey)
      if (group?.length) {
        const sel = selectMasterFile(group)
        if (sel.master) {
          status = 'AMBIGUOUS'
          notes = `expected ${uploadPath}; closest master ${sel.master} (${sel.notes})`
        }
      }
    }

    if (!referencedIds.has(id) && status === 'FOUND') {
      status = 'UNUSED'
      notes = notes ? `${notes}; unreferenced` : 'not referenced by scoped content scan'
    }

    const dir = path.dirname(uploadPath)
    const groupKey = dir === '.' ? getMasterKey(filename) : `${dir}/${getMasterKey(filename)}`
    const derivatives = (masterGroups.get(groupKey) || []).filter((f) => f !== uploadPath)
    const derivativeCount = derivatives.filter((f) => isDerivativeFilename(path.basename(f))).length

    return {
      wordpress_attachment_id: id,
      legacy_url: legacyUrl,
      expected_relative_path: uploadPath,
      actual_archive_path: archivePath ? path.relative(path.join(MIGRATION_CONFIG.uploadsExtractDir, 'uploads'), archivePath).replace(/\\/g, '/') : '',
      filename,
      mime_type: mime,
      alt_text: alt,
      caption,
      master_asset: uploadPath && !isDerivativeFilename(filename) ? 'yes' : isDerivativeFilename(filename) ? 'no' : 'yes',
      derivative_count: derivativeCount,
      referenced_by_content: referencedIds.has(id) ? 'yes' : 'no',
      status,
      notes,
    }
  })

  const outPath = path.join(MIGRATION_CONFIG.reportsDir, 'media-reconciliation.csv')
  writeCsv(outPath, rows)
  console.log(`Wrote ${rows.length} rows to ${outPath}`)
  const summary = rows.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  console.log('Summary:', summary)
}

main()
