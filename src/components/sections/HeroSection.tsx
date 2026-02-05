'use client'

import { useRef, useEffect } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import content from '@/lib/content.json'

// Dynamic import for WebGL (client-side only)
const WaveBackground = dynamic(
  () => import('@/components/effects/WaveBackground'),
  { ssr: false }
)

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const greetingRef = useRef<HTMLHeadingElement>(null)
  
  useEffect(() => {
    if (!sectionRef.current) return
    
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
      
      if (greetingRef.current) {
        const chars = greetingRef.current.querySelectorAll('.greeting-char')
        gsap.fromTo(chars,
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
      }
      
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])
  
  // txt aniation
  const greetingText = content.hero.greeting
  const greetingChars = greetingText.split('').map((char, i) => (
    <span 
      key={i} 
      className="greeting-char inline-block"
      style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))
  
  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section min-h-screen flex items-center relative overflow-hidden"
    >
      {/* PARTICLE BKG */}
      <WaveBackground className="opacity-50" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-transparent to-primary pointer-events-none z-[1]" />
      
      {/* MAIN */}
      <div 
        ref={contentRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16"
      >
        <div className="max-w-full">
          {/* main txt */}
          <h1 
            ref={greetingRef}
            className="font-display text-[clamp(2.5rem,10vw,9rem)] leading-[0.9] tracking-wide mb-6 overflow-hidden whitespace-nowrap"
            style={{ perspective: '1000px' }}
          >
            {greetingChars}
          </h1>
          
          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="w-12 h-px bg-gradient-to-r from-accent-cyan to-transparent" />
              <span className="font-display text-[clamp(1.2rem,3vw,2rem)] leading-[1.1] tracking-wide text-accent-cyan">
                {content.hero.title} {content.hero.titleAlt}
              </span>
            </div>
          </motion.div>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-lg md:text-xl text-white/50 leading-relaxed max-w-xl mb-12 text-justify"
          >
            {content.hero.description}
          </motion.p>
          
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <TransitionLink
              href="/about"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/20 text-sm font-medium tracking-[0.15em] uppercase transition-all duration-300 hover:bg-accent-cyan hover:text-black hover:border-accent-cyan hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] group relative overflow-hidden"
            >
              <span className="relative z-10">{content.hero.cta}</span>
              <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
            </TransitionLink>
          </motion.div>
        </div>
      </div>
      
      {/* SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/40 z-10"
      >
        <span className="text-[0.65rem] tracking-[0.25em] uppercase">{content.hero.scrollHint}</span>
        <div className="w-px h-16 relative overflow-hidden">
          <span className="absolute inset-0 w-full bg-gradient-to-b from-accent-cyan via-accent-cyan to-transparent animate-scroll-line" />
        </div>
      </motion.div>
      
      <div className="absolute top-8 right-8 md:top-12 md:right-12 flex flex-col items-end gap-1 text-white/20 z-10">
        <span className="text-[0.6rem] tracking-[0.2em] uppercase">Portfolio</span>
        <span className="text-[0.6rem] tracking-[0.2em]">2026</span>
      </div>
    </section>
  )
}
