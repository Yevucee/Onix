#!/usr/bin/env tsx
/**
 * Analyze WordPress image derivatives in extracted archive.
 * npm run migrate:analyze-derivatives
 */
import fs from 'fs'
import path from 'path'
import { MIGRATION_CONFIG } from '../../src/migration/config'
import {
  buildArchiveIndex,
  getMasterKey,
  groupFilesByMaster,
  isDerivativeFilename,
  guessMimeType,
} from '../../src/migration/media-utils'
import { getAttachments, getAttachmentFile, loadWpItems } from '../../src/migration/wp-export'

function main() {
  const archive = buildArchiveIndex()
  const contentFiles = archive.allFiles.filter((f) => /^\d{4}\//.test(f))
  const groups = groupFilesByMaster(contentFiles)

  let masters = 0
  let derivatives = 0
  let scaledOnly = 0
  let orphans = 0
  const wpPaths = new Set(getAttachments(loadWpItems()).map((a) => getAttachmentFile(a)).filter(Boolean))

  for (const [, files] of groups) {
    const hasOriginal = files.some((f) => !isDerivativeFilename(path.basename(f)))
    const hasScaled = files.some((f) => /-scaled\./i.test(path.basename(f)))
    const derivs = files.filter((f) => isDerivativeFilename(path.basename(f)))
    derivatives += derivs.length
    if (hasOriginal) masters++
    else if (hasScaled) scaledOnly++
    else if (files.length) masters++

    const masterName = files[0] ? getMasterKey(path.basename(files[0])) : ''
    const anyReferenced = files.some((f) => wpPaths.has(f))
    if (!anyReferenced) orphans++
  }

  const pluginFiles = archive.allFiles.filter((f) => !/^\d{4}\//.test(f))
  const unsupported = pluginFiles.filter((f) => {
    const mime = guessMimeType(f)
    return !mime.startsWith('image/') && mime !== 'application/pdf'
  })

  const lines = [
    '# Media derivatives summary',
    '',
    `**Generated:** ${new Date().toISOString()}`,
    '',
    '## Totals',
    '',
    `- **Extracted files (all):** ${archive.allFiles.length}`,
    `- **Year/month content files:** ${contentFiles.length}`,
    `- **Logical master groups:** ${groups.size}`,
    `- **Probable masters identified:** ${masters}`,
    `- **Generated derivatives:** ${derivatives}`,
    `- **Groups with only scaled source:** ${scaledOnly}`,
    `- **Orphaned/unreferenced file groups:** ${orphans}`,
    `- **Plugin/system directory files:** ${pluginFiles.length}`,
    `- **Unsupported non-image/PDF in plugin dirs:** ${unsupported.length}`,
    '',
    '## Policy',
    '',
    '- Import master assets only into Payload.',
    '- Payload/Sharp generates hero, article, card, thumbnail variants.',
    '- WordPress `-WxH` and `-scaled` files remain in source archive only.',
    '',
    '## Potential cleanup savings',
    '',
    `Importing masters instead of all ${contentFiles.length} year/month files avoids ~${derivatives} derivative files.`,
    '',
    '## Sample scaled-only groups',
    '',
  ]

  let sample = 0
  for (const [key, files] of groups) {
    const hasOriginal = files.some((f) => !isDerivativeFilename(path.basename(f)))
    const hasScaled = files.some((f) => /-scaled\./i.test(path.basename(f)))
    if (!hasOriginal && hasScaled && sample < 10) {
      lines.push(`- \`${key}\`: ${files.join(', ')}`)
      sample++
    }
  }

  const out = path.join(MIGRATION_CONFIG.reportsDir, 'media-derivatives-summary.md')
  fs.writeFileSync(out, lines.join('\n'))
  console.log(`Wrote ${out}`)
}

main()
