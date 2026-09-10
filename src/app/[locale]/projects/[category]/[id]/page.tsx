'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Calendar, MapPin } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { getProjectById, getCategoryById, getLocalizedField, Locale } from '@/lib/projects'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { Badge } from '@/components/ui/Badge'
import { Tag } from '@/components/ui/Tag'
import { Figure } from '@/components/ui/Figure'
import { useTranslations, useLocale } from 'next-intl'
import { SECTION_BG } from '@/lib/theme'

const PROJECT_DETAIL_BG_COLOR = SECTION_BG.projectDetail

export default function ProjectDetailPage() {
  const t = useTranslations('projects')
  const tCommon = useTranslations('common')
  const locale = useLocale() as Locale
  const params = useParams()
  const router = useRouter()
  const categoryId = params.category as string
  const projectId = params.id as string
  
  const project = categoryId && projectId ? getProjectById(categoryId, projectId) : null
  const category = categoryId ? getCategoryById(categoryId) : null
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [projectId])
  
  useEffect(() => {
    if (!project && categoryId && projectId) {
      router.push('/projects')
    }
  }, [project, categoryId, projectId, router])
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/50">{tCommon('loading')}</div>
      </div>
    )
  }
  
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
                  className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
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
                  <span 
                    className="text-xs tracking-caps-wide uppercase"
                    style={{ color: category?.accentColor }}
                  >
                    {t(`categories.${categoryId}`)}
                  </span>
                  
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
                <h1 className="font-display text-display-page leading-display-snug tracking-wide mb-4">
                  {getLocalizedField(project.title, locale)}
                </h1>

                {/* Subtitle */}
                {project.subtitle && (
                  <p className="text-lg text-white/60 mb-6">{getLocalizedField(project.subtitle, locale)}</p>
                )}
                
                {/* Meta info */}
                <div className="flex flex-col gap-3 text-sm text-white/40 mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{getLocalizedField(project.period, locale)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{getLocalizedField(project.location, locale)}</span>
                  </div>
                </div>
                
                {/* Technologies */}
                <div className="mb-8">
                  <h2 className="text-xs tracking-caps-wide uppercase text-white/40 mb-4">
                    {t('technologies')}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Tag key={tech}>{tech}</Tag>
                    ))}
                  </div>
                </div>
                
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
            
            {/* Description */}
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
          </div>
        </div>
      </div>
    </div>
  )
}
