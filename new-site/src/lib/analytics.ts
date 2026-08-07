/**
 * Analytics event hooks — production IDs from environment variables only.
 * Disabled when SITE_ENV=staging.
 */
import { getSiteEnv } from './env'

export type AnalyticsEvent =
  | 'article_view'
  | 'pdf_download'
  | 'file_download'
  | 'contact_form_submission'
  | 'cta_click'
  | 'email_click'
  | 'telephone_click'
  | 'outbound_link_click'

export function trackEvent(event: AnalyticsEvent, params?: Record<string, string | number>) {
  if (getSiteEnv() === 'staging') return
  if (typeof window === 'undefined') return
  const gaId = process.env.NEXT_PUBLIC_GA4_ID
  if (!gaId) return
  // Future: window.gtag?.('event', event, params)
  void event
  void params
}
