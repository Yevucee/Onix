import { ContactForm } from '@/components/forms/ContactForm'
import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { OnixPageCTA } from '@/components/onix/templates/OnixPageCTA'
import { FRENCH_BREADCRUMB_HOME } from '@/data/french-site'
import { productionCanonical } from '@/lib/canonical'
import { buildMetadata } from '@/lib/seo'

const OFFICES = [
  {
    region: 'Siège international',
    name: 'Siège international',
    address: '6th Floor, International House, 4 Maddox Street, Mayfair, London, W1S 1QP, UK',
  },
  {
    region: 'Ghana',
    name: 'Bureau principal Ghana',
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
    region: 'Sénégal',
    name: 'Bureau principal Sénégal',
    address: "8 Avenue Léopold Sédar Senghor, Place de l'indépendance, Dakar, Sénégal",
  },
  {
    region: 'Sénégal',
    name: 'Onix Data Centre',
    address: '2Africa Landing station, Almadies, Dakar',
    phone: '+221 77 668 41 10',
    email: 'Senegal@onixdatacentres.com',
  },
]

export function frenchContactPageMetadata() {
  return buildMetadata(
    {
      title: 'Contactez-nous',
      description: 'Contactez Onix Data Centre — bureaux au Ghana et au Sénégal.',
      canonicalUrl: productionCanonical('/fr/contactez-nous'),
      hreflangPath: '/fr/contactez-nous/',
    },
    'Contactez-nous',
  )
}

export function FrenchContactPageTemplate() {
  return (
    <>
      <div className="border-b border-[var(--onix-border,#e5e5e5)] bg-white">
        <div className="onix-container">
          <OnixBreadcrumbs items={[FRENCH_BREADCRUMB_HOME, { label: 'Contactez-nous' }]} />
        </div>
      </div>

      <section className="bg-white py-12 md:py-16">
        <div className="onix-container">
          <h2 className="onix-heading-dark text-[40px] font-semibold leading-[48px]">Nous serions ravis de vous entendre</h2>
          <p className="mt-4 text-base leading-[22.4px] text-[var(--onix-body)]">
            Restez en contact avec nos équipes au Ghana, au Sénégal et au Royaume-Uni.
          </p>
        </div>
      </section>

      <section className="bg-[var(--onix-bg-alt)] py-12 md:py-16">
        <div className="onix-container">
          <h2 className="onix-heading-dark mb-8 text-[32px] font-semibold">Restez connecté</h2>
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
            <h1 className="onix-heading-dark mb-6 text-[40px] font-semibold leading-[48px]">Envoyez-nous un message</h1>
            <ContactForm locale="fr" />
          </div>
        </div>
      </section>

      <OnixPageCTA
        heading="Contactez-nous dès aujourd'hui"
        body="Parlez à notre équipe de colocation, connectivité et services gérés."
        buttonLabel="Contactez-nous"
        buttonUrl="/fr/contactez-nous"
      />
    </>
  )
}
