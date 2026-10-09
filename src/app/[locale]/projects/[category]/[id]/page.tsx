import { notFound } from 'next/navigation'
import {
  getProjectById,
  getCategoryById,
  getProjectsSortedByDate,
  getRelatedProjects,
  getLocalizedField,
  Locale,
} from '@/lib/projects'
import ProjectDetailView from './ProjectDetailView'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import { getTranslations } from 'next-intl/server'

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
  // UX-08: related projects never repeat the previous / next links
  const neighbours = [previousProject, nextProject].filter((p): p is NonNullable<typeof p> => p !== null)
  const relatedProjects = getRelatedProjects(project, 3, neighbours)

  const tNav = await getTranslations({ locale, namespace: 'nav' })

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: tNav('home'), path: '' },
          { name: tNav('projects'), path: '/projects' },
          { name: getLocalizedField(project.title, locale as Locale), path: `/projects/${categoryId}/${projectId}` },
        ]}
      />
      <ProjectDetailView
        project={project}
        category={category}
        categoryId={categoryId}
        previousProject={previousProject}
        nextProject={nextProject}
        relatedProjects={relatedProjects}
        locale={locale as Locale}
      />
    </>
  )
}
