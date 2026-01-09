'use client'

import { useRef, useEffect, useState } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import ParticleCollision from '@/components/effects/ParticleCollision'
import HiddenIcon from '@/components/easter-egg/HiddenIcon'
import content from '@/lib/content.json'

gsap.registerPlugin(ScrollTrigger)

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const decorativeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const collisionRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  
  const [isCollisionVisible, setIsCollisionVisible] = useState(false)
  
  useEffect(() => {
    if (!sectionRef.current) return
    
    const ctx = gsap.context(() => {
      
      // ============================================
      // PARALLAX - Decorative text (vertical)
      // ============================================
      if (decorativeRef.current) {
        gsap.fromTo(decorativeRef.current,
          { yPercent: 20 },
          {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        )
      }
      
      // ============================================
      // TRIGGER - Collision animation
      // ============================================
      if (collisionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 60%',
          onEnter: () => setIsCollisionVisible(true),
        })
      }
      
      // ============================================
      // TITLE - Character reveal
      // ============================================
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll('.contact-char')
        gsap.fromTo(chars,
          { 
            y: 80,
            opacity: 0,
            rotateY: -90
          },
          {
            y: 0,
            opacity: 1,
            rotateY: 0,
            stagger: 0.02,
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
      
      // ============================================
      // CTA - Slide up
      // ============================================
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
      
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])
  
  // Split title into characters
  const titleText = content.contact.title
  const titleChars = titleText.split('').map((char, i) => (
    <span 
      key={i} 
      className="contact-char inline-block"
      style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))
  
  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section min-h-[90vh] py-32 md:py-40 relative overflow-hidden flex items-center"
    >
      {/* ============================================ */}
      {/* PARALLAX - Decorative text */}
      {/* ============================================ */}
      <div 
        ref={decorativeRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="font-display text-[35vw] text-white/[0.015] leading-none">
          CONTACT
        </span>
      </div>
      
      {/* ============================================ */}
      {/* GRADIENT ORBS - Subtle, matching Blog section */}
      {/* ============================================ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Use similar colors to Blog section for smooth transition */}
        <div className="absolute bottom-1/4 left-1/4 w-[35vw] h-[35vw] bg-accent-pink/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 right-1/3 w-[25vw] h-[25vw] bg-accent-cyan/5 rounded-full blur-[120px]" />
      </div>
      
      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left side - Particle Collision Animation */}
          <div 
            ref={collisionRef}
            className="hidden lg:block relative aspect-square"
          >
            {/* Collision canvas with shuffle button */}
            <div className="absolute inset-4 rounded-full overflow-visible">
              <ParticleCollision 
                isVisible={isCollisionVisible}
                className="opacity-80"
              />
            </div>
            
            {/* Decorative frame around collision */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Outer circle */}
              <div className="absolute inset-0 border border-white/5 rounded-full" />
              
              {/* Inner circles */}
              <div className="absolute inset-8 border border-white/[0.03] rounded-full" />
              <div className="absolute inset-16 border border-white/[0.02] rounded-full" />
              
              {/* Corner decorations */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-px h-8 bg-gradient-to-b from-accent-cyan/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div className="w-px h-8 bg-gradient-to-t from-accent-purple/40 to-transparent" />
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
                <div className="w-8 h-px bg-gradient-to-r from-accent-cyan/40 to-transparent" />
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                <div className="w-8 h-px bg-gradient-to-l from-accent-purple/40 to-transparent" />
              </div>
            </div>
            
            {/* Labels */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.2em] uppercase text-white/20">
              Event Display
            </div>
          </div>
          
          {/* Right side - Content */}
          <div>
            {/* Section label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="section-label text-accent-cyan mb-4"
            >
              {content.contact.sectionLabel}
            </motion.div>
            
            {/* Title with character animation */}
            <h2 
              ref={titleRef}
              className="font-display text-[clamp(3rem,10vw,6rem)] leading-[0.9] tracking-wide mb-8"
              style={{ perspective: '1000px' }}
            >
              {titleChars}
            </h2>
            
            {/* Text */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/60 leading-relaxed mb-12 max-w-lg"
            >
              {content.contact.preview.text}
            </motion.p>
            
            {/* CTA Button - Reduced glow */}
            <div ref={ctaRef}>
              <TransitionLink
                href="/contact"
                className="inline-flex items-center gap-4 px-10 py-5 bg-accent-cyan text-black text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] group relative overflow-hidden"
              >
                <span className="relative z-10">{content.contact.preview.cta}</span>
                <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
                
                {/* Shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </TransitionLink>
            </div>
            
            {/* Decorative text with hidden icon */}
            <div className="mt-16 flex items-center gap-4 text-white/20">
              <span className="w-12 h-px bg-white/10" />
              <span className="text-xs tracking-[0.3em] uppercase flex items-center gap-2">
                Samuel <HiddenIcon id="contact-icon" /> Lecomte
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
