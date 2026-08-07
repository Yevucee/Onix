import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container, Section } from '@/components/layout/Container'
import { ContactForm } from '@/components/forms/ContactForm'
import { PageHero } from '@/components/sections/Hero'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return buildMetadata(
    { title: 'Contact Us', description: 'Contact Onix Data Centre' },
    'Contact Us',
  )
}

export default function ContactPage() {
  return (
    <>
      <Section className="border-b border-[var(--color-border)]">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />
          <PageHero title="Contact Us" intro="Speak with our team about colocation, connectivity and managed services." />
        </Container>
      </Section>
      <Section>
        <Container className="max-w-2xl">
          <ContactForm />
        </Container>
      </Section>
    </>
  )
}
