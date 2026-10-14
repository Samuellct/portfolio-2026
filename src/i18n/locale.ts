import { hasLocale, type Locale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from './routing'

/**
 * Narrows a route's `[locale]` segment to a site locale (server code only).
 * An unknown locale is a 404, as in the `[locale]` layout.
 */
export function toLocale(segment: string): Locale {
  if (!hasLocale(routing.locales, segment)) notFound()
  return segment
}
