'use client'

import TransitionLink from '@/components/navigation/TransitionLink'
import { useTranslations } from 'next-intl'
import { RESUME_PATH } from '@/lib/constants'
import { FOOTER_SKY } from '@/lib/starBand'
import type { CSSProperties } from 'react'

export default function Footer() {
  const tNav = useTranslations('nav')
  const tFooter = useTranslations('footer')
  const tCommon = useTranslations('common')
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="scheme-night star-band rule-pair-above relative py-8 px-6 md:px-12 md:[--star-band:var(--star-band-md)]"
      style={{ '--star-band': FOOTER_SKY.mobile, '--star-band-md': FOOTER_SKY.desktop } as CSSProperties}
    >
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
            href={RESUME_PATH}
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
