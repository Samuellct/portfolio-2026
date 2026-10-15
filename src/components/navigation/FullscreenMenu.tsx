'use client'

import { useRef, type RefObject } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Github, Linkedin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import TransitionLink from '@/components/navigation/TransitionLink'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useModalFocusTrap } from '@/hooks/use-modal-focus-trap'
import { SOCIAL } from '@/lib/constants'

interface MenuLink {
  href: string
  label: string
}

interface FullscreenMenuProps {
  open: boolean
  onClose: () => void
  links: MenuLink[]
  isActive: (href: string) => boolean
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
  /** Where focus goes back when the menu closes (the menu button). */
  returnFocusRef: RefObject<HTMLElement | null>
}

export default function FullscreenMenu({ open, onClose, links, isActive, onNavClick, returnFocusRef }: FullscreenMenuProps) {
  const tMenu = useTranslations('menu')
  const panelRef = useRef<HTMLDivElement>(null)
  useModalFocusTrap(open, panelRef, onClose, returnFocusRef)

  const externalLinks = [
    { href: SOCIAL.github, label: tMenu('github'), icon: Github, hoverColor: 'hover:text-brand-github' },
    { href: SOCIAL.linkedin, label: tMenu('linkedin'), icon: Linkedin, hoverColor: 'hover:text-brand-linkedinAlt' },
  ]

  return (
    <AnimatePresence>
      {open && (
        <m.div
          ref={panelRef}
          id="main-menu"
          role="dialog"
          aria-modal="true"
          aria-label={tMenu('dialogLabel')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="scheme-night fixed inset-0 z-menu bg-primary"
        >
          {/* bkg */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-riso-pink rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-riso-blue rounded-full blur-[150px]" />
          </div>

          {/* RESP-03: below md the external column stacks under the sections
              instead of disappearing; the panel scrolls if a short screen needs it. */}
          <div className="relative h-full flex flex-col justify-center overflow-y-auto py-20 md:flex-row md:justify-start md:overflow-visible md:py-0">
            {/* Left side - Navigation Links */}
            <div className="md:flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
              <m.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xs tracking-menu-label uppercase text-muted mb-8"
              >
                {tMenu('sections')}
              </m.p>

              <nav className="space-y-2">
                {links.map((link, index) => (
                  <m.div
                    key={link.href}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.08 }}
                  >
                    <TransitionLink
                      href={link.href}
                      onClick={(e) => onNavClick(e, link.href)}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                      className={`block font-display uppercase font-black text-page leading-none tracking-wide hover:text-white transition-all duration-300 hover:translate-x-4 ${
                        isActive(link.href) ? 'text-white' : 'text-faint'
                      }`}
                    >
                      {link.label}
                    </TransitionLink>
                  </m.div>
                ))}
              </nav>
            </div>

            {/* Right side - External Links */}
            <div className="flex flex-col justify-center mx-8 mt-10 pt-8 border-t border-white/5 md:mx-0 md:mt-0 md:pt-0 md:px-16 lg:px-24 md:border-t-0 md:border-l">
              <m.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs tracking-menu-label uppercase text-muted mb-8"
              >
                {tMenu('external')}
              </m.p>

              <div className="space-y-6">
                {externalLinks.map((link, index) => (
                  <m.a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.08 }}
                    className={`tap-target flex items-center gap-4 text-muted transition-colors group ${link.hoverColor}`}
                  >
                    <link.icon aria-hidden="true" size={20} />
                    <span className="text-lg">{link.label}</span>
                  </m.a>
                ))}
              </div>

              {/* Language switcher */}
              <m.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + externalLinks.length * 0.08 }}
                className="mt-8 pt-6 border-t border-white/5"
              >
                <LanguageSwitcher
                  label={tMenu('switchLang')}
                  className="flex items-center gap-3 text-muted hover:text-accent transition-colors text-lg"
                />
              </m.div>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
