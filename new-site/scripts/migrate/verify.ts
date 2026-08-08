#!/usr/bin/env tsx
/**
 * Migration verification and QA report generation.
 * npm run migrate:verify
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { MIGRATION_CONFIG } from '../../src/migration/config'
import { readCsv, writeCsv } from '../../src/migration/csv'
import { getPublishedPosts, getLegacyPostPath, loadWpItems } from '../../src/migration/wp-export'

async function main() {
  const payload = await getPayload({ config })
  const articles = await payload.find({ collection: 'articles', limit: 200, depth: 1 })
  const published = getPublishedPosts(loadWpItems())

  const urlRows: Record<string, unknown>[] = []
  const qaRows: Record<string, unknown>[] = []
  const hotlinkRows: Record<string, unknown>[] = []
  const seoRows: Record<string, unknown>[] = []

  for (const post of published) {
    const slug = String(post['wp:post_name'])
    const legacyPath = getLegacyPostPath(post)
    const doc = articles.docs.find((a) => a.legacy?.wordpressId === Number(post['wp:post_id']))
    urlRows.push({
      legacy_url: legacyPath,
      payload_id: doc?.id || '',
      classification: doc ? '200_PRESERVED' : 'ERROR',
      notes: doc ? '' : 'Article not found in Payload',
    })
  }

  for (const article of articles.docs) {
    const contentStr = JSON.stringify(article.content || {})
    const hasHotlink = contentStr.includes('wp-content/uploads') || contentStr.includes('onixdatacentres.com/wp-content')
    if (hasHotlink) {
      hotlinkRows.push({
        article_id: article.id,
        article_url: article.legacy?.legacyPath || '',
        issue: 'legacy uploads URL in content JSON',
      })
    }

    qaRows.push({
      slug: article.slug,
      title_ok: article.title ? 'yes' : 'no',
      body_ok: contentStr.length > 50 ? 'yes' : 'no',
      url_ok: article.legacy?.legacyPath ? 'yes' : 'no',
      featured_ok: article.featuredImage ? 'yes' : 'no',
      seo_ok: article.seo?.title || article.seo?.description ? 'yes' : 'partial',
      elementor_artifacts: /elementor|_elementor/i.test(contentStr) ? 'yes' : 'no',
    })

    seoRows.push({
      content_id: article.id,
      old_url: article.legacy?.legacyPath || '',
      seo_title_status: article.seo?.title ? 'mapped' : 'missing',
      meta_description_status: article.seo?.description ? 'mapped' : 'missing',
      canonical_status: article.seo?.canonicalUrl ? 'mapped' : 'missing',
      social_status: article.seo?.ogImage ? 'mapped' : 'missing',
      robots_status: 'default',
      notes: '',
    })
  }

  const redirects = JSON.parse(
    fs.readFileSync(MIGRATION_CONFIG.redirectsDataJson, 'utf-8'),
  ) as unknown[]
  for (const r of redirects as Array<{ sourcePath: string; destination: string }>) {
    urlRows.push({
      legacy_url: r.sourcePath,
      payload_id: '',
      classification: '301_REDIRECTED',
      notes: `→ ${r.destination}`,
    })
  }

  const excluded = readCsv(MIGRATION_CONFIG.pageScopeCsv).filter((r) => r.recommendation === 'EXCLUDE')
  for (const row of excluded) {
    urlRows.push({
      legacy_url: row.path,
      payload_id: '',
      classification: 'EXCLUDED_APPROVED',
      notes: row.notes,
    })
  }

  writeCsv(path.join(MIGRATION_CONFIG.reportsDir, 'url-reconciliation.csv'), urlRows)
  writeCsv(path.join(MIGRATION_CONFIG.reportsDir, 'article-content-qa.csv'), qaRows)
  writeCsv(path.join(MIGRATION_CONFIG.reportsDir, 'legacy-media-hotlinks.csv'), hotlinkRows)
  writeCsv(path.join(MIGRATION_CONFIG.reportsDir, 'seo-import-results.csv'), seoRows)

  const summary = {
    articlesInPayload: articles.totalDocs,
    publishedExpected: published.length,
    hotlinks: hotlinkRows.length,
    preserved: urlRows.filter((r) => r.classification === '200_PRESERVED').length,
    redirects: redirects.length,
  }
  console.log(JSON.stringify(summary, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
