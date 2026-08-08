#!/usr/bin/env tsx
/**
 * Phase 6 Group 1 staging setup — seed content and link leadership photos.
 * Run: DATABASE_URL=... npx tsx scripts/phase6/group1-staging.ts
 */
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..')

const steps = [
  ['scripts/phase6/seed-group1-content.ts', 'Seed Group 1 About Us content'],
  ['scripts/migrate/import-leadership-photos.ts', 'Link leadership photos to Payload'],
]

for (const [script, label] of steps) {
  console.log(`\n=== ${label} ===`)
  execSync(`npx tsx ${script}`, { stdio: 'inherit', cwd: root })
}

console.log('\nPhase 6 Group 1 staging setup complete.')
