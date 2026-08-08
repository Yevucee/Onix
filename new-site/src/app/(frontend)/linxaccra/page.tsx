import { SpecialistPageTemplate } from '@/components/onix/templates/SpecialistPageTemplate'
import { productionCanonical } from '@/lib/canonical'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return buildMetadata(
    {
      title: 'LINX Accra',
      description: 'Peer at LINX Accra from Onix — the new Internet Exchange Point for West Africa.',
      canonicalUrl: productionCanonical('/linxaccra'),
    },
    'LINX Accra',
  )
}

export default function LinxAccraPage() {
  return (
    <SpecialistPageTemplate
      variant="linx"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'LINX Accra' }]}
    />
  )
}
