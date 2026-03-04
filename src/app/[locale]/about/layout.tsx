import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export const runtime = 'edge'

const BASE_URL = 'https://www.samuel-lecomte.fr'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('about.title'),
    description: t('about.description'),
    openGraph: {
      title: t('about.ogTitle'),
      description: t('about.ogDescription'),
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/about`,
      languages: {
        en: `${BASE_URL}/en/about`,
        fr: `${BASE_URL}/fr/about`,
        'x-default': `${BASE_URL}/en/about`,
      },
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
