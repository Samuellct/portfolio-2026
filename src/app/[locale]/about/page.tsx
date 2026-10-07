'use client'

import { useCallback, useEffect, useRef, useLayoutEffect, useMemo, useState } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, ArrowRight, Download, Github, Linkedin } from 'lucide-react'
import { extractTechStats, TechStats, isLightColor } from '@/lib/techStats'
import { getProjectsByCategory, getLocalizedField, type Locale } from '@/lib/projects'
import MountainProfile from '@/components/about/MountainProfile'
import NetworkGraph from '@/components/about/NetworkGraph'
import CinemaSpotlight from '@/components/about/CinemaSpotlight'
import ScrollIndicator from '@/components/about/ScrollIndicator'
import { useLocale, useTranslations } from 'next-intl'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useSmoothScroll } from '@/context/SmoothScrollContext'
import { CONTRAST_TEXT, RISO, SECTION_BG } from '@/lib/theme'

gsap.registerPlugin(ScrollTrigger)

// ============================================
// BACKGROUND TEXTS
// ============================================
const bgTexts = ['ABOUT', 'EXPERIENCE', 'STACK', 'EDUCATION', 'INTERESTS']

// Scroll length of each section's pin. A pin plays once, on the way down: when
// its section has been played to the end, the pin is removed and the scroll
// position compensated, so scrolling back up never pins again (DEC-15a).
const PIN_LENGTH = 1000
const SECTION_IDS = ['about-intro', 'about-experience', 'about-stack', 'about-education', 'about-interests']

// Research internships, most recent first (data from projects.ts)
const internships = [...getProjectsByCategory('internship')].sort((a, b) =>
  b.dateCreated.localeCompare(a.dateCreated)
)

// ============================================
// GHOST TAG COMPONENT
// ============================================
function GhostTag({ tech }: { tech: TechStats }) {
  const [isHovered, setIsHovered] = useState(false)
  
  const textColor = isHovered 
    ? (isLightColor(tech.color) ? CONTRAST_TEXT.onLight : CONTRAST_TEXT.onDark)
    : 'var(--muted)'
  
  return (
    <span
      className="inline-block px-4 py-2 text-sm tracking-wide border cursor-default transition-all duration-300"
      style={{
        backgroundColor: isHovered ? tech.color : 'transparent',
        borderColor: isHovered ? tech.color : 'rgb(var(--fg) / 0.15)',
        color: textColor,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {tech.name}
    </span>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function AboutPage() {
  const tAbout = useTranslations('about')
  const tCommon = useTranslations('common')
  const tMenu = useTranslations('menu')
  const locale = useLocale() as Locale
  const prefersReducedMotion = useReducedMotion()

  const education = [
    {
      id: 'master2',
      period: tAbout('education.master2.period'),
      degree: tAbout('education.master2.degree'),
      track: tAbout('education.master2.track'),
      school: tAbout('education.master2.school'),
      color: RISO.ink,
    },
    {
      id: 'datascience',
      period: tAbout('education.datascience.period'),
      degree: tAbout('education.datascience.degree'),
      school: tAbout('education.datascience.school'),
      color: RISO.ink,
    },
    {
      id: 'bachelor',
      period: tAbout('education.bachelor.period'),
      degree: tAbout('education.bachelor.degree'),
      school: tAbout('education.bachelor.school'),
      color: RISO.ink,
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

  const sectionLabels = [
    tAbout('sectionLabel'),
    tAbout('experience.sectionLabel'),
    tAbout('stack.sectionLabel'),
    tAbout('education.sectionLabel'),
    tAbout('interests.sectionLabel'),
  ]

  // Page container ref
  const pageRef = useRef<HTMLDivElement>(null)
  
  // Background text CONTAINER ref (pour le parallax)
  const bgContainerRef = useRef<HTMLDivElement>(null)
  
  // Section refs
  const introSectionRef = useRef<HTMLElement>(null)
  const experienceSectionRef = useRef<HTMLElement>(null)
  const stackSectionRef = useRef<HTMLElement>(null)
  const educationSectionRef = useRef<HTMLElement>(null)
  const interestsSectionRef = useRef<HTMLElement>(null)

  // Refs pour stocker la progression MAXIMALE atteinte
  const introMaxProgressRef = useRef(0)
  const experienceMaxProgressRef = useRef(0)
  const stackMaxProgressRef = useRef(0)
  const educationMaxProgressRef = useRef(0)
  const interestsMaxProgressRef = useRef(0)

  // Progress states for animations
  const [introProgress, setIntroProgress] = useState(0)
  const [experienceProgress, setExperienceProgress] = useState(0)
  const [stackProgress, setStackProgress] = useState(0)
  const [educationProgress, setEducationProgress] = useState(0)
  const [interestsProgress, setInterestsProgress] = useState(0)
  
  // Section in view (drives the background word and the section rail) and the
  // position of the rail's progress thumb, from 0 (first dot) to 1 (last dot)
  const [activeSection, setActiveSection] = useState(0)
  const [railProgress, setRailProgress] = useState(0)

  // One-way pins: which sections have been played, and their live pin triggers
  const releasedRef = useRef<boolean[]>(SECTION_IDS.map(() => false))
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
    // Lenis already targets this position and would ignore a second scrollTo
    if (removed > 0 && Math.abs(window.scrollY - (y - removed)) > 1) {
      window.scrollTo({ top: y - removed, behavior: 'instant' })
      ScrollTrigger.update()
    }
  }, [maxProgressRefs, progressSetters])

  /** Rail jump: sections above the target count as played, then scroll to it. */
  const jumpToSection = (index: number) => {
    releasePins(SECTION_IDS.map((_, i) => i).filter((i) => i < index), false)
    const el = sectionRefs[index].current
    if (!el) return
    const box = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
    const top = box.getBoundingClientRect().top + window.scrollY
    const smooth = lenisRef.current
    if (smooth) smooth.scrollTo(top, { force: true })
    else window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    el.focus({ preventScroll: true })
  }

  // Get tech stats
  const { topTechs, secondaryByFamily } = useMemo(() => extractTechStats(), [])

  // Scroll to top on mount
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    document.body.style.backgroundColor = SECTION_BG.aboutIntro
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

    // Reduced motion: no pins, no scrub, no parallax. Reveal every pinned
    // section at full progress so all content is visible, page scrolls natively.
    if (prefersReducedMotion) {
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
  }, [prefersReducedMotion, sectionRefs, maxProgressRefs, progressSetters, releasePins])

  // ============================================
  // INTRO SECTION CALCULATIONS
  // ============================================
  const introTextOpacity = Math.max(0, Math.min(1, (introProgress - 0.1) / 0.25))
  const introTextY = Math.max(0, 30 - introProgress * 120)
  const goalsOpacity = Math.max(0, Math.min(1, (introProgress - 0.35) / 0.25))
  const goalsY = Math.max(0, 30 - (introProgress - 0.35) * 120)
  const buttonsOpacity = Math.max(0, Math.min(1, (introProgress - 0.6) / 0.25))
  const buttonsY = Math.max(0, 40 - (introProgress - 0.6) * 160)
  
  // ============================================
  // EXPERIENCE SECTION CALCULATIONS
  // ============================================
  const expIntroOpacity = Math.max(0, Math.min(1, (experienceProgress - 0.1) / 0.2))
  const expItemProgress = internships.map((_, i) =>
    Math.max(0, Math.min(1, (experienceProgress - 0.3 - i * 0.25) / 0.25))
  )

  // ============================================
  // STACK SECTION CALCULATIONS
  // ============================================
  const stackDescriptionOpacity = Math.max(0, Math.min(1, stackProgress / 0.2))
  const barContainerOpacity = Math.max(0, Math.min(1, (stackProgress - 0.2) / 0.1))
  const barProgress = Math.max(0, Math.min(1, (stackProgress - 0.3) / 0.4))
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
      {/* HEADER */}
      {/* z-index = 100 pour être au-dessus des sections pinnées */}
      {/* ============================================ */}
      <header className="scheme-night fixed top-0 left-0 right-0 z-[100] pt-6 pb-4 px-6 md:px-12 lg:px-16 pointer-events-none">
        <div className="flex justify-between items-center">
          {/* Espace pour le logo SL de la NavBar (à gauche) */}
          <div className="w-20" />
          
          {/* Bouton Back */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute left-20 md:left-24 pointer-events-auto"
          >
            <TransitionLink
              href="/"
              className="tap-target inline-flex items-center gap-2 text-muted hover:text-white transition-colors group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <span className="text-sm tracking-label uppercase">{tCommon('back')}</span>
            </TransitionLink>
          </motion.div>
        </div>
      </header>
      
      {/* ============================================ */}
      {/* SCROLL INDICATOR */}
      {/* ============================================ */}
      <ScrollIndicator hideAfterPx={100} />

      {/* ============================================ */}
      {/* SECTION RAIL (desktop) */}
      {/* ============================================ */}
      <nav
        aria-label={tAbout('sectionNav')}
        className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-[90]"
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
      {/* pointer-events: none pour pas bloquer les clics */}
      {/* ref sur le conteneur, pas sur le span qui change */}
      {/* ============================================ */}
      <div
        aria-hidden="true"
        className="fixed inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center"
      >
        <div ref={bgContainerRef} className="relative">
          <AnimatePresence mode="wait">
            <motion.span
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
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      
      {/* ============================================ */}
      {/* PAGE CONTENT */}
      {/* ============================================ */}
      <div ref={pageRef}>
        
        {/* ============================================ */}
        {/* SECTION 001 - ABOUT */}
        {/* ============================================ */}
        <section 
          ref={introSectionRef}
          id={SECTION_IDS[0]}
          tabIndex={-1}
          className="min-h-screen flex items-center outline-none px-6 md:px-12 lg:px-16 py-24"
        >
          <div className="max-w-4xl mx-auto w-full">
            {/* Title */}
            <div>
              <div className="section-label text-accent mb-4">
                {tAbout('sectionLabel')}
              </div>
              <h1 className="font-display uppercase font-black text-page leading-display-snug tracking-wide mb-12">
                {tAbout('title')}
              </h1>
            </div>
            
            {/* Intro text */}
            <div 
              className="mb-12"
              style={{ 
                opacity: introTextOpacity,
                transform: `translateY(${introTextY}px)`,
              }}
            >
              <p className="text-lg md:text-xl text-muted leading-relaxed">
                {tAbout('full.intro')}
              </p>
            </div>
            
            {/* Goals */}
            <div 
              className="mb-12"
              style={{ 
                opacity: goalsOpacity,
                transform: `translateY(${goalsY}px)`,
              }}
            >
              <h2 className="text-xs tracking-caps-wide uppercase text-accent mb-4">
                {tAbout('full.goalsTitle')}
              </h2>
              <p className="text-muted leading-relaxed">
                {tAbout('full.goals')}
              </p>
            </div>
            
            {/* Buttons */}
            <div 
              className="flex flex-wrap justify-center gap-4"
              style={{ 
                opacity: buttonsOpacity,
                transform: `translateY(${buttonsY}px)`,
              }}
            >
              <a
                href="/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-accent-line/50 hover:bg-accent-line/10 transition-all duration-300"
              >
                <Download size={18} className="text-accent" />
                <span className="text-sm">{tAbout('downloadCV')}</span>
              </a>
              
              <a
                href="https://github.com/Samuellct"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300"
              >
                <Github size={18} />
                <span className="text-sm">{tMenu('github')}</span>
              </a>
              
              <a
                href="https://www.linkedin.com/in/samuel-lecomte37/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-brand-linkedin/50 hover:bg-brand-linkedin/10 transition-all duration-300"
              >
                <Linkedin size={18} className="text-brand-linkedin" />
                <span className="text-sm">{tMenu('linkedin')}</span>
              </a>
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
          className="min-h-screen flex items-center outline-none px-6 md:px-12 lg:px-16 py-24"
        >
          <div className="max-w-5xl mx-auto w-full">
            {/* Title */}
            <div className="mb-8">
              <div className="section-label text-accent mb-4">
                {tAbout('experience.sectionLabel')}
              </div>
              <h2 className="font-display uppercase font-black text-heading leading-display-snug tracking-wide">
                {tAbout('experience.title')}
              </h2>
            </div>

            {/* Intro */}
            <p
              className="text-muted leading-relaxed max-w-3xl mb-12"
              style={{ opacity: expIntroOpacity }}
            >
              {tAbout('full.experience')}
            </p>

            {/* Internships */}
            <div className="grid md:grid-cols-2 gap-6">
              {internships.map((project, index) => (
                <article
                  key={project.id}
                  className="flex flex-col p-6 bg-white/[0.02] border border-white/5 border-l-2 border-l-riso-pink/60"
                  style={{
                    opacity: expItemProgress[index],
                    transform: `translateY(${30 - expItemProgress[index] * 30}px)`,
                  }}
                >
                  <p className="text-meta tracking-wider uppercase text-muted mb-3">
                    {[
                      getLocalizedField(project.period, locale),
                      project.research?.collaboration,
                      getLocalizedField(project.research?.lab, locale),
                    ].filter(Boolean).join(' · ')}
                  </p>
                  <h3 className="font-display uppercase font-black text-title tracking-wide mb-2">
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
                          {/* body font: the display face is all caps and would print MeV as MEV */}
                          <dd className="text-xl md:text-2xl font-semibold tabular-nums">
                            {result.value}
                          </dd>
                          <dd className="text-xs text-muted leading-snug mt-1" aria-hidden="true">
                            {getLocalizedField(result.label, locale)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <TransitionLink
                    href={`/projects/${project.category}/${project.id}`}
                    className="tap-target mt-auto inline-flex items-center gap-2 text-sm tracking-caps uppercase text-accent hover:text-white transition-colors group"
                  >
                    {tAbout('experience.viewProject')}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </TransitionLink>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 003 - TECHNICAL STACK */}
        {/* ============================================ */}
        <section 
          ref={stackSectionRef}
          id={SECTION_IDS[2]}
          tabIndex={-1}
          className="min-h-screen flex items-center outline-none px-6 md:px-12 lg:px-16 py-24"
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
              <h2 className="font-display uppercase font-black text-heading leading-display-snug tracking-wide mb-4">
                {tAbout('stack.title')}
              </h2>
              <p className="text-muted max-w-xl" style={{ opacity: stackDescriptionOpacity }}>
                {tAbout('stack.description')}
              </p>
            </div>
            
            {/* Progress Bar */}
            <div 
              className="grid md:grid-cols-2 gap-x-12 gap-y-6 mb-20"
              style={{ opacity: barContainerOpacity }}
            >
              {topTechs.map((tech, index) => {
                const barStartDelay = index * 0.1
                const individualBarProgress = Math.max(0, Math.min(1, (barProgress - barStartDelay) / 0.6))
                const barFill = individualBarProgress * tech.percentage
                
                return (
                  <div key={tech.name} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium tracking-wide text-white">
                        {tech.name}
                      </span>
                      <span className="text-xs text-muted tabular-nums">
                        {tAbout('stack.projectCount', { count: tech.count })}
                      </span>
                    </div>
                    <div className="relative h-[3px] bg-white/10 overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0"
                        style={{ 
                          width: `${barFill}%`,
                          backgroundColor: tech.color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
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
          className="min-h-screen flex items-center outline-none px-6 md:px-12 lg:px-16 py-24"
        >
          <div className="max-w-5xl mx-auto w-full">
            {/* Title */}
            <div className="mb-12 text-center">
              <div className="section-label text-accent justify-center mb-4">
                {tAbout('education.sectionLabel')}
              </div>
              <h2 className="font-display uppercase font-black text-heading leading-display-snug tracking-wide">
                {tAbout('education.subtitle')}
              </h2>
            </div>
            
            {/* Timeline */}
            <div className="relative">
              {/* Central line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/5">
                <div 
                  className="w-full bg-gradient-to-b from-riso-blue to-riso-pink origin-top"
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
                        className="relative p-4 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors duration-500"
                        style={{ 
                          borderLeftColor: isLeft ? item.color : undefined,
                          borderRightColor: !isLeft ? item.color : undefined,
                          borderLeftWidth: isLeft ? '2px' : undefined,
                          borderRightWidth: !isLeft ? '2px' : undefined,
                        }}
                      >
                        <span 
                          className="inline-block px-2 py-0.5 text-meta tracking-wider uppercase mb-2"
                          style={{ backgroundColor: `${item.color}15`, color: item.color }}
                        >
                          {item.period}
                        </span>
                        
                        <h3 className="font-display uppercase font-black text-title tracking-wide mb-1">
                          {item.degree}
                        </h3>
                        
                        {'track' in item && item.track && (
                          <p className="text-xs text-muted mb-1">{item.track}</p>
                        )}
                        
                        <p className="text-xs text-muted">{item.school}</p>
                      </div>
                    </div>
                    
                    {/* Center point */}
                    <div 
                      className="hidden md:block absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 bg-surface z-10"
                      style={{ 
                        borderColor: item.color,
                        opacity: itemProgress
                      }}
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
          className="min-h-screen flex items-center outline-none px-6 md:px-12 lg:px-16 py-24"
        >
          <div className="max-w-6xl mx-auto w-full">
            {/* Title */}
            <div className="mb-16">
              <div className="section-label text-accent mb-4">
                {tAbout('interests.sectionLabel')}
              </div>
              <p className="text-muted">
                {tAbout('interests.subtitle')}
              </p>
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
                <h3 className="font-display uppercase font-black text-title tracking-wide mb-3 text-accent">
                  {interests[0].label}
                </h3>
                <p className="text-muted leading-relaxed">
                  {interests[0].description}
                </p>
              </div>
              <div className="md:w-1/2 h-48 md:h-52">
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
              <div className="md:w-1/2 md:text-right">
                <h3 className="font-display uppercase font-black text-title tracking-wide mb-3 text-illustration-homelab">
                  {interests[1].label}
                </h3>
                <p className="text-muted leading-relaxed">
                  {interests[1].description}
                </p>
              </div>
              <div className="md:w-1/2 h-48 md:h-52">
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
                <h3 className="font-display uppercase font-black text-title tracking-wide mb-3 text-riso-pinkTitle">
                  {interests[2].label}
                </h3>
                <p className="text-muted leading-relaxed">
                  {interests[2].description}
                </p>
              </div>
              <div className="md:w-1/2 h-48 md:h-52">
                <CinemaSpotlight progress={interest3Progress} className="w-full h-full" />
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </>
  )
}
