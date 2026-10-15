'use client'

import { Suspense, useState, useEffect, useRef, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import TransitionLink from '@/components/navigation/TransitionLink'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import { m, AnimatePresence, LazyMotion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { gsap } from '@/lib/gsap'
import { ArrowRight, LayoutGrid, List, Search } from 'lucide-react'
import Image from 'next/image'
import { getLocalizedField, getCardPeriod, PROJECT_CATEGORIES, ProjectSummary, PROJECTS_FILTER_KEY, PROJECTS_VIEW_KEY } from '@/lib/projects/helpers'
import { useTranslations, useLocale } from 'next-intl'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useEntryAnimation } from '@/hooks/use-entry-animation'
import { PAGE_BG, RISO } from '@/lib/theme'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { Badge } from '@/components/ui/Badge'
import { Pill } from '@/components/ui/Pill'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import Watermark from '@/components/effects/Watermark'

// Case- and accent-insensitive comparison for the free-text search (AUDIT-083).
function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

const loadLayoutFeatures = () => import('@/lib/motion-max').then((mod) => mod.default)

// Background color for projects page
const PROJECTS_BG_COLOR = PAGE_BG

// ============================================
// Project card
// ============================================
function ProjectCard({ project, index }: { project: ProjectSummary; index: number }) {
  const t = useTranslations('projects')
  const locale = useLocale()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  // Under reduced motion the hover keeps its colour changes only: no parallax,
  // zoom or sliding arrow (V6-LST-04; the parallax stays otherwise, V6-Q-20)
  const prefersReducedMotion = useReducedMotion()

  const titleId = `card-title-${project.id}`
  const statusKey = project.status === 'in-progress' ? 'inProgress' : project.status === 'paused' ? 'paused' : null

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { stiffness: 150, damping: 25 }
  const x = useSpring(useTransform(mouseX, [-1, 1], [-10, 10]), springConfig)
  const y = useSpring(useTransform(mouseY, [-1, 1], [-10, 10]), springConfig)
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReducedMotion) return
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
    <m.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      // Six subgrid rows (image, meta, title, tags, description, footer) shared
      // across a grid row, so every footer lines up (V6-LST-03)
      className="group row-span-6 grid grid-rows-subgrid gap-y-2"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <TransitionLink
        href={`/projects/${project.category}/${project.id}`}
        // Named by its title alone, not by the whole card text (V6-LST-06)
        aria-labelledby={titleId}
        className="row-span-6 grid grid-rows-subgrid gap-y-2"
      >
        {/* Image container - respecte le ratio original */}
        <m.div 
          className="relative overflow-hidden mb-5 bg-white/[0.02]"
          style={{ x, y }}
        >
          {/* Flexible container with a min and max height */}
          <div className="relative min-h-[200px] max-h-[280px] overflow-hidden">
            <m.div
              className={`relative w-full h-full min-h-[200px] transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              animate={{
                scale: isHovered && !prefersReducedMotion ? 1.05 : 1,
              }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {!imageFailed && (
                <Image
                  src={project.image}
                  // Decorative here: the title that follows names the link (V6-LST-06)
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageFailed(true)}
                />
              )}
            </m.div>

            {/* Loading placeholder */}
            {!imageLoaded && !imageFailed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/10 border-t-accent-line rounded-full animate-spin" />
              </div>
            )}

            {/* Fallback shown when the image cannot be loaded */}
            {imageFailed && (
              <div
                className="absolute inset-0 flex items-center justify-center p-6 text-center"
                style={{ backgroundColor: `${RISO.ink}14` }}
              >
                <span className="font-body font-semibold text-lg text-muted">
                  {getLocalizedField(project.title, locale)}
                </span>
              </div>
            )}
          </div>
          
          {/* hover */}
          <m.div
            className="absolute inset-3 border border-white/20 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered || prefersReducedMotion ? 1 : 0.95
            }}
            transition={{ duration: 0.4 }}
          />
        </m.div>
        
        {/* Content */}
        <div className="contents">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-meta tracking-caps-wide uppercase text-muted [&>span]:whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5 text-white">
              <CategoryIcon category={project.category} />
              {t(`categories.${project.category}`)}
            </span>
            <span aria-hidden="true">•</span>
            <span>{getCardPeriod(project.period, locale)}</span>
          </div>

          {/* Pink title at bold weight: the one focal point of the card (DEC-14m) */}
          <h3 id={titleId} className="font-body font-bold text-xl md:text-2xl text-riso-pinkTitle group-hover:text-accent transition-colors duration-300">
            {getLocalizedField(project.title, locale)}
          </h3>

          <div className="flex flex-wrap content-start gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
            {project.technologies.length > 3 && (
              <Tag>+{project.technologies.length - 3}</Tag>
            )}
          </div>

          <p className="text-sm text-muted leading-relaxed">
            {getLocalizedField(project.description, locale)}
          </p>
          
          {/* View link, visible without hover (UI-01); the status label closes the line, mirroring it (P12-D4) */}
          <div className="self-end flex min-h-8 items-center justify-between gap-4 pt-2">
            <span className="flex items-center gap-2 text-accent">
              <span className="text-xs tracking-caps uppercase">{t('viewProject')}</span>
              <ArrowRight size={12} aria-hidden="true" className="transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
            </span>
            {statusKey && (
              <Badge status={statusKey === 'inProgress' ? 'in-progress' : 'paused'}>{t(`status.${statusKey}`)}</Badge>
            )}
          </div>
        </div>
      </TransitionLink>
    </m.div>
  )
}

// ============================================
// Project row (list view, P12-D2): small thumbnail, period, title, category,
// three technologies, status. Served visible, no entrance animation.
// ============================================
function ProjectRow({ project }: { project: ProjectSummary }) {
  const t = useTranslations('projects')
  const locale = useLocale()
  const titleId = `row-title-${project.id}`
  const status =
    project.status === 'in-progress' || project.status === 'paused' ? (
      <Badge status={project.status}>{t(project.status === 'in-progress' ? 'status.inProgress' : 'status.paused')}</Badge>
    ) : null

  return (
    <li className="border-b border-white/20">
      <TransitionLink
        href={`/projects/${project.category}/${project.id}`}
        aria-labelledby={titleId}
        className="group grid grid-cols-[88px_1fr] gap-x-4 gap-y-1.5 py-3.5 md:grid-cols-[112px_7rem_1fr_auto_1rem] md:items-center md:gap-x-6"
      >
        <div className="relative row-span-2 aspect-[16/10] self-start overflow-hidden bg-white/[0.02] md:row-span-1 md:self-auto">
          <Image src={project.image} alt="" fill sizes="112px" className="object-cover" />
        </div>
        <span className="font-mono text-xs md:text-sm text-muted whitespace-nowrap">{getCardPeriod(project.period, locale)}</span>
        <div className="grid gap-1.5">
          <h3 id={titleId} className="font-body font-bold text-xl leading-tight text-white group-hover:text-riso-pinkTitle transition-colors duration-300">
            {getLocalizedField(project.title, locale)}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5 text-meta tracking-caps-wide uppercase text-white">
              <CategoryIcon category={project.category} />
              {t(`categories.${project.category}`)}
            </span>
            <span>{project.technologies.slice(0, 3).join(', ')}</span>
            {status && <span className="md:hidden">{status}</span>}
          </div>
        </div>
        <span className="hidden md:block">{status}</span>
        <ArrowRight size={16} aria-hidden="true" className="hidden md:block text-accent transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
      </TransitionLink>
    </li>
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
export default function ProjectsView({ allProjects }: { allProjects: ProjectSummary[] }) {
  const t = useTranslations('projects')
  const tNav = useTranslations('nav')
  const locale = useLocale()
  const prefersReducedMotion = useReducedMotion()
  // Entrance motion only after a client-side navigation; the served page is visible as is
  const enter = useEntryAnimation()
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  // Tiles by default; the list view is remembered for the session (P12-D2),
  // read after mount so the server HTML and the first client render agree
  const [view, setView] = useState<'tiles' | 'list'>('tiles')

  // Remember the filter so a project page can link back to it (UX-13)
  useEffect(() => {
    try {
      sessionStorage.setItem(PROJECTS_FILTER_KEY, activeFilter)
    } catch {}
  }, [activeFilter])

  useEffect(() => {
    try {
      if (sessionStorage.getItem(PROJECTS_VIEW_KEY) === 'list') setView('list')
    } catch {}
  }, [])

  const chooseView = (next: 'tiles' | 'list') => {
    setView(next)
    try {
      sessionStorage.setItem(PROJECTS_VIEW_KEY, next)
    } catch {}
  }
  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const filteredProjects = useMemo(() => {
    const query = normalizeForSearch(searchQuery.trim())
    return allProjects.filter((p) => {
      if (activeFilter !== 'all' && p.category !== activeFilter) return false
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
  }, [allProjects, activeFilter, searchQuery, locale])

  // GSAP
  useEffect(() => {
    if (!pageRef.current) return

    // Served page: the title is already visible, so no reveal (phase 04 report)
    if (prefersReducedMotion || !enter) {
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
    }, pageRef)

    return () => ctx.revert()
  }, [prefersReducedMotion, enter])

  return (
    // Card reflow on filtering needs the layout features, fetched after first load
    <LazyMotion features={loadLayoutFeatures}>
      <div ref={pageRef} className="min-h-screen relative overflow-x-clip" style={{ backgroundColor: PROJECTS_BG_COLOR }}>
        <Suspense fallback={null}>
          <CategoryFromQuery onCategory={setActiveFilter} />
        </Suspense>

        <Watermark
          word="PROJECTS"
          className="absolute top-1/2 -translate-y-1/2 left-0 z-0"
          textClassName="text-ghost-20 whitespace-nowrap"
          parallax={{ axis: 'x', from: -5, to: 5, scrub: 2 }}
        />
        
        <div className="relative z-10 pt-24 pb-20 max-w-7xl mx-auto px-6 md:px-12">
          <m.div
            initial={enter ? { opacity: 0, x: -20 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <Breadcrumb items={[{ label: tNav('projects') }]} />
            <BreadcrumbJsonLd
              locale={locale}
              items={[{ name: tNav('home'), path: '' }, { name: tNav('projects'), path: '/projects' }]}
            />
          </m.div>
          
          {/* Header */}
          <div ref={headerRef} className="mb-16">
            {/* Pink over its blue misregister, like the About and Contact titles (P12-D1) */}
            <h1 className="misregister font-display uppercase font-black text-page leading-display-tight tracking-wide mb-6 text-riso-pinkTitle">
              {t('pageTitle')}
            </h1>
            
            <p className="text-lg text-muted max-w-2xl">
              {t('preview.description')}
            </p>
          </div>
          
          {/* Filters */}
          <m.div
            initial={enter ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap items-center gap-3 mb-4"
          >
            <div role="group" aria-label={t('filterGroupLabel')} className="flex flex-wrap items-center gap-3">
              <Button
                className="tap-target"
                active={activeFilter === 'all'}
                aria-pressed={activeFilter === 'all'}
                onClick={() => setActiveFilter('all')}
              >
                {t('categories.all')}
              </Button>

              {PROJECT_CATEGORIES.map((categoryId) => (
                <Button
                  key={categoryId}
                  className="tap-target"
                  active={activeFilter === categoryId}
                  aria-pressed={activeFilter === categoryId}
                  onClick={() => setActiveFilter(categoryId)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <CategoryIcon category={categoryId} />
                    {t(`categories.${categoryId}`)}
                  </span>
                </Button>
              ))}
            </div>

            <div className="relative">
              <Search aria-hidden="true" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                aria-label={t('searchLabel')}
                // Framed in blue like the Contact fields (P11-D6): 3.99:1 frame, ink and a blue ring on focus (V6-LST-02)
                className="h-11 bg-snow/60 border-[1.5px] border-riso-blue text-white text-sm pl-9 pr-4 placeholder:text-muted outline-none transition-colors focus:border-riso-ink focus:ring-2 focus:ring-riso-blue focus:ring-offset-2 focus:ring-offset-riso-paper"
              />
            </div>

            {/* Tiles or list (P12-D2): a square ink segment, apart from the filters */}
            <div role="group" aria-label={t('viewGroupLabel')} className="inline-flex border border-white md:ml-auto">
              {(['tiles', 'list'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={view === option}
                  onClick={() => chooseView(option)}
                  className={`inline-flex h-[42px] items-center gap-2 px-4 text-xs tracking-caps-wide uppercase transition-colors duration-300 ${
                    view === option ? 'bg-white text-black' : 'text-white hover:bg-white/10'
                  }`}
                >
                  {option === 'tiles' ? <LayoutGrid size={14} aria-hidden="true" /> : <List size={14} aria-hidden="true" />}
                  {t(option === 'tiles' ? 'viewTiles' : 'viewList')}
                </button>
              ))}
            </div>
          </m.div>

          {/* Result count, visible and announced on filter change */}
          <p aria-live="polite" className="mb-10 font-mono text-xs text-muted">
            {t('resultsCount', { count: filteredProjects.length })}
          </p>
          
          {/* Heading level between the page h1 and the card h3 (V6-BKL-38) */}
          <h2 className="sr-only">{t('listHeading')}</h2>

          {view === 'tiles' ? (
            <m.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
            >
              {/* Cards present at the first render skip their entrance on a served page,
                  so they read without JavaScript; later ones (filtering) still fade in */}
              <AnimatePresence mode="popLayout" initial={enter}>
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </m.div>
          ) : (
            // Opened by the registered double rule of the bands: blue, then pink 3 px below
            filteredProjects.length > 0 && (
              <ul className="relative border-t-2 border-riso-blue pt-[5px] before:absolute before:inset-x-0 before:top-[3px] before:h-0.5 before:bg-riso-pink before:content-['']">
                {filteredProjects.map((project) => (
                  <ProjectRow key={project.id} project={project} />
                ))}
              </ul>
            )
          )}

          {/* Empty state: only a search can empty the list (every category has
              projects), so the message names the search and offers the way back (V6-LST-05) */}
          {filteredProjects.length === 0 && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-6 py-20 text-center"
            >
              <p className="text-lg text-muted">
                {t(activeFilter === 'all' ? 'emptySearch' : 'emptySearchInCategory')}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Pill
                  tone="outline"
                  onClick={() => {
                    setSearchQuery('')
                    searchRef.current?.focus()
                  }}
                >
                  {t('clearSearch')}
                </Pill>
                {activeFilter !== 'all' && (
                  <Pill
                    tone="outline"
                    onClick={() => {
                      setSearchQuery('')
                      setActiveFilter('all')
                    }}
                  >
                    {t('showAll')}
                  </Pill>
                )}
              </div>
            </m.div>
          )}
        </div>
      </div>
    </LazyMotion>
  )
}
