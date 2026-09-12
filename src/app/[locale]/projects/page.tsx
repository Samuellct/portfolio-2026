'use client'

import { Suspense, useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import Image from 'next/image'
import { getProjectsSortedByDate, getLocalizedField, Locale, projectCategories, ProjectData } from '@/lib/projects'
import type { TechName } from '@/lib/technologies'
import { useTranslations, useLocale } from 'next-intl'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { SECTION_BG } from '@/lib/theme'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Tag } from '@/components/ui/Tag'

gsap.registerPlugin(ScrollTrigger)

// Case- and accent-insensitive comparison for the free-text search (AUDIT-083).
function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

// Background color for projects page
const PROJECTS_BG_COLOR = SECTION_BG.listing

// ============================================
// Project card
// ============================================
function ProjectCard({ project, index }: { project: ProjectData; index: number }) {
  const t = useTranslations('projects')
  const locale = useLocale() as Locale
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  const categoryColor =
    project.category === 'internship' ? '#10b981' : project.category === 'academic' ? '#a855f7' : '#00f0ff'

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { stiffness: 150, damping: 25 }
  const x = useSpring(useTransform(mouseX, [-1, 1], [-10, 10]), springConfig)
  const y = useSpring(useTransform(mouseY, [-1, 1], [-10, 10]), springConfig)
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set((e.clientX - centerX) / (rect.width / 2))
    mouseY.set((e.clientY - centerY) / (rect.height / 2))
  }
  
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }
  
  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <TransitionLink
        href={`/projects/${project.category}/${project.id}`}
        className="block"
      >
        {/* Image container - respecte le ratio original */}
        <motion.div 
          className="relative overflow-hidden mb-5 bg-white/[0.02]"
          style={{ x, y }}
        >
          {/* Container flexible avec hauteur min/max */}
          <div className="relative min-h-[200px] max-h-[280px] overflow-hidden">
            <motion.div
              className={`relative w-full h-full min-h-[200px] transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {!imageFailed && (
                <Image
                  src={project.image}
                  alt={getLocalizedField(project.imageAlt, locale)}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageFailed(true)}
                />
              )}
            </motion.div>

            {/* Loading placeholder */}
            {!imageLoaded && !imageFailed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/10 border-t-accent-cyan rounded-full animate-spin" />
              </div>
            )}

            {/* Fallback shown when the image cannot be loaded */}
            {imageFailed && (
              <div
                className="absolute inset-0 flex items-center justify-center p-6 text-center"
                style={{ backgroundColor: `${categoryColor}14` }}
              >
                <span className="font-body font-semibold text-lg text-white/70">
                  {getLocalizedField(project.title, locale)}
                </span>
              </div>
            )}
          </div>
          
          {/* Gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
            animate={{ opacity: isHovered ? 1 : 0.3 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Status badge */}
          {project.status === 'in-progress' && (
            <Badge status="in-progress" tone="card" className="absolute top-3 right-3">
              {t('status.inProgress')}
            </Badge>
          )}
          {project.status === 'paused' && (
            <Badge status="paused" tone="card" className="absolute top-3 right-3">
              {t('status.paused')}
            </Badge>
          )}
          
          {/* hover */}
          <motion.div
            className="absolute inset-3 border border-white/20 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.95
            }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
        
        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-micro-xs tracking-caps-wide uppercase text-muted">
            <span style={{ color: project.category === 'internship' ? '#10b981' : project.category === 'academic' ? '#a855f7' : '#00f0ff' }}>
              {t(`categories.${project.category}`)}
            </span>
            <span>•</span>
            <span>{getLocalizedField(project.period, locale)}</span>
          </div>
          
          <h3 className="font-body font-semibold text-xl md:text-2xl group-hover:text-accent-cyan transition-colors duration-300">
            {getLocalizedField(project.title, locale)}
          </h3>

          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
            {project.technologies.length > 3 && (
              <Tag>+{project.technologies.length - 3}</Tag>
            )}
          </div>

          <p className="text-sm text-white/50 leading-relaxed line-clamp-2 text-justify">
            {getLocalizedField(project.description, locale)}
          </p>
          
          {/* View link */}
          <motion.div
            className="flex items-center gap-2 pt-2 text-accent-cyan"
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -10
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xs tracking-caps uppercase">{t('viewProject')}</span>
            <ArrowRight size={12} />
          </motion.div>
        </div>
      </TransitionLink>
    </motion.div>
  )
}

// ============================================
// Category pre-filter from the URL (?category=personal)
// ============================================
// Isolated in its own component: useSearchParams() requires a Suspense
// boundary, and keeping it out of ProjectsPage lets that page stay
// statically prerendered (AUDIT-019, link from a project's category label).
function CategoryFromQuery({ onCategory }: { onCategory: (category: string) => void }) {
  const searchParams = useSearchParams()
  useEffect(() => {
    const category = searchParams.get('category')
    if (category) onCategory(category)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])
  return null
}

// ============================================
// Main Projects Page
// ============================================
export default function ProjectsPage() {
  const t = useTranslations('projects')
  const tCommon = useTranslations('common')
  const locale = useLocale() as Locale
  const prefersReducedMotion = useReducedMotion()
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [activeTech, setActiveTech] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  // Chronological order (newest first), deliberately distinct from the
  // featured-first order of the homepage preview (AUDIT-009). Shared with the
  // project detail page's previous/next navigation (AUDIT-019).
  const allProjects = useMemo(() => getProjectsSortedByDate(), [])
  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  // Technologies actually used on a visible project, not the full canonical
  // dictionary (which also holds reserve entries with no project yet).
  const availableTechnologies = useMemo(() => {
    const names = new Set<string>()
    allProjects.forEach((p) => p.technologies.forEach((tech) => names.add(tech)))
    return Array.from(names).sort((a, b) => a.localeCompare(b))
  }, [allProjects])

  const filteredProjects = useMemo(() => {
    const query = normalizeForSearch(searchQuery.trim())
    return allProjects.filter((p) => {
      if (activeFilter !== 'all' && p.category !== activeFilter) return false
      if (activeTech !== 'all' && !p.technologies.includes(activeTech as TechName)) return false
      if (!query) return true
      const haystack = normalizeForSearch(
        [
          getLocalizedField(p.title, locale),
          getLocalizedField(p.description, locale),
          ...p.technologies,
          ...p.keywords,
        ].join(' '),
      )
      return haystack.includes(query)
    })
  }, [allProjects, activeFilter, activeTech, searchQuery, locale])

  // Scroll to top before paint
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  // GSAP
  useEffect(() => {
    if (!pageRef.current) return

    if (prefersReducedMotion) {
      const title = headerRef.current?.querySelector('h1')
      if (title) gsap.set(title, { y: 0, opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      // Title reveal
      const title = headerRef.current?.querySelector('h1')
      if (title) {
        gsap.fromTo(title,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.2
          }
        )
      }
      
      // Parallax txt
      const decorText = pageRef.current?.querySelector('.decor-text')
      if (decorText) {
        gsap.fromTo(decorText,
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: pageRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            },
          }
        )
      }
    }, pageRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <div ref={pageRef} className="min-h-screen relative" style={{ backgroundColor: PROJECTS_BG_COLOR }}>
      <Suspense fallback={null}>
        <CategoryFromQuery onCategory={setActiveFilter} />
      </Suspense>

      {/* parallax */}
      <div aria-hidden="true" className="decor-text fixed top-1/2 -translate-y-1/2 left-0 pointer-events-none select-none z-0">
        <span className="font-display text-ghost-20 text-white/[0.015] leading-none whitespace-nowrap">
          PROJECTS
        </span>
      </div>
      
      <div className="relative z-10 pt-24 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <TransitionLink
            href="/"
            className="tap-target inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span className="text-sm tracking-label uppercase">{tCommon('back')}</span>
          </TransitionLink>
        </motion.div>
        
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-label text-accent-cyan mb-4"
          >
            {t('sectionLabel')}
          </motion.div>
          
          <h1 className="font-display text-display-listing leading-display-tight tracking-wide mb-6">
            {t('pageTitle')}
          </h1>
          
          <p className="text-lg text-white/50 max-w-2xl">
            {t('preview.description')}
          </p>
        </div>
        
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap items-center gap-3 mb-16"
        >
          <div role="group" aria-label={t('filterGroupLabel')} className="flex flex-wrap items-center gap-3">
            <Button
              variant="filter"
              className="tap-target"
              active={activeFilter === 'all'}
              aria-pressed={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            >
              {t('categories.all')}
            </Button>

            {projectCategories.map((category) => (
              <Button
                key={category.id}
                variant="filter"
                className="tap-target"
                active={activeFilter === category.id}
                aria-pressed={activeFilter === category.id}
                onClick={() => setActiveFilter(category.id)}
              >
                {t(`categories.${category.id}`)}
              </Button>
            ))}
          </div>

          <select
            value={activeTech}
            onChange={(e) => setActiveTech(e.target.value)}
            aria-label={t('techFilterLabel')}
            className="tap-target bg-transparent border border-white/20 text-white/60 text-xs tracking-caps-wide uppercase px-4 py-2.5 focus:outline-none focus:border-accent-cyan"
          >
            <option value="all">{t('allTechnologies')}</option>
            {availableTechnologies.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchLabel')}
              className="tap-target bg-transparent border border-white/20 text-white text-sm pl-9 pr-4 py-2.5 placeholder:text-white/30 focus:outline-none focus:border-accent-cyan"
            />
          </div>
        </motion.div>

        {/* Result count, announced to assistive tech on filter change */}
        <p aria-live="polite" className="sr-only">
          {t('resultsCount', { count: filteredProjects.length })}
        </p>
        
        {/* Projects Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-muted"
          >
            {t('emptyState')}
          </motion.div>
        )}
      </div>
    </div>
  )
}
