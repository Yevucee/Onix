import Image from 'next/image'
import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { OnixButton } from '@/components/onix/OnixButton'
import { OnixPageCTA } from '@/components/onix/templates/OnixPageCTA'
import { OUR_SOLUTIONS_SECTIONS } from '@/data/solution-pages'

type Crumb = { label: string; href?: string }

export function OurSolutionsPageTemplate({ breadcrumbs }: { breadcrumbs: Crumb[] }) {
  return (
    <>
      <div className="border-b border-[var(--onix-border,#e5e5e5)] bg-white">
        <div className="onix-container">
          <OnixBreadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <section className="relative flex min-h-[360px] items-center bg-[var(--onix-navy)] py-16 md:min-h-[420px]">
        <Image
          src="/images/solutions/solutions-hero.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="onix-container relative z-10 text-center">
          <h1 className="onix-heading-light text-[32px] font-semibold leading-[1.2] md:text-[48px]">
            Welcome to Onix Data Centres!
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-[22.4px] text-white/85">
            Here, we offer bespoke solutions tailored to your unique needs. Our team is ready to help you find the
            perfect fit. Explore below to see how we can elevate your data management, with streamlined efficiency and
            top-tier security.
          </p>
        </div>
      </section>

      {OUR_SOLUTIONS_SECTIONS.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={index % 2 === 0 ? 'bg-white py-12 md:py-16' : 'bg-[var(--onix-bg-alt)] py-12 md:py-16'}
        >
          <div className="onix-container">
            <h2 className="onix-heading-dark text-[40px] font-semibold leading-[48px]">{section.title}</h2>
            {section.intro && (
              <p className="mt-4 max-w-3xl text-base leading-[22.4px] text-[var(--onix-body)]">{section.intro}</p>
            )}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {section.features.map((feature) => (
                <div
                  key={feature.title}
                  className={`p-6 md:p-8 ${index % 2 === 0 ? 'border border-[var(--onix-border,#e5e5e5)] bg-white shadow-sm' : 'bg-white shadow-sm'}`}
                >
                  <h3 className="onix-heading-dark text-[22px] font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-base leading-[22.4px] text-[var(--onix-body)]">{feature.body}</p>
                </div>
              ))}
            </div>
            {'linkUrl' in section && section.linkUrl && (
              <div className="mt-8">
                <OnixButton variant="primary-red" href={section.linkUrl} icon={<span aria-hidden>→</span>}>
                  {section.linkLabel || 'Learn more'}
                </OnixButton>
              </div>
            )}
          </div>
        </section>
      ))}

      <OnixPageCTA
        heading="Get in touch with us today"
        body="Speak with our team about colocation, connectivity and managed services."
        buttonLabel="Contact us"
        buttonUrl="/contact-us"
      />
    </>
  )
}
