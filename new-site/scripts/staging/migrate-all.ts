#!/usr/bin/env tsx
/**
 * Run complete idempotent migration pipeline against current DATABASE_URL.
 * npm run staging:migrate
 */
import 'dotenv/config'
import { execSync } from 'child_process'

const steps = [
  ['migrate:validate-uploads', 'Validate uploads archive'],
  ['migrate:reconcile-media', 'Reconcile media'],
  ['migrate:scope-media', 'Scope production media'],
  ['migrate:media', 'Import media to Payload'],
  ['migrate:articles:resolve', 'Import/update articles'],
  ['migrate:pages', 'Import corporate pages'],
  ['migrate:leadership', 'Import leadership'],
  ['migrate:redirects', 'Import redirects'],
  ['migrate:verify', 'Generate verification reports'],
]

for (const [script, label] of steps) {
  console.log(`\n=== ${label} (${script}) ===`)
  execSync(`npm run ${script}`, { stdio: 'inherit', cwd: new URL('../..', import.meta.url).pathname })
}

console.log('\nStaging migration pipeline complete.')
