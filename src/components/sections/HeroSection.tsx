'use client'

import { useRef, useEffect } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Download } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useSite } from '@/context/SiteContext'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

// Dynamic import for WebGL (client-side only)
const WaveBackground = dynamic(
  () => import('@/components/effects/WaveBackground'),
  { ssr: false }
)

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const t = useTranslations('hero')
  const { hasEnteredSite } = useSite()
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const greetingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Content fade avec scroll
      if (contentRef.current) {
        gsap.to(contentRef.current, {
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
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  // Greeting reveal: plays once the entrance is over (landing overlay gone, or
  // immediately on a direct visit), never behind the overlay.
  useEffect(() => {
    if (!hasEnteredSite || !greetingRef.current) return

    const chars = greetingRef.current.querySelectorAll('.greeting-char')

    if (prefersReducedMotion) {
      gsap.set(chars, { y: 0, opacity: 1, rotateX: 0 })
      return
    }

    const tween = gsap.fromTo(chars,
      {
        y: 100,
        opacity: 0,
        rotateX: -90
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.03,
        duration: 1,
        ease: 'power4.out',
        delay: 0.3
      }
    )

    return () => {
      tween.kill()
    }
  }, [hasEnteredSite, prefersReducedMotion])

  // Text animation
  const makeChars = (text: string) =>
    text.split('').map((char, i) => (
      <span
        key={i}
        className="greeting-char inline-block"
        style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))

  const greetingFull = makeChars(t('greeting'))
  const greetingMobile = makeChars(t('greetingMobile'))

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="scheme-night section min-h-screen flex items-center relative overflow-hidden"
    >
      {/* PARTICLE BKG */}
      <WaveBackground className="opacity-50" />

      <div className="absolute inset-0 bg-gradient-to-b from-primary/25 via-transparent to-primary pointer-events-none z-[1]" />

      {/* MAIN - left-aligned, no mx-auto */}
      <div
        ref={contentRef}
        className="relative z-10 w-full px-6 md:px-12 lg:px-20"
      >
        {/* Availability indicator - inline, above greeting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-5 border border-status-available/40 px-3 py-1.5"
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-status-available shrink-0 animate-pulse-slow"
          />
          <span className="font-mono text-meta tracking-hero-caps uppercase text-muted">
            {t('available')}
          </span>
        </motion.div>

        {/* Greeting */}
        <h1
          ref={greetingRef}
          className="font-display font-black uppercase mb-6 whitespace-nowrap text-display leading-hero tracking-hero-tight"
          style={{
            perspective: '1000px',
          }}
        >
          {/* Mobile : greeting court (évite le débordement) */}
          <span className="md:hidden">{greetingMobile}</span>
          {/* Desktop : greeting complet */}
          <span className="hidden md:inline">{greetingFull}</span>
        </h1>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 h-px bg-gradient-to-r from-accent-line to-transparent shrink-0" />
            <span className="font-display uppercase font-black text-lead leading-heading tracking-wide text-accent">
              {t('title')}
            </span>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-base md:text-lg text-muted leading-relaxed max-w-xl mb-12"
        >
          {t('description')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-4"
        >
          <TransitionLink
            href="/projects"
            className="inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-white/5 border border-white/20 text-xs md:text-sm font-medium tracking-caps uppercase transition-all duration-300 hover:bg-accent-line hover:text-black hover:border-accent-line hover:shadow-glow-accent group relative overflow-hidden"
          >
            <span className="relative z-10">{t('cta')}</span>
            <ArrowRight size={14} className="relative z-10 transition-transform group-hover:translate-x-1" />
          </TransitionLink>

          <a
            href="/Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 border border-white/10 text-xs md:text-sm font-medium tracking-caps uppercase text-muted transition-all duration-300 hover:border-white/30 hover:text-white"
          >
            <span>{t('ctaSecondary')}</span>
            <Download size={14} />
          </a>
        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-muted z-10"
      >
        <span className="text-meta tracking-hint uppercase">{t('scrollHint')}</span>
        <div className="w-px h-16 relative overflow-hidden">
          <span className="absolute inset-0 w-full bg-gradient-to-b from-accent-line via-accent-line to-transparent animate-scroll-line" />
        </div>
      </motion.div>
    </section>
  )
}
