type Section = {
  title?: string | null
  bullets?: Array<{ text?: string | null }> | null
}

export function OnixBulletedFeatures({
  heading,
  sections,
  variant = 'light',
}: {
  heading?: string | null
  sections?: Section[] | null
  variant?: 'light' | 'alt'
}) {
  if (!sections?.length) return null

  return (
    <section className={variant === 'alt' ? 'bg-[var(--onix-bg-alt)] py-12 md:py-16' : 'bg-white py-12 md:py-16'}>
      <div className="onix-container">
        {heading && (
          <h2 className="onix-heading-dark mb-10 text-center text-[32px] font-semibold">{heading}</h2>
        )}
        <div className="grid gap-10 md:grid-cols-2">
          {sections.map((section, i) => (
            <div key={i}>
              {section.title && (
                <h3 className="onix-heading-dark text-[22px] font-semibold">{section.title}</h3>
              )}
              {section.bullets?.length ? (
                <ul className="mt-4 space-y-2 text-base leading-[22.4px] text-[var(--onix-body)]">
                  {section.bullets.map((bullet, j) =>
                    bullet.text ? (
                      <li key={j} className="flex gap-2">
                        <span className="text-[var(--onix-red)]">•</span>
                        <span>{bullet.text}</span>
                      </li>
                    ) : null,
                  )}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
