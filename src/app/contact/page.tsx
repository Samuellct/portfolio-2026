'use client'

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, Send, CheckCircle, AlertCircle, Mail, Github, Linkedin } from 'lucide-react'
import content from '@/lib/content.json'

gsap.registerPlugin(ScrollTrigger)

// Background color
const CONTACT_BG_COLOR = '#080510'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<FormStatus>('idle')
  
  // Scroll to top before paint
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  // GSAP
  useEffect(() => {
    if (!pageRef.current) return
    
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
  }, [])
  
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
      <div className="decor-text fixed top-1/2 -translate-y-1/2 left-0 pointer-events-none select-none z-0">
        <span className="font-display text-[20vw] text-white/[0.015] leading-none whitespace-nowrap">
          CONTACT
        </span>
      </div>
      
      <div className="relative z-10 pt-24 pb-20 max-w-3xl mx-auto px-6 md:px-12">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <TransitionLink
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm tracking-[0.1em] uppercase">{content.common.back}</span>
          </TransitionLink>
        </motion.div>
        
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="section-label text-accent-cyan mb-4">
            {content.contact.sectionLabel}
          </div>
          <h1 className="font-display text-[clamp(3rem,10vw,6rem)] leading-[0.9] tracking-wide mb-6">
            {content.contact.page.title}
          </h1>
          <p className="text-lg text-white/50 text-justify">
            {content.contact.page.description}
          </p>
        </motion.header>
        
        {/* Success State */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-green-500/10 border border-green-500/30 text-center"
          >
            <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
            <h2 className="font-display text-2xl mb-2">{content.contact.page.form.success}</h2>
            <p className="text-white/60 mb-6">{content.contact.page.form.successDescription}</p>
            <button
              onClick={resetForm}
              className="px-6 py-2 text-sm tracking-[0.1em] uppercase border border-white/20 hover:border-white/40 transition-colors"
            >
              Send another message
            </button>
          </motion.div>
        )}
        
        {/* Error State */}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-red-500/10 border border-red-500/30 text-center mb-8"
          >
            <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
            <h2 className="font-display text-2xl mb-2">{content.contact.page.form.error}</h2>
            <p className="text-white/60 mb-6">{content.contact.page.form.errorDescription}</p>
            <button
              onClick={resetForm}
              className="px-6 py-2 text-sm tracking-[0.1em] uppercase border border-white/20 hover:border-white/40 transition-colors"
            >
              {content.contact.page.form.retry}
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
                <label htmlFor="name" className="block text-xs tracking-[0.15em] uppercase text-white/40 mb-2">
                  {content.contact.page.form.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={content.contact.page.form.namePlaceholder}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-xs tracking-[0.15em] uppercase text-white/40 mb-2">
                  {content.contact.page.form.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={content.contact.page.form.emailPlaceholder}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>
            </div>
            
            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-xs tracking-[0.15em] uppercase text-white/40 mb-2">
                {content.contact.page.form.subject}
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder={content.contact.page.form.subjectPlaceholder}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-cyan transition-colors"
              />
            </div>
            
            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-xs tracking-[0.15em] uppercase text-white/40 mb-2">
                {content.contact.page.form.message}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder={content.contact.page.form.messagePlaceholder}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-cyan transition-colors resize-none"
              />
            </div>
            
            {/* Submit bttn */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent-cyan text-black text-sm font-medium tracking-[0.15em] uppercase transition-all hover:bg-white hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {content.contact.page.form.sending}
                </>
              ) : (
                <>
                  {content.contact.page.form.send}
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
          <h2 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-6">
            {content.contact.page.directContact.title}
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <a
              href={`mailto:${content.contact.page.directContact.email}`}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 transition-all hover:border-accent-cyan/30 hover:text-accent-cyan group"
            >
              <Mail size={16} className="text-accent-cyan" />
              <span>E-mail</span>
            </a>
            
            <a
              href="https://github.com/Samuellct"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 transition-all hover:border-[#fafbfc]/30 hover:text-[#fafbfc]"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
            
            <a
              href="www.linkedin.com/in/samuel-lecomte37"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 transition-all hover:border-[#0e76a8]/30 hover:text-[#0e76a8]"
            >
              <Linkedin size={16} />
              <span>LinkedIn</span>
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
