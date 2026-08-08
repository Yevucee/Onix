import { OnixButton } from '@/components/onix/OnixButton'

export function OnixPageCTA({
  heading,
  body,
  buttonLabel = 'Contact us',
  buttonUrl = '/contact-us',
}: {
  heading?: string
  body?: string
  buttonLabel?: string
  buttonUrl?: string
}) {
  if (!heading && !body) return null

  return (
    <section className="bg-[var(--onix-navy)] py-16 text-center md:py-20">
      <div className="onix-content px-6">
        {heading && <h2 className="onix-heading-light text-[40px] font-semibold leading-[1.2]">{heading}</h2>}
        {body && <p className="mx-auto mt-4 max-w-2xl text-base leading-[22.4px] text-white/80">{body}</p>}
        <OnixButton variant="primary-red" href={buttonUrl} className="mt-8" icon={<span aria-hidden>→</span>}>
          {buttonLabel}
        </OnixButton>
      </div>
    </section>
  )
}
