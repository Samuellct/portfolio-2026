'use client'

import { useEffect } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ExternalLink, Calendar, MapPin, Building2 } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { getLocalizedField, CategoryData, Locale, ProjectData } from '@/lib/projects'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { Badge } from '@/components/ui/Badge'
import { Tag } from '@/components/ui/Tag'
import { Figure } from '@/components/ui/Figure'
import { useTranslations } from 'next-intl'
import { SECTION_BG } from '@/lib/theme'

const PROJECT_DETAIL_BG_COLOR = SECTION_BG.projectDetail

// ============================================
// Related project thumbnail
// ============================================
function RelatedProjectCard({ project, locale }: { project: ProjectData; locale: Locale }) {
  return (
    <TransitionLink href={`/projects/${project.category}/${project.id}`} className="group block">
      <Figure
        src={project.image}
        alt={getLocalizedField(project.imageAlt, locale)}
        frameClassName="mb-3 transition-opacity duration-300 group-hover:opacity-80"
      />
      <h3 className="font-body font-semibold group-hover:text-accent-cyan transition-colors duration-300">
        {getLocalizedField(project.title, locale)}
      </h3>
    </TransitionLink>
  )
}

export default function ProjectDetailView({
  project,
  category,
  categoryId,
  previousProject,
  nextProject,
  relatedProjects,
  locale,
}: {
  project: ProjectData
  category: CategoryData | undefined
  categoryId: string
  previousProject: ProjectData | null
  nextProject: ProjectData | null
  relatedProjects: ProjectData[]
  locale: Locale
}) {
  const t = useTranslations('projects')
  const tCommon = useTranslations('common')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [project.id])

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: PROJECT_DETAIL_BG_COLOR }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ============================================ */}
        {/* SPLIT LAYOUT: Desktop (lg+) = 2 colonnes */}
        {/* ============================================ */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">

          {/* ============================================ */}
          {/* LEFT COLUMN - Sticky sidebar (4/12) */}
          {/* ============================================ */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">

              {/* Back link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <TransitionLink
                  href="/projects"
                  className="tap-target inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span className="text-sm tracking-label uppercase">{tCommon('back')}</span>
                </TransitionLink>
              </motion.div>

              {/* Project info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Category */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <TransitionLink
                    href={`/projects?category=${categoryId}`}
                    className="tap-target text-xs tracking-caps-wide uppercase hover:underline"
                    style={{ color: category?.accentColor }}
                  >
                    {t(`categories.${categoryId}`)}
                  </TransitionLink>

                  {project.status === 'in-progress' && (
                    <Badge status="in-progress" tone="inline">
                      {t('status.inProgress')}
                    </Badge>
                  )}
                  {project.status === 'paused' && (
                    <Badge status="paused" tone="inline">
                      {t('status.paused')}
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="font-body font-semibold text-display-page leading-display-snug mb-4">
                  {getLocalizedField(project.title, locale)}
                </h1>

                {/* Subtitle */}
                {project.subtitle && (
                  <p className="text-lg text-white/60 mb-6">{getLocalizedField(project.subtitle, locale)}</p>
                )}

                {/* Meta info */}
                <div className="flex flex-col gap-3 text-sm text-muted mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{getLocalizedField(project.period, locale)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{getLocalizedField(project.location, locale)}</span>
                  </div>
                  {project.research && (
                    <div className="flex items-center gap-2">
                      <Building2 size={14} />
                      <span>
                        {getLocalizedField(project.research.lab, locale)}
                        {project.research.collaboration && ` - ${project.research.collaboration}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Results (AUDIT-017, AUDIT-082: sidebar, separate from the prose) */}
                {project.results && project.results.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xs tracking-caps-wide uppercase text-muted mb-4">
                      {t('sections.results')}
                    </h2>
                    <dl className="grid grid-cols-2 gap-4">
                      {project.results.map((result) => (
                        <div key={getLocalizedField(result.label, locale)}>
                          <dt className="text-xs text-muted mb-1">
                            {getLocalizedField(result.label, locale)}
                          </dt>
                          <dd className="font-body font-semibold text-white">
                            {result.value}
                            {result.note && (
                              <span className="block text-xs font-normal text-muted mt-0.5">
                                {getLocalizedField(result.note, locale)}
                              </span>
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {/* Technologies */}
                <div className="mb-8">
                  <h2 className="text-xs tracking-caps-wide uppercase text-muted mb-4">
                    {t('technologies')}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Tag key={tech}>{tech}</Tag>
                    ))}
                  </div>
                </div>

                {/* Context (AUDIT-017: an intro reads better in the sidebar than Limits does) */}
                {project.sections?.context && (
                  <div className="mb-8">
                    <h2 className="text-xs tracking-caps-wide uppercase text-muted mb-4">
                      {t('sections.context')}
                    </h2>
                    <p className="text-sm text-white/60">
                      {getLocalizedField(project.sections.context, locale)}
                    </p>
                  </div>
                )}

                {/* gitHub CTA */}
                {project.gitHubUrl && (
                  <div className="flex justify-center">
                    <a
                      href={project.gitHubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-6 py-3 bg-[#238636] text-white text-sm font-medium tracking-wide transition-colors hover:bg-[#2ea043]"
                    >
                      <FaGithub size={18} />
                      {t('viewOnGitHub')}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* ============================================ */}
          {/* RIGHT COLUMN - Scrollable txt (8/12) */}
          {/* ============================================ */}
          <div className="lg:col-span-8 mt-12 lg:mt-0">

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-10"
            >
              <Figure
                src={project.image}
                alt={getLocalizedField(project.imageAlt, locale)}
                priority
                creditLabel={t('imageCredit')}
                credit={
                  project.imageCredit
                    ? { name: project.imageCredit, url: project.imageCreditUrl }
                    : undefined
                }
              />
            </motion.div>

            {/* Description: named sections (AUDIT-017) when present, legacy free-form text otherwise.
                Context moved to the sidebar (reads better as an intro there than Limits did);
                Limits moved here, after What I built, closing the narrative on an honest note. */}
            {project.sections ? (
              <div className="space-y-10">
                {(
                  [
                    ['problem', project.sections.problem],
                    ['approach', project.sections.approach],
                    ['whatIBuilt', project.sections.whatIBuilt],
                    ['limits', project.limits],
                  ] as const
                ).map(
                  ([key, content], index) =>
                    content && (
                      <motion.section
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.05, duration: 0.6 }}
                      >
                        <h2 className="font-body font-semibold text-xl mb-4">{t(`sections.${key}`)}</h2>
                        <MarkdownRenderer
                          content={getLocalizedField(content, locale)}
                          className="prose prose-lg max-w-none"
                        />
                      </motion.section>
                    )
                )}
              </div>
            ) : (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <MarkdownRenderer
                  content={getLocalizedField(project.detailedDescription, locale)}
                  className="prose prose-lg max-w-none"
                />
              </motion.section>
            )}
          </div>
        </div>

        {/* ============================================ */}
        {/* PREVIOUS / NEXT + RELATED PROJECTS (AUDIT-019) */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 pt-12 border-t border-white/10"
        >
          {(previousProject || nextProject) && (
            <div className="flex flex-col sm:flex-row items-stretch justify-between gap-6 mb-16">
              {previousProject && (
                <TransitionLink
                  href={`/projects/${previousProject.category}/${previousProject.id}`}
                  className="tap-target group flex items-center gap-3"
                >
                  <ArrowLeft size={18} className="shrink-0 transition-transform group-hover:-translate-x-1" />
                  <div>
                    <div className="text-xs tracking-caps-wide uppercase text-muted mb-1">
                      {t('previousProject')}
                    </div>
                    <div className="font-body font-semibold group-hover:text-accent-cyan transition-colors">
                      {getLocalizedField(previousProject.title, locale)}
                    </div>
                  </div>
                </TransitionLink>
              )}

              {nextProject && (
                <TransitionLink
                  href={`/projects/${nextProject.category}/${nextProject.id}`}
                  className="tap-target group flex items-center gap-3 sm:text-right sm:flex-row-reverse sm:ml-auto"
                >
                  <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
                  <div>
                    <div className="text-xs tracking-caps-wide uppercase text-muted mb-1">
                      {t('nextProject')}
                    </div>
                    <div className="font-body font-semibold group-hover:text-accent-cyan transition-colors">
                      {getLocalizedField(nextProject.title, locale)}
                    </div>
                  </div>
                </TransitionLink>
              )}
            </div>
          )}

          {relatedProjects.length > 0 && (
            <div>
              <h2 className="text-xs tracking-caps-wide uppercase text-muted mb-6">
                {t('relatedProjects')}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProjects.map((related) => (
                  <RelatedProjectCard key={`${related.category}-${related.id}`} project={related} locale={locale} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
