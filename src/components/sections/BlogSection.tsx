'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink, Sparkles } from 'lucide-react'
import content from '@/lib/content.json'

gsap.registerPlugin(ScrollTrigger)

export default function BlogSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const decorativeRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!sectionRef.current) return
    
    const ctx = gsap.context(() => {
      
      // ============================================
      // PARALLAX - Decorative text
      // ============================================
      if (decorativeRef.current) {
        gsap.fromTo(decorativeRef.current,
          { xPercent: 5 },
          {
            xPercent: -10,
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
      
      // ============================================
      // PARALLAX - Gradient orb
      // ============================================
      if (orbRef.current) {
        gsap.to(orbRef.current, {
          yPercent: -30,
          xPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      }
      
      // ============================================
      // TITLE - Split reveal
      // ============================================
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { 
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
            x: -30
          },
          {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
      
      // ============================================
      // CARD - 3D tilt on scroll
      // ============================================
      if (cardRef.current) {
        gsap.fromTo(cardRef.current,
          { 
            y: 60,
            opacity: 0,
            rotateX: 10
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardRef.current,
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
      id="blog"
      className="section min-h-[80vh] py-32 md:py-40 relative overflow-hidden flex items-center"
    >
      {/* ============================================ */}
      {/* PARALLAX - Decorative text */}
      {/* ============================================ */}
      <div 
        ref={decorativeRef}
        className="absolute top-1/2 -translate-y-1/2 left-0 pointer-events-none select-none"
      >
        <span className="font-display text-[40vw] text-white/[0.015] leading-none whitespace-nowrap">
          BLOG
        </span>
      </div>
      
      {/* ============================================ */}
      {/* PARALLAX - Gradient orb - Harmonized with Contact */}
      {/* ============================================ */}
      <div 
        ref={orbRef}
        className="absolute top-1/4 right-1/4 w-[35vw] h-[35vw] bg-accent-pink/5 rounded-full blur-[150px] pointer-events-none"
      />
      
      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full">
        {/* Section label - Left aligned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-label text-accent-pink mb-4"
        >
          {content.blog.sectionLabel}
        </motion.div>
        
        {/* Title - Left aligned */}
        <h2 
          ref={titleRef}
          className="font-display text-[clamp(3rem,10vw,7rem)] leading-[0.9] tracking-wide mb-12"
        >
          {content.blog.title}
        </h2>
        
        {/* Coming Soon Card - Centered */}
        <div className="flex justify-center">
          <div 
            ref={cardRef}
            className="relative p-8 md:p-12 bg-white/[0.02] border border-white/5 overflow-hidden group hover:border-accent-pink/20 transition-all duration-500 max-w-xl w-full text-center"
            style={{ perspective: '1000px' }}
          >
            {/* Decorative sparkles */}
            <div className="absolute top-4 right-4 text-accent-pink/40 group-hover:text-accent-pink/70 transition-colors">
              <Sparkles size={24} />
            </div>
            
            {/* Decorative corner lines */}
            <div className="absolute top-0 left-0 w-12 h-px bg-gradient-to-r from-accent-pink/50 to-transparent" />
            <div className="absolute top-0 left-0 w-px h-12 bg-gradient-to-b from-accent-pink/50 to-transparent" />
            <div className="absolute bottom-0 right-0 w-12 h-px bg-gradient-to-l from-accent-pink/50 to-transparent" />
            <div className="absolute bottom-0 right-0 w-px h-12 bg-gradient-to-t from-accent-pink/50 to-transparent" />
            
            {/* Coming soon badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-pink/10 border border-accent-pink/20 rounded-full mb-8">
              <span className="w-2 h-2 bg-accent-pink rounded-full animate-pulse" />
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-accent-pink font-medium">
                {content.blog.comingSoon.badge}
              </span>
            </div>
            
            <h3 className="font-display text-2xl md:text-3xl mb-4">
              {content.blog.comingSoon.title}
            </h3>
            
            <p className="text-white/50 leading-relaxed mb-10 max-w-lg mx-auto">
              {content.blog.comingSoon.description}
            </p>
            
            <a
              href="https://samuel-lecomte.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:bg-accent-pink/10 hover:border-accent-pink/30 group/btn"
            >
              {content.blog.comingSoon.cta}
              <ExternalLink size={14} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
            
            {/* Hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/5 via-transparent to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
