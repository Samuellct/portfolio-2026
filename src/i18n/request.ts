import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'
import { frenchSpacing, unitSpacing } from '@/lib/projects/helpers'

type Messages = { [key: string]: string | Messages }

function spaceMessages(messages: Messages, fix: (text: string) => string): Messages {
  return Object.fromEntries(
    Object.entries(messages).map(([key, value]) => [
      key,
      typeof value === 'string' ? fix(value) : spaceMessages(value, fix),
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
    messages: spaceMessages(
      messages,
      locale === 'fr' ? (text) => frenchSpacing(unitSpacing(text)) : unitSpacing
    )
  }
})
