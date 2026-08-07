import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container, Section } from '@/components/layout/Container'
import { RoiCalculator } from '@/components/roi/RoiCalculator'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return buildMetadata(
    {
      title: 'CFO ROI Calculator',
      description: 'Compare in-house data centre costs with Onix colocation.',
      canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/home/cfo-roi/`,
    },
    'CFO ROI Calculator',
  )
}

export default function CfoRoiPage() {
  return (
    <>
      <Section className="border-b">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'CFO ROI Calculator' }]} />
        </Container>
      </Section>
      <RoiCalculator />
    </>
  )
}
