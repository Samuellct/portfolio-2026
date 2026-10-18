'use client'

import { useRef, useEffect, type CSSProperties } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { gsap } from '@/lib/gsap'
import { ArrowRight, FileText } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import HeroSky, { FRINGE_HEIGHT } from '@/components/effects/HeroSky'
import { Pill } from '@/components/ui/Pill'
import { WordClamp } from '@/components/ui/WordClamp'
import { ACCENT } from '@/lib/theme'
import { getCardPeriod, getLocalizedField, Locale, ProjectSummary } from '@/lib/projects/helpers'
import { RESUME_PATH } from '@/lib/constants'

// Desktop "star-projects" sit at the four corners of the name (DEC-16g, comp A);
// their caption opens outward, away from the name.
const STAR_SLOTS = [
  { left: '27%', top: '22%', side: 'left' },
  { left: '73%', top: '24%', side: 'right' },
  { left: '25%', top: '76%', side: 'left' },
  { left: '75%', top: '74%', side: 'right' },
] as const

// Mobile paper labels lean by 1.5 degrees at most (contract).
const TAG_TILT = ['-1.5deg', '1.2deg', '1deg', '-1.2deg']

const STATUS_KEY = { completed: 'completed', 'in-progress': 'inProgress', paused: 'paused' } as const


function Sparkle({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden="true">
      <path d="M20 0C21.4 13 27 18.6 40 20 27 21.4 21.4 27 20 40 18.6 27 13 21.4 0 20 13 18.6 18.6 13 20 0Z" fill={fill} />
    </svg>
  )
}

interface StarProjectProps {
  project: ProjectSummary
  slot: (typeof STAR_SLOTS)[number]
  locale: Locale
  status: string | null
}

// Two plates out of register at rest; on hover or focus they register, the star
// brightens and a paper label opens with the project's line, status and period.
function StarProject({ project, slot, locale, status }: StarProjectProps) {
  const toLeft = slot.side === 'left'
  const title = getLocalizedField(project.title, locale)

  return (
    <TransitionLink
      href={`/projects/${project.category}/${project.id}`}
      className={`group absolute flex items-center gap-3 -translate-y-1/2 ${
        toLeft ? 'flex-row-reverse text-right -translate-x-[calc(100%-17px)]' : '-translate-x-[17px]'
      }`}
      style={{ left: slot.left, top: slot.top }}
    >
      <span className="relative w-[34px] h-[34px] shrink-0">
        <span className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,theme(colors.riso.pink/35%),transparent_60%)] transition-transform duration-200 ease-out group-hover:scale-150 group-focus-visible:scale-150 motion-reduce:transition-none" />
        <span className="absolute inset-0 translate-x-[3px] translate-y-[2px] transition-transform duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 motion-reduce:transition-none">
          <Sparkle fill={ACCENT.blue} />
        </span>
        <span className="absolute inset-0 mix-blend-screen">
          <Sparkle fill={ACCENT.pink} />
        </span>
      </span>

      {/* The paper label below carries the accessible name; this resting caption repeats it. */}
      <span aria-hidden="true" className="flex flex-col gap-1 transition-opacity duration-150 group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none">
        <span className="max-w-[250px] text-[clamp(0.875rem,0.6vw,1.0625rem)] font-extrabold leading-snug tracking-[0.12em] uppercase text-riso-paper">
          {title}
        </span>
        <span className="font-mono text-[clamp(0.75rem,0.5vw,0.9375rem)] text-muted">{getCardPeriod(project.period, locale)}</span>
      </span>

      <span
        className={`pointer-events-none absolute top-1/2 w-[min(300px,21vw)] bg-riso-paper px-4 pt-3 pb-3.5 text-left text-riso-ink shadow-lift-lg opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none ${
          toLeft
            ? 'right-[46px] -translate-y-1/2 -rotate-[1.5deg]'
            : 'left-[46px] -translate-y-1/2 rotate-[1.5deg]'
        }`}
      >
        <span className="block font-display text-[1.2rem] font-black uppercase leading-tight text-riso-pinkTitle">{title}</span>
        {project.subtitle && (
          <span className="mt-1 block text-sm font-medium leading-snug">{getLocalizedField(project.subtitle, locale)}</span>
        )}
        <span className="mt-2 flex items-center gap-2.5 font-mono text-meta">
          {status && <span className="rounded-full border border-riso-blue px-2">{status}</span>}
          {getLocalizedField(project.period, locale)}
        </span>
      </span>
    </TransitionLink>
  )
}

export default function HeroSection({ featuredProjects }: { featuredProjects: ProjectSummary[] }) {
  const t = useTranslations('hero')
  const tp = useTranslations('projects')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)

  const featured = featuredProjects.slice(0, STAR_SLOTS.length)
  const statusOf = (p: ProjectSummary) => {
    const key = STATUS_KEY[p.status as keyof typeof STATUS_KEY]
    return key ? tp(`status.${key}`) : null
  }

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const targets = [contentRef.current, starsRef.current].filter(Boolean)
      gsap.to(targets, {
        opacity: 0,
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '50% top',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    // Desktop: the hero runs one fringe height past the fold, so the paper fringe only
    // starts as the visitor scrolls. Mobile: one small viewport, fringe included, with
    // the content set at the bottom, so the fringe shows on the first screen (P15-D7).
    <section
      ref={sectionRef}
      id="hero"
      className="scheme-night section flex items-end justify-center relative overflow-hidden min-h-[100svh] lg:items-center lg:min-h-[calc(100vh+var(--fringe))]"
      style={{ '--fringe': `${FRINGE_HEIGHT}px`, paddingBottom: FRINGE_HEIGHT } as CSSProperties}
    >
      {/* Ink dropout inside the name: small specks of the plate show through. */}
      <svg aria-hidden="true" className="absolute w-0 h-0">
        <filter id="hero-riso-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="3" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -9 0 0 0 7.2" result="holes" />
          <feComposite in="SourceGraphic" in2="holes" operator="in" />
        </filter>
      </svg>

      <HeroSky />

      {/* Desktop star-projects */}
      <div ref={starsRef} className="hidden lg:block absolute inset-x-0 top-0 z-10" style={{ bottom: FRINGE_HEIGHT }}>
        {featured.map((project, i) => (
          <StarProject key={project.id} project={project} slot={STAR_SLOTS[i]} locale={locale} status={statusOf(project)} />
        ))}
      </div>

      <div
        ref={contentRef}
        className="relative z-10 flex w-full flex-col items-center px-4 pt-24 pb-6 lg:px-0 lg:py-0 lg:w-auto"
      >
        <h1
          className="hero-rise misregister text-center font-display font-black uppercase text-riso-pink leading-[0.86] tracking-[-0.02em] text-[clamp(2.6rem,14vw,5rem)] lg:text-[clamp(4rem,8.6vw,13rem)]"
          style={{ filter: 'url(#hero-riso-grain)' }}
        >
          {t('name').split(' ').map((word) => (
            <span key={word} className="block">{word}</span>
          ))}
        </h1>

        <p className="mt-6 text-center text-base lg:text-[clamp(1rem,1.2vw,1.375rem)] font-medium tracking-[0.02em] text-white/80">
          {t('title')}
        </p>

        <div className="mt-6 flex w-full flex-col gap-3 min-[400px]:flex-row lg:w-auto lg:gap-3.5">
          <Pill as="link" href="/projects" scheme="night" className="min-[400px]:flex-1 lg:flex-none">
            {t('cta')}
            <ArrowRight size={16} aria-hidden="true" />
          </Pill>
          <Pill as="external" href={RESUME_PATH} tone="outline" scheme="night" className="min-[400px]:flex-1 lg:flex-none">
            {tCommon('viewCV')}
            <FileText size={16} aria-hidden="true" />
          </Pill>
        </div>

        {/* Mobile and tablet: the four projects as paper labels (DEC-16g, comp M2) */}
        {/* Rows share one height; the title fits the label's width (cqi). */}
        <ul className="mt-8 grid w-full max-w-3xl auto-rows-fr grid-cols-2 gap-x-3 gap-y-3.5 md:grid-cols-4 lg:hidden">
          {featured.map((project, i) => {
            const status = statusOf(project)
            return (
              <li key={project.id} style={{ transform: `rotate(${TAG_TILT[i % TAG_TILT.length]})` }}>
                <TransitionLink
                  href={`/projects/${project.category}/${project.id}`}
                  className="flex h-full flex-col gap-1.5 bg-riso-paper p-3 text-riso-ink shadow-lift [container-type:inline-size]"
                >
                  <span className="misregister font-display text-[min(1.2rem,13cqi)] font-black uppercase leading-none text-riso-pinkTitle">
                    {getLocalizedField(project.title, locale)}
                  </span>
                  {project.subtitle && (
                    <WordClamp text={getLocalizedField(project.subtitle, locale)} className="text-sm leading-snug" />
                  )}
                  <span className="mt-auto flex items-center justify-between gap-x-1.5 whitespace-nowrap pt-1 font-mono text-meta">
                    {status && <span className="rounded-full border border-riso-blue px-1.5">{status}</span>}
                    {/* Start year only: a two-year range does not fit beside the status (P15-D9). */}
                    <span className="ml-auto">{getCardPeriod(project.period, locale).split(' - ')[0]}</span>
                  </span>
                </TransitionLink>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
