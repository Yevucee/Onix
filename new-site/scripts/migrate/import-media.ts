#!/usr/bin/env tsx
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { importRequiredMedia } from '../../src/migration/import-media'
import { writeCsv } from '../../src/migration/csv'
import { MIGRATION_CONFIG } from '../../src/migration/config'
import path from 'path'

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const limit = process.argv.includes('--limit')
    ? Number(process.argv[process.argv.indexOf('--limit') + 1])
    : undefined

  const payload = await getPayload({ config })
  const report = await importRequiredMedia(payload, { dryRun, limit })
  console.log(JSON.stringify(report, null, 2))

  writeCsv(path.join(MIGRATION_CONFIG.reportsDir, 'media-import-results.csv'), [
    ...report.failed.map((f) => ({ ...f, status: 'failed' })),
  ])
  process.exit(report.failed.length && !dryRun ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
