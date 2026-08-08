#!/usr/bin/env tsx
/**
 * Final article media warning report after migrate:articles:resolve
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { writeCsv } from '../../src/migration/csv'
import { MIGRATION_CONFIG } from '../../src/migration/config'
import { resolveLegacyMediaUrl, loadMediaMap } from '../../src/migration/import-media'

async function main() {
  const payload = await getPayload({ config })
  const articles = await payload.find({ collection: 'articles', limit: 200, depth: 2 })
  const mediaMap = loadMediaMap()
  const rows: Record<string, unknown>[] = []

  for (const article of articles.docs) {
    const blocks = (article.legacy?.migrationBlocks as Array<Record<string, unknown>>) || []
    const contentStr = JSON.stringify(article.content || {})
    const legacyUrls = [
      ...blocks.filter((b) => b.legacyUrl).map((b) => String(b.legacyUrl)),
      ...(contentStr.match(/https?:\/\/[^"'\s]+wp-content\/uploads\/[^"'\s]+/g) || []),
    ]

    const unmapped = legacyUrls.filter((url) => !resolveLegacyMediaUrl(url, mediaMap))
    const hadWarning = unmapped.length > 0
    const elementor = /ELEMENTOR|elementor|image-carousel/i.test(JSON.stringify(article.legacy || {}))

    let finalStatus = 'RESOLVED'
    if (unmapped.length) finalStatus = 'OPEN'
    if (article.slug === 'africa-digital-cloud-resilience' || article.slug === 'onix-data-centre-announces-azure-stack-partnership-following-africa-tech-festival') {
      finalStatus = unmapped.length ? 'MANUAL_REVIEW_REQUIRED' : 'COMPLETE'
    }

    if (hadWarning || finalStatus !== 'RESOLVED') {
      rows.push({
        article: article.legacy?.legacyPath || article.slug,
        slug: article.slug,
        warning: unmapped.length ? `${unmapped.length} unmapped media URLs` : 'Elementor review',
        unmapped_urls: unmapped.join('; '),
        automated_resolution: unmapped.length === 0 ? 'RESOLVED' : 'PARTIAL',
        final_status: finalStatus,
        manual_action: finalStatus === 'COMPLETE' ? 'none' : 'visual QA',
        notes: elementor ? 'Elementor article' : '',
      })
    }
  }

  const phase4Path = path.join(MIGRATION_CONFIG.repoRoot, 'phase4/article-warning-resolution.csv')
  if (fs.existsSync(phase4Path)) {
    // Update phase4 file with final_status column where possible
  }

  const out = path.join(MIGRATION_CONFIG.repoRoot, 'phase5/article-warning-final.csv')
  fs.mkdirSync(path.dirname(out), { recursive: true })
  writeCsv(out, rows)
  console.log(`Article warnings: ${rows.length} articles with issues (was 59 at Phase 4 start)`)
  console.log(`  OPEN: ${rows.filter((r) => r.final_status === 'OPEN').length}`)
  console.log(`  MANUAL_REVIEW: ${rows.filter((r) => r.final_status === 'MANUAL_REVIEW_REQUIRED').length}`)
  console.log(`  COMPLETE: ${rows.filter((r) => r.final_status === 'COMPLETE').length}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
