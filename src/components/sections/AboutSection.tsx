'use client'

import { useRef, useEffect } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { getAllProjects } from '@/lib/projects'
import { programmingLanguages } from '@/lib/techStats'

gsap.registerPlugin(ScrollTrigger)

// Homepage statistics, derived from the visible projects
const statValues = (() => {
  const projects = getAllProjects()
  const usedTechs = new Set<string>(projects.flatMap((p) => p.technologies))
  return {
    internships: projects.filter((p) => p.category === 'internship').length,
    languages: programmingLanguages.filter((lang) => usedTechs.has(lang)),
    repos: projects.filter((p) => p.gitHubUrl).length,
  }
})()

export default function AboutSection() {
  const t = useTranslations('about')
  const prefersReducedMotion = useReducedMotion()

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
  const decorativeTextRef = useRef<HTMLDivElement>(null)
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

      // PARALLAX txt
      if (decorativeTextRef.current) {
        gsap.fromTo(decorativeTextRef.current,
          { xPercent: 10 },
          {
            xPercent: -15,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            },
          }
        )
      }
      
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
              toggleActions: 'play none none reverse',
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
              toggleActions: 'play none none reverse',
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
              toggleActions: 'play none none reverse',
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
      className="section py-32 md:py-40 relative overflow-hidden"
    >
      {/* PARALLAX txt */}
      <div
        ref={decorativeTextRef}
        aria-hidden="true"
        className="absolute top-1/2 -translate-y-1/2 -left-1/4 pointer-events-none select-none"
      >
        <span className="font-display uppercase font-black text-ghost-35 text-white/[0.015] leading-none whitespace-nowrap">
          ABOUT
        </span>
      </div>
      
      {/* test orbs (maybe dlt) */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-riso-blue/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[30vw] h-[30vw] bg-riso-blue/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* MAIN */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-label text-accent mb-4"
          >
            {t('sectionLabel')}
          </motion.div>
          
          <h2
            ref={titleRef}
            className="text-page leading-display-loose overflow-hidden"
          >
            {t('title').split(' ').map((word: string, i: number) => {
              const clean = word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
              const isAccent = ['physicien', 'developpeur', 'physicist', 'developer'].includes(clean)
              return (
                <span
                  key={i}
                  className={`title-word inline-block mr-[0.2em] ${
                    isAccent
                      ? 'fraunces-display-italic text-accent'
                      : 'font-display uppercase font-black tracking-wide'
                  }`}
                >
                  {word}
                </span>
              )
            })}
          </h2>
        </div>
        
        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          
          {/* Left column */}
          <div>
            {/* txt */}
            <div ref={textBlockRef} className="space-y-6 mb-12">
              <p className="text-lg md:text-xl text-muted leading-relaxed text-justify">
                {t('preview.intro')}
              </p>
              
              <p className="text-muted leading-relaxed text-justify">
                {t('preview.whatIBuild')}
              </p>
            </div>
            
            {/* CTA (page perso) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <TransitionLink
                href="/about"
                className="inline-flex items-center gap-3 text-accent hover:text-white transition-colors group"
              >
                <span className="text-sm tracking-caps uppercase">{t('preview.cta')}</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </TransitionLink>
            </motion.div>
          </div>
          
          {/* Right column */}
          <div>
            {/* Stats: a staircase in the flow (AUDIT-040, DEC-16e). The offsets keep the
                floating-tag feel on desktop; the context line is always shown. */}
            <ul ref={statsRef} className="flex flex-col gap-10 md:gap-12">
              {stats.map((stat, index) => (
                <li
                  key={stat.label}
                  className={`float-stat max-w-sm ${['lg:ml-[4%]', 'lg:ml-[28%]', 'lg:ml-[12%]'][index]}`}
                >
                  <div className="fraunces-display-italic text-heading font-light leading-none mb-1.5 gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-meta text-muted uppercase tracking-caps font-medium">
                    {stat.label}
                  </div>
                  <div className="text-sm text-muted italic mt-1.5">
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
