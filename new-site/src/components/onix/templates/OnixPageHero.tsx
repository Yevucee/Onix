import Image from 'next/image'
import { OnixButton } from '@/components/onix/OnixButton'

export type OnixPageHeroProps = {
  eyebrow?: string
  title: string
  intro?: string
  imageUrl?: string
  imageAlt?: string
  ctaLabel?: string
  ctaUrl?: string
  variant?: 'default' | 'dark'
}

export function OnixPageHero({
  eyebrow,
  title,
  intro,
  imageUrl,
  imageAlt,
  ctaLabel,
  ctaUrl,
  variant = 'default',
}: OnixPageHeroProps) {
  const isDark = variant === 'dark'

  if (imageUrl) {
    return (
      <section className={isDark ? 'bg-[var(--onix-navy)] py-16 md:py-20' : 'bg-white py-16 md:py-20'}>
        <div className="onix-container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              {eyebrow && (
                <p className={`text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-[var(--onix-red)]' : 'text-[var(--onix-red)]'}`}>
                  {eyebrow}
                </p>
              )}
              <h1 className={`mt-2 text-[40px] font-semibold leading-[48px] ${isDark ? 'onix-heading-light' : 'onix-heading-dark'}`}>
                {title}
              </h1>
              {intro && (
                <p className={`mt-4 text-base leading-[22.4px] ${isDark ? 'text-white/80' : 'text-[var(--onix-body)]'}`}>{intro}</p>
              )}
              {ctaLabel && ctaUrl && (
                <OnixButton variant="primary-red" href={ctaUrl} className="mt-8" icon={<span aria-hidden>→</span>}>
                  {ctaLabel}
                </OnixButton>
              )}
            </div>
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              width={800}
              height={500}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-12 md:py-16 ${isDark ? 'bg-[var(--onix-navy)]' : 'bg-white'}`}>
      <div className="onix-container">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--onix-red)]">{eyebrow}</p>
        )}
        <h1 className={`mt-2 text-[40px] font-semibold leading-[48px] ${isDark ? 'onix-heading-light' : 'onix-heading-dark'}`}>
          {title}
        </h1>
        {intro && (
          <p className={`mt-4 max-w-3xl text-base leading-[22.4px] ${isDark ? 'text-white/80' : 'text-[var(--onix-body)]'}`}>
            {intro}
          </p>
        )}
        {ctaLabel && ctaUrl && (
          <OnixButton variant="primary-red" href={ctaUrl} className="mt-8" icon={<span aria-hidden>→</span>}>
            {ctaLabel}
          </OnixButton>
        )}
      </div>
    </section>
  )
}
