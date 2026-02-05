'use client'

import { useRef, useEffect } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import HiddenIcon from '@/components/easter-egg/HiddenIcon'
import content from '@/lib/content.json'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { 
    value: '2', 
    label: content.about.stats.experiments,
    hoverText: content.about.stats.experimentsHover
  },
  { 
    value: '6+', 
    label: content.about.stats.languages,
    hoverText: content.about.stats.languagesHover
  },
  { 
    value: '20+', 
    label: content.about.stats.reports,
    hoverText: content.about.stats.reportsHover
  },
]

export default function AboutSection() {
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
      
      // STATS
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll('.stat-card')
        
        statCards.forEach((card, index) => {
          gsap.fromTo(card,
            { 
              y: 60,
              opacity: 0,
              rotateX: -15
            },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 0.8,
              delay: index * 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: statsRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          )
          
          const valueEl = card.querySelector('.stat-value')
          if (valueEl) {
            const finalValue = valueEl.textContent || '0'
            const numericValue = parseInt(finalValue.replace(/\D/g, ''), 10)
            const suffix = finalValue.replace(/[0-9]/g, '')
            
            if (!isNaN(numericValue)) {
              gsap.fromTo(valueEl,
                { textContent: '0' + suffix },
                {
                  textContent: numericValue,
                  duration: 1.5,
                  delay: 0.3 + index * 0.15,
                  ease: 'power2.out',
                  snap: { textContent: 1 },
                  scrollTrigger: {
                    trigger: statsRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                  },
                  onUpdate: function() {
                    if (valueEl.textContent) {
                      valueEl.textContent = Math.round(parseFloat(valueEl.textContent)) + suffix
                    }
                  }
                }
              )
            }
          }
        })
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
            {content.about.sectionLabel}
          </motion.div>
          
          <h2 
            ref={titleRef}
            className="font-display text-[clamp(3rem,10vw,7rem)] leading-[0.9] tracking-wide overflow-hidden"
          >
            {content.about.title.split(' ').map((word, i) => (
              <span key={i} className="title-word inline-block mr-[0.25em]">
                {word}
              </span>
            ))}
          </h2>
        </div>
        
        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          
          {/* Left column */}
          <div>
            {/* txt */}
            <div ref={textBlockRef} className="space-y-6 mb-12">
              <p className="text-lg md:text-xl text-white/70 leading-relaxed text-justify">
                {content.about.preview.intro}
              </p>
              
              <p className="text-white/50 leading-relaxed text-justify">
                {content.about.preview.highlight} <HiddenIcon id="about-icon" className="inline-block align-middle" />
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
                <span className="text-sm tracking-[0.15em] uppercase">{content.about.preview.cta}</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </TransitionLink>
            </motion.div>
          </div>
          
          {/* Right column */}
          <div>
            {/* Stats grid */}
            <div ref={statsRef} className="grid gap-6" style={{ perspective: '1000px' }}>
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="stat-card relative p-8 bg-white/[0.02] border border-white/5 group hover:border-accent-purple/30 transition-all duration-500"
                >
                  <div className="flex items-center justify-between">
                    {/* nb */}
                    <div className="stat-value font-display text-[clamp(3rem,8vw,5rem)] leading-none gradient-text">
                      {stat.value}
                    </div>
                    
                    {/* label + hover */}
                    <div className="text-right">
                      <div className="text-sm tracking-[0.1em] uppercase text-white/60 mb-1">
                        {stat.label}
                      </div>
                      <div className="text-xs text-white/30 max-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {stat.hoverText}
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
