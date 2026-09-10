import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { BASE_URL, buildAlternates } from '@/lib/constants'

export const runtime = 'edge'

type Props = {
  params: Promise<{ locale: string }>
}

const ogLocaleMap: Record<string, string> = { en: 'en_US', fr: 'fr_FR' }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('about.title'),
    description: t('about.description'),
    openGraph: {
      title: t('about.ogTitle'),
      description: t('about.ogDescription'),
      locale: ogLocaleMap[locale] || 'en_US',
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/about`,
      ...buildAlternates('/about'),
    },
  }
}

export default async function AboutLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return children
}
