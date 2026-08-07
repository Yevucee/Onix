import type { Media } from '@/payload-types'

export function getMediaUrl(media: number | Media | null | undefined, size?: 'thumbnail' | 'card' | 'article' | 'hero'): string | undefined {
  if (!media || typeof media === 'number') return undefined
  if (size && media.sizes?.[size]?.url) return media.sizes[size].url || undefined
  return media.url || undefined
}

export function getMediaAlt(media: number | Media | null | undefined, fallback = ''): string {
  if (!media || typeof media === 'number') return fallback
  return media.alt || fallback
}
