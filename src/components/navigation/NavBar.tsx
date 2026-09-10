'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from '@/i18n/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Github, Linkedin, ExternalLink } from 'lucide-react'
import TransitionLink from '@/components/navigation/TransitionLink'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useTranslations } from 'next-intl'

export default function NavBar() {
  const tNav = useTranslations('nav')
  const tMenu = useTranslations('menu')

  const navLinks = [
    { href: '/', label: tNav('home'), sectionId: 'hero' },
    { href: '/about', label: tNav('about'), sectionId: 'about' },
    { href: '/projects', label: tNav('projects'), sectionId: 'projects' },
    { href: '/contact', label: tNav('contact'), sectionId: 'contact' },
  ]

  const externalLinks = [
    { href: 'https://samuel-lecomte.fr', label: tMenu('blog'), icon: ExternalLink, hoverColor: 'hover:text-accent-cyan' },
    { href: 'https://github.com/Samuellct', label: tMenu('github'), icon: Github, hoverColor: 'hover:text-[#fafbfc]' },
    { href: 'https://www.linkedin.com/in/samuel-lecomte37/', label: tMenu('linkedin'), icon: Linkedin, hoverColor: 'hover:text-[#0e76a8]' },
  ]
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const [isMobile, setIsMobile] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])
  
  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])
  
  // Prevent body scroll if navmenu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Modal behaviour for the fullscreen menu (AUDIT-053): trap focus inside the
  // panel, close on Escape, make the rest of the page inert, and return focus
  // to the hamburger on close.
  useEffect(() => {
    if (!isMenuOpen) return
    const panel = panelRef.current
    if (!panel) return

    const inertTargets = [
      document.getElementById('main-content'),
      document.querySelector('footer'),
    ].filter((el): el is HTMLElement => el !== null)
    inertTargets.forEach((el) => el.setAttribute('inert', ''))

    const focusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.getClientRects().length > 0)

    const previousActive = document.activeElement as HTMLElement | null
    const hamburger = hamburgerRef.current
    focusable()[0]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsMenuOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const items = focusable()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      inertTargets.forEach((el) => el.removeAttribute('inert'))
      ;(hamburger ?? previousActive)?.focus()
    }
  }, [isMenuOpen])
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    // If on home page, scroll to section instead of navigating
    if (pathname === '/') {
      e.preventDefault()
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
      setIsMenuOpen(false)
    }
  }
  
  return (
    <>
      {/* Navigation Bar */}
      <motion.nav
        aria-label={tNav('mainLabel')}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          isScrolled ? 'bg-primary/90 backdrop-blur-xl' : ''
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          {/* Logo */}
          <TransitionLink 
            href="/"
            className="font-display text-2xl tracking-widest hover:text-accent-cyan transition-colors"
          >
            SL
          </TransitionLink>
          
          {/* Desktop nav */}
          <motion.div
            className="hidden md:flex items-center gap-10"
            animate={{ opacity: isScrolled ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            style={{ pointerEvents: isScrolled ? 'none' : 'auto' }}
            inert={isScrolled}
          >
            {navLinks.map((link) => (
              <TransitionLink
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.sectionId)}
                className="text-xs font-medium tracking-caps-wide uppercase text-white/50 hover:text-white relative transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-cyan transition-all duration-300 group-hover:w-full" />
              </TransitionLink>
            ))}
          </motion.div>
          
          {/* Language switcher + Hamburger */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher className="text-xs font-medium tracking-caps-wide uppercase text-white/50 hover:text-white transition-colors" />

            {/* Hamburger bttn */}
            <motion.button
            ref={hamburgerRef}
            className="relative z-50 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            animate={{ opacity: isScrolled || isMenuOpen || isMobile ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ pointerEvents: isScrolled || isMenuOpen || isMobile ? 'auto' : 'none' }}
            inert={!(isScrolled || isMenuOpen || isMobile)}
            aria-label={isMenuOpen ? tMenu('close') : tMenu('open')}
            aria-expanded={isMenuOpen}
            aria-controls={isMenuOpen ? 'main-menu' : undefined}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          </div>
        </div>
      </motion.nav>
      
      {/* Fullscreen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={panelRef}
            id="main-menu"
            role="dialog"
            aria-modal="true"
            aria-label={tMenu('dialogLabel')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-30 bg-primary"
          >
            {/* bkg */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan rounded-full blur-[150px]" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple rounded-full blur-[150px]" />
            </div>
            
            <div className="relative h-full flex">
              {/* Left side - Navigation Links */}
              <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xs tracking-menu-label uppercase text-muted mb-8"
                >
                  {tMenu('sections')}
                </motion.p>
                
                <nav className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.08 }}
                    >
                      <TransitionLink
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.sectionId)}
                        className="block font-display text-display-menu leading-none tracking-wide text-faint hover:text-white transition-all duration-300 hover:translate-x-4"
                      >
                        {link.label}
                      </TransitionLink>
                    </motion.div>
                  ))}
                </nav>
              </div>
              
              {/* Right side - External Links */}
              <div className="hidden md:flex flex-col justify-center px-16 lg:px-24 border-l border-white/5">
                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs tracking-menu-label uppercase text-muted mb-8"
                >
                  {tMenu('external')}
                </motion.p>
                
                <div className="space-y-6">
                  {externalLinks.map((link, index) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + index * 0.08 }}
                      className={`flex items-center gap-4 text-white/50 transition-colors group ${link.hoverColor}`}
                    >
                      <link.icon size={20} />
                      <span className="text-lg">{link.label}</span>
                    </motion.a>
                  ))}
                </div>

                {/* Language switcher */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + externalLinks.length * 0.08 }}
                  className="mt-8 pt-6 border-t border-white/5"
                >
                  <LanguageSwitcher
                    label={tMenu('switchLang')}
                    className="flex items-center gap-3 text-white/50 hover:text-accent-cyan transition-colors text-lg"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
