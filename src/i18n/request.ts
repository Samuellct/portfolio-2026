import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'
import { frenchSpacing } from '@/lib/projects/helpers'

type Messages = { [key: string]: string | Messages }

function spaceMessages(messages: Messages): Messages {
  return Object.fromEntries(
    Object.entries(messages).map(([key, value]) => [
      key,
      typeof value === 'string' ? frenchSpacing(value) : spaceMessages(value),
    ])
  )
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale
  const messages = (await import(`../../messages/${locale}.json`)).default
  return {
    locale,
    messages: locale === 'fr' ? spaceMessages(messages) : messages
  }
})
