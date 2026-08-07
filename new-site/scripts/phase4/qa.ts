#!/usr/bin/env tsx
/**
 * Phase 4 QA report generator (no DB required for URL map checks).
 */
import fs from 'fs'
import path from 'path'
import { readCsv, writeCsv } from '../../src/migration/csv'
import { MIGRATION_CONFIG } from '../../src/migration/config'

const repoRoot = MIGRATION_CONFIG.repoRoot
const phase4Dir = path.join(repoRoot, 'phase4')

function loadUrlMap() {
  return readCsv(MIGRATION_CONFIG.urlMapCsv)
}

function generateFrenchMigration() {
  const rows = [
    { english_url: '/', french_url: '/fr/home-francais/', status: 'IN_PROGRESS', content_complete: 'partial', seo_complete: 'partial', media_complete: 'partial', notes: 'FR homepage via Payload locale' },
    { english_url: '/about-us/', french_url: '/fr/a-propos/', status: 'OPEN', content_complete: 'no', seo_complete: 'no', media_complete: 'n/a', notes: 'Awaiting FR page import' },
    { english_url: '/contact-us/', french_url: '/fr/contactez-nous/', status: 'IN_PROGRESS', content_complete: 'partial', seo_complete: 'no', media_complete: 'n/a', notes: 'Form route live; CMS content pending' },
    { english_url: '/news/', french_url: 'n/a', status: 'ACCEPTED_LIMITATION', content_complete: 'n/a', seo_complete: 'n/a', media_complete: 'n/a', notes: 'No FR articles in export' },
  ]
  writeCsv(path.join(phase4Dir, 'french-page-migration.csv'), rows)
}

function generateArticleWarnings() {
  const src = path.join(MIGRATION_CONFIG.reportsDir, 'article-migration-results.csv')
  if (!fs.existsSync(src)) return
  const rows = readCsv(src)
    .filter((r) => r.manual_review === 'yes')
    .map((r) => ({
      article: r.old_url,
      warning: r.warnings,
      automated_resolution: r.inline_media_status === 'partial' ? 'IMPROVED_MATCHER_PENDING_RERUN' : 'MANUAL',
      final_status: 'OPEN',
      manual_action: r.article_type === 'ELEMENTOR' ? 'Review Elementor widgets' : 'Review inline media',
      notes: r.title,
    }))
  writeCsv(path.join(phase4Dir, 'article-warning-resolution.csv'), rows)
}

function generateSeoPageQa() {
  const scope = readCsv(MIGRATION_CONFIG.pageScopeCsv).filter((r) => r.recommendation === 'MIGRATE')
  const rows = scope.map((r) => ({
    url: r.path,
    title_status: 'PENDING_CRAWL',
    meta_description_status: 'PENDING_CRAWL',
    canonical_status: 'PENDING_CRAWL',
    social_status: 'PENDING_CRAWL',
    robots_status: 'ok',
    h1_status: 'PENDING_CRAWL',
    notes: r.title,
  }))
  writeCsv(path.join(phase4Dir, 'seo-page-qa.csv'), rows)
}

function main() {
  phase4Dir && fs.mkdirSync(phase4Dir, { recursive: true })
  generateFrenchMigration()
  generateArticleWarnings()
  generateSeoPageQa()
  const urlCount = loadUrlMap().length
  console.log(`Phase 4 QA reports written to ${phase4Dir} (${urlCount} URLs in map)`)
}

main()
