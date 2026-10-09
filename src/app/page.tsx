import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { routing } from '@/i18n/routing'

// AUDIT-038: the bare root picks the visitor's language from Accept-Language,
// weighted by q, and falls back to the default locale (crawlers send no header,
// so they keep landing on it). Only `/` negotiates; `/fr` and `/en` never
// redirect. Reading headers makes the route dynamic, so the 307 is not cached.
function negotiateLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return routing.defaultLocale
  const ranked = acceptLanguage
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().toLowerCase().split(';')
      const q = params.find((p) => p.trim().startsWith('q='))
      return { lang: tag.split('-')[0], q: q ? Number(q.trim().slice(2)) : 1, index }
    })
    .filter((entry) => entry.lang && !Number.isNaN(entry.q) && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index)
  const match = ranked.find((entry) => (routing.locales as readonly string[]).includes(entry.lang))
  return match ? match.lang : routing.defaultLocale
}

export default async function RootPage() {
  const locale = negotiateLocale((await headers()).get('accept-language'))
  redirect(`/${locale}`)
}
