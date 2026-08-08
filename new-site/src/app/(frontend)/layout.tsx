import type { Metadata } from 'next'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { LIVE_HEADER_CTA, LIVE_HEADER_NAV } from '@/data/live-site'
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

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayloadClient()
  const [header, siteSettings] = await Promise.all([
    payload.findGlobal({ slug: 'header-navigation' }).catch(() => null),
    payload.findGlobal({ slug: 'site-settings' }).catch(() => null),
  ])

  const logo = typeof header?.logo === 'object' && header.logo?.url ? header.logo.url : undefined

  // CHECKPOINT 1B: live production site is the navigation source of truth.
  // Payload header-navigation global is incomplete (missing dropdowns, language switch).
  const navItems = LIVE_HEADER_NAV

  const cta = {
    label: header?.cta?.label || LIVE_HEADER_CTA.label,
    url: header?.cta?.url || LIVE_HEADER_CTA.url,
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header logoUrl={logo} siteName={siteSettings?.siteName || 'Onix Data Centres'} items={navItems} cta={cta} />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
