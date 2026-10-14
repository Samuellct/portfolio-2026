import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ContactSection from '@/components/sections/ContactSection'
import { BASE_URL, buildAlternates } from '@/lib/constants'
import { toLocale } from '@/i18n/locale'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  return {
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      ...buildAlternates(''),
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = toLocale((await params).locale)
  setRequestLocale(locale)
  // Each section paints its own background (`.section` in globals.css, from the
  // scheme's `--surface`), so the body does not change colour while scrolling.
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ContactSection />
    </>
  )
}
