'use client'

import { useRef, useEffect } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Download } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useLocale, useTranslations } from 'next-intl'
import { useSite } from '@/context/SiteContext'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import HeroStarfield from '@/components/effects/HeroStarfield'
import { getCardPeriod, getFeaturedProjects, getLocalizedField, Locale, ProjectData } from '@/lib/projects'

// Dynamic import for WebGL (client-side only)
const WaveBackground = dynamic(
  () => import('@/components/effects/WaveBackground'),
  { ssr: false }
)

gsap.registerPlugin(ScrollTrigger)

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

const pillBase =
  'inline-flex items-center justify-center gap-2 px-6 lg:px-7 py-3.5 rounded-full text-xs lg:text-sm font-bold tracking-caps uppercase whitespace-nowrap transition-colors duration-200'

function Sparkle({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden="true">
      <path d="M20 0C21.4 13 27 18.6 40 20 27 21.4 21.4 27 20 40 18.6 27 13 21.4 0 20 13 18.6 18.6 13 20 0Z" fill={fill} />
    </svg>
  )
}

interface StarProjectProps {
  project: ProjectData
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
        <span className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgb(255_72_176/0.35),transparent_60%)] transition-transform duration-200 ease-out group-hover:scale-150 group-focus-visible:scale-150 motion-reduce:transition-none" />
        <span className="absolute inset-0 translate-x-[3px] translate-y-[2px] transition-transform duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 motion-reduce:transition-none">
          <Sparkle fill="#0078bf" />
        </span>
        <span className="absolute inset-0 mix-blend-screen">
          <Sparkle fill="#ff48b0" />
        </span>
      </span>

      <span className="flex flex-col gap-1 transition-opacity duration-150 group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none">
        <span className="max-w-[250px] text-[clamp(0.875rem,0.6vw,1.0625rem)] font-extrabold leading-snug tracking-[0.12em] uppercase text-riso-paper">
          {title}
        </span>
        <span className="font-mono text-[clamp(0.75rem,0.5vw,0.9375rem)] text-muted">{getCardPeriod(project.period, locale)}</span>
      </span>

      <span
        className={`pointer-events-none absolute top-1/2 w-[300px] bg-riso-paper px-4 pt-3 pb-3.5 text-left text-riso-ink shadow-[0_10px_30px_rgb(0_0_0/0.45)] opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none ${
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

export default function HeroSection() {
  const t = useTranslations('hero')
  const tp = useTranslations('projects')
  const locale = useLocale() as Locale
  const { hasEnteredSite } = useSite()
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)

  const featured = getFeaturedProjects().slice(0, STAR_SLOTS.length)
  const statusOf = (p: ProjectData) => {
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

  // Name reveal: plays once the entrance is over (landing overlay gone, or
  // immediately on a direct visit), never behind the overlay.
  useEffect(() => {
    if (!hasEnteredSite || !nameRef.current) return

    const title = nameRef.current

    if (prefersReducedMotion) {
      gsap.set(title, { y: 0, opacity: 1 })
      return
    }

    // ANIM-02: the title rises as one block, no per-letter rotation.
    const tween = gsap.fromTo(title,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
    )

    return () => {
      tween.kill()
    }
  }, [hasEnteredSite, prefersReducedMotion])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="scheme-night section min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Ink dropout inside the name: small specks of the plate show through. */}
      <svg aria-hidden="true" className="absolute w-0 h-0">
        <filter id="hero-riso-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="3" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -9 0 0 0 7.2" result="holes" />
          <feComposite in="SourceGraphic" in2="holes" operator="in" />
        </filter>
      </svg>

      <HeroStarfield />
      <WaveBackground className="opacity-50" />

      <div className="absolute inset-0 bg-gradient-to-b from-primary/25 via-transparent to-primary pointer-events-none z-[1]" />

      {/* Desktop star-projects */}
      <div ref={starsRef} className="hidden lg:block absolute inset-0 z-10">
        {featured.map((project, i) => (
          <StarProject key={project.id} project={project} slot={STAR_SLOTS[i]} locale={locale} status={statusOf(project)} />
        ))}
      </div>

      <div
        ref={contentRef}
        className="relative z-10 flex w-full flex-col items-center px-4 pt-28 pb-12 lg:px-0 lg:py-0 lg:w-auto"
      >
        <h1
          ref={nameRef}
          className="misregister text-center font-display font-black uppercase text-riso-pink leading-[0.86] tracking-[-0.02em] text-[clamp(2.6rem,14vw,5rem)] lg:text-[clamp(4rem,8.6vw,13rem)]"
          style={{ filter: 'url(#hero-riso-grain)' }}
        >
          {t('name').split(' ').map((word) => (
            <span key={word} className="block">{word}</span>
          ))}
        </h1>

        <p className="mt-6 text-center text-base lg:text-[clamp(1rem,1.2vw,1.375rem)] font-medium tracking-[0.02em] text-white/80">
          {t('title')}
        </p>

        <div className="mt-6 flex w-full gap-3 lg:w-auto lg:gap-3.5">
          <TransitionLink
            href="/projects"
            className={`${pillBase} flex-1 lg:flex-none bg-riso-pink text-primary hover:bg-snow`}
          >
            {t('cta')}
            <ArrowRight size={16} aria-hidden="true" />
          </TransitionLink>
          <a
            href="/Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('ctaSecondary')}
            className={`${pillBase} flex-1 lg:flex-none border-[1.5px] border-riso-paper text-riso-paper hover:bg-riso-paper hover:text-primary`}
          >
            {t('cv')}
            <Download size={16} aria-hidden="true" />
          </a>
        </div>

        {/* Mobile and tablet: the four projects as paper labels (DEC-16g, comp M2) */}
        <ul className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-x-3 gap-y-3.5 md:grid-cols-4 lg:hidden">
          {featured.map((project, i) => {
            const status = statusOf(project)
            return (
              <li key={project.id} style={{ transform: `rotate(${TAG_TILT[i % TAG_TILT.length]})` }}>
                <TransitionLink
                  href={`/projects/${project.category}/${project.id}`}
                  className="flex h-full min-h-[132px] flex-col gap-1.5 bg-riso-paper p-3 text-riso-ink shadow-[0_8px_22px_rgb(0_0_0/0.4)]"
                >
                  <span className="misregister font-display text-[1.2rem] font-black uppercase leading-none text-riso-pinkTitle">
                    {getLocalizedField(project.title, locale)}
                  </span>
                  {project.subtitle && (
                    <span className="line-clamp-3 text-sm leading-snug">{getLocalizedField(project.subtitle, locale)}</span>
                  )}
                  <span className="mt-auto flex flex-wrap justify-between gap-x-2 font-mono text-meta">
                    <span className="whitespace-nowrap">{status}</span>
                    <span className="ml-auto whitespace-nowrap">{getCardPeriod(project.period, locale)}</span>
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
