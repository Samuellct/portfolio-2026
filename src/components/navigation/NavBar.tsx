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
    { href: '/', label: tNav('home') },
    { href: '/about', label: tNav('about') },
    { href: '/projects', label: tNav('projects') },
    { href: '/contact', label: tNav('contact') },
  ]

  const externalLinks = [
    { href: 'https://samuel-lecomte.fr', label: tMenu('blog'), icon: ExternalLink, hoverColor: 'hover:text-accent' },
    { href: 'https://github.com/Samuellct', label: tMenu('github'), icon: Github, hoverColor: 'hover:text-brand-github' },
    { href: 'https://www.linkedin.com/in/samuel-lecomte37/', label: tMenu('linkedin'), icon: Linkedin, hoverColor: 'hover:text-brand-linkedinAlt' },
  ]
  const [isHidden, setIsHidden] = useState(false)
  const [hasFocusWithin, setHasFocusWithin] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  // On the home page the bar melts into the hero's sky (no band of its own)
  // and takes its night band back once the hero has scrolled under it.
  const [overHero, setOverHero] = useState(pathname === '/')

  const [isMobile, setIsMobile] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const updateOverHero = () => {
      const hero = pathname === '/' ? document.getElementById('hero') : null
      setOverHero(!!hero && hero.getBoundingClientRect().bottom > 80)
    }
    updateOverHero()
    window.addEventListener('scroll', updateOverHero, { passive: true })
    window.addEventListener('resize', updateOverHero)
    return () => {
      window.removeEventListener('scroll', updateOverHero)
      window.removeEventListener('resize', updateOverHero)
    }
  }, [pathname])

  // AUDIT-024: the bar slides away while scrolling down and comes back on the
  // first scroll up. A few pixels of slack keep trackpad jitter from toggling it.
  useEffect(() => {
    let lastY = window.scrollY
    const handleScroll = () => {
      const y = window.scrollY
      if (y <= 100) setIsHidden(false)
      else if (y - lastY > 6) setIsHidden(true)
      else if (lastY - y > 6) setIsHidden(false)
      else return
      lastY = y
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
  // to the hamburger on close (falling back to the logo when the hamburger is
  // hidden, e.g. desktop at the top of the page).
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
      // Defer past React's re-render so the hamburger's `inert` state is settled
      // before we decide where focus lands.
      requestAnimationFrame(() => {
        const canFocus = (el: HTMLElement | null): el is HTMLElement =>
          !!el &&
          el !== document.body &&
          document.contains(el) &&
          !el.closest('[inert]') &&
          el.tabIndex > -1
        const target = canFocus(hamburger)
          ? hamburger
          : canFocus(previousActive)
            ? previousActive
            : document.querySelector<HTMLElement>('#site-nav a')
        target?.focus()
      })
    }
  }, [isMenuOpen])
  
  // Every link opens its own page; only Home, clicked on the home page, scrolls
  // back to the top instead of reloading it.
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === '/' && href === '/') {
      e.preventDefault()
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }
  
  // Never hidden over the home hero (the bar is part of it), with the menu
  // open, or while keyboard focus is inside it.
  const isBarHidden = isHidden && !overHero && !isMenuOpen && !hasFocusWithin
  // DEC-17g: the menu button lives outside the bar so it stays when the bar
  // folds away, turning into a pink pill. On desktop the expanded bar shows its
  // links, so the button only appears folded or with the menu open. Its focus
  // is not the bar's: unfolding on mousedown would make it inert before the click.
  const showMenuButton = isBarHidden || isMenuOpen || isMobile

  return (
    <>
      {/* Navigation Bar */}
      <motion.nav
        id="site-nav"
        aria-label={tNav('mainLabel')}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: isBarHidden ? '-100%' : 0 }}
        transition={{ y: { duration: 0.3, ease: 'easeOut' }, opacity: { duration: 0.6, delay: 0.2 } }}
        onFocus={() => setHasFocusWithin(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHasFocusWithin(false)
        }}
        className={`scheme-night fixed top-0 inset-x-0 z-[110] transition-colors duration-200 ${
          overHero && !isMenuOpen ? 'bg-transparent' : 'bg-primary'
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          {/* Logo */}
          <TransitionLink
            href="/"
            className="tap-target font-display uppercase font-black text-title tracking-widest hover:text-accent transition-colors"
          >
            SL
          </TransitionLink>
          
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <TransitionLink
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={active ? 'page' : undefined}
                  className={`text-xs font-medium tracking-caps-wide uppercase hover:text-riso-paper relative transition-colors group ${
                    active ? 'text-riso-paper' : 'text-riso-paper/70'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-accent-line transition-all duration-300 group-hover:w-full ${active ? 'w-full' : 'w-0'}`} />
                </TransitionLink>
              )
            })}
          </div>

          {/* Language switcher + Hamburger */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher className="text-xs font-medium tracking-caps-wide uppercase text-riso-paper" />

            {/* Room for the menu button, which is positioned over it */}
            <span aria-hidden="true" className="w-12 h-12" />
          </div>
        </div>
      </motion.nav>

      {/* Menu button: sits over its slot in the bar, a pink pill once the bar folds */}
      <motion.button
        ref={hamburgerRef}
        className={`fixed top-4 right-6 md:right-12 z-[120] p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-[background-color,color,box-shadow] duration-300 motion-reduce:transition-none ${
          isBarHidden ? 'bg-riso-pinkTitle text-primary shadow-[0_6px_18px_rgb(0_0_0/0.22)]' : 'bg-transparent text-snow'
        }`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        animate={{ opacity: showMenuButton ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: showMenuButton ? 'auto' : 'none' }}
        inert={!showMenuButton}
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
            className="scheme-night fixed inset-0 z-[100] bg-primary"
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
                        onClick={(e) => handleNavClick(e, link.href)}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                        className={`block font-display uppercase font-black text-page leading-none tracking-wide hover:text-white transition-all duration-300 hover:translate-x-4 ${
                          isActive(link.href) ? 'text-white' : 'text-faint'
                        }`}
                      >
                        {link.label}
                      </TransitionLink>
                    </motion.div>
                  ))}
                </nav>
              </div>
              
              {/* Right side - External Links */}
              <div className="flex flex-col justify-center mx-8 mt-10 pt-8 border-t border-white/5 md:mx-0 md:mt-0 md:pt-0 md:px-16 lg:px-24 md:border-t-0 md:border-l">
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
                      className={`tap-target flex items-center gap-4 text-muted transition-colors group ${link.hoverColor}`}
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
                    className="flex items-center gap-3 text-muted hover:text-accent transition-colors text-lg"
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
