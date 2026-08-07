import type { Metadata } from 'next'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { getPayloadClient } from '@/lib/payload'
import { getStagingRobotsMeta } from '@/lib/staging'
import './styles.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const stagingRobots = getStagingRobotsMeta()
  return {
    title: {
      default: 'Onix Data Centre',
      template: '%s – Onix Data Centre',
    },
    description: 'Connecting Africa to the Globe',
    robots: stagingRobots,
  }
}

const defaultNav = [
  { label: 'Our Solutions', url: '/home/our-solutions' },
  { label: 'Infrastructure', url: '/home/infrastructure' },
  { label: 'News', url: '/news' },
  { label: 'About Us', url: '/about-us' },
  { label: 'Contact Us', url: '/contact-us' },
]

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayloadClient()
  const [header, footer, siteSettings] = await Promise.all([
    payload.findGlobal({ slug: 'header-navigation' }).catch(() => null),
    payload.findGlobal({ slug: 'footer' }).catch(() => null),
    payload.findGlobal({ slug: 'site-settings' }).catch(() => null),
  ])

  const logo = typeof header?.logo === 'object' && header.logo?.url ? header.logo.url : undefined
  const navItems = header?.items?.length
    ? header.items.map((item) => ({
        label: item.label,
        url: item.url,
        children: item.children?.map((child) => ({ label: child.label, url: child.url })),
      }))
    : defaultNav

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header
          logoUrl={logo}
          siteName={siteSettings?.siteName || 'Onix Data Centre'}
          items={navItems}
          cta={{
            label: header?.cta?.label ?? 'Contact Us',
            url: header?.cta?.url ?? '/about-us',
          }}
        />
        <main id="main-content">{children}</main>
        <Footer
          columns={(footer?.columns || []).map((column) => ({
            heading: column.heading ?? undefined,
            links: column.links?.map((link) => ({ label: link.label, url: link.url })) ?? [],
          }))}
          copyright={footer?.copyright || undefined}
          legalLinks={(footer?.legalLinks || [{ label: 'Privacy Policy', url: '/about-us' }]).map((link) => ({
            label: link.label,
            url: link.url,
          }))}
        />
      </body>
    </html>
  )
}
