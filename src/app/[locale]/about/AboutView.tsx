'use client'

import { useCallback, useEffect, useRef, useLayoutEffect, useMemo, useState, type CSSProperties } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import { m, AnimatePresence } from 'framer-motion'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { ArrowRight, ChevronDown, FileText, Github, Linkedin } from 'lucide-react'
import { TechStats, TechFamilyStats, LanguageStats, isLightColor } from '@/lib/techStats'
import { getLocalizedField, formatMeasure, type BilingualText, type ProjectData } from '@/lib/projects/helpers'
import type { ExperienceEntry } from '@/lib/experience'
import MountainProfile from '@/components/about/MountainProfile'
import NetworkGraph from '@/components/about/NetworkGraph'
import CinemaSpotlight from '@/components/about/CinemaSpotlight'
import ScrollIndicator from '@/components/about/ScrollIndicator'
import { useLocale, useTranslations } from 'next-intl'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useSmoothScroll } from '@/context/SmoothScrollContext'
import { PAGE_BG } from '@/lib/theme'
import { cn } from '@/lib/cn'
import { RESUME_PATH, SOCIAL } from '@/lib/constants'
import { Pill } from '@/components/ui/Pill'

// ============================================
// BACKGROUND TEXTS
// ============================================
const bgTexts = ['ABOUT', 'EXPERIENCE', 'STACK', 'EDUCATION', 'INTERESTS']

// Scroll length of each section's pin. A pin plays once, on the way down: when
// its section has been played to the end, the pin is removed and the scroll
// position compensated, so scrolling back up never pins again (DEC-15a).
const PIN_LENGTH = 1300
// Pins on desktop only; below, sections are static and fade in once (DEC-15b)
const DESKTOP_QUERY = '(min-width: 1024px)'
const SECTION_IDS = ['about-intro', 'about-experience', 'about-stack', 'about-education', 'about-interests']

// What the experience timeline reads from an internship (sorted by page.tsx)
export type AboutInternship = Pick<ProjectData, 'id' | 'category' | 'title' | 'subtitle' | 'period' | 'research' | 'results'>

// ============================================
// GHOST TAG COMPONENT
// ============================================
// The brand colour is the only inline value, as a CSS variable read on hover
function GhostTag({ tech }: { tech: TechStats }) {
  return (
    <span
      data-tech={tech.name}
      className={cn(
        'inline-block px-4 py-2 text-sm tracking-wide border border-white/15 text-muted cursor-default transition-colors duration-300',
        'hover:bg-[var(--tech)] hover:border-[var(--tech)]',
        isLightColor(tech.color) ? 'hover:text-riso-night' : 'hover:text-snow'
      )}
      style={{ '--tech': tech.color } as CSSProperties}
    >
      {tech.name}
    </span>
  )
}

// ============================================
// PROJECT TIP (name of the project behind a pawn)
// ============================================
// Shown at once on hover and focus: the native title tooltip waits about a
// second (P14-D17). Devices without hover get no tip until their fallback is chosen.
function ProjectTip({ title }: { title: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-0 bottom-full z-10 mb-2 hidden whitespace-nowrap bg-riso-ink px-2 py-1 text-xs font-normal normal-case not-italic tracking-normal text-snow no-underline opacity-0 transition-opacity duration-100 group-hover/tip:opacity-100 group-focus-visible/tip:opacity-100 [@media(hover:hover)]:block"
    >
      {title}
    </span>
  )
}

// ============================================
// INTEREST LINKS (the projects an interest led to)
// ============================================
type InterestProject = { id: string; category: string; title: BilingualText | string }

function InterestLinks({ projects }: { projects?: InterestProject[] }) {
  const locale = useLocale()
  const tAbout = useTranslations('about')
  if (!projects?.length) return null
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs tracking-caps uppercase">
      <span className="text-muted">{tAbout('interests.related')}</span>
      <ul className="contents">
        {projects.map((project) => (
          <li key={project.id}>
            <TransitionLink
              href={`/projects/${project.category}/${project.id}`}
              className="tap-target inline-flex items-center gap-2 text-accent hover:text-white transition-colors group"
            >
              {getLocalizedField(project.title, locale)}
              <ArrowRight aria-hidden="true" size={14} className="transition-transform group-hover:translate-x-1" />
            </TransitionLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ============================================
// OTHER JOB (one line of the disclosure)
// ============================================
function OtherJob({ job }: { job: ExperienceEntry }) {
  const locale = useLocale()
  const tAbout = useTranslations('about')
  const where = job.place ? `${job.organisation} (${job.place})` : job.organisation
  return (
    <li data-experience={job.id} className="py-4 border-b border-riso-blue/35">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <span className="font-bold">{getLocalizedField(job.role, locale)}, {where}</span>
        <span className="font-mono text-xs text-muted">{getLocalizedField(job.period, locale)}</span>
      </div>
      <p className="mt-1 text-sm text-muted leading-relaxed">{getLocalizedField(job.summary, locale)}</p>
      {job.project && (
        <TransitionLink
          href={`/projects/${job.project.category}/${job.project.id}`}
          className="tap-target mt-1 inline-flex items-center gap-2 text-xs tracking-caps uppercase text-accent hover:text-white transition-colors group"
        >
          {tAbout('experience.others.viewProject', { name: job.project.name })}
          <ArrowRight aria-hidden="true" size={14} className="transition-transform group-hover:translate-x-1" />
        </TransitionLink>
      )}
    </li>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function AboutView({
  internships,
  experiences,
  interestProjects,
  techStats,
}: {
  internships: AboutInternship[]
  experiences: ExperienceEntry[]
  interestProjects: Record<string, InterestProject[]>
  techStats: { languages: LanguageStats[]; secondaryByFamily: TechFamilyStats[] }
}) {
  const tAbout = useTranslations('about')
  const tNav = useTranslations('nav')
  const tMenu = useTranslations('menu')
  const tContact = useTranslations('contact')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const prefersReducedMotion = useReducedMotion()
  // bumped when the viewport crosses the desktop breakpoint, to rebuild the triggers
  const [layoutVersion, setLayoutVersion] = useState(0)
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const onChange = () => setLayoutVersion((v) => v + 1)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const education = [
    {
      id: 'master2',
      period: tAbout('education.master2.period'),
      degree: tAbout('education.master2.degree'),
      track: tAbout('education.master2.track'),
      school: tAbout('education.master2.school'),
    },
    {
      id: 'datascience',
      period: tAbout('education.datascience.period'),
      degree: tAbout('education.datascience.degree'),
      school: tAbout('education.datascience.school'),
      note: tAbout('education.datascience.note'),
    },
    {
      id: 'bachelor',
      period: tAbout('education.bachelor.period'),
      degree: tAbout('education.bachelor.degree'),
      school: tAbout('education.bachelor.school'),
    },
  ]

  const interests = [
    {
      id: 'running',
      label: tAbout('interests.running.title'),
      description: tAbout('interests.running.description'),
    },
    {
      id: 'homelab',
      label: tAbout('interests.tech.title'),
      description: tAbout('interests.tech.description'),
    },
    {
      id: 'science',
      label: tAbout('interests.science.title'),
      description: tAbout('interests.science.description'),
    },
  ]

  // last word of the page title set in Fraunces italic (DEC-13c accent)
  const titleWords = tAbout('title').split(' ')
  const titleLast = titleWords.pop()
  const titleLead = titleWords.join(' ')

  const sectionLabels = [
    tAbout('sectionLabel'),
    tAbout('experience.sectionLabel'),
    tAbout('stack.sectionLabel'),
    tAbout('education.sectionLabel'),
    tAbout('interests.sectionLabel'),
  ]

  // Page container ref
  const pageRef = useRef<HTMLDivElement>(null)
  
  // Container of the background word (parallax target)
  const bgContainerRef = useRef<HTMLDivElement>(null)
  
  // Section refs
  const introSectionRef = useRef<HTMLElement>(null)
  const experienceSectionRef = useRef<HTMLElement>(null)
  const stackSectionRef = useRef<HTMLElement>(null)
  const educationSectionRef = useRef<HTMLElement>(null)
  const interestsSectionRef = useRef<HTMLElement>(null)

  // Highest progress reached by each pinned section
  // the intro is the first screen: shown whole, never pinned
  const introMaxProgressRef = useRef(1)
  const experienceMaxProgressRef = useRef(0)
  const stackMaxProgressRef = useRef(0)
  const educationMaxProgressRef = useRef(0)
  const interestsMaxProgressRef = useRef(0)

  // Progress states for animations
  const [, setIntroProgress] = useState(1)
  const [experienceProgress, setExperienceProgress] = useState(0)
  const [stackProgress, setStackProgress] = useState(0)
  const [educationProgress, setEducationProgress] = useState(0)
  const [interestsProgress, setInterestsProgress] = useState(0)
  
  // Section in view (drives the background word and the section rail) and the
  // position of the rail's progress thumb, from 0 (first dot) to 1 (last dot)
  const [activeSection, setActiveSection] = useState(0)
  const [railProgress, setRailProgress] = useState(0)

  // One-way pins: which sections have been played, and their live pin triggers
  const releasedRef = useRef<boolean[]>(SECTION_IDS.map((_, i) => i === 0))
  const pinTriggersRef = useRef<(ScrollTrigger | null)[]>(SECTION_IDS.map(() => null))

  const { lenis } = useSmoothScroll()
  const lenisRef = useRef(lenis)
  useEffect(() => {
    lenisRef.current = lenis
  }, [lenis])

  const sectionRefs = useMemo(
    () => [introSectionRef, experienceSectionRef, stackSectionRef, educationSectionRef, interestsSectionRef],
    []
  )
  const maxProgressRefs = useMemo(
    () => [introMaxProgressRef, experienceMaxProgressRef, stackMaxProgressRef, educationMaxProgressRef, interestsMaxProgressRef],
    []
  )
  const progressSetters = useMemo(
    () => [setIntroProgress, setExperienceProgress, setStackProgress, setEducationProgress, setInterestsProgress],
    []
  )

  /** Mark sections as played and remove their pins. With `compensate`, the
   *  scroll position moves up by the pin length removed above the viewport,
   *  so nothing on screen moves. */
  const releasePins = useCallback((indices: number[], compensate: boolean) => {
    const y = window.scrollY
    // removing a pin moves its section out of the spacer, which drops the
    // focus of any element inside it (keyboard navigation)
    const focused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    let removed = 0
    for (const i of indices) {
      if (releasedRef.current[i]) continue
      releasedRef.current[i] = true
      maxProgressRefs[i].current = 1
      progressSetters[i](1)
      const trigger = pinTriggersRef.current[i]
      if (!trigger) continue
      if (compensate && y >= trigger.end) removed += trigger.end - trigger.start
      trigger.kill()
      pinTriggersRef.current[i] = null
    }
    const compensateScroll = () => {
      if (removed === 0) return
      const target = y - removed
      const smooth = lenisRef.current
      if (smooth) {
        smooth.resize()
        smooth.scrollTo(target, { immediate: true, force: true })
      } else {
        window.scrollTo({ top: target, behavior: 'instant' })
      }
    }
    // before the refresh, so the triggers below are measured at the right
    // position; again after it, since the refresh restores the scroll position
    // it recorded
    compensateScroll()
    ScrollTrigger.refresh()
    if (focused && focused !== document.body && focused.isConnected && document.activeElement !== focused) {
      focused.focus({ preventScroll: true })
    }
    // Lenis already targets this position and would ignore a second scrollTo
    if (removed > 0 && Math.abs(window.scrollY - (y - removed)) > 1) {
      window.scrollTo({ top: y - removed, behavior: 'instant' })
      ScrollTrigger.update()
    }
  }, [maxProgressRefs, progressSetters])

  /** Keyboard focus entering a section not yet played: that section and the
   *  ones above it are shown at their final state, then the focused element is
   *  brought into view (a focused link must never be invisible, UX-14). */
  const revealFocusedSection = (event: React.FocusEvent<HTMLDivElement>) => {
    const index = sectionRefs.findIndex((ref) => ref.current?.contains(event.target))
    // focusing the section itself (rail jump) is handled by its caller
    if (index < 0 || releasedRef.current[index] || sectionRefs[index].current === event.target) return
    releasePins(SECTION_IDS.map((_, i) => i).filter((i) => i <= index), true)
    const target = event.target as HTMLElement
    const top = target.getBoundingClientRect().top + window.scrollY - window.innerHeight / 3
    const smooth = lenisRef.current
    if (smooth) smooth.scrollTo(top, { immediate: true, force: true })
    else window.scrollTo({ top, behavior: 'instant' })
  }

  /** Rail jump: the target and the sections above it count as played, so the
   *  visitor lands on content, not on a section waiting for its scroll (P14-D16). */
  const jumpToSection = (index: number) => {
    releasePins(SECTION_IDS.map((_, i) => i).filter((i) => i <= index), false)
    const el = sectionRefs[index].current
    if (!el) return
    const box = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
    const top = box.getBoundingClientRect().top + window.scrollY
    const smooth = lenisRef.current
    if (smooth) smooth.scrollTo(top, { force: true })
    else window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    el.focus({ preventScroll: true })
  }

  const { languages, secondaryByFamily } = techStats
  // One row per language used by several projects; the single-project ones share a line (V6-STAT-02)
  const languageRows = languages.filter((l) => l.count > 1)
  const languageTies = languages.filter((l) => l.count === 1)

  // Page set-up before paint (the page transition already scrolled to the top)
  useLayoutEffect(() => {
    // the home page's section tween can still be running from the page
    // transition (it scrolls to the top before the route swaps); stop it so it
    // does not repaint the body in the night colour after this page sets paper
    gsap.killTweensOf(document.body)
    document.body.style.backgroundColor = PAGE_BG
    // the browser's own scroll anchoring would shift the page a second time
    // when a played pin is removed (the compensation is done by hand)
    const root = document.documentElement
    const previousAnchor = root.style.overflowAnchor
    root.style.overflowAnchor = 'none'
    return () => {
      root.style.overflowAnchor = previousAnchor
    }
  }, [])

  // ============================================
  // GSAP
  // ============================================
  useEffect(() => {
    if (!pageRef.current) return

    // Reduced motion: no pins, no scrub, no parallax. Small screens: no pins.
    // Either way every section is shown at full progress and scrolls natively.
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches
    if (prefersReducedMotion || !isDesktop) {
      SECTION_IDS.forEach((_, i) => {
        releasedRef.current[i] = true
        maxProgressRefs[i].current = 1
        progressSetters[i](1)
      })
    }

    let releaseFrame = 0
    const pending = new Set<number>()
    const scheduleRelease = (index: number) => {
      pending.add(index)
      if (releaseFrame) return
      // outside ScrollTrigger's own update pass: killing a trigger mid-update
      // would skip the callbacks of the triggers below it
      releaseFrame = requestAnimationFrame(() => {
        releaseFrame = 0
        const indices = [...pending]
        pending.clear()
        releasePins(indices, true)
      })
    }

    const ctx = gsap.context(() => {

      // ========================================
      // 0. SECTION TRACKER (rail, background word)
      // ========================================
      const track = (self: ScrollTrigger) => {
        const probe = window.scrollY + window.innerHeight / 3
        const starts = sectionRefs.map((ref) => {
          const el = ref.current
          if (!el) return 0
          const box = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
          return box.getBoundingClientRect().top + window.scrollY
        })
        let active = 0
        starts.forEach((start, i) => {
          if (start <= probe) active = i
        })
        const last = starts.length - 1
        const next = active < last ? starts[active + 1] : self.end
        const span = next - starts[active]
        const within = span > 0 ? Math.min(1, Math.max(0, (window.scrollY - starts[active]) / span)) : 1
        setActiveSection(active)
        setRailProgress(active === last ? 1 : (active + within) / last)
      }
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: track,
        // a refresh (each time a played pin is removed) updates the triggers
        // while pins are reverted; measure again once it has settled
        onRefresh: track,
      })

      if (prefersReducedMotion) return

      // ========================================
      // 1. PARALLAX BACKGROUND txt
      // ========================================
      if (bgContainerRef.current) {
        gsap.fromTo(bgContainerRef.current,
          { xPercent: -12 },
          {
            xPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: pageRef.current,
              start: 'top top',
              // recompute the range on refresh, once the pinned sections have
              // added their scroll length
              end: () => `+=${document.scrollingElement?.scrollHeight || document.body.scrollHeight}`,
              invalidateOnRefresh: true,
              scrub: 1,
            }
          }
        )
      }
      
      // Small screens: each section fades in once as it enters the viewport
      if (!isDesktop) {
        sectionRefs.forEach((ref) => {
          const content = ref.current?.firstElementChild
          if (!content) return
          gsap.from(content, {
            opacity: 0,
            y: 24,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
          })
        })
        return
      }

      // ========================================
      // 2. ONE-WAY SECTION PINS
      // ========================================
      sectionRefs.forEach((ref, i) => {
        if (releasedRef.current[i] || !ref.current) return
        pinTriggersRef.current[i] = ScrollTrigger.create({
          trigger: ref.current,
          start: 'top top',
          end: `+=${PIN_LENGTH}`,
          pin: true,
          onUpdate: (self) => {
            // ratchet: revealed content never fades back (AUDIT-079)
            if (self.progress > maxProgressRefs[i].current) {
              maxProgressRefs[i].current = self.progress
              progressSetters[i](self.progress)
            }
            if (self.progress >= 1) scheduleRelease(i)
          },
          onLeave: () => scheduleRelease(i),
        })
      })
    }, pageRef)

    return () => {
      cancelAnimationFrame(releaseFrame)
      ctx.revert()
      pinTriggersRef.current = SECTION_IDS.map(() => null)
    }
  }, [prefersReducedMotion, layoutVersion, sectionRefs, maxProgressRefs, progressSetters, releasePins])

  
  // ============================================
  // EXPERIENCE SECTION CALCULATIONS
  // ============================================
  // The job cards, then the internship cards, appear one after the other
  const jobs = experiences.filter((e) => e.level === 1)
  const otherJobs = experiences.filter((e) => e.level === 2 && !e.student)
  const studentJobs = experiences.filter((e) => e.level === 2 && e.student)
  const expItemProgress = [...jobs, ...internships].map((_, i) =>
    Math.max(0, Math.min(1, (experienceProgress - 0.3 - i * 0.15) / 0.25))
  )

  // ============================================
  // STACK SECTION CALCULATIONS
  // ============================================
  const stackDescriptionOpacity = Math.max(0, Math.min(1, stackProgress / 0.2))
  const barContainerOpacity = Math.max(0, Math.min(1, (stackProgress - 0.2) / 0.1))
  const barProgress = Math.max(0, Math.min(1, (stackProgress - 0.3) / 0.4))
  // Pawns print one after the other, across the rows, as the section progresses
  const pawnTotal = languageRows.reduce((sum, l) => sum + l.count, 0)
  const tiesOpacity = Math.max(0, Math.min(1, (barProgress - 0.9) / 0.1))
  const toolkitOpacity = Math.max(0, Math.min(1, (stackProgress - 0.7) / 0.2))
  const toolkitY = Math.max(0, 30 - (stackProgress - 0.7) * 150)
  
  // ============================================
  // EDUCATION SECTION CALCULATIONS
  // ============================================
  const lineProgress = Math.max(0, Math.min(1, (educationProgress - 0.1) / 0.6))
  const item1Progress = Math.max(0, Math.min(1, (lineProgress - 0.05) / 0.25))
  const item2Progress = Math.max(0, Math.min(1, (lineProgress - 0.35) / 0.25))
  const item3Progress = Math.max(0, Math.min(1, (lineProgress - 0.65) / 0.25))
  
  // ============================================
  // INTERESTS SECTION CALCULATIONS
  // ============================================
  const interest1Progress = Math.max(0, Math.min(1, (interestsProgress - 0.15) / 0.25))
  const interest2Progress = Math.max(0, Math.min(1, (interestsProgress - 0.4) / 0.25))
  const interest3Progress = Math.max(0, Math.min(1, (interestsProgress - 0.65) / 0.25))
  
  return (
    <>
      {/* ============================================ */}
      {/* SCROLL INDICATOR */}
      {/* ============================================ */}
      <ScrollIndicator hideAfterPx={100} />

      {/* ============================================ */}
      {/* SECTION RAIL (desktop) */}
      {/* ============================================ */}
      <nav
        aria-label={tAbout('sectionNav')}
        className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-rail"
      >
        <div className="relative h-[50vh]">
          <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-riso-blue" />
          <span
            aria-hidden="true"
            className="absolute left-1/2 w-[5px] h-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-riso-pink"
            style={{ top: `${railProgress * 100}%` }}
          />
          <ol className="absolute inset-0">
            {sectionLabels.map((label, i) => (
              <li
                key={SECTION_IDS[i]}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${(i / (SECTION_IDS.length - 1)) * 100}%` }}
              >
                <a
                  href={`#${SECTION_IDS[i]}`}
                  aria-current={activeSection === i ? 'true' : undefined}
                  onClick={(event) => {
                    event.preventDefault()
                    jumpToSection(i)
                  }}
                  className="group relative flex items-center justify-center w-6 h-6"
                >
                  <span
                    aria-hidden="true"
                    className={`w-3 h-3 rounded-full border-2 border-riso-blue transition-colors ${
                      activeSection === i ? 'bg-riso-pink border-riso-pink' : 'bg-surface group-hover:bg-riso-blue'
                    }`}
                  />
                  <span className="absolute right-full mr-3 px-2 py-1 whitespace-nowrap text-meta tracking-caps uppercase bg-surface opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {label}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* ============================================ */}
      {/* PARALLAX BACKGROUND TEXT */}
      {/* pointer-events: none so it never blocks clicks */}
      {/* the ref is on the container, not on the span that changes */}
      {/* ============================================ */}
      <div
        aria-hidden="true"
        className="fixed inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center"
      >
        <div ref={bgContainerRef} className="relative">
          <AnimatePresence mode="wait">
            <m.span
              key={activeSection}
              initial={{
                opacity: 0,
                x: activeSection % 2 === 0 ? -30 : 30
              }}
              animate={{ opacity: 0.025, x: 0 }}
              exit={{
                opacity: 0,
                x: activeSection % 2 === 0 ? 30 : -30
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="font-display uppercase font-black text-ghost-20 md:text-ghost-15 leading-none tracking-widest text-white whitespace-nowrap"
            >
              {bgTexts[activeSection]}
            </m.span>
          </AnimatePresence>
        </div>
      </div>
      
      {/* ============================================ */}
      {/* PAGE CONTENT */}
      {/* ============================================ */}
      <div ref={pageRef} onFocus={revealFocusedSection} style={{ backgroundColor: PAGE_BG }}>
        
        {/* ============================================ */}
        {/* SECTION 001 - ABOUT */}
        {/* ============================================ */}
        <section 
          ref={introSectionRef}
          id={SECTION_IDS[0]}
          tabIndex={-1}
          className="min-h-[100svh] lg:min-h-screen flex items-center outline-none px-6 md:px-12 lg:px-16 pt-28 pb-16 lg:py-24"
        >
          <div className="max-w-4xl mx-auto w-full">
            {/* Title */}
            <div>
              <Breadcrumb className="mb-8" items={[{ label: tNav('about') }]} />
              <div className="section-label text-accent mb-4">
                {tAbout('sectionLabel')}
              </div>
              <h1 className="font-display uppercase font-black text-page leading-display-snug tracking-wide mb-12 text-riso-pinkTitle misregister">
                {titleLead}{' '}
                <span className="fraunces-display-italic normal-case">{titleLast}</span>
              </h1>
            </div>
            
            {/* Intro text */}
            <div className="mb-12">
              <p className="text-lg md:text-xl text-muted leading-relaxed prose-body">
                {tAbout('full.intro')}
              </p>
            </div>
            
            {/* Goals */}
            <div className="mb-12">
              <h2 className="text-xs tracking-caps-wide uppercase text-accent mb-4">
                {tAbout('full.goalsTitle')}
              </h2>
              <p className="text-muted leading-relaxed">
                {tAbout('full.goals')}
              </p>
            </div>
            
            {/* Buttons: visible from the start, outside the pin animation */}
            <div className="flex flex-wrap gap-4">
              <Pill as="external" href={RESUME_PATH}>
                <FileText size={16} aria-hidden="true" />
                {tCommon('viewCV')}
              </Pill>
              <Pill as="external" href={SOCIAL.github} tone="outline">
                <Github size={16} aria-hidden="true" />
                {tMenu('github')}
              </Pill>
              <Pill as="external" href={SOCIAL.linkedin} tone="outline">
                <Linkedin size={16} aria-hidden="true" />
                {tMenu('linkedin')}
              </Pill>
            </div>
          </div>
        </section>
        
        {/* ============================================ */}
        {/* SECTION 002 - EXPERIENCE */}
        {/* ============================================ */}
        <section
          ref={experienceSectionRef}
          id={SECTION_IDS[1]}
          tabIndex={-1}
          className="lg:min-h-screen flex items-center outline-none px-6 md:px-12 lg:px-16 py-16 lg:py-24"
        >
          <div className="max-w-5xl mx-auto w-full">
            {/* Title */}
            <div className="mb-12">
              <div className="section-label text-accent mb-4">
                {tAbout('experience.sectionLabel')}
              </div>
              <h2 className="font-display uppercase font-black text-heading leading-display-snug tracking-wide text-riso-pinkTitle misregister">
                {tAbout('experience.title')}
              </h2>
            </div>

            {/* Jobs: low cards, a sentence instead of figures (P14-D15) */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {jobs.map((job, index) => (
                <article
                  key={job.id}
                  data-experience={job.id}
                  className="flex flex-col px-6 py-[18px] border border-riso-blue/50"
                  style={{
                    opacity: expItemProgress[index],
                    transform: `translateY(${30 - expItemProgress[index] * 30}px)`,
                  }}
                >
                  <p className="text-meta tracking-wider uppercase text-muted mb-3">
                    {[getLocalizedField(job.period, locale), job.organisation, job.place].filter(Boolean).join(' · ')}
                  </p>
                  <h3 className="font-display uppercase font-black text-lg md:text-xl leading-tight tracking-wide mb-2">
                    {getLocalizedField(job.role, locale)}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed prose-body">
                    {getLocalizedField(job.summary, locale)}
                  </p>
                </article>
              ))}
            </div>

            {/* Internships: the frame printed a second time in pink, off register (P14-D15) */}
            <div className="grid md:grid-cols-2 gap-6">
              {internships.map((project, i) => {
                const index = jobs.length + i
                return (
                  <div
                    key={project.id}
                    data-experience={project.id}
                    className="relative mr-1.5 mb-1.5"
                    style={{
                      opacity: expItemProgress[index],
                      transform: `translateY(${30 - expItemProgress[index] * 30}px)`,
                    }}
                  >
                    <div aria-hidden="true" className="absolute inset-0 translate-x-1.5 translate-y-1.5 border-[1.5px] border-riso-pink" />
                    <article className="relative h-full flex flex-col p-6 border-[1.5px] border-accent-line bg-surface">
                      <p className="text-meta tracking-wider uppercase text-muted mb-3">
                        {[
                          getLocalizedField(project.period, locale),
                          project.research?.collaboration,
                          getLocalizedField(project.research?.lab, locale),
                        ].filter(Boolean).join(' · ')}
                      </p>
                      <h3 id={`experience-${project.id}`} className="font-display uppercase font-black text-title tracking-wide mb-2">
                        {getLocalizedField(project.title, locale)}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed mb-6">
                        {getLocalizedField(project.subtitle, locale)}
                      </p>

                      {project.results && project.results.length > 0 && (
                        <dl className="grid grid-cols-3 gap-4 mb-6">
                          {project.results.map((result) => (
                            <div key={getLocalizedField(result.label, 'en')}>
                              <dt className="sr-only">{getLocalizedField(result.label, locale)}</dt>
                              {/* Digits in Fraunces italic; signs and units in the body font (MeV, not MEV) */}
                              <dd className="font-fraunces italic text-[2.25rem] leading-none tabular-nums whitespace-nowrap">
                                {formatMeasure(result.value, locale).split(/([^0-9.,\s]+)/).map((part, k) =>
                                  k % 2 ? <span key={k} className="font-body not-italic text-base font-semibold mx-px">{part}</span> : part
                                )}
                                {result.unit && <span className="ml-0.5 font-body not-italic text-base font-semibold">{result.unit}</span>}
                              </dd>
                              <dd className="text-xs text-muted leading-snug mt-2" aria-hidden="true">
                                {getLocalizedField(result.label, locale)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      <TransitionLink
                        href={`/projects/${project.category}/${project.id}`}
                        aria-describedby={`experience-${project.id}`}
                        className="tap-target mt-auto inline-flex items-center gap-2 text-sm tracking-caps uppercase text-accent hover:text-white transition-colors group"
                      >
                        {tAbout('experience.viewProject')}
                        <ArrowRight aria-hidden="true" size={16} className="transition-transform group-hover:translate-x-1" />
                      </TransitionLink>
                    </article>
                  </div>
                )
              })}
            </div>

            {/* Other work experience: native disclosure, open without JS, outside the
                animation (V6-ABT-05, V6-ABT-06) */}
            <details
              className="group mt-10 border-t border-accent-line"
              onClick={(event) => {
                // the section must be played before it grows, or its pin would shift
                if ((event.target as HTMLElement).closest('summary')) releasePins([0, 1], true)
              }}
              onToggle={() => ScrollTrigger.refresh()}
            >
              <summary className="flex items-center gap-4 min-h-14 py-3 border-b border-accent-line cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-white/[0.04] transition-colors">
                <h3 className="text-sm font-bold tracking-caps uppercase">{tAbout('experience.others.title')}</h3>
                <span className="ml-auto whitespace-nowrap font-mono text-xs text-muted">
                  {tAbout('experience.others.count', { count: otherJobs.length + studentJobs.length })}
                </span>
                <ChevronDown aria-hidden="true" size={18} className="shrink-0 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <ul>
                {otherJobs.map((job) => <OtherJob key={job.id} job={job} />)}
              </ul>
              <h4 className="mt-7 text-xs tracking-caps-wide uppercase text-muted">{tAbout('experience.others.student')}</h4>
              <ul>
                {studentJobs.map((job) => <OtherJob key={job.id} job={job} />)}
              </ul>
            </details>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 003 - TECHNICAL STACK */}
        {/* ============================================ */}
        <section 
          ref={stackSectionRef}
          id={SECTION_IDS[2]}
          tabIndex={-1}
          className="lg:min-h-screen flex items-center outline-none px-6 md:px-12 lg:px-16 py-16 lg:py-24"
        >
          <div className="max-w-5xl mx-auto w-full">
            {/* Titre section */}
            <div className="mb-4">
              <div className="section-label text-accent mb-4">
                {tAbout('stack.sectionLabel')}
              </div>
            </div>
            
            {/* Sous-titre + description */}
            <div className="mb-16">
              <h2 className="font-display uppercase font-black text-heading leading-display-snug tracking-wide mb-4 text-riso-pinkTitle misregister">
                {tAbout('stack.title')}
              </h2>
              <p className="text-muted max-w-xl" style={{ opacity: stackDescriptionOpacity }}>
                {tAbout('stack.description')}
              </p>
            </div>
            
            {/* Project pawns: one square per project that uses the language (V6-STAT-04, design A) */}
            <div className="mb-20" style={{ opacity: barContainerOpacity }}>
              <ul>
                {languageRows.map((lang, rowIndex) => {
                  const firstPawn = languageRows.slice(0, rowIndex).reduce((sum, l) => sum + l.count, 0)
                  return (
                    <li
                      key={lang.name}
                      data-language={lang.name}
                      className="grid grid-cols-[1fr_auto] md:grid-cols-[9rem_3.5rem_1fr] items-center gap-x-4 gap-y-3 py-4 border-b border-riso-blue/35"
                    >
                      <span className="font-black uppercase tracking-wider text-white">
                        {lang.name}
                        <span className="sr-only">, {tAbout('stack.projectCount', { count: lang.count })}</span>
                      </span>
                      <span aria-hidden="true" className="font-fraunces italic text-[2rem] leading-none text-right text-riso-ink tabular-nums">
                        {lang.count}
                      </span>
                      <span className="col-span-2 md:col-span-1 flex flex-wrap gap-2">
                        {lang.projects.map((project, i) => {
                          const title = getLocalizedField(project.title, locale)
                          return (
                            <TransitionLink
                              key={project.id}
                              href={`/projects/${project.category}/${project.id}`}
                              aria-label={title}
                              className="group/tip relative block w-6 h-6 bg-riso-pink shadow-plate transition-[box-shadow,transform] duration-200 hover:shadow-none hover:translate-x-px hover:translate-y-px focus-visible:shadow-none"
                              style={{ opacity: Math.max(0, Math.min(1, barProgress * pawnTotal - (firstPawn + i))) }}
                            >
                              <ProjectTip title={title} />
                            </TransitionLink>
                          )
                        })}
                      </span>
                    </li>
                  )
                })}
              </ul>
              {languageTies.length > 0 && (
                <p className="mt-4 text-sm text-muted" style={{ opacity: tiesOpacity }}>
                  {tAbout('stack.ties')}{' '}
                  {languageTies.map((lang, i) => {
                    const project = lang.projects[0]
                    const title = getLocalizedField(project.title, locale)
                    return (
                      <span key={lang.name}>
                        <TransitionLink
                          href={`/projects/${project.category}/${project.id}`}
                          aria-label={`${lang.name}, ${title}`}
                          className="group/tip relative text-accent underline decoration-1 underline-offset-2 hover:text-white"
                        >
                          {lang.name}
                          <ProjectTip title={title} />
                        </TransitionLink>
                        {i < languageTies.length - 1 ? ', ' : '.'}
                      </span>
                    )
                  })}
                </p>
              )}
            </div>

            {/* Extended Toolkit */}
            <div
              style={{ 
                opacity: toolkitOpacity,
                transform: `translateY(${toolkitY}px)`,
              }}
            >
              <h3 className="text-xs tracking-caps-wide uppercase text-muted mb-8">
                {tAbout('stack.extendedToolkit')}
              </h3>
              
              <div className="space-y-8">
                {secondaryByFamily.map((family) => (
                  <div key={family.id}>
                    <h4 className="flex items-center gap-2 text-xs tracking-wider uppercase mb-4 text-accent">
                      {/* Brand tint as a swatch only: the label stays in ink (COL-04). */}
                      <span aria-hidden="true" className="w-2 h-2 shrink-0" style={{ backgroundColor: family.color }} />
                      {tAbout(`stack.families.${family.id}`)}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {family.techs.map((tech) => (
                        <GhostTag key={tech.name} tech={tech} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* ============================================ */}
        {/* SECTION 004 - EDUCATION */}
        {/* ============================================ */}
        <section 
          ref={educationSectionRef}
          id={SECTION_IDS[3]}
          tabIndex={-1}
          className="lg:min-h-screen flex items-center outline-none px-6 md:px-12 lg:px-16 py-16 lg:py-24"
        >
          <div className="max-w-5xl mx-auto w-full">
            {/* Title */}
            <div className="mb-12 text-center">
              <div className="section-label text-accent justify-center mb-4">
                {tAbout('education.sectionLabel')}
              </div>
              <h2 className="font-display uppercase font-black text-heading leading-display-snug tracking-wide text-riso-pinkTitle misregister">
                {tAbout('education.subtitle')}
              </h2>
            </div>
            
            {/* Timeline */}
            <div className="relative">
              {/* Central line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/5">
                <div 
                  className="w-full bg-riso-pink origin-top"
                  style={{ height: `${lineProgress * 100}%` }}
                />
              </div>
              
              {/* Timeline items */}
              {education.map((item, index) => {
                const itemProgress = index === 0 ? item1Progress : index === 1 ? item2Progress : item3Progress
                const isLeft = index % 2 === 0
                const slideX = isLeft 
                  ? -50 + itemProgress * 50
                  : 50 - itemProgress * 50
                
                return (
                  <div 
                    key={item.id}
                    className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'} mb-12 last:mb-0`}
                    style={{
                      opacity: itemProgress,
                      transform: `translateX(${slideX}px)`,
                    }}
                  >
                    <div className={`w-full md:w-[45%] ${isLeft ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                      <div 
                        className="relative p-4 border border-accent-line"
                      >
                        <span className="inline-block px-2 py-0.5 text-meta tracking-wider uppercase mb-2 bg-riso-ink/[0.08] text-riso-ink">
                          {item.period}
                        </span>
                        
                        <h3 className="font-display uppercase font-black text-title tracking-wide mb-1">
                          {item.degree}
                        </h3>
                        
                        {'track' in item && item.track && (
                          <p className="text-xs text-muted mb-1">{item.track}</p>
                        )}
                        
                        <p className="text-xs text-muted">{item.school}</p>

                        {'note' in item && item.note && (
                          <p className="text-xs text-muted mt-1">{item.note}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Center point */}
                    <div 
                      className="hidden md:block absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-riso-ink bg-surface z-10"
                      style={{ opacity: itemProgress }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
        
        {/* ============================================ */}
        {/* SECTION 005 - INTERESTS */}
        {/* ============================================ */}
        <section 
          ref={interestsSectionRef}
          id={SECTION_IDS[4]}
          tabIndex={-1}
          className="lg:min-h-screen flex items-center outline-none px-6 md:px-12 lg:px-16 py-16 lg:py-24"
        >
          <div className="max-w-6xl mx-auto w-full">
            {/* Title */}
            <div className="mb-16">
              <div className="section-label text-accent mb-4">
                {tAbout('interests.sectionLabel')}
              </div>
              <h2 className="font-display uppercase font-black text-heading leading-display-snug tracking-wide text-riso-pinkTitle misregister">
                {tAbout('interests.title')}
              </h2>
            </div>
            
            {/* Interest 1 - Trail Running (Left) */}
            <div 
              className="flex flex-col md:flex-row items-center gap-8 mb-16"
              style={{ 
                opacity: interest1Progress,
                transform: `translateX(${-50 + interest1Progress * 50}px)`,
              }}
            >
              <div className="md:w-1/2">
                <h3 className="font-display uppercase font-black text-title tracking-wide mb-3">
                  {interests[0].label}
                </h3>
                <p className="text-muted leading-relaxed prose-body">
                  {interests[0].description}
                </p>
                <InterestLinks projects={interestProjects[interests[0].id]} />
              </div>
              <div className="w-full md:w-1/2 aspect-[8/3]">
                <MountainProfile progress={interest1Progress} className="w-full h-full" />
              </div>
            </div>
            
            {/* Interest 2 - Home Lab (Right) */}
            <div 
              className="flex flex-col md:flex-row-reverse items-center gap-8 mb-16"
              style={{ 
                opacity: interest2Progress,
                transform: `translateX(${50 - interest2Progress * 50}px)`,
              }}
            >
              <div className="md:w-1/2">
                <h3 className="font-display uppercase font-black text-title tracking-wide mb-3 md:text-right">
                  {interests[1].label}
                </h3>
                <p className="text-muted leading-relaxed prose-body">
                  {interests[1].description}
                </p>
                <InterestLinks projects={interestProjects[interests[1].id]} />
              </div>
              <div className="w-full md:w-1/2 aspect-[8/3]">
                <NetworkGraph progress={interest2Progress} className="w-full h-full" />
              </div>
            </div>
            
            {/* Interest 3 - Science Communication (Left) */}
            <div 
              className="flex flex-col md:flex-row items-center gap-8"
              style={{ 
                opacity: interest3Progress,
                transform: `translateX(${-50 + interest3Progress * 50}px)`,
              }}
            >
              <div className="md:w-1/2">
                <h3 className="font-display uppercase font-black text-title tracking-wide mb-3">
                  {interests[2].label}
                </h3>
                <p className="text-muted leading-relaxed prose-body">
                  {interests[2].description}
                </p>
                <InterestLinks projects={interestProjects[interests[2].id]} />
              </div>
              <div className="w-full md:w-1/2 aspect-[8/3]">
                <CinemaSpotlight progress={interest3Progress} className="w-full h-full" />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* END OF PAGE: CV first, then contact (DEC-15f) */}
        {/* ============================================ */}
        <div className="px-6 md:px-12 lg:px-16 pb-24">
          <div className="max-w-6xl mx-auto w-full flex flex-wrap items-center gap-4 pt-12 border-t border-riso-pink">
            <Pill as="external" href={RESUME_PATH}>
              <FileText size={16} aria-hidden="true" />
              {tCommon('viewCV')}
            </Pill>
            <Pill as="link" href="/contact" tone="outline">
              {tContact('preview.cta')}
              <ArrowRight size={16} aria-hidden="true" />
            </Pill>
          </div>
        </div>
      </div>
    </>
  )
}
