import fs from 'fs'
import path from 'path'
import { MIGRATION_CONFIG } from './config'

const DERIVATIVE_RE = /-(\d+)x(\d+)(?=\.[^.]+$)/
const SCALED_RE = /-scaled(?=\.[^.]+$)/i

export type ArchiveIndex = {
  byRelativePath: Map<string, string>
  allFiles: string[]
}

export function buildArchiveIndex(extractDir = MIGRATION_CONFIG.uploadsExtractDir): ArchiveIndex {
  const byRelativePath = new Map<string, string>()
  const allFiles: string[] = []
  const uploadsRoot = path.join(extractDir, 'uploads')

  if (!fs.existsSync(uploadsRoot)) {
    return { byRelativePath, allFiles }
  }

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else {
        const rel = path.relative(uploadsRoot, full).replace(/\\/g, '/')
        allFiles.push(rel)
        byRelativePath.set(rel, full)
        byRelativePath.set(rel.toLowerCase(), full)
      }
    }
  }
  walk(uploadsRoot)
  return { byRelativePath, allFiles }
}

export function isDerivativeFilename(filename: string): boolean {
  return DERIVATIVE_RE.test(filename) || SCALED_RE.test(filename)
}

export function getMasterKey(filename: string): string {
  let base = filename
  base = base.replace(DERIVATIVE_RE, '')
  base = base.replace(SCALED_RE, '')
  return base
}

export function groupFilesByMaster(files: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>()
  for (const file of files) {
    const name = path.basename(file)
    const key = getMasterKey(name)
    const relDir = path.dirname(file)
    const groupKey = relDir === '.' ? key : `${relDir}/${key}`
    const list = groups.get(groupKey) || []
    list.push(file)
    groups.set(groupKey, list)
  }
  return groups
}

export function selectMasterFile(candidates: string[]): {
  master: string
  derivatives: string[]
  notes: string
} {
  if (!candidates.length) return { master: '', derivatives: [], notes: 'no candidates' }
  const sorted = [...candidates].sort((a, b) => {
    const aDer = isDerivativeFilename(path.basename(a)) ? 1 : 0
    const bDer = isDerivativeFilename(path.basename(b)) ? 1 : 0
    if (aDer !== bDer) return aDer - bDer
    return fs.statSync(resolveArchivePath(b) || b).size - fs.statSync(resolveArchivePath(a) || a).size
  })

  const nonDerivatives = sorted.filter((f) => !isDerivativeFilename(path.basename(f)))
  if (nonDerivatives.length === 1) {
    return {
      master: nonDerivatives[0],
      derivatives: sorted.filter((f) => f !== nonDerivatives[0]),
      notes: 'original without dimension suffix',
    }
  }
  if (nonDerivatives.length > 1) {
    const largest = nonDerivatives.reduce((a, b) =>
      fileSize(b) > fileSize(a) ? b : a,
    )
    return {
      master: largest,
      derivatives: sorted.filter((f) => f !== largest),
      notes: 'multiple originals — chose largest',
    }
  }

  const scaled = sorted.find((f) => /-scaled\./i.test(path.basename(f)))
  if (scaled) {
    return {
      master: scaled,
      derivatives: sorted.filter((f) => f !== scaled),
      notes: 'only scaled variant available',
    }
  }

  const largest = sorted.reduce((a, b) => (fileSize(b) > fileSize(a) ? b : a))
  return {
    master: largest,
    derivatives: sorted.filter((f) => f !== largest),
    notes: 'chose largest derivative as master',
  }
}

function fileSize(relPath: string): number {
  const full = resolveArchivePath(relPath)
  if (!full || !fs.existsSync(full)) return 0
  return fs.statSync(full).size
}

export function resolveArchivePath(relativePath: string, index?: ArchiveIndex): string | null {
  const idx = index || buildArchiveIndex()
  return idx.byRelativePath.get(relativePath) || idx.byRelativePath.get(relativePath.toLowerCase()) || null
}

export function guessMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  }
  return map[ext] || 'application/octet-stream'
}
