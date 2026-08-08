import Image from 'next/image'
import type { DataCentre } from '@/payload-types'
import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { OnixPageCTA } from '@/components/onix/templates/OnixPageCTA'
import { LexicalContent } from '@/components/articles/LexicalContent'
import type { LexicalRoot } from '@/lib/lexical'
import { getMediaAlt, getMediaUrl } from '@/lib/media-url'

type Crumb = { label: string; href?: string }

function OnixStatsRow({ items }: { items: Array<{ value?: string | null; label?: string | null }> }) {
  if (!items?.length) return null
  return (
    <section className="bg-[var(--onix-stats-bg)] py-4">
      <div className="onix-container">
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((stat, i) => (
            <div key={i} className="m-[17px] px-0 py-[27px] pb-9 text-center">
              <p className="text-5xl font-semibold text-[var(--onix-red)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {stat.value}
              </p>
              <p className="mt-2 text-base leading-[26px] text-[var(--onix-body)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RichSection({ title, content }: { title: string; content?: LexicalRoot | null }) {
  if (!content) return null
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="onix-container">
        <h2 className="onix-heading-dark mb-6 text-[32px] font-semibold">{title}</h2>
        <div className="onix-prose max-w-3xl text-base leading-[22.4px] text-[var(--onix-body)]">
          <LexicalContent content={content} />
        </div>
      </div>
    </section>
  )
}

export function DataCentrePageTemplate({ centre, breadcrumbs }: { centre: DataCentre; breadcrumbs: Crumb[] }) {
  const heroImage = getMediaUrl(centre.heroImage, 'hero')

  return (
    <>
      <div className="border-b border-[var(--onix-border,#e5e5e5)] bg-[var(--onix-bg-alt)]">
        <div className="onix-container">
          <OnixBreadcrumbs items={breadcrumbs} />
          <div className="grid items-center gap-10 py-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--onix-red)]">
                {[centre.city, centre.country].filter(Boolean).join(', ')}
              </p>
              <h1 className="onix-heading-dark mt-2 text-[40px] font-semibold leading-[48px]">{centre.name}</h1>
              {centre.summary && <p className="mt-4 text-base leading-[22.4px] text-[var(--onix-body)]">{centre.summary}</p>}
            </div>
            {heroImage && (
              <Image
                src={heroImage}
                alt={getMediaAlt(centre.heroImage, centre.name)}
                width={800}
                height={500}
                className="h-auto w-full object-cover"
                priority
              />
            )}
          </div>
        </div>
      </div>

      {centre.stats?.length ? <OnixStatsRow items={centre.stats} /> : null}

      {centre.description && (
        <section className="bg-white py-12 md:py-16">
          <div className="onix-container">
            <div className="onix-prose max-w-3xl text-base leading-[22.4px] text-[var(--onix-body)]">
              <LexicalContent content={centre.description} />
            </div>
          </div>
        </section>
      )}

      {centre.infrastructure && <RichSection title="Infrastructure" content={centre.infrastructure} />}
      {centre.connectivity && <RichSection title="Connectivity" content={centre.connectivity} />}
      {centre.sustainability && <RichSection title="Sustainability" content={centre.sustainability} />}

      {centre.certifications?.length ? (
        <section className="bg-[var(--onix-bg-alt)] py-12 md:py-16">
          <div className="onix-container">
            <h2 className="onix-heading-dark mb-8 text-[32px] font-semibold">Certifications</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {centre.certifications.map((cert, i) => (
                <li key={i} className="bg-white p-6">
                  <p className="onix-heading-dark font-semibold">{cert.title}</p>
                  {cert.description && <p className="mt-2 text-sm text-[var(--onix-muted)]">{cert.description}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {centre.downloads?.length ? (
        <section className="bg-white py-12 md:py-16">
          <div className="onix-container">
            <h2 className="onix-heading-dark mb-6 text-[32px] font-semibold">Downloads</h2>
            <ul className="space-y-3">
              {centre.downloads.map((dl, i) => {
                const fileUrl = getMediaUrl(dl.file)
                if (!fileUrl) return null
                return (
                  <li key={i}>
                    <a href={fileUrl} className="text-[var(--onix-red)] hover:underline" download>
                      {dl.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      ) : null}

      <OnixPageCTA
        heading={centre.cta?.heading || 'Discuss facility requirements'}
        body={centre.cta?.body || 'Contact our team to learn more about Onix data centres.'}
        buttonLabel={centre.cta?.buttonLabel || 'Contact us'}
        buttonUrl={centre.cta?.buttonUrl || '/contact-us'}
      />
    </>
  )
}
