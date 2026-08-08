import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { RoiCalculator } from '@/components/roi/RoiCalculator'
import { productionCanonical } from '@/lib/canonical'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return buildMetadata(
    {
      title: 'CFO ROI Calculator',
      description: 'Compare in-house data centre costs with Onix colocation.',
      canonicalUrl: productionCanonical('/home/cfo-roi'),
    },
    'CFO ROI Calculator',
  )
}

export default function CfoRoiPage() {
  return (
    <>
      <div className="border-b border-[var(--onix-border,#e5e5e5)] bg-white">
        <div className="onix-container">
          <OnixBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'CFO ROI Calculator' }]} />
        </div>
      </div>
      <RoiCalculator />
    </>
  )
}
