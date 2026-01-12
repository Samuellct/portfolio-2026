import type { Metadata } from 'next'
import { getProjectById, getAllProjectParams } from '@/lib/projects'

type Props = {
  params: Promise<{ category: string; id: string }>
}

// Generate static params for all projects (SSG)
export async function generateStaticParams() {
  return getAllProjectParams()
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

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
