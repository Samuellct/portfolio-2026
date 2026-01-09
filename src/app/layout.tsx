import type { Metadata, Viewport } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from './providers'

// Fonts optimisées par Next.js
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

// Metadata globale (SEO)
export const metadata: Metadata = {
  metadataBase: new URL('https://www.samuel-lecomte.fr'),
  title: {
    default: 'Samuel Lecomte | Particle Physicist & Data Engineer',
    template: '%s | Samuel Lecomte',
  },
  description: 'Portfolio of Samuel Lecomte - Particle Physicist & Data Engineer. Showcasing research projects, data analysis work, and technical skills from CERN collaborations.',
  keywords: ['Samuel Lecomte', 'Particle Physics', 'Data Engineer', 'CERN', 'ATLAS', 'LHCb', 'Portfolio', 'Physics', 'Data Science'],
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
    title: 'Samuel Lecomte | Particle Physicist & Data Engineer',
    description: 'Portfolio showcasing research projects, data analysis work, and technical skills.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Samuel Lecomte Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Samuel Lecomte | Portfolio',
    description: 'Particle Physicist & Data Engineer',
    images: ['/og-image.jpg'],
  },
  verification: {
    // google: 'votre-code-verification',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
