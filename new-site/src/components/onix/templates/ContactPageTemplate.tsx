import { ContactForm } from '@/components/forms/ContactForm'
import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { OnixPageCTA } from '@/components/onix/templates/OnixPageCTA'
import { productionCanonical } from '@/lib/canonical'
import { buildMetadata } from '@/lib/seo'

type Crumb = { label: string; href?: string }

const OFFICES = [
  {
    region: 'International Head Office',
    name: 'International Head Office',
    address: '6th Floor, International House, 4 Maddox Street, Mayfair, London, W1S 1QP, UK',
  },
  {
    region: 'Ghana',
    name: 'Ghana Head Office',
    address: 'Shalom Villas, 3d, Onyasia Cres, Accra',
  },
  {
    region: 'Ghana',
    name: 'Onix Data Centre',
    address: 'Amrahia-Katamanso Towards Dodowa Accra, Ghana',
    phone: '+233 50 086 5266',
    email: 'info@onixdatacentres.com',
  },
  {
    region: 'Senegal',
    name: 'Senegal Head Office',
    address: "8 Avenue Léopold Sédar Senghor, Place de l'indépendance, Dakar, Sénégal",
  },
  {
    region: 'Senegal',
    name: 'Onix Data Centre',
    address: '2Africa Landing station, Almadies, Dakar',
    phone: '+221 77 668 41 10',
    email: 'Senegal@onixdatacentres.com',
  },
]

export function contactPageMetadata() {
  return buildMetadata(
    {
      title: 'Contact Us',
      description: 'Contact Onix Data Centre — Ghana and Senegal offices.',
      canonicalUrl: productionCanonical('/contact-us'),
      hreflangPath: '/contact-us/',
    },
    'Contact Us',
  )
}

export function ContactPageTemplate({ breadcrumbs }: { breadcrumbs: Crumb[] }) {
  return (
    <>
      <div className="border-b border-[var(--onix-border,#e5e5e5)] bg-white">
        <div className="onix-container">
          <OnixBreadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <section className="bg-white py-12 md:py-16">
        <div className="onix-container">
          <h2 className="onix-heading-dark text-[40px] font-semibold leading-[48px]">We would love to hear from you</h2>
          <p className="mt-4 text-base leading-[22.4px] text-[var(--onix-body)]">Stay connected with our teams in Ghana, Senegal and the UK.</p>
        </div>
      </section>

      <section className="bg-[var(--onix-bg-alt)] py-12 md:py-16">
        <div className="onix-container">
          <h2 className="onix-heading-dark mb-8 text-[32px] font-semibold">Stay Connected</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {OFFICES.map((office) => (
              <div key={`${office.region}-${office.name}`} className="bg-white p-6">
                <p className="text-sm font-medium uppercase tracking-wide text-[var(--onix-red)]">{office.region}</p>
                <h3 className="onix-heading-dark mt-2 text-lg font-semibold">{office.name}</h3>
                <p className="mt-3 text-sm leading-[22.4px] text-[var(--onix-body)]">{office.address}</p>
                {office.phone && (
                  <p className="mt-2">
                    <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-[var(--onix-red)] hover:underline">
                      {office.phone}
                    </a>
                  </p>
                )}
                {office.email && (
                  <p className="mt-1">
                    <a href={`mailto:${office.email}`} className="text-[var(--onix-red)] hover:underline">
                      {office.email}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="onix-container">
          <div className="mx-auto max-w-2xl">
            <h1 className="onix-heading-dark mb-6 text-[40px] font-semibold leading-[48px]">Send us a message</h1>
            <ContactForm />
          </div>
        </div>
      </section>

      <OnixPageCTA
        heading="Get in touch with us today"
        body="Speak with our team about colocation, connectivity and managed services."
        buttonLabel="Contact us"
        buttonUrl="/contact-us"
      />
    </>
  )
}
