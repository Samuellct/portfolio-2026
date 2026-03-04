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
    title: t('projects.title'),
    description: t('projects.description'),
    openGraph: {
      title: t('projects.ogTitle'),
      description: t('projects.ogDescription'),
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/projects`,
      languages: {
        en: `${BASE_URL}/en/projects`,
        fr: `${BASE_URL}/fr/projects`,
        'x-default': `${BASE_URL}/en/projects`,
      },
    },
  }
}

export default async function ProjectsLayout({
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
