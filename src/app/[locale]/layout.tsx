import type { Metadata, Viewport } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google'
import { hasLocale } from 'next-intl'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Providers } from '../providers'
import '@/styles/globals.css'

const BASE_URL = 'https://www.samuel-lecomte.fr'

// Fonts optimized by Next.js
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas',
})

export const viewport: Viewport = {
  themeColor: '#030308',
  width: 'device-width',
  initialScale: 1,
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Props = {
  params: Promise<{ locale: string }>
}

const ogLocaleMap: Record<string, string> = { en: 'en_US', fr: 'fr_FR' }
const langTagMap: Record<string, string> = { en: 'en-US', fr: 'fr-FR' }

function buildJsonLd(locale: string, t: (key: string) => string) {
  const inLanguage = langTagMap[locale] || 'en-US'
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'Samuel Lecomte Portfolio',
        description: t('jsonLd.siteDescription'),
        publisher: { '@id': `${BASE_URL}/#person` },
        inLanguage,
      },
      {
        '@type': 'Person',
        '@id': `${BASE_URL}/#person`,
        name: 'Samuel Lecomte',
        url: BASE_URL,
        jobTitle: t('jsonLd.jobTitle'),
        description: t('jsonLd.personDescription'),
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'Université Clermont Auvergne',
          url: 'https://www.uca.fr',
        },
        knowsAbout: [
          'Particle Physics',
          'Data Science',
          'Python',
          'ROOT',
          'Machine Learning',
          'Data Analysis',
          'Scientific Computing',
        ],
        sameAs: [
          'https://github.com/Samuellct',
          'https://www.linkedin.com/in/samuel-lecomte37/',
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/#webpage`,
        url: BASE_URL,
        name: t('home.titleDefault'),
        isPartOf: { '@id': `${BASE_URL}/#website` },
        about: { '@id': `${BASE_URL}/#person` },
        description: t('jsonLd.webpageDescription'),
        inLanguage,
      },
    ],
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: t('home.titleDefault'),
      template: t('home.titleTemplate'),
    },
    description: t('home.description'),
    keywords: ['Samuel Lecomte', 'Particle Physics', 'Data Engineer', 'CERN', 'DevOps', 'Data Analysis', 'Portfolio', 'Physics', 'Data Science'],
    authors: [{ name: 'Samuel Lecomte' }],
    creator: 'Samuel Lecomte',
    publisher: 'Samuel Lecomte',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocaleMap[locale] || 'en_US',
      url: `${BASE_URL}/${locale}`,
      siteName: 'Samuel Lecomte Portfolio',
      title: t('home.titleDefault'),
      description: t('home.ogDescription'),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('home.twitterTitle'),
      description: t('home.twitterDescription'),
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        fr: `${BASE_URL}/fr`,
        'x-default': `${BASE_URL}/en`,
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Load messages for next-intl
  const messages = (await import(`../../../messages/${locale}.json`)).default

  // Build locale-aware JSON-LD
  const t = await getTranslations({ locale, namespace: 'metadata' })
  const jsonLd = buildJsonLd(locale, t)

  return (
    <html lang={locale} className={`${inter.variable} ${bebasNeue.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
