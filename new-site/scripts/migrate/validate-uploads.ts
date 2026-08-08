#!/usr/bin/env tsx
/**
 * Validate uploads.zip and extraction.
 * npm run migrate:validate-uploads
 */
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { MIGRATION_CONFIG } from '../../src/migration/config'
import { buildArchiveIndex } from '../../src/migration/media-utils'

function formatBytes(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} GB`
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} MB`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)} KB`
  return `${n} B`
}

function main() {
  const zipPath = MIGRATION_CONFIG.uploadsZip
  const extractDir = MIGRATION_CONFIG.uploadsExtractDir
  const lines: string[] = ['# Uploads archive validation', '', `**Date:** ${new Date().toISOString().slice(0, 10)}`, '']

  if (!fs.existsSync(zipPath)) {
    lines.push('## Status: FAILED', '', 'Archive not found at `migration/source/media/uploads.zip`.')
    writeReport(lines)
    process.exit(1)
  }

  const zipStat = fs.statSync(zipPath)
  const isPointer = zipStat.size < 1000 && fs.readFileSync(zipPath, 'utf-8').startsWith('version https://git-lfs')
  lines.push('## Archive', '', `- **Path:** \`migration/source/media/uploads.zip\``)
  lines.push(`- **Size (working tree):** ${formatBytes(zipStat.size)}`)
  lines.push(`- **Git LFS pointer in working tree:** ${isPointer ? 'yes (run git lfs pull)' : 'no'}`)

  let zipTest = 'not run'
  try {
    execSync(`unzip -t "${zipPath}"`, { stdio: 'pipe' })
    zipTest = 'passed'
  } catch {
    zipTest = 'failed'
  }
  lines.push(`- **ZIP integrity test:** ${zipTest}`)

  const listOutput = execSync(`unzip -l "${zipPath}"`, { encoding: 'utf-8' })
  const totalMatch = listOutput.match(/(\d+) files/)
  const sizeMatch = listOutput.match(/(\d+)\s+\d+ files/)
  const zipFileCount = totalMatch ? Number(totalMatch[1]) : 0

  lines.push('', '## ZIP structure (top level)', '')
  const topDirs = new Set<string>()
  for (const line of listOutput.split('\n')) {
    const m = line.match(/^\s+\d+.*\s+uploads\/([^/]+)\/?\s*$/)
    if (m) topDirs.add(m[1])
  }
  lines.push('Expected root: `uploads/` with WordPress year/month directories.')
  lines.push('', 'Top-level entries under `uploads/`:', '')
  ;[...topDirs].sort().forEach((d) => lines.push(`- ${d}`))

  lines.push('', '## Extraction', '')
  const uploadsRoot = path.join(extractDir, 'uploads')
  if (!fs.existsSync(uploadsRoot)) {
    lines.push('Extraction directory not found. Run extraction to `.migration-work/uploads/`.')
  } else {
    const index = buildArchiveIndex(extractDir)
    let totalSize = 0
    for (const rel of index.allFiles) {
      const full = index.byRelativePath.get(rel)
      if (full) totalSize += fs.statSync(full).size
    }
    lines.push(`- **Extraction path:** \`.migration-work/uploads/\``)
    lines.push(`- **Extracted files:** ${index.allFiles.length}`)
    lines.push(`- **Extracted total size:** ${formatBytes(totalSize)}`)
    lines.push(`- **ZIP listed files:** ${zipFileCount}`)
    lines.push(`- **Year directories present:** ${['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'].filter((y) => topDirs.has(y)).join(', ')}`)

    const corrupt: string[] = []
    for (const rel of index.allFiles.slice(0, 500)) {
      const full = index.byRelativePath.get(rel)!
      try {
        fs.accessSync(full, fs.constants.R_OK)
      } catch {
        corrupt.push(rel)
      }
    }
    lines.push(`- **Unreadable sample (first 500):** ${corrupt.length}`)

    const unexpected = [...topDirs].filter(
      (d) => !/^\d{4}$/.test(d) && !['elementor', 'astra', 'astra-addon'].includes(d),
    )
    lines.push('', '## Plugin/system directories (not year/month content)', '')
    unexpected.sort().forEach((d) => lines.push(`- uploads/${d}/`))
  }

  lines.push('', '## Notes', '')
  lines.push('- Source ZIP must not be modified.')
  lines.push('- Extracted tree is gitignored via `.migration-work/`.')
  lines.push('- `__MACOSX` metadata may be present in ZIP; excluded from extraction where possible.')

  writeReport(lines)
  console.log(`Wrote ${path.join(MIGRATION_CONFIG.reportsDir, 'uploads-archive-validation.md')}`)
}

function writeReport(lines: string[]) {
  const out = path.join(MIGRATION_CONFIG.reportsDir, 'uploads-archive-validation.md')
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, lines.join('\n'))
}

main()
