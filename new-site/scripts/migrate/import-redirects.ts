#!/usr/bin/env tsx
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { MIGRATION_CONFIG } from '../../src/migration/config'
import { writeCsv } from '../../src/migration/csv'

async function main() {
  const redirects = JSON.parse(fs.readFileSync(MIGRATION_CONFIG.redirectsJson, 'utf-8')) as Array<{
    url?: string
    match_url?: string
    action_code?: number
    action_data?: string
    status?: string
  }>

  const payload = await getPayload({ config })
  const publicRedirects: Array<{
    sourcePath: string
    destination: string
    statusCode: '301' | '302'
    active: boolean
    notes: string
  }> = []

  let imported = 0
  let excluded = 0
  let failed = 0

  const seen = new Set<string>()

  for (const rule of redirects) {
    if (rule.status !== 'enabled') {
      excluded++
      continue
    }
    const source = rule.match_url || rule.url || ''
    if (!source || source.includes('wp-admin') || source.includes('wp-login')) {
      excluded++
      continue
    }
    const sourcePath = source.startsWith('/') ? source : `/${source}`
    if (!sourcePath.endsWith('/')) {
      // normalize both with and without trailing slash - use with slash
    }
    const normalized = sourcePath.endsWith('/') ? sourcePath : `${sourcePath}/`
    if (seen.has(normalized)) continue
    seen.add(normalized)

    let destination = rule.action_data || ''
    if (destination.startsWith('https://onixdatacentres.com')) {
      destination = destination.replace('https://onixdatacentres.com', '')
    }
    if (!destination.startsWith('/')) destination = `/${destination}`
    if (!destination.endsWith('/') && !destination.includes('.')) destination = `${destination}/`

    try {
      const existing = await payload.find({
        collection: 'redirects',
        where: { sourcePath: { equals: normalized } },
        limit: 1,
      })
      const data = {
        sourcePath: normalized,
        destination,
        statusCode: String(rule.action_code || 301) as '301' | '302',
        active: true,
        notes: 'Imported from WordPress Pretty Links',
      }
      if (existing.docs[0]) {
        await payload.update({ collection: 'redirects', id: existing.docs[0].id, data })
      } else {
        await payload.create({ collection: 'redirects', data })
      }
      publicRedirects.push(data)
      imported++
    } catch {
      failed++
    }
  }

  fs.mkdirSync(path.dirname(MIGRATION_CONFIG.redirectsDataJson), { recursive: true })
  fs.writeFileSync(MIGRATION_CONFIG.redirectsDataJson, JSON.stringify(publicRedirects, null, 2))

  writeCsv(path.join(MIGRATION_CONFIG.reportsDir, 'redirect-import-results.csv'), publicRedirects.map((r) => ({
    source_path: r.sourcePath,
    destination: r.destination,
    status_code: r.statusCode,
    status: 'imported',
  })))

  console.log({ imported, excluded, failed })
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
