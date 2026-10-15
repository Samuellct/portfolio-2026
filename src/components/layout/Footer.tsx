'use client'

import TransitionLink from '@/components/navigation/TransitionLink'
import { useTranslations } from 'next-intl'
import { EMAIL, RESUME_PATH, SOCIAL } from '@/lib/constants'
import { FOOTER_SKY } from '@/lib/starBand'
import type { CSSProperties } from 'react'

const linkClass = 'tap-target text-muted hover:text-white transition-colors'

// V6-NAV-05: the footer closes every page with the whole site navigation and
// every way to reach the owner, so GitHub and LinkedIn stay reachable at the top
// of a desktop page without the menu (V6-NAV-04, DEC-17g kept).
export default function Footer() {
  const tNav = useTranslations('nav')
  const tMenu = useTranslations('menu')
  const tFooter = useTranslations('footer')
  const tCommon = useTranslations('common')
  const currentYear = new Date().getFullYear()

  const pages = [
    { href: '/', label: tNav('home') },
    { href: '/about', label: tNav('about') },
    { href: '/projects', label: tNav('projects') },
    { href: '/contact', label: tNav('contact') },
  ]
  const external = [
    { href: SOCIAL.github, label: tMenu('github') },
    { href: SOCIAL.linkedin, label: tMenu('linkedin') },
    { href: RESUME_PATH, label: tFooter('resume') },
  ]

  return (
    <footer
      className="scheme-night star-band rule-pair-above relative py-8 px-6 md:px-12 md:[--star-band:var(--star-band-md)]"
      style={{ '--star-band': FOOTER_SKY.mobile, '--star-band-md': FOOTER_SKY.desktop } as CSSProperties}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-4 text-sm md:flex-row md:items-center md:gap-14">
        <p className="text-muted md:flex-1">© {currentYear} Samuel Lecomte</p>

        <nav aria-label={tFooter('navLabel')}>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {pages.map((page) => (
              <li key={page.href}>
                <TransitionLink href={page.href} className={linkClass}>
                  {page.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          <li>
            <a href={`mailto:${EMAIL}`} className={linkClass}>
              {EMAIL}
            </a>
          </li>
          {external.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} (${tCommon('newTab')})`}
                className={linkClass}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
