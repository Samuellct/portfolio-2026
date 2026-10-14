import { notFound } from 'next/navigation'
import {
  getProjectById,
  getProjectsSortedByDate,
  getRelatedProjects,
  getLocalizedField,
  type BilingualText,
} from '@/lib/projects'
import ProjectDetailView, { type ProjectMarkdown } from './ProjectDetailView'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import ProjectJsonLd from '@/components/seo/ProjectJsonLd'
import { getTranslations } from 'next-intl/server'
import { toLocale } from '@/i18n/locale'

type Props = {
  params: Promise<{ locale: string; category: string; id: string }>
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale: segment, category: categoryId, id: projectId } = await params
  const locale = toLocale(segment)

  const project = getProjectById(categoryId, projectId)
  // Hidden projects stay unreachable (V6-Q-11, V6-Q-12)
  if (!project || project.visible === false) {
    notFound()
  }

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

  // Markdown and KaTeX render here, on the server, so their code stays out of
  // the page's client bundle (V6-COD-03); the view only places the nodes.
  const renderMarkdown = (content: BilingualText | string | undefined) =>
    content ? (
      <MarkdownRenderer content={getLocalizedField(content, locale)} className="prose prose-lg max-w-none" />
    ) : null
  const markdown: ProjectMarkdown = {
    problem: renderMarkdown(project.sections?.problem),
    approach: renderMarkdown(project.sections?.approach),
    whatIBuilt: renderMarkdown(project.sections?.whatIBuilt),
    limits: renderMarkdown(project.limits),
    description: project.sections ? null : renderMarkdown(project.detailedDescription),
  }

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: tNav('home'), path: '' },
          { name: tNav('projects'), path: '/projects' },
          { name: getLocalizedField(project.title, locale), path: `/projects/${categoryId}/${projectId}` },
        ]}
      />
      <ProjectJsonLd project={project} locale={locale} />
      <ProjectDetailView
        project={project}
        categoryId={project.category}
        previousProject={previousProject}
        nextProject={nextProject}
        relatedProjects={relatedProjects}
        markdown={markdown}
        locale={locale}
      />
    </>
  )
}
