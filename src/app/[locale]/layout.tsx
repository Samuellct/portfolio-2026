import type { Metadata, Viewport } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Providers } from '../providers'
import '@/styles/globals.css'

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

// Global metadata (SEO) — stays static English for now (step 07 makes it locale-aware)
export const metadata: Metadata = {
  metadataBase: new URL('https://www.samuel-lecomte.fr'),
  title: {
    default: 'Samuel Lecomte | Particle Physics & Data Science',
    template: '%s | Samuel Lecomte',
  },
  description: 'Portfolio of Samuel Lecomte - Graduate in Physics and Data Science. Showcasing research projects, data analysis work, and technical skills from CERN collaborations.',
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
    locale: 'en_US',
    url: 'https://www.samuel-lecomte.fr',
    siteName: 'Samuel Lecomte Portfolio',
    title: 'Samuel Lecomte | Particle Physics & Data Science',
    description: 'Portfolio showcasing research projects, data analysis work, and technical skills.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Samuel Lecomte | Portfolio',
    description: 'Particle Physics & Data Science',
  },
  verification: {
    // google: 'your-verification-code',
  },
  alternates: {
    canonical: 'https://www.samuel-lecomte.fr',
  },
}

export const viewport: Viewport = {
  themeColor: '#030308',
  width: 'device-width',
  initialScale: 1,
}

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.samuel-lecomte.fr/#website',
      url: 'https://www.samuel-lecomte.fr',
      name: 'Samuel Lecomte Portfolio',
      description: 'Portfolio of Samuel Lecomte - Graduate in Physics and Data Science',
      publisher: {
        '@id': 'https://www.samuel-lecomte.fr/#person',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'Person',
      '@id': 'https://www.samuel-lecomte.fr/#person',
      name: 'Samuel Lecomte',
      url: 'https://www.samuel-lecomte.fr',
      jobTitle: 'Graduate in Physics and Data Science',
      description: 'Recent graduate specialized in high-energy physics and data science. Experience with CERN collaborations (ATLAS, LHCb).',
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
      '@id': 'https://www.samuel-lecomte.fr/#webpage',
      url: 'https://www.samuel-lecomte.fr',
      name: 'Samuel Lecomte | Particle Physics & Data Science',
      isPartOf: {
        '@id': 'https://www.samuel-lecomte.fr/#website',
      },
      about: {
        '@id': 'https://www.samuel-lecomte.fr/#person',
      },
      description: 'Portfolio showcasing research projects, data analysis work, and technical skills from CERN collaborations.',
      inLanguage: 'en-US',
    },
  ],
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
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
