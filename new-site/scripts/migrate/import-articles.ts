#!/usr/bin/env tsx
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { importAllArticles, importArticle } from '../../src/migration/import-articles'
import { importRequiredMedia } from '../../src/migration/import-media'
import { writeCsv } from '../../src/migration/csv'
import { MIGRATION_CONFIG } from '../../src/migration/config'
import path from 'path'
import fs from 'fs'

const SAMPLE_SLUGS = [
  'what-is-peering',
  'tier-3-facility-in-dakar-2023-completion',
  'support-for-south-tongu-flood-relief',
  'challenges-in-data-centre-deployment-in-africa',
  'cold-aisle-containment-data-centre-cooling',
  'africa-digital-cloud-resilience',
  'advantages-tier-iv-data-centre',
]

async function main() {
  const args = process.argv.slice(2)
  const sample = args.includes('--sample')
  const all = args.includes('--all')
  const slugArg = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : null

  const payload = await getPayload({ config })

  if (!args.includes('--skip-media')) {
    console.log('Importing required media...')
    await importRequiredMedia(payload)
  }

  let results
  if (slugArg) {
    results = [await importArticle(payload, slugArg)]
  } else if (sample) {
    results = []
    for (const slug of SAMPLE_SLUGS) {
      results.push(await importArticle(payload, slug))
      results.push(await importArticle(payload, slug))
    }
  } else if (all) {
    results = await importAllArticles(payload)
  } else {
    results = []
    for (const slug of SAMPLE_SLUGS.slice(0, 2)) {
      results.push(await importArticle(payload, slug))
    }
  }

  const csvRows = results
    .filter((r, i, arr) => !sample || i < SAMPLE_SLUGS.length || i >= SAMPLE_SLUGS.length)
    .slice(0, sample ? SAMPLE_SLUGS.length : undefined)
    .map((r) => ({
      wordpress_id: r.wordpressId,
      old_url: r.oldUrl,
      payload_id: r.payloadId || '',
      title: r.slug,
      article_type: r.articleType,
      content_import_status: r.contentImportStatus,
      featured_image_status: r.featuredImageStatus,
      inline_media_status: r.inlineMediaStatus,
      seo_status: r.seoStatus,
      url_status: r.urlStatus,
      warnings: r.warnings.join('; '),
      manual_review: r.manualReview ? 'yes' : 'no',
    }))

  const outPath = path.join(MIGRATION_CONFIG.reportsDir, 'article-migration-results.csv')
  if (all) writeCsv(outPath, csvRows)
  else {
    const existing = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf-8') : ''
    writeCsv(outPath, csvRows)
  }

  const mediaErrors: Record<string, string>[] = []
  for (const r of results) {
    if (r.inlineMediaStatus !== 'mapped') {
      mediaErrors.push({
        article_id: String(r.wordpressId),
        article_url: r.oldUrl,
        legacy_media_url: '',
        expected_attachment_id: '',
        issue: r.warnings.find((w) => w.includes('media')) || 'inline media issue',
        fallback: 'legacy url preserved in warnings',
        manual_review_required: r.manualReview ? 'yes' : 'no',
      })
    }
  }
  writeCsv(path.join(MIGRATION_CONFIG.reportsDir, 'article-media-errors.csv'), mediaErrors)

  console.log(JSON.stringify(results, null, 2))
  console.log(`Wrote ${outPath}`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
