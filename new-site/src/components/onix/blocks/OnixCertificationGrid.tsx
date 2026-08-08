import Image from 'next/image'
import type { Media } from '@/payload-types'
import { getMediaAlt, getMediaUrl } from '@/lib/media-url'

type CertItem = {
  title: string
  description?: string | null
  image?: number | Media | null
  imageUrl?: string | null
}

export function OnixCertificationGrid({
  intro,
  items,
}: {
  intro?: string | null
  items: CertItem[]
}) {
  if (!items.length) return null

  return (
    <section className="bg-[var(--onix-bg-alt)] py-12 md:py-16">
      <div className="onix-container">
        {intro && (
          <p className="mx-auto mb-12 max-w-3xl text-center text-base leading-[22.4px] text-[var(--onix-body)]">{intro}</p>
        )}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const imageUrl = getMediaUrl(item.image, 'card') || item.imageUrl || null
            return (
              <div key={i} className="bg-white p-6 text-center">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={getMediaAlt(item.image, item.title)}
                    width={160}
                    height={160}
                    className="mx-auto mb-6 h-32 w-32 object-contain"
                  />
                )}
                <h3 className="onix-heading-dark text-xl font-semibold">{item.title}</h3>
                {item.description && (
                  <p className="mt-3 text-sm leading-[22.4px] text-[var(--onix-body)]">{item.description}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
