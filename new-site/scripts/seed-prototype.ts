/**
 * Seeds Phase 2 prototype content into Payload.
 * Run: npm run seed (from new-site/)
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function seed() {
  const payload = await getPayload({ config })

  const admin = await payload.find({ collection: 'users', limit: 1 })
  if (!admin.docs.length) {
    if (process.env.SITE_ENV === 'staging') {
      console.error('Staging requires STAGING_ADMIN_EMAIL/PASSWORD via npm run staging:admin — not default seed')
      process.exit(1)
    }
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@onix.local',
        password: 'ChangeMeNow123!',
        name: 'Onix Admin',
        role: 'admin',
      },
    })
    console.log('Created admin user: admin@onix.local')
  }

  const categories = ['news', 'technology', 'data']
  for (const slug of categories) {
    const existing = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
    if (!existing.docs.length) {
      await payload.create({
        collection: 'categories',
        data: { name: slug.charAt(0).toUpperCase() + slug.slice(1), slug },
      })
    }
  }

  const homeExists = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })
  if (!homeExists.docs.length) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Onix Data Centre',
        slug: 'home',
        pageType: 'homepage',
        _status: 'published',
        blocks: [
          {
            blockType: 'hero',
            eyebrow: 'Connecting Africa to the Globe',
            heading: 'Carrier-neutral data centre infrastructure for Africa',
            subheading:
              'Secure, resilient colocation, cloud connectivity and peering from Ghana — built for enterprises, carriers and public sector organisations.',
            ctaLabel: 'Explore our solutions',
            ctaUrl: '/about-us',
          },
        ],
        seo: {
          title: 'Onix Data Centre',
          description: 'Connecting Africa to the Globe',
          canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL,
        },
      },
    })
  }

  const aboutExists = await payload.find({ collection: 'pages', where: { slug: { equals: 'about-us' } }, limit: 1 })
  if (!aboutExists.docs.length) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'About Us',
        slug: 'about-us',
        pageType: 'corporate',
        _status: 'published',
        blocks: [
          {
            blockType: 'richText',
            body: '<p>Onix Data Centre provides carrier-neutral colocation, connectivity and managed services from Ghana, supporting organisations across Africa with resilient digital infrastructure.</p><p>Our facilities are designed to meet demanding uptime, security and compliance requirements for enterprises, financial institutions, carriers and public sector bodies.</p>',
          },
        ],
        seo: { canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/about-us` },
        legacy: { legacyPath: '/about-us/', wordpressId: 0 },
      },
    })
  }

  const senegalExists = await payload.find({ collection: 'data-centres', where: { slug: { equals: 'senegal' } }, limit: 1 })
  if (!senegalExists.docs.length) {
    await payload.create({
      collection: 'data-centres',
      data: {
        name: 'Senegal',
        slug: 'senegal',
        city: 'Dakar',
        country: 'Senegal',
        summary: 'Onix presence in Senegal supporting regional connectivity and digital infrastructure growth.',
        _status: 'published',
        stats: [
          { value: 'Tier IV', label: 'Design alignment' },
          { value: '24/7', label: 'Operations' },
          { value: '100%', label: 'Carrier neutral' },
        ],
        certifications: [{ title: 'ISO-aligned operations', description: 'Management systems aligned to international standards.' }],
        seo: { canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/senegal` },
        legacy: { legacyPath: '/senegal/' },
        cta: { heading: 'Discuss Senegal requirements', buttonLabel: 'Contact us', buttonUrl: '/about-us' },
      },
    })
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Onix Data Centre',
      tagline: 'Connecting Africa to the Globe',
      contactEmail: 'info@onixdatacentres.com',
    },
  })

  await payload.updateGlobal({
    slug: 'header-navigation',
    data: {
      items: [
        { label: 'Our Solutions', url: '/about-us' },
        { label: 'Senegal', url: '/senegal' },
        { label: 'Infrastructure', url: '/about-us' },
        { label: 'Blog', url: '/2025/11/13/what-is-peering/' },
      ],
      cta: { label: 'Contact Us', url: '/about-us' },
    },
  })

  console.log('Prototype seed complete')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
