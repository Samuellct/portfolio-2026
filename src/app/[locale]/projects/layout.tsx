import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { BASE_URL, buildAlternates } from '@/lib/constants'

type Props = {
  params: Promise<{ locale: string }>
}

const ogLocaleMap: Record<string, string> = { en: 'en_US', fr: 'fr_FR' }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    // A plain string here would reset the root template for the project pages
    // below (TXT-15): re-declare it so a fiche reads "AlpineRoute | Samuel Lecomte".
    title: { default: t('projects.title'), template: t('home.titleTemplate') },
    description: t('projects.description'),
    openGraph: {
      title: t('projects.ogTitle'),
      description: t('projects.ogDescription'),
      locale: ogLocaleMap[locale] || 'en_US',
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/projects`,
      ...buildAlternates('/projects'),
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
