/**
 * Push Payload schema to the database (staging only).
 * Creates missing tables when new block types are added after initial bootstrap.
 *
 * Run: SITE_ENV=staging npx tsx scripts/staging/push-schema.ts
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'

async function main() {
  if (process.env.SITE_ENV !== 'staging') {
    console.error('push-schema: SITE_ENV must be staging (refusing to run)')
    process.exit(1)
  }

  console.log('push-schema: initializing Payload (push enabled in config)...')
  await getPayload({ config })
  console.log('push-schema: complete')
}

main().catch((err) => {
  console.error('push-schema: failed', err)
  process.exit(1)
})
