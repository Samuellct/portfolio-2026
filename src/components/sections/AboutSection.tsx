'use client'

import { useRef, useEffect } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

gsap.registerPlugin(ScrollTrigger)

export default function AboutSection() {
  const t = useTranslations('about')

  const stats = [
    {
      value: '2',
      label: t('stats.experiments'),
      hoverText: t('stats.experimentsHover')
    },
    {
      value: '6+',
      label: t('stats.languages'),
      hoverText: t('stats.languagesHover')
    },
    {
      value: '20+',
      label: t('stats.reports'),
      hoverText: t('stats.reportsHover')
    },
  ]
  const sectionRef = useRef<HTMLElement>(null)
  const decorativeTextRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textBlockRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!sectionRef.current) return
    
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
      
      // STATS — Floating Tags fade-in
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
  }, [])
  
  return (
    <section
      ref={sectionRef}
      id="about"
      className="section min-h-screen py-32 md:py-40 relative overflow-hidden"
    >
      {/* PARALLAX txt */}
      <div
        ref={decorativeTextRef}
        aria-hidden="true"
        className="absolute top-1/2 -translate-y-1/2 -left-1/4 pointer-events-none select-none"
      >
        <span className="font-display text-[35vw] text-white/[0.015] leading-none whitespace-nowrap">
          ABOUT
        </span>
      </div>
      
      {/* test orbs (maybe dlt) */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-accent-purple/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[30vw] h-[30vw] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* MAIN */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-label text-accent-purple mb-4"
          >
            {t('sectionLabel')}
          </motion.div>
          
          <h2
            ref={titleRef}
            className="text-[clamp(3rem,10vw,7rem)] leading-[1.05] overflow-hidden"
          >
            {t('title').split(' ').map((word: string, i: number) => {
              const clean = word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
              const isAccent = ['physicien', 'developpeur', 'physicist', 'developer'].includes(clean)
              return (
                <span
                  key={i}
                  className={`title-word inline-block mr-[0.2em] ${
                    isAccent
                      ? 'fraunces-display-italic text-accent-cyan'
                      : 'font-display tracking-wide'
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
              <p className="text-lg md:text-xl text-white/70 leading-relaxed text-justify">
                {t('preview.intro')}
              </p>
              
              <p className="text-white/50 leading-relaxed text-justify">
                {t('preview.highlight')}
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
                className="inline-flex items-center gap-3 text-accent-purple hover:text-white transition-colors group"
              >
                <span className="text-sm tracking-[0.15em] uppercase">{t('preview.cta')}</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </TransitionLink>
            </motion.div>
          </div>
          
          {/* Right column */}
          <div>
            {/* Stats — Floating Tags */}
            <div ref={statsRef} className="relative h-[350px] md:h-[400px]">
              {stats.map((stat, index) => {
                const positions = [
                  { top: '10%', left: '8%' },
                  { top: '42%', left: '45%' },
                  { top: '72%', left: '14%' },
                ]
                return (
                  <div
                    key={stat.label}
                    className="float-stat absolute cursor-default transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1.5 group"
                    style={{ top: positions[index].top, left: positions[index].left }}
                  >
                    <div className="fraunces-display-italic text-[54px] font-light leading-none mb-1.5 gradient-text">
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-white/50 uppercase tracking-[0.15em] font-medium">
                      {stat.label}
                    </div>
                    <div className="text-xs text-white/30 italic mt-1.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      {stat.hoverText}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
