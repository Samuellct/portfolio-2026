import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getProjectById, getLocalizedField, getAllProjectParams } from '@/lib/projects'
import { routing } from '@/i18n/routing'
import { BASE_URL, buildAlternates, OG_LOCALE } from '@/lib/constants'
import { toLocale } from '@/i18n/locale'

type Props = {
  params: Promise<{ locale: string; category: string; id: string }>
}

// Only the prerendered (visible) projects exist: any other id is a 404
export const dynamicParams = false

// Generate static params for all projects × all locales (SSG)
export async function generateStaticParams() {
  const projectParams = getAllProjectParams()
  return routing.locales.flatMap((locale) =>
    projectParams.map((p) => ({
      locale,
      category: p.category,
      id: p.id,
    }))
  )
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: segment, category, id } = await params
  const locale = toLocale(segment)
  const project = getProjectById(category, id)
  const projectPath = `/projects/${category}/${id}`

  if (!project || project.visible === false) {
    const t = await getTranslations({ locale, namespace: 'common' })
    return {
      title: t('notFound.title'),
    }
  }

  const title = getLocalizedField(project.title, locale)
  const description = getLocalizedField(project.description, locale)

  return {
    title,
    description,
    keywords: [...project.keywords, project.category, ...project.technologies],
    openGraph: {
      title: `${title} | Samuel Lecomte`,
      description,
      type: 'article',
      locale: OG_LOCALE[locale] || 'en_US',
      images: project.image.startsWith('/')
        ? [`${BASE_URL}${project.image}`]
        : [project.image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}${projectPath}`,
      ...buildAlternates(projectPath),
    },
  }
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const locale = toLocale((await params).locale)
  setRequestLocale(locale)
  return children
}
