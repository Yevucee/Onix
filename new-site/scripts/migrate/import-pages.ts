#!/usr/bin/env tsx
import 'dotenv/config'
import path from 'path'
import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { MIGRATION_CONFIG } from '../../src/migration/config'
import { writeCsv } from '../../src/migration/csv'
import { importCorporatePages } from '../../src/migration/import-pages'
import { importRequiredMedia } from '../../src/migration/import-media'

async function main() {
  const payload = await getPayload({ config })
  if (process.env.MIGRATE_PAGES_SKIP_MEDIA !== '1') {
    console.log('Importing media...')
    await importRequiredMedia(payload)
  } else {
    console.log('Skipping media import (MIGRATE_PAGES_SKIP_MEDIA=1)')
  }
  console.log('Importing corporate pages...')
  const results = await importCorporatePages(payload)
  writeCsv(path.join(MIGRATION_CONFIG.repoRoot, 'phase4/corporate-page-import.csv'), results)
  const imported = results.filter((r) => r.status === 'imported' || r.status === 'updated').length
  console.log(`Corporate pages: ${imported} imported/updated, ${results.filter((r) => r.status === 'missing').length} missing`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
