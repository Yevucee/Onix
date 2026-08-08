import { ContactPageTemplate, contactPageMetadata } from '@/components/onix/templates/ContactPageTemplate'

export async function generateMetadata() {
  return contactPageMetadata()
}

export default function ContactPage() {
  return <ContactPageTemplate breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />
}
