import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getProjectById, getLocalizedField, getAllProjectParams, Locale } from '@/lib/projects'
import { routing } from '@/i18n/routing'

type Props = {
  params: Promise<{ locale: string; category: string; id: string }>
}

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
  const { locale, category, id } = await params
  const project = getProjectById(category, id)
  const loc = (locale || 'en') as Locale

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  const title = getLocalizedField(project.title, loc)
  const description = getLocalizedField(project.description, loc)

  return {
    title,
    description,
    keywords: [...project.keywords, project.category, ...project.technologies],
    openGraph: {
      title: `${title} | Samuel Lecomte`,
      description,
      type: 'article',
      images: project.image.startsWith('/')
        ? [`https://www.samuel-lecomte.fr${project.image}`]
        : [project.image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
  const { locale } = await params
  setRequestLocale(locale)
  return children
}
