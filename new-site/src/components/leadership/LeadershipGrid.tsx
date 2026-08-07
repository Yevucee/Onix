import Image from 'next/image'
import Link from 'next/link'
import type { Leadership } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'
import { getMediaAlt, getMediaUrl } from '@/lib/media-url'

export async function LeadershipGrid({ heading, intro }: { heading?: string | null; intro?: string | null }) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'leadership',
    where: { visible: { equals: true } },
    sort: 'sortOrder',
    limit: 50,
  })

  return (
    <div>
      {heading && <h2 className="text-3xl font-semibold">{heading}</h2>}
      {intro && <p className="mt-4 max-w-3xl text-[var(--color-muted)]">{intro}</p>}
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {result.docs.map((person) => (
          <LeadershipCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  )
}

function LeadershipCard({ person }: { person: Leadership }) {
  const href = person.legacy?.legacyPath || '#'
  const photo = getMediaUrl(person.photo, 'card')

  return (
    <Link href={href} className="group block rounded-[var(--radius-card)] border bg-white p-6 shadow-sm transition hover:shadow-md">
      {photo ? (
        <Image
          src={photo}
          alt={getMediaAlt(person.photo, person.name)}
          width={320}
          height={320}
          className="mx-auto mb-4 h-40 w-40 rounded-full object-cover"
        />
      ) : (
        <div className="mx-auto mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-[var(--color-background-alt)] text-2xl font-semibold text-[var(--color-brand)]">
          {person.name.charAt(0)}
        </div>
      )}
      <h3 className="text-lg font-semibold group-hover:text-[var(--color-brand)]">{person.name}</h3>
      {person.title && <p className="mt-1 text-sm text-[var(--color-muted)]">{person.title}</p>}
    </Link>
  )
}

export function LeadershipProfileView({ person }: { person: Leadership }) {
  const photo = getMediaUrl(person.photo, 'article')

  return (
    <article className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <div>
        {photo ? (
          <Image
            src={photo}
            alt={getMediaAlt(person.photo, person.name)}
            width={400}
            height={400}
            className="w-full rounded-[var(--radius-card)] object-cover"
          />
        ) : (
          <div className="flex aspect-square items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-background-alt)] text-5xl font-semibold text-[var(--color-brand)]">
            {person.name.charAt(0)}
          </div>
        )}
        {person.linkedinUrl && (
          <a
            href={person.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-[var(--color-brand)] hover:underline"
            data-analytics-event="outbound_link_click"
          >
            LinkedIn profile
          </a>
        )}
      </div>
      <div>
        <h1 className="text-4xl font-semibold">{person.name}</h1>
        {person.title && <p className="mt-2 text-lg text-[var(--color-muted)]">{person.title}</p>}
        {person.biography && typeof person.biography === 'object' && (
          <div className="prose mt-8 max-w-none">
            <LexicalBio content={person.biography} />
          </div>
        )}
      </div>
    </article>
  )
}

function LexicalBio({ content }: { content: { root?: { children?: Array<{ type: string; children?: Array<{ text?: string }> }> } } }) {
  const paragraphs = content.root?.children || []
  return (
    <>
      {paragraphs.map((node, i) => {
        if (node.type === 'paragraph') {
          const text = node.children?.map((c) => c.text || '').join('') || ''
          return text ? <p key={i}>{text}</p> : null
        }
        return null
      })}
    </>
  )
}
