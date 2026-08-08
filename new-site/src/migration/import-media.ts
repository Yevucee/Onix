import fs from 'fs'
import path from 'path'
import type { Payload } from 'payload'
import { readCsv } from './csv'
import { MIGRATION_CONFIG } from './config'
import { buildArchiveIndex, guessMimeType, resolveArchivePath, selectMasterFile, groupFilesByMaster } from './media-utils'
import { buildAttachmentIndex, getAttachmentFile, getAttachments, getMeta, loadWpItems } from './wp-export'

export type MediaMapEntry = {
  wordpressId: number
  payloadMediaId: string | number
  legacyUrl: string
  uploadPath: string
  filename: string
}

const mapCachePath = path.join(MIGRATION_CONFIG.repoRoot, '.migration-work/media-map.json')

export function loadMediaMap(): Record<string, MediaMapEntry> {
  if (fs.existsSync(mapCachePath)) {
    return JSON.parse(fs.readFileSync(mapCachePath, 'utf-8'))
  }
  return {}
}

export function saveMediaMap(map: Record<string, MediaMapEntry>) {
  fs.mkdirSync(path.dirname(mapCachePath), { recursive: true })
  fs.writeFileSync(mapCachePath, JSON.stringify(map, null, 2))
}

export type MediaImportReport = {
  imported: number
  updated: number
  skipped: number
  failed: Array<{ wordpressId: number; path: string; error: string }>
}

export async function importRequiredMedia(
  payload: Payload,
  options: { dryRun?: boolean; limit?: number } = {},
): Promise<MediaImportReport> {
  const report: MediaImportReport = { imported: 0, updated: 0, skipped: 0, failed: [] }
  const scopePath = path.join(MIGRATION_CONFIG.reportsDir, 'media-production-scope.csv')
  let targets: Array<{ wordpressId: number; path: string; reason: string }> = []

  if (fs.existsSync(scopePath)) {
    const rows = readCsv(scopePath)
    targets = rows
      .filter((r) => r.status === 'REQUIRED' || r.status === 'POSSIBLY_REQUIRED')
      .map((r) => ({
        wordpressId: Number(r.wordpress_attachment_id) || 0,
        path: r.master_relative_path || r.expected_relative_path || '',
        reason: r.referenced_reason || r.status,
      }))
      .filter((t) => t.path)
  }

  const items = loadWpItems()
  const { byId } = buildAttachmentIndex(items)
  const archive = buildArchiveIndex()
  const map = loadMediaMap()

  const attachmentTargets = new Map<number, string>()
  for (const att of getAttachments(items)) {
    const id = Number(att['wp:post_id'])
    const uploadPath = getAttachmentFile(att)
    if (uploadPath && resolveArchivePath(uploadPath, archive)) {
      attachmentTargets.set(id, uploadPath)
    }
  }

  if (!targets.length) {
    for (const [id, p] of attachmentTargets) targets.push({ wordpressId: id, path: p, reason: 'attachment' })
  }

  const unique = new Map<string, { wordpressId: number; path: string }>()
  for (const t of targets) {
    const att = byId.get(t.wordpressId)
    const uploadPath = att ? getAttachmentFile(att) : t.path
    if (!uploadPath) continue
    unique.set(uploadPath, { wordpressId: t.wordpressId || Number(att?.['wp:post_id']) || 0, path: uploadPath })
  }

  let count = 0
  for (const [uploadPath, target] of unique) {
    if (options.limit && count >= options.limit) break
    count++

    const att = byId.get(target.wordpressId) || [...byId.values()].find((a) => getAttachmentFile(a) === uploadPath)
    const wpId = att ? Number(att['wp:post_id']) : target.wordpressId
    let filePath: string | null = resolveArchivePath(uploadPath, archive)

    if (!filePath) {
      const dir = path.dirname(uploadPath)
      const groups = groupFilesByMaster(archive.allFiles.filter((f) => f.startsWith(dir)))
      const group = groups.get(`${dir}/${path.basename(uploadPath).replace(/-\d+x\d+|-scaled/i, '')}`) ||
        [...groups.values()].find((g) => g.some((f) => f.includes(path.basename(uploadPath, path.extname(uploadPath)))))
      if (group) filePath = resolveArchivePath(selectMasterFile(group).master, archive)
    }

    if (!filePath || !fs.existsSync(filePath)) {
      report.failed.push({ wordpressId: wpId, path: uploadPath, error: 'file not in archive' })
      continue
    }

    const resolvedPath: string = filePath

    const existing = await payload.find({
      collection: 'media',
      where: { 'legacy.wordpressId': { equals: wpId } },
      limit: 1,
    })

    const alt = att ? getMeta(att, '_wp_attachment_image_alt') || att.title || path.basename(uploadPath) : path.basename(uploadPath)
    const title = att ? String(att.title || path.basename(uploadPath)) : path.basename(uploadPath)
    const legacyUrl = `${MIGRATION_CONFIG.uploadsUrlPrefix}${uploadPath}`

    if (options.dryRun) {
      report.skipped++
      continue
    }

    try {
      const data = {
        alt: String(alt).slice(0, 500) || 'Image',
        title: String(title).slice(0, 500),
        caption: att ? String(att['excerpt:encoded'] || '') : '',
        legacy: {
          wordpressId: wpId,
          originalUrl: legacyUrl,
          uploadPath,
        },
      }

      let doc
      if (existing.docs[0]) {
        doc = await payload.update({
          collection: 'media',
          id: existing.docs[0].id,
          data,
          filePath: resolvedPath,
        })
        report.updated++
      } else {
        doc = await payload.create({
          collection: 'media',
          data,
          filePath: resolvedPath,
        })
        report.imported++
      }

      map[String(wpId)] = {
        wordpressId: wpId,
        payloadMediaId: doc.id,
        legacyUrl,
        uploadPath,
        filename: path.basename(uploadPath),
      }
    } catch (e) {
      report.failed.push({
        wordpressId: wpId,
        path: uploadPath,
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  saveMediaMap(map)
  return report
}

export function resolveLegacyMediaUrl(url: string, map = loadMediaMap()): string | number | null {
  const normalized = url
    .replace(MIGRATION_CONFIG.uploadsUrlPrefix, '')
    .replace(MIGRATION_CONFIG.uploadsPathPrefix, '')
    .replace(/^https?:\/\/[^/]+\/wp-content\/uploads\//, '')

  for (const entry of Object.values(map)) {
    if (url.includes(entry.uploadPath) || normalized === entry.uploadPath) return entry.payloadMediaId
    if (entry.legacyUrl === url) return entry.payloadMediaId
    const entryBase = entry.uploadPath.replace(/-\d+x\d+(?=\.[^.]+$)/i, '').replace(/-scaled(?=\.[^.]+$)/i, '')
    const normBase = normalized.replace(/-\d+x\d+(?=\.[^.]+$)/i, '').replace(/-scaled(?=\.[^.]+$)/i, '')
    if (entryBase === normBase) return entry.payloadMediaId
  }

  const items = loadWpItems()
  const { byPath, byUrl } = buildAttachmentIndex(items)
  const rel = url.match(/wp-content\/uploads\/(.+)/)?.[1] || normalized
  if (rel) {
    const relBase = rel.replace(/-\d+x\d+(?=\.[^.]+$)/i, '').replace(/-scaled(?=\.[^.]+$)/i, '')
    const att = byPath.get(rel) || byPath.get(rel.toLowerCase()) || byPath.get(relBase) || byPath.get(relBase.toLowerCase())
    if (att) {
      const wpId = Number(att['wp:post_id'])
      if (map[String(wpId)]) return map[String(wpId)].payloadMediaId
    }
    for (const [pathKey, attachment] of byPath) {
      const pathBase = pathKey.replace(/-\d+x\d+(?=\.[^.]+$)/i, '').replace(/-scaled(?=\.[^.]+$)/i, '')
      if (pathBase === relBase) {
        const wpId = Number(attachment['wp:post_id'])
        if (map[String(wpId)]) return map[String(wpId)].payloadMediaId
      }
    }
  }

  const attByUrl = byUrl.get(url)
  if (attByUrl) {
    const wpId = Number(attByUrl['wp:post_id'])
    if (map[String(wpId)]) return map[String(wpId)].payloadMediaId
  }

  return null
}

export function isSupportedMediaFile(filename: string): boolean {
  const mime = guessMimeType(filename)
  return mime.startsWith('image/') || mime === 'application/pdf' || mime.includes('wordprocessingml')
}
