'use client'

import TransitionLink from '@/components/navigation/TransitionLink'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const tNav = useTranslations('nav')
  const tFooter = useTranslations('footer')
  const tCommon = useTranslations('common')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-8 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <div className="text-xs text-muted">
          <span>© {currentYear} Samuel Lecomte</span>
        </div>

        {/* Links */}
        <nav aria-label={tFooter('navLabel')} className="flex items-center gap-6 text-xs text-muted">
          <TransitionLink 
            href="/about"
            className="tap-target hover:text-white transition-colors"
          >
            {tNav('about')}
          </TransitionLink>
          <TransitionLink 
            href="/projects"
            className="tap-target hover:text-white transition-colors"
          >
            {tNav('projects')}
          </TransitionLink>
          <TransitionLink 
            href="/contact"
            className="tap-target hover:text-white transition-colors"
          >
            {tNav('contact')}
          </TransitionLink>
          <a
            href="/Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${tFooter('resume')} (${tCommon('newTab')})`}
            className="tap-target hover:text-white transition-colors"
          >
            {tFooter('resume')}
          </a>
        </nav>
      </div>
    </footer>
  )
}
