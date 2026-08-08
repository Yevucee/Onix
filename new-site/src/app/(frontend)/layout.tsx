import type { Metadata } from 'next'
import { OnixFooter } from '@/components/onix/OnixFooter'
import { OnixHeader } from '@/components/onix/OnixHeader'
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

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OnixHeader />
        <main id="main-content">{children}</main>
        <OnixFooter />
      </body>
    </html>
  )
}
