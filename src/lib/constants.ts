import { routing } from '@/i18n/routing'

export const BASE_URL = 'https://www.samuel-lecomte.fr'

/**
 * Build hreflang alternates for a given path.
 * Used by layouts (generateMetadata) and sitemap.
 */
export function buildAlternates(path: string) {
  return {
    languages: Object.fromEntries([
      ...routing.locales.map((loc) => [loc, `${BASE_URL}/${loc}${path}`]),
      ['x-default', `${BASE_URL}/${routing.defaultLocale}${path}`],
    ]),
  }
}
