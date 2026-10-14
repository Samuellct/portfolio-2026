import type { Metadata, Viewport } from 'next'
import { Schibsted_Grotesk, Space_Mono, Fraunces } from 'next/font/google'
import { hasLocale } from 'next-intl'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { BASE_URL, SOCIAL, OG_LOCALE, LANG_TAG } from '@/lib/constants'
import { SURFACE } from '@/lib/theme'
import { Providers } from '../providers'
import '@/styles/globals.css'
import { toLocale } from '@/i18n/locale'

// Fonts optimized by Next.js
// One grotesque carries display and text (A4: three families at most)
const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-schibsted',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['opsz'],
  style: ['italic'],
})

export const viewport: Viewport = {
  themeColor: SURFACE.shell,
  width: 'device-width',
  initialScale: 1,
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Props = {
  params: Promise<{ locale: string }>
}

function buildJsonLd(locale: string, t: Awaited<ReturnType<typeof getTranslations<'metadata'>>>) {
  const inLanguage = LANG_TAG[locale] || 'en-US'
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
          'Machine Learning',
          'Data Analysis',
          'Scientific Computing',
          'Web Development',
          'DevOps',
          'Data Engineering',
        ],
        sameAs: [
          SOCIAL.github,
          SOCIAL.linkedin,
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
  const locale = toLocale((await params).locale)
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
    // Indexing is the default; an explicit index/follow here would be inherited
    // by 404s and contradict their noindex (V6-COD-06). Only the preview hints stay.
    robots: {
      googleBot: {
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[locale] || 'en_US',
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
    // No alternates here: the 404s render at this level and would inherit the
    // home canonical and hreflang (V6-COD-06). The home page sets its own.
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
    <html lang={locale} className={`${schibsted.variable} ${spaceMono.variable} ${fraunces.variable}`}>
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
