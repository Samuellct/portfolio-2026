import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection, { type HomeStats } from '@/components/sections/AboutSection'
import ContactSection from '@/components/sections/ContactSection'
import { BASE_URL, buildAlternates } from '@/lib/constants'
import { toLocale } from '@/i18n/locale'
import { getAllProjects, getFeaturedProjects, toProjectSummary } from '@/lib/projects/data'
import { programmingLanguages } from '@/lib/techStats'

// Homepage statistics, derived from the visible projects
function getHomeStats(): HomeStats {
  const projects = getAllProjects()
  const usedTechs = new Set<string>(projects.flatMap((p) => p.technologies))
  return {
    internships: projects.filter((p) => p.category === 'internship').length,
    languages: programmingLanguages.filter((lang) => usedTechs.has(lang)),
    repos: projects.filter((p) => p.gitHubUrl).length,
  }
}

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
      <HeroSection featuredProjects={getFeaturedProjects().map(toProjectSummary)} />
      <AboutSection statValues={getHomeStats()} />
      <ContactSection />
    </>
  )
}
