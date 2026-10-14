import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { BASE_URL, OG_IMAGE, buildAlternates, OG_LOCALE } from '@/lib/constants'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'

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
      locale: OG_LOCALE[locale] || 'en_US',
      images: [OG_IMAGE],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/contact`,
      ...buildAlternates('/contact'),
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
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  return (
    <>
      <BreadcrumbJsonLd locale={locale} items={[{ name: tNav('home'), path: '' }, { name: tNav('contact'), path: '/contact' }]} />
      {children}
    </>
  )
}
