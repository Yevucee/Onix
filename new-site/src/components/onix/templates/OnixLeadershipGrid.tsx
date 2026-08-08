import Image from 'next/image'
import Link from 'next/link'
import type { Leadership } from '@/payload-types'
import { leadershipContactFromLegacyPath } from '@/data/leadership-contacts'
import { leadershipPhotoFromLegacyPath } from '@/data/leadership-photos'
import { getPayloadClient } from '@/lib/payload'
import { getMediaAlt, getMediaUrl } from '@/lib/media-url'

function resolveLeadershipPhoto(person: Leadership, size: 'card' | 'article' = 'card'): string | null {
  const payloadPhoto = getMediaUrl(person.photo, size)
  if (payloadPhoto) return payloadPhoto
  return leadershipPhotoFromLegacyPath(person.legacy?.legacyPath)
}

export async function OnixLeadershipGrid({ heading, intro }: { heading?: string | null; intro?: string | null }) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'leadership',
    where: { visible: { equals: true } },
    sort: 'sortOrder',
    limit: 50,
  })

  return (
    <div>
      {heading && <h2 className="onix-heading-dark text-center text-[40px] font-semibold leading-[48px]">{heading}</h2>}
      {intro && <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-[22.4px] text-[var(--onix-body)]">{intro}</p>}
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {result.docs.map((person) => (
          <OnixLeadershipCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  )
}

function OnixLeadershipCard({ person }: { person: Leadership }) {
  const href = person.legacy?.legacyPath || '#'
  const photo = resolveLeadershipPhoto(person, 'card')
  const photoAlt = getMediaAlt(person.photo, person.name) || person.name

  return (
    <Link href={href} className="group block bg-white p-6 text-center transition-shadow hover:shadow-md">
      {photo ? (
        <Image
          src={photo}
          alt={photoAlt}
          width={200}
          height={200}
          className="mx-auto mb-4 h-40 w-40 rounded-full object-cover"
        />
      ) : (
        <div className="mx-auto mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-[var(--onix-stats-bg)] text-3xl font-semibold text-[var(--onix-red)]">
          {person.name.charAt(0)}
        </div>
      )}
      <h3 className="onix-heading-dark text-lg font-semibold group-hover:text-[var(--onix-red)]">{person.name}</h3>
      {person.title && <p className="mt-1 text-sm text-[var(--onix-muted)]">{person.title}</p>}
    </Link>
  )
}

export function OnixLeadershipProfile({ person }: { person: Leadership }) {
  const photo = resolveLeadershipPhoto(person, 'article')
  const photoAlt = getMediaAlt(person.photo, person.name) || person.name
  const contact = leadershipContactFromLegacyPath(person.legacy?.legacyPath)

  return (
    <article className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <div>
        {photo ? (
          <Image
            src={photo}
            alt={photoAlt}
            width={400}
            height={400}
            className="w-full object-cover"
          />
        ) : (
          <div className="flex aspect-square items-center justify-center bg-[var(--onix-stats-bg)] text-5xl font-semibold text-[var(--onix-red)]">
            {person.name.charAt(0)}
          </div>
        )}
        {person.linkedinUrl && (
          <a
            href={person.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-[var(--onix-red)] hover:underline"
          >
            LinkedIn profile
          </a>
        )}
      </div>
      <div>
        <h1 className="onix-heading-dark text-[40px] font-semibold leading-[48px]">{person.name}</h1>
        {person.title && <p className="mt-2 text-lg text-[var(--onix-muted)]">{person.title}</p>}
        {(contact?.phone || contact?.email) && (
          <div className="mt-6 space-y-2">
            {contact.phone && (
              <p>
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-lg text-[var(--onix-body)] hover:text-[var(--onix-red)]">
                  {contact.phone}
                </a>
              </p>
            )}
            {contact.email && (
              <p>
                <a href={`mailto:${contact.email}`} className="text-lg text-[var(--onix-body)] hover:text-[var(--onix-red)]">
                  {contact.email}
                </a>
              </p>
            )}
          </div>
        )}
        {person.biography && typeof person.biography === 'object' && (
          <div className="onix-prose mt-8 max-w-none text-base leading-[22.4px] text-[var(--onix-body)]">
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
          return text ? <p key={i} className="mb-4">{text}</p> : null
        }
        return null
      })}
    </>
  )
}
