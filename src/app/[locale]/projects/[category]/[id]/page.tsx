import { notFound } from 'next/navigation'
import {
  getProjectById,
  getCategoryById,
  getProjectsSortedByDate,
  getRelatedProjects,
  Locale,
} from '@/lib/projects'
import ProjectDetailView from './ProjectDetailView'

type Props = {
  params: Promise<{ locale: string; category: string; id: string }>
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, category: categoryId, id: projectId } = await params

  const project = getProjectById(categoryId, projectId)
  if (!project) {
    notFound()
  }

  const category = getCategoryById(categoryId)

  // Previous / next follow the listing's chronological order (AUDIT-009);
  // navigation loops at both ends so a button is always available.
  const sortedProjects = getProjectsSortedByDate()
  const currentIndex = sortedProjects.findIndex(
    (p) => p.category === project.category && p.id === project.id
  )
  const previousProject =
    currentIndex >= 0
      ? sortedProjects[(currentIndex - 1 + sortedProjects.length) % sortedProjects.length]
      : null
  const nextProject =
    currentIndex >= 0 ? sortedProjects[(currentIndex + 1) % sortedProjects.length] : null
  const relatedProjects = getRelatedProjects(project, 3)

  return (
    <ProjectDetailView
      project={project}
      category={category}
      categoryId={categoryId}
      previousProject={previousProject}
      nextProject={nextProject}
      relatedProjects={relatedProjects}
      locale={locale as Locale}
    />
  )
}
