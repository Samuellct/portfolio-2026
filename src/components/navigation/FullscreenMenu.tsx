'use client'

import { useRef, type RefObject } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, FileText, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import TransitionLink from '@/components/navigation/TransitionLink'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useModalFocusTrap } from '@/hooks/use-modal-focus-trap'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { RESUME_PATH, SOCIAL } from '@/lib/constants'
import { RISO } from '@/lib/theme'
import { ExternalLink } from '@/components/ui/ExternalLink'

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

// Two printed halftone screens in multiply, where the blurred orbs used to be.
const screen = (ink: string, cell: number) => ({
  backgroundImage: `radial-gradient(circle, ${ink} 0 34%, transparent 36%)`,
  backgroundSize: `${cell}px ${cell}px`,
  maskImage: 'radial-gradient(circle, #000 0 30%, transparent 70%)',
  WebkitMaskImage: 'radial-gradient(circle, #000 0 30%, transparent 70%)',
})

// NAV-A (V6-NAV-11): a paper sheet that drops from the bar. Links read at rest
// in blue (3.99:1, large text), the current page in registered pink, hover in ink.
export default function FullscreenMenu({ open, onClose, links, isActive, onNavClick, returnFocusRef }: FullscreenMenuProps) {
  const tMenu = useTranslations('menu')
  const tFooter = useTranslations('footer')
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  useModalFocusTrap(open, panelRef, onClose, returnFocusRef)

  const externalLinks = [
    { href: SOCIAL.github, label: tMenu('github'), icon: Github },
    { href: SOCIAL.linkedin, label: tMenu('linkedin'), icon: Linkedin },
    { href: RESUME_PATH, label: tFooter('resume'), icon: FileText },
  ]

  const hidden = reduce ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }
  const shown = reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }

  return (
    <AnimatePresence>
      {open && (
        <m.div
          ref={panelRef}
          id="main-menu"
          role="dialog"
          aria-modal="true"
          aria-label={tMenu('dialogLabel')}
          initial={hidden}
          animate={shown}
          exit={hidden}
          transition={reduce ? { duration: 0.16, ease: 'easeOut' } : { duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
          className="fixed inset-0 z-menu bg-riso-paper text-white overflow-hidden"
        >
          {/* Inside the dialog, first in the focus order, over the slot of the
              bar's menu button (V6-NAV-03). */}
          <button
            type="button"
            onClick={onClose}
            aria-label={tMenu('close')}
            className="absolute top-4 right-6 md:right-12 z-10 p-3 min-w-tap min-h-tap flex items-center justify-center rounded-full text-white hover:text-riso-blue transition-colors"
          >
            <X aria-hidden="true" size={24} />
          </button>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 w-[26rem] h-[26rem] rounded-full mix-blend-multiply opacity-55"
            style={screen(RISO.pink, 14)}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -bottom-28 w-[26rem] h-[26rem] rounded-full mix-blend-multiply opacity-35"
            style={screen(RISO.blue, 12)}
          />

          {/* RESP-03: below md the external column stacks under the sections
              instead of disappearing; the panel scrolls if a short screen needs it. */}
          <div className="relative h-full flex flex-col justify-center overflow-y-auto py-20 md:flex-row md:justify-start md:overflow-visible md:py-0">
            <div className="md:flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
              <p className="flex items-center gap-3.5 text-xs tracking-menu-label uppercase text-muted mb-8 before:content-[''] before:w-8 before:h-px before:bg-current">
                {tMenu('sections')}
              </p>

              <nav aria-label={tMenu('sections')} className="space-y-2">
                {links.map((link) => {
                  const active = isActive(link.href)
                  return (
                    <TransitionLink
                      key={link.href}
                      href={link.href}
                      onClick={(e) => onNavClick(e, link.href)}
                      aria-current={active ? 'page' : undefined}
                      className={`block w-fit font-display uppercase font-black text-page leading-none tracking-wide transition-[color,transform] duration-200 motion-reduce:transition-none hover:translate-x-3 motion-reduce:hover:translate-x-0 ${
                        active ? 'text-riso-pinkTitle misregister' : 'text-riso-blue hover:text-white'
                      }`}
                    >
                      {link.label}
                      {active && (
                        <span aria-hidden="true" className="ml-3 align-middle text-[0.3em] text-white">
                          ●
                        </span>
                      )}
                    </TransitionLink>
                  )
                })}
              </nav>
            </div>

            <div className="flex flex-col justify-center mx-8 mt-10 pt-8 border-t border-accent-line/25 md:mx-0 md:mt-0 md:pt-0 md:px-16 lg:px-24 md:border-t-0 md:border-l">
              <p className="flex items-center gap-3.5 text-xs tracking-menu-label uppercase text-muted mb-8 before:content-[''] before:w-8 before:h-px before:bg-current">
                {tMenu('external')}
              </p>

              <div className="space-y-6">
                {externalLinks.map((link) => (
                  <ExternalLink
                    key={link.href}
                    href={link.href}
                    className="tap-target flex items-center gap-4 text-white underline-offset-[6px] decoration-2 decoration-riso-pink hover:underline"
                  >
                    <link.icon aria-hidden="true" size={20} />
                    <span className="text-lg">{link.label}</span>
                  </ExternalLink>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-accent-line/25">
                <LanguageSwitcher variant="segment" className="w-fit text-white text-sm font-medium tracking-caps-wide" />
              </div>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
