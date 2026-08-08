import { ContactPageTemplate } from '@/components/onix/templates/ContactPageTemplate'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return buildMetadata(
    { title: 'Contact Us', description: 'Contact Onix Data Centre' },
    'Contact Us',
  )
}

export default function ContactPage() {
  return <ContactPageTemplate breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />
}
