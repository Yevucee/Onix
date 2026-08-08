#!/usr/bin/env tsx
/**
 * Create staging admin user from environment variables.
 * Requires: STAGING_ADMIN_EMAIL, STAGING_ADMIN_PASSWORD
 * Does NOT use default seed credentials.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../src/payload.config'

async function main() {
  const email = process.env.STAGING_ADMIN_EMAIL
  const password = process.env.STAGING_ADMIN_PASSWORD

  if (!email || !password) {
    console.error('Set STAGING_ADMIN_EMAIL and STAGING_ADMIN_PASSWORD')
    process.exit(1)
  }

  if (password.length < 12) {
    console.error('STAGING_ADMIN_PASSWORD must be at least 12 characters')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data: { password, role: 'admin', name: 'Staging Admin' },
    })
    console.log('Updated staging admin password')
  } else {
    await payload.create({
      collection: 'users',
      data: { email, password, role: 'admin', name: 'Staging Admin' },
    })
    console.log('Created staging admin user')
  }

  // Remove default seed account if present
  const seed = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@onix.local' } },
    limit: 1,
  })
  if (seed.docs[0]) {
    await payload.delete({ collection: 'users', id: seed.docs[0].id })
    console.log('Removed default seed admin@onix.local account')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
