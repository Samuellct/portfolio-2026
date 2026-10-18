'use client'

import { useRef, useEffect } from 'react'
import { m } from 'framer-motion'
import { gsap } from '@/lib/gsap'
import Watermark from '@/components/effects/Watermark'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useEntryAnimation } from '@/hooks/use-entry-animation'
import { Pill } from '@/components/ui/Pill'
import { AboutTitleWords } from '@/components/ui/AboutTitleWords'
// Homepage statistics, derived from the visible projects by the page
export interface HomeStats {
  internships: number
  languages: string[]
  repos: number
}

export default function AboutSection({ statValues }: { statValues: HomeStats }) {
  const t = useTranslations('about')
  const prefersReducedMotion = useReducedMotion()
  // Served visible on the first page (no JS, no blink); animated after a client navigation.
  const enter = useEntryAnimation()

  const stats = [
    {
      value: String(statValues.internships),
      label: t('stats.experiments'),
      context: t('stats.experimentsHover')
    },
    {
      value: String(statValues.languages.length),
      label: t('stats.languages'),
      context: statValues.languages.join(', ')
    },
    {
      value: String(statValues.repos),
      label: t('stats.repos'),
      context: t('stats.reposHover')
    },
  ]
  const sectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLUListElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textBlockRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!sectionRef.current) return

    // Reduced motion: no parallax, no scroll-triggered reveals; show everything.
    if (prefersReducedMotion) {
      if (titleRef.current) gsap.set(titleRef.current.querySelectorAll('.title-word'), { yPercent: 0, opacity: 1 })
      if (textBlockRef.current) gsap.set(textBlockRef.current.querySelectorAll('p'), { y: 0, opacity: 1 })
      if (statsRef.current) gsap.set(statsRef.current.querySelectorAll('.float-stat'), { y: 0, opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      // TITLE
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll('.title-word')
        gsap.fromTo(words,
          { 
            yPercent: 100,
            opacity: 0
          },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }
      
      // TEXT (Staggered reveal)
      if (textBlockRef.current) {
        const paragraphs = textBlockRef.current.querySelectorAll('p')
        gsap.fromTo(paragraphs,
          { 
            y: 40,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: textBlockRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        )
      }
      
      // STATS - Floating Tags fade-in
      if (statsRef.current) {
        const floatStats = statsRef.current.querySelectorAll('.float-stat')
        gsap.fromTo(floatStats,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        )
      }
      
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])
  
  return (
    <section
      ref={sectionRef}
      id="about"
      className="section py-16 md:py-40 relative overflow-hidden"
    >
      <Watermark
        word="ABOUT"
        className="absolute top-1/2 -translate-y-1/2 -left-1/4"
        textClassName="text-ghost-35 whitespace-nowrap"
        parallax={{ axis: 'x', from: 10, to: -15, scrub: 2 }}
      />
      
      {/* MAIN */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* header */}
        <div className="mb-16">
          <m.div
            initial={enter ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-label text-accent mb-4"
          >
            {t('sectionLabel')}
          </m.div>
          
          <h2
            ref={titleRef}
            // Display scale, second only to the hero's name (bolder pass, 2026-10-09).
            // The bottom padding keeps the descenders of the last line inside the
            // overflow mask that the word reveal needs.
            className="text-display leading-[0.98] overflow-hidden pb-[0.18em]"
          >
            <AboutTitleWords text={t('title')} />
          </h2>
        </div>
        
        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          
          {/* Left column */}
          <div>
            {/* txt */}
            <div ref={textBlockRef} className="space-y-6 mb-12">
              <p className="text-lg md:text-xl text-muted leading-relaxed prose-body">
                {t('preview.intro')}
              </p>
              
              <p className="text-muted leading-relaxed prose-body">
                {t('preview.whatIBuild')}
              </p>
            </div>
            
            {/* CTA (page perso) */}
            <m.div
              initial={enter ? { opacity: 0, y: 20 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Pill as="link" href="/about" className="group">
                {t('preview.cta')}
                <ArrowRight aria-hidden="true" size={16} className="transition-transform group-hover:translate-x-1" />
              </Pill>
            </m.div>
          </div>
          
          {/* Right column */}
          <div>
            {/* Stats: a staircase in the flow (AUDIT-040, DEC-16e). The offsets keep the
                floating-tag feel on desktop; the context line is always shown. Below lg
                they print as a ledger, number left, label and context right (V6-MOB-04). */}
            <ul ref={statsRef} className="flex flex-col border-t border-riso-blue/35 lg:gap-12 lg:border-0">
              {stats.map((stat, index) => (
                <li
                  key={stat.label}
                  className={`float-stat grid grid-cols-[64px_1fr] items-baseline gap-x-3 border-b border-riso-blue/35 py-3 lg:block lg:max-w-sm lg:border-0 lg:py-0 ${['lg:ml-[4%]', 'lg:ml-[28%]', 'lg:ml-[12%]'][index]}`}
                >
                  <div className="fraunces-display-italic row-span-2 text-[2.75rem] lg:text-heading font-light leading-none lg:mb-1.5 text-white">
                    {stat.value}
                  </div>
                  <div className="text-meta text-muted uppercase tracking-caps font-medium">
                    {stat.label}
                  </div>
                  <div className="text-sm text-muted italic lg:mt-1.5">
                    {stat.context}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
