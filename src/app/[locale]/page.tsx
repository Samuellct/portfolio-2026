import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import HomePageClient from '@/components/home/HomePageClient'
import { BASE_URL, buildAlternates } from '@/lib/constants'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
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
  const { locale } = await params
  setRequestLocale(locale)
  return <HomePageClient />
}
