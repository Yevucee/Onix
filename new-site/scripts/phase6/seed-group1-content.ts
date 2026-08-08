#!/usr/bin/env tsx
/**
 * Seed Group 1 page content from live production copy.
 * Run: DATABASE_URL=... npx tsx scripts/phase6/seed-group1-content.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { productionCanonical } from '../../src/lib/canonical'
import type { Page } from '@/payload-types'
import { DEFAULT_ABOUT_US_BLOCKS } from '../../src/data/group1-about-us'

async function findMediaId(payload: Awaited<ReturnType<typeof getPayload>>, uploadPath: string) {
  const result = await payload.find({
    collection: 'media',
    where: { 'legacy.uploadPath': { equals: uploadPath } },
    limit: 1,
  })
  return result.docs[0]?.id
}

async function buildAboutUsBlocks(payload: Awaited<ReturnType<typeof getPayload>>) {
  const heroImage = await findMediaId(payload, '2023/03/ONIX-DATA-CENTER-KEELSON-STUDIOS-61-scaled.jpg')
  const splitImage = await findMediaId(payload, '2021/11/Screenshot-2021-11-15-at-13.55.02.png')

  return DEFAULT_ABOUT_US_BLOCKS.map((block) => {
    if (block.blockType === 'hero' && heroImage) {
      return { ...block, image: heroImage, imageUrl: undefined }
    }
    if (block.blockType === 'imageText' && splitImage) {
      return { ...block, image: splitImage, imageUrl: undefined }
    }
    return block
  })
}

async function main() {
  const payload = await getPayload({ config })
  const aboutBlocks = await buildAboutUsBlocks(payload)

  const about = await payload.find({ collection: 'pages', where: { slug: { equals: 'about-us' } }, limit: 1 })
  if (about.docs[0]) {
    await payload.update({
      collection: 'pages',
      id: about.docs[0].id,
      data: {
        title: 'About Us',
        blocks: aboutBlocks as Page['blocks'],
        seo: {
          title: 'About Us',
          description:
            'Onix Data Centres owns and operates world class carrier neutral colocation data centres across West Africa.',
          canonicalUrl: productionCanonical('/about-us'),
        },
      },
    })
    console.log('Updated about-us page blocks')
  } else {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'About Us',
        slug: 'about-us',
        pageType: 'corporate',
        blocks: aboutBlocks as Page['blocks'],
        seo: {
          title: 'About Us',
          canonicalUrl: productionCanonical('/about-us'),
        },
        legacy: { legacyPath: '/about-us/' },
        _status: 'published',
      },
    })
    console.log('Created about-us page')
  }

  console.log('Group 1 content seed complete')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
