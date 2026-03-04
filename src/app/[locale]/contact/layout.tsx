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
    title: t('contact.title'),
    description: t('contact.description'),
    openGraph: {
      title: t('contact.ogTitle'),
      description: t('contact.ogDescription'),
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/contact`,
      languages: {
        en: `${BASE_URL}/en/contact`,
        fr: `${BASE_URL}/fr/contact`,
        'x-default': `${BASE_URL}/en/contact`,
      },
    },
  }
}

export default async function ContactLayout({
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
