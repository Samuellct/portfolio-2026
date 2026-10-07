'use client'

import { useEffect, useState } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { getLocalizedField, formatMeasure, CategoryData, Locale, ProjectData, PROJECTS_FILTER_KEY } from '@/lib/projects'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { Badge } from '@/components/ui/Badge'
import { Tag } from '@/components/ui/Tag'
import { Figure } from '@/components/ui/Figure'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/cn'
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
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
        frameClassName="mb-3 transition-opacity duration-300 group-hover:opacity-80"
      />
      <h3 className="font-body font-semibold group-hover:text-accent transition-colors duration-300">
        {getLocalizedField(project.title, locale)}
      </h3>
    </TransitionLink>
  )
}

// ============================================
// One measured result: value (± uncertainty, unit), label, baseline, note
// ============================================
type ProjectResult = NonNullable<ProjectData['results']>[number]

function ResultMeasure({ result, locale }: { result: ProjectResult; locale: Locale }) {
  const t = useTranslations('projects')
  const fmt = (text: string) => formatMeasure(text, locale)
  return (
    <div className="py-5 border-b border-white/15 flex flex-col">
      <dt className="order-2 mt-2 text-sm font-semibold">
        {getLocalizedField(result.label, locale)}
      </dt>
      <dd className="order-1 flex flex-wrap items-baseline gap-x-2">
        <span className="font-display font-black text-heading leading-none text-riso-pinkTitle whitespace-nowrap">
          {fmt(result.value)}
        </span>
        {result.uncertainty && (
          <span className="font-mono text-lg tabular-nums">± {fmt(result.uncertainty)}</span>
        )}
        {result.unit && <span className="font-display font-black text-title">{result.unit}</span>}
      </dd>
      {result.baseline && (
        <dd className="order-3 mt-1 font-mono text-sm text-muted">
          {t('resultBaseline', {
            value: fmt(result.baseline.value),
            label: getLocalizedField(result.baseline.label, locale),
          })}
        </dd>
      )}
      {result.note && (
        <dd className="order-4 mt-1 text-sm text-muted">{fmt(getLocalizedField(result.note, locale))}</dd>
      )}
    </div>
  )
}

export default function ProjectDetailView({
  project,
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
  const tNav = useTranslations('nav')
  const leadMedia = project.media?.[0]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [project.id])

  // UX-13: "Projects" returns to the listing with the filter the visitor left it on
  const [projectsHref, setProjectsHref] = useState('/projects')
  useEffect(() => {
    try {
      const filter = sessionStorage.getItem(PROJECTS_FILTER_KEY)
      if (filter && filter !== 'all') setProjectsHref(`/projects?category=${filter}`)
    } catch {}
  }, [])

  const location = getLocalizedField(project.location, locale)
  const lab = project.research ? getLocalizedField(project.research.lab, locale) : undefined
  // Facts of the context frame. "Personal project" repeats the category, and a
  // lab equal to the location is shown once (CONS-06).
  const facts: Array<[string, string]> = [
    [t('facts.period'), getLocalizedField(project.period, locale)],
    ...(project.category !== 'personal' ? [[t('facts.location'), location] as [string, string]] : []),
    ...(lab && lab !== location ? [[t('research.lab'), lab] as [string, string]] : []),
    ...(project.research?.collaboration
      ? [[t('research.collaboration'), project.research.collaboration] as [string, string]]
      : []),
  ]
  const outLinks = [
    ...(project.gitHubUrl ? [{ url: project.gitHubUrl, label: t('viewOnGitHub'), github: true }] : []),
    ...(project.links ?? [])
      .filter((link) => link.type !== 'code')
      .map((link) => ({ url: link.url, label: link.label ? getLocalizedField(link.label, locale) : link.url, github: false })),
  ]

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: PROJECT_DETAIL_BG_COLOR }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ============================================ */}
        {/* HEADER: breadcrumb, title, hook, status, links (full width) */}
        {/* ============================================ */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-6 pb-10 mb-10 border-b border-white/15"
        >
          <nav aria-label={t('breadcrumbLabel')} className="mb-5">
            <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
              <li>
                <TransitionLink href={projectsHref} className="tap-target inline-flex items-center hover:text-white transition-colors">
                  {tNav('projects')}
                </TransitionLink>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <TransitionLink
                  href={`/projects?category=${categoryId}`}
                  className="tap-target inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <CategoryIcon category={categoryId} />
                  {t(`categories.${categoryId}`)}
                </TransitionLink>
              </li>
            </ol>
          </nav>

          <h1 className="misregister font-display font-black text-page leading-display-snug text-riso-pinkTitle break-words [hyphens:manual]">
            {getLocalizedField(project.title, locale)}
          </h1>

          {project.subtitle && (
            <p className="mt-5 max-w-3xl text-lead font-semibold">{getLocalizedField(project.subtitle, locale)}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.status === 'in-progress' && (
              <Badge status="in-progress" tone="pill">
                {t('status.inProgress')}
              </Badge>
            )}
            {project.status === 'paused' && (
              <Badge status="paused" tone="pill">
                {t('status.paused')}
              </Badge>
            )}
            {outLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white text-sm font-semibold tracking-caps uppercase transition-colors hover:bg-white hover:text-black"
              >
                {link.github && <FaGithub size={16} aria-hidden="true" />}
                {link.label}
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            ))}
          </div>
        </motion.header>

        {/* ============================================ */}
        {/* SPLIT LAYOUT: lg+ = sticky context frame (4/12) + narrative (8/12);
            below lg the narrative comes first and the frame follows it (RESP-02) */}
        {/* ============================================ */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12">

          {/* Context frame (AUDIT-082: sticky on desktop) */}
          <aside className="order-2 lg:order-1 lg:col-span-4 mt-14 lg:mt-0 lg:sticky lg:top-24 lg:self-start border border-accent-line p-6">
            <h2 className="pb-3 mb-5 border-b border-riso-pink text-meta font-semibold tracking-caps-wide uppercase">
              {t('sections.context')}
            </h2>
            <dl className="space-y-4 text-sm">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="font-semibold">{label}</dt>
                  <dd className="text-muted">{value}</dd>
                </div>
              ))}
              <div>
                <dt className="font-semibold mb-2">{t('technologies')}</dt>
                <dd className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </dd>
              </div>
            </dl>
            {project.sections?.context && (
              <p className="mt-6 pt-5 border-t border-white/15 text-sm text-muted">
                {getLocalizedField(project.sections.context, locale)}
              </p>
            )}
          </aside>

          {/* Narrative column: results, lead media, sections */}
          <div className="order-1 lg:order-2 lg:col-span-8">

            {/* Results as measures (UX-12): main column, ahead of the figure and the narrative */}
            {project.results && project.results.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="pb-3 mb-2 border-b border-riso-pink text-meta font-semibold tracking-caps-wide uppercase">
                  {t('sections.results')}
                </h2>
                <dl className={cn('grid sm:grid-cols-2 sm:gap-x-10', project.results.length === 3 && 'lg:grid-cols-3')}>
                  {project.results.map((result) => (
                    <ResultMeasure key={getLocalizedField(result.label, locale)} result={result} locale={locale} />
                  ))}
                </dl>
              </motion.section>
            )}

            {/* Lead media: first `media[]` entry, `image` for fiches without one (A15, DEC-10c) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-10"
            >
              {leadMedia ? (
                <Figure
                  src={leadMedia.src}
                  alt={getLocalizedField(leadMedia.alt, locale)}
                  priority
                  framing={leadMedia.frame === 'figure' ? 'whole' : 'crop'}
                  width={leadMedia.width}
                  height={leadMedia.height}
                  caption={leadMedia.caption && getLocalizedField(leadMedia.caption, locale)}
                  creditLabel={t('imageCredit')}
                  credit={leadMedia.credit}
                />
              ) : (
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
              )}
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
                        <h2 className="pb-3 mb-5 border-b border-riso-pink text-meta font-semibold tracking-caps-wide uppercase">{t(`sections.${key}`)}</h2>
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
                    <div className="font-body font-semibold group-hover:text-accent transition-colors">
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
                    <div className="font-body font-semibold group-hover:text-accent transition-colors">
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
