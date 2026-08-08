import { ContactForm } from '@/components/forms/ContactForm'
import { LIVE_FOOTER } from '@/data/live-site'
import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { OnixPageHero } from '@/components/onix/templates/OnixPageHero'

type Crumb = { label: string; href?: string }

export function ContactPageTemplate({ breadcrumbs }: { breadcrumbs: Crumb[] }) {
  const { contact } = LIVE_FOOTER

  return (
    <>
      <div className="border-b border-[var(--onix-border,#e5e5e5)] bg-white">
        <div className="onix-container">
          <OnixBreadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <OnixPageHero
        title="Contact Us"
        intro="Speak with our team about colocation, connectivity and managed services."
      />

      <section className="bg-white py-12 md:py-16">
        <div className="onix-container">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <div>
              <h2 className="onix-heading-dark mb-6 text-[28px] font-semibold">Send us a message</h2>
              <ContactForm />
            </div>
            <aside className="bg-[var(--onix-bg-alt)] p-8">
              <h2 className="onix-heading-dark text-[22px] font-semibold">{contact.heading}</h2>
              <div className="mt-6 space-y-4 text-base text-[var(--onix-body)]">
                <p>
                  <span className="block text-sm font-medium text-[var(--onix-muted)]">Email</span>
                  <a href={`mailto:${contact.email}`} className="text-[var(--onix-red)] hover:underline">
                    {contact.email}
                  </a>
                </p>
                {contact.phones.map((phone) => (
                  <p key={phone}>
                    <span className="block text-sm font-medium text-[var(--onix-muted)]">Phone</span>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-[var(--onix-red)]">
                      {phone}
                    </a>
                  </p>
                ))}
                <p>
                  <span className="block text-sm font-medium text-[var(--onix-muted)]">Ghana</span>
                  Accra, Ghana
                </p>
                <p>
                  <span className="block text-sm font-medium text-[var(--onix-muted)]">Senegal</span>
                  Dakar, Senegal
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
