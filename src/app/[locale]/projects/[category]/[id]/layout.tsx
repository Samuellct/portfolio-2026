import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getProjectById, getAllProjectParams } from '@/lib/projects'
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
  const { category, id } = await params
  const project = getProjectById(category, id)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: project.title,
    description: project.description,
    keywords: [...project.keywords, project.category, ...project.technologies],
    openGraph: {
      title: `${project.title} | Samuel Lecomte`,
      description: project.description,
      type: 'article',
      images: project.image.startsWith('/')
        ? [`https://www.samuel-lecomte.fr${project.image}`]
        : [project.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
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
