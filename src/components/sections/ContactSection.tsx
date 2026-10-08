'use client'

import { useRef, useEffect, useState } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Mail } from 'lucide-react'
import ParticleCollision from '@/components/effects/ParticleCollision'
import { useTranslations } from 'next-intl'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger)

// Same pill as the hero's call to action, inked for paper.
const pillBase =
  'inline-flex items-center justify-center gap-2 px-6 lg:px-7 py-3.5 rounded-full text-xs lg:text-sm font-bold tracking-caps uppercase whitespace-nowrap transition-colors duration-200'

export default function ContactSection() {
  const t = useTranslations('contact')
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const decorativeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const collisionRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  
  const [isCollisionVisible, setIsCollisionVisible] = useState(false)
  
  useEffect(() => {
    if (!sectionRef.current) return

    // Reduced motion: no parallax, no scroll-triggered reveals, no collision
    // canvas; show the section fully.
    if (prefersReducedMotion) {
      if (titleRef.current) gsap.set(titleRef.current.querySelectorAll('.contact-char'), { y: 0, opacity: 1, rotateY: 0 })
      if (ctaRef.current) gsap.set(ctaRef.current, { y: 0, opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {

      // ============================================
      // PARALLAX txt
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
      // trigger pour l'animation de collision
      // ============================================
      if (collisionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 60%',
          onEnter: () => setIsCollisionVisible(true),
        })
      }
      
      // ============================================
      // TITLE
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
      // CTA (page perso)
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
  }, [prefersReducedMotion])

  const titleText = t('title')
  // Chars are grouped per word (a break is allowed after a space or a hyphen)
  // so the per-char animation spans never wrap mid-word.
  const email = t('page.directContact.email')
  const titleChars = titleText.split(/(?<=[\s-])/).map((word, w) => (
    <span key={w}>
      <span className="inline-block whitespace-nowrap">
        {[...word.trimEnd()].map((char, i) => (
          <span key={i} aria-hidden="true" className="contact-char inline-block">
            {char}
          </span>
        ))}
      </span>
      {word.endsWith(' ') ? ' ' : ''}
    </span>
  ))
  
  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section py-32 md:py-40 relative overflow-hidden flex items-center"
    >
      {/* Paper follows paper (DEC-16j): a thin blue rule parts Contact from About. */}
      <div aria-hidden="true" className="absolute top-0 inset-x-0 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="h-px bg-riso-blue/30" />
      </div>

      {/* ============================================ */}
      {/* PARALLAX txt */}
      {/* ============================================ */}
      <div
        ref={decorativeRef}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="font-display uppercase font-black text-ghost-35 text-white/[0.015] leading-none">
          CONTACT
        </span>
      </div>
      
      {/* ============================================ */}
      {/* MAIN */}
      {/* ============================================ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left : Particle Collision */}
          <div 
            ref={collisionRef}
            className="hidden lg:block relative aspect-square"
          >
            {/* canvas + bouton */}
            <div className="absolute inset-4 rounded-full overflow-visible">
              {!prefersReducedMotion && (
                <ParticleCollision
                  isVisible={isCollisionVisible}
                />
              )}
            </div>
            
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border border-riso-blue/40 rounded-full" />
              
              <div className="absolute inset-8 border border-riso-blue/25 rounded-full" />
              <div className="absolute inset-16 border border-riso-pink/30 rounded-full" />
              
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-px h-8 bg-riso-blue" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div className="w-px h-8 bg-riso-blue" />
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
                <div className="w-8 h-px bg-riso-pink" />
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                <div className="w-8 h-px bg-riso-pink" />
              </div>
            </div>
            
            {/* UX-06: one line a non-physicist can read. */}
            <p className="absolute -bottom-10 inset-x-0 text-center font-mono text-meta text-muted">
              {t('collision.legend')}
            </p>
          </div>
          
          {/* Right side : txt */}
          <div>
            {/* Section label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="section-label text-accent mb-4"
            >
              {t('sectionLabel')}
            </motion.div>
            
            {/* Title */}
            <h2 
              ref={titleRef}
              aria-label={titleText}
              className="misregister font-display uppercase font-black text-page leading-display tracking-wide mb-8 text-riso-pinkTitle"
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
              className="text-xl md:text-2xl text-muted leading-relaxed mb-12 max-w-lg"
            >
              {t('preview.text')}
            </motion.p>
            
            {/* CTA: the contact page, or a direct e-mail */}
            <div ref={ctaRef} className="flex flex-wrap gap-3">
              <TransitionLink
                href="/contact"
                className={`${pillBase} bg-riso-pink text-primary hover:bg-riso-ink hover:text-riso-paper group`}
              >
                {t('preview.cta')}
                <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </TransitionLink>
              <a
                href={`mailto:${email}`}
                className={`${pillBase} normal-case tracking-normal border-[1.5px] border-riso-ink text-riso-ink hover:bg-riso-ink hover:text-riso-paper`}
              >
                <Mail size={16} aria-hidden="true" />
                {email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
