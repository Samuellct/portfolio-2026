import { setRequestLocale } from 'next-intl/server'
import HomePageClient from '@/components/home/HomePageClient'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <HomePageClient />
}
