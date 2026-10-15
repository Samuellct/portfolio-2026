'use client'

import { useEffect, useState, useRef } from 'react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import { m } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, Github, Linkedin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PAGE_BG } from '@/lib/theme'
import { SOCIAL, FORMSPREE_ENDPOINT } from '@/lib/constants'
import Watermark from '@/components/effects/Watermark'
import { Pill } from '@/components/ui/Pill'
import { useEntryAnimation } from '@/hooks/use-entry-animation'

// Background color (shares the About intro token: same value, one source)
const CONTACT_BG_COLOR = PAGE_BG

// Paper fields framed in blue (3.99:1 at rest, V6-CTA-06, P11-D6); focus turns
// the frame to ink and adds an offset blue ring.
const FIELD =
  'w-full px-4 py-3 bg-snow/60 border-[1.5px] border-riso-blue text-white placeholder:text-muted outline-none transition-colors focus:border-riso-ink focus:ring-2 focus:ring-riso-blue focus:ring-offset-2 focus:ring-offset-riso-paper'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
  const tContact = useTranslations('contact')
  const tNav = useTranslations('nav')
  // Served visible (no JS, first load); entries animate only after a client navigation
  const enter = useEntryAnimation()
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
  // After a submission the form unmounts: focus goes to the outcome heading,
  // then back to the first field when the form returns (V6-COD-25).
  const outcomeRef = useRef<HTMLHeadingElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const settled = useRef(false)

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      settled.current = true
      outcomeRef.current?.focus()
    } else if (status === 'idle' && settled.current) {
      settled.current = false
      nameRef.current?.focus()
    }
  }, [status])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
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
    <div className="min-h-screen relative overflow-x-clip" style={{ backgroundColor: CONTACT_BG_COLOR }}>
      <Watermark
        word="CONTACT"
        className="absolute top-1/2 -translate-y-1/2 left-0 z-0"
        textClassName="text-ghost-20 whitespace-nowrap"
        parallax={{ axis: 'x', from: -5, to: 5, scrub: 2 }}
      />
      
      <div className="relative z-10 pt-24 pb-20 max-w-3xl mx-auto px-6 md:px-12">
        <m.div
          initial={enter ? { opacity: 0, x: -20 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <Breadcrumb items={[{ label: tNav('contact') }]} />
        </m.div>

        {/* Header: the breadcrumb names the page, no orphan section number (P11-D7) */}
        <m.header
          initial={enter ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="misregister font-display uppercase font-black text-heading leading-display tracking-wide mb-6 text-riso-pinkTitle">
            {tContact('page.title')}
          </h1>
          <p className="text-lg text-muted">
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
        </m.header>
        
        {/* Live region, in the DOM before any submission (AUDIT-069): it announces
            the sending state; the outcome is read through the focused heading. */}
        <p role="status" aria-live="polite" className="sr-only">
          {status === 'submitting' && tContact('page.form.sending')}
        </p>

        {/* Success State */}
        {status === 'success' && (
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-status-success/10 border border-status-success/30 text-center"
          >
            <CheckCircle aria-hidden="true" size={48} className="mx-auto mb-4 text-status-success" />
            <h2 ref={outcomeRef} tabIndex={-1} className="font-display uppercase font-black text-title mb-2">{tContact('page.form.success')}</h2>
            <p className="text-muted mb-6">{tContact('page.form.successDescription')}</p>
            <Pill tone="outline" onClick={resetForm}>
              {tContact('page.form.sendAnother')}
            </Pill>
          </m.div>
        )}
        
        {/* Error State */}
        {status === 'error' && (
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-status-error/10 border border-status-error/30 text-center mb-8"
          >
            <AlertCircle aria-hidden="true" size={48} className="mx-auto mb-4 text-status-error" />
            <h2 ref={outcomeRef} tabIndex={-1} className="font-display uppercase font-black text-title mb-2">{tContact('page.form.error')}</h2>
            <p className="text-muted mb-6">{tContact('page.form.errorDescription')}</p>
            <Pill tone="outline" onClick={resetForm}>
              {tContact('page.form.retry')}
            </Pill>
          </m.div>
        )}
        
        {/* Form */}
        {(status === 'idle' || status === 'submitting') && (
          <m.form
            initial={enter ? { opacity: 0, y: 20 } : false}
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
                  ref={nameRef}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  placeholder={tContact('page.form.namePlaceholder')}
                  className={FIELD}
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
                  className={FIELD}
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
                className={FIELD}
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
                className={`${FIELD} resize-none`}
              />
            </div>
            
            {/* Honeypot, out of sight and out of the tab order */}
            <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
              <input ref={gotchaRef} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            {/* Submit bttn */}
            {/* The pink glow on hover is kept (V6-Q-20) */}
            <Pill
              type="submit"
              disabled={status === 'submitting'}
              className="hover:shadow-glow-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <>
                  <span aria-hidden="true" className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  {tContact('page.form.sending')}
                </>
              ) : (
                <>
                  {tContact('page.form.send')}
                  <Send aria-hidden="true" size={16} />
                </>
              )}
            </Pill>
          </m.form>
        )}

        {/* Direct contact: opened by the bands' registered double rule (P11-D8) */}
        <m.section
          initial={enter ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="rule-pair-above relative mt-16 pt-16"
        >
          <h2 className="text-xs tracking-caps-wide uppercase text-muted mb-6">
            {tContact('page.directContact.title')}
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <Pill as="external" href={SOCIAL.github} tone="outline">
              <Github aria-hidden="true" size={16} />
              {tContact('page.directContact.githubLabel')}
            </Pill>
            <Pill as="external" href={SOCIAL.linkedin} tone="outline">
              <Linkedin aria-hidden="true" size={16} />
              {tContact('page.directContact.linkedinLabel')}
            </Pill>
          </div>
        </m.section>
      </div>
    </div>
  )
}
