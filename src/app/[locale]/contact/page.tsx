'use client'

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Send, CheckCircle, AlertCircle, Github, Linkedin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { SECTION_BG } from '@/lib/theme'

gsap.registerPlugin(ScrollTrigger)

// Background color (shares the About intro token: same value, one source)
const CONTACT_BG_COLOR = SECTION_BG.aboutIntro

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
  const tContact = useTranslations('contact')
  const tNav = useTranslations('nav')
  const prefersReducedMotion = useReducedMotion()
  const pageRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<FormStatus>('idle')
  // Honeypot: left empty by people, filled by bots; Formspree drops submissions
  // that carry a value in `_gotcha`.
  const gotchaRef = useRef<HTMLInputElement>(null)

  // Scroll to top before paint
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  // GSAP
  useEffect(() => {
    if (!pageRef.current || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const decorText = pageRef.current?.querySelector('.decor-text')
      if (decorText) {
        gsap.fromTo(decorText,
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: pageRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            },
          }
        )
      }
    }, pageRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    
    try {
      const response = await fetch('https://formspree.io/f/xpwjbwkb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _replyto: formData.email,
          _gotcha: gotchaRef.current?.value ?? '',
        }),
      })
      
      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }
  
  const resetForm = () => {
    setStatus('idle')
  }
  
  return (
    <div ref={pageRef} className="min-h-screen relative" style={{ backgroundColor: CONTACT_BG_COLOR }}>
      {/* parallax */}
      <div aria-hidden="true" className="decor-text fixed top-1/2 -translate-y-1/2 left-0 pointer-events-none select-none z-0">
        <span className="font-display uppercase font-black text-ghost-20 text-white/[0.015] leading-none whitespace-nowrap">
          CONTACT
        </span>
      </div>
      
      <div className="relative z-10 pt-24 pb-20 max-w-3xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <Breadcrumb items={[{ label: tNav('contact') }]} />
        </motion.div>
        
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="section-label text-accent mb-4">
            {tContact('sectionLabel')}
          </div>
          <h1 className="font-display uppercase font-black text-page leading-display tracking-wide mb-6">
            {tContact('page.title')}
          </h1>
          <p className="text-lg text-muted text-justify">
            {tContact('page.description')}
          </p>
          {/* UX-11: the direct address comes before the form */}
          <p className="mt-4 text-lg text-muted">
            {tContact.rich('page.emailFirst', {
              email: () => (
                <a
                  href={`mailto:${tContact('page.directContact.email')}`}
                  className="tap-target text-accent underline underline-offset-4 decoration-accent-line/40 hover:decoration-accent-line transition-colors break-all"
                >
                  {tContact('page.directContact.email')}
                </a>
              ),
            })}
          </p>
        </motion.header>
        
        {/* Live region, in the DOM before any submission so screen readers
            announce the outcome (AUDIT-069). */}
        <p role="status" aria-live="polite" className="sr-only">
          {status === 'submitting' && tContact('page.form.sending')}
          {status === 'success' && tContact('page.form.success')}
          {status === 'error' && tContact('page.form.error')}
        </p>

        {/* Success State */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-status-success/10 border border-status-success/30 text-center"
          >
            <CheckCircle size={48} className="mx-auto mb-4 text-status-success" />
            <h2 className="font-display uppercase font-black text-title mb-2">{tContact('page.form.success')}</h2>
            <p className="text-muted mb-6">{tContact('page.form.successDescription')}</p>
            <button
              onClick={resetForm}
              className="px-6 py-2 text-sm tracking-label uppercase border border-white/20 hover:border-white/40 transition-colors"
            >
              {tContact('page.form.sendAnother')}
            </button>
          </motion.div>
        )}
        
        {/* Error State */}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-status-error/10 border border-status-error/30 text-center mb-8"
          >
            <AlertCircle size={48} className="mx-auto mb-4 text-status-error" />
            <h2 className="font-display uppercase font-black text-title mb-2">{tContact('page.form.error')}</h2>
            <p className="text-muted mb-6">{tContact('page.form.errorDescription')}</p>
            <button
              onClick={resetForm}
              className="px-6 py-2 text-sm tracking-label uppercase border border-white/20 hover:border-white/40 transition-colors"
            >
              {tContact('page.form.retry')}
            </button>
          </motion.div>
        )}
        
        {/* Form */}
        {(status === 'idle' || status === 'submitting') && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Name + Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-xs tracking-caps uppercase text-muted mb-2">
                  {tContact('page.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  placeholder={tContact('page.form.namePlaceholder')}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-muted focus:outline-none focus:border-accent-line transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-xs tracking-caps uppercase text-muted mb-2">
                  {tContact('page.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder={tContact('page.form.emailPlaceholder')}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-muted focus:outline-none focus:border-accent-line transition-colors"
                />
              </div>
            </div>
            
            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-xs tracking-caps uppercase text-muted mb-2">
                {tContact('page.form.subject')}
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder={tContact('page.form.subjectPlaceholder')}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-muted focus:outline-none focus:border-accent-line transition-colors"
              />
            </div>
            
            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-xs tracking-caps uppercase text-muted mb-2">
                {tContact('page.form.message')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder={tContact('page.form.messagePlaceholder')}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-muted focus:outline-none focus:border-accent-line transition-colors resize-none"
              />
            </div>
            
            {/* Honeypot, out of sight and out of the tab order */}
            <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
              <input ref={gotchaRef} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            {/* Submit bttn */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center gap-3 px-8 py-4 bg-riso-pink text-primary hover:text-black text-sm font-medium tracking-caps uppercase transition-all hover:bg-white hover:shadow-glow-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  {tContact('page.form.sending')}
                </>
              ) : (
                <>
                  {tContact('page.form.send')}
                  <Send size={16} />
                </>
              )}
            </button>
          </motion.form>
        )}
        
        {/* Direct contact section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 pt-16 border-t border-white/5"
        >
          <h2 className="text-xs tracking-caps-wide uppercase text-muted mb-6">
            {tContact('page.directContact.title')}
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/Samuellct"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 transition-all hover:border-brand-github/30 hover:text-brand-github"
            >
              <Github size={16} />
              <span>{tContact('page.directContact.githubLabel')}</span>
            </a>
            
            <a
              href="https://www.linkedin.com/in/samuel-lecomte37/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 transition-all hover:border-brand-linkedinAlt/30 hover:text-brand-linkedinAlt"
            >
              <Linkedin size={16} />
              <span>{tContact('page.directContact.linkedinLabel')}</span>
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
