#!/usr/bin/env tsx
/**
 * Seed Groups 2–4 page content into Payload CMS.
 * Run: DATABASE_URL=... npx tsx scripts/phase6/seed-groups-2-4.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { productionCanonical } from '../../src/lib/canonical'
import { DEFAULT_CERTIFICATION_BLOCKS } from '../../src/data/certification-content'
import { GROUP2_SOLUTION_PAGES } from '../../src/data/group2-solutions'
import type { Page } from '../../src/payload-types'

async function updatePageByLegacyPath(
  payload: Awaited<ReturnType<typeof getPayload>>,
  legacyPath: string,
  blocks: Page['blocks'],
  seo?: { title?: string; description?: string },
) {
  const result = await payload.find({
    collection: 'pages',
    where: { 'legacy.legacyPath': { equals: legacyPath } },
    limit: 1,
  })
  if (!result.docs[0]) {
    console.warn(`Page not found for ${legacyPath}`)
    return
  }
  await payload.update({
    collection: 'pages',
    id: result.docs[0].id,
    data: {
      blocks,
      seo: {
        ...result.docs[0].seo,
        title: seo?.title || result.docs[0].seo?.title,
        description: seo?.description || result.docs[0].seo?.description,
        canonicalUrl: productionCanonical(legacyPath),
      },
    },
  })
  console.log(`Updated ${legacyPath}`)
}

async function main() {
  const payload = await getPayload({ config })

  for (const [legacyPath, config_] of Object.entries(GROUP2_SOLUTION_PAGES)) {
    await updatePageByLegacyPath(payload, legacyPath, config_.blocks as Page['blocks'])
  }

  await updatePageByLegacyPath(payload, '/o-home/certification/', DEFAULT_CERTIFICATION_BLOCKS as Page['blocks'], {
    title: 'Certification',
    description: 'Onix Data Centre certifications — Tier IV, ISO 27001, ISO 9001, PCI-DSS.',
  })

  console.log('Groups 2–4 content seed complete')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
