import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { BASE_URL, OG_IMAGE, buildAlternates, OG_LOCALE } from '@/lib/constants'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import { toLocale } from '@/i18n/locale'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('about.title'),
    description: t('about.description'),
    openGraph: {
      title: t('about.ogTitle'),
      description: t('about.ogDescription'),
      locale: OG_LOCALE[locale] || 'en_US',
      images: [OG_IMAGE],
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
  const locale = toLocale((await params).locale)
  setRequestLocale(locale)
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  return (
    <>
      <BreadcrumbJsonLd locale={locale} items={[{ name: tNav('home'), path: '' }, { name: tNav('about'), path: '/about' }]} />
      {children}
    </>
  )
}
