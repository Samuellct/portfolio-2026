'use client'

import { useState, useEffect, useRef, type CSSProperties } from 'react'
import { usePathname } from '@/i18n/navigation'
import { m } from 'framer-motion'
import { Menu } from 'lucide-react'
import TransitionLink from '@/components/navigation/TransitionLink'
import FullscreenMenu from '@/components/navigation/FullscreenMenu'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useTranslations } from 'next-intl'
import { BAR_SKY } from '@/lib/starBand'

export default function NavBar() {
  const tNav = useTranslations('nav')
  const tMenu = useTranslations('menu')

  const navLinks = [
    { href: '/', label: tNav('home') },
    { href: '/about', label: tNav('about') },
    { href: '/projects', label: tNav('projects') },
    { href: '/contact', label: tNav('contact') },
  ]

  const [isHidden, setIsHidden] = useState(false)
  const [hasFocusWithin, setHasFocusWithin] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  // On the home page the bar melts into the hero's sky (no band of its own)
  // and takes its night band back once the hero has scrolled under it.
  const [overHero, setOverHero] = useState(pathname === '/')

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

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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
  // links, so the button only appears folded. Its focus is not the bar's:
  // unfolding on mousedown would hide it before the click. With the menu open,
  // the dialog carries its own close button at the same place (V6-NAV-03).
  // V6-COD-26: shown on mobile from the server HTML, by CSS; JS only folds it
  // in and out on desktop (`data-shown`).
  const showOnDesktop = isBarHidden && !isMenuOpen

  return (
    <>
      {/* Navigation Bar */}
      <m.nav
        id="site-nav"
        aria-label={tNav('mainLabel')}
        // Served visible: no entry fade, so the links read without JavaScript.
        initial={false}
        animate={{ y: isBarHidden ? '-100%' : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ '--star-band': BAR_SKY } as CSSProperties}
        // Only keyboard focus pins the bar: a clicked link keeps focus after the
        // client-side navigation, which would otherwise lock the bar open.
        onFocus={(e) => setHasFocusWithin(e.target.matches(':focus-visible'))}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHasFocusWithin(false)
        }}
        // The menu sheet covers the bar: hidden and inert while it is open, so its
        // links and language pair are not doubled behind the dialog.
        inert={isMenuOpen}
        className={`scheme-night fixed top-0 inset-x-0 z-nav transition-colors duration-200 ${
          overHero ? 'bg-transparent' : 'star-band rule-pair-below'
        } ${isMenuOpen ? 'invisible' : ''}`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          {/* Logo */}
          <TransitionLink
            href="/"
            aria-label={tNav('logoLabel')}
            className="tap-target font-display uppercase font-black text-title tracking-widest text-riso-pinkTitle misregister hover:text-riso-paper transition-colors"
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
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-riso-pink shadow-plate transition-all duration-300 group-hover:w-full ${active ? 'w-full' : 'w-0'}`} />
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
      </m.nav>

      {/* Menu button: sits over its slot in the bar, a pink pill once the bar folds */}
      <button
        ref={hamburgerRef}
        type="button"
        data-shown={showOnDesktop}
        className={`fixed top-4 right-6 md:right-12 z-menu-button p-3 min-w-tap min-h-tap flex items-center justify-center rounded-full transition-[background-color,color,box-shadow,opacity,visibility] duration-300 motion-reduce:transition-none ${
          isMenuOpen
            ? 'invisible opacity-0'
            : 'md:invisible md:opacity-0 md:data-[shown=true]:visible md:data-[shown=true]:opacity-100'
        } ${
          // P10-D2: printed pill, riso-pink with a blue plate 2 px off, no shadow.
          isBarHidden ? 'bg-riso-pink text-primary shadow-plate' : 'bg-transparent text-snow'
        }`}
        onClick={() => setIsMenuOpen(true)}
        aria-label={tMenu('open')}
        aria-expanded={isMenuOpen}
      >
        <Menu aria-hidden="true" size={24} />
      </button>
      
      <FullscreenMenu
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={navLinks}
        isActive={isActive}
        onNavClick={handleNavClick}
        returnFocusRef={hamburgerRef}
      />
    </>
  )
}
