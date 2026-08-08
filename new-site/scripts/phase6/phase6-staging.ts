#!/usr/bin/env tsx
/**
 * Full Phase 6 staging setup — Groups 1–4 content + leadership photos.
 * Run: DATABASE_URL=... npx tsx scripts/phase6/phase6-staging.ts
 */
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..')

const steps = [
  ['scripts/phase6/seed-group1-content.ts', 'Seed Group 1 About Us'],
  ['scripts/phase6/seed-groups-2-4.ts', 'Seed Groups 2–4 content'],
  ['scripts/migrate/import-leadership-photos.ts', 'Link leadership photos to Payload'],
]

for (const [script, label] of steps) {
  console.log(`\n=== ${label} ===`)
  execSync(`npx tsx ${script}`, { stdio: 'inherit', cwd: root })
}

console.log('\nPhase 6 full staging setup complete.')
