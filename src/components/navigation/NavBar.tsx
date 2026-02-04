'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Github, Linkedin, ExternalLink } from 'lucide-react'
import TransitionLink from '@/components/navigation/TransitionLink'
import content from '@/lib/content.json'

const navLinks = [
  { href: '/', label: content.nav.home, sectionId: 'hero' },
  { href: '/about', label: content.nav.about, sectionId: 'about' },
  { href: '/projects', label: content.nav.projects, sectionId: 'projects' },
  { href: '/contact', label: content.nav.contact, sectionId: 'contact' },
]

const externalLinks = [
  { href: 'https://samuel-lecomte.fr', label: content.menu.blog, icon: ExternalLink, hoverColor: 'hover:text-accent-cyan' },
  { href: 'https://github.com/Samuellct', label: content.menu.github, icon: Github, hoverColor: 'hover:text-[#fafbfc]' },
  { href: 'https://www.linkedin.com/in/samuel-lecomte37/', label: content.menu.linkedin, icon: Linkedin, hoverColor: 'hover:text-[#0e76a8]' },
]

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
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
        role="navigation"
        aria-label="Main navigation"
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
          >
            {navLinks.map((link) => (
              <TransitionLink
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.sectionId)}
                className="text-xs font-medium tracking-[0.2em] uppercase text-white/50 hover:text-white relative transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-cyan transition-all duration-300 group-hover:w-full" />
              </TransitionLink>
            ))}
          </motion.div>
          
          {/* Hamburger bttn */}
          <motion.button
            className="relative z-50 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            animate={{ opacity: isScrolled || isMenuOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ pointerEvents: isScrolled || isMenuOpen ? 'auto' : 'none' }}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="main-menu"
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
      </motion.nav>
      
      {/* Fullscreen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="main-menu"
            role="menu"
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
                  className="text-xs tracking-[0.3em] uppercase text-white/40 mb-8"
                >
                  {content.menu.sections}
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
                        role="menuitem"
                        onClick={(e) => handleNavClick(e, link.sectionId)}
                        className="block font-display text-[clamp(2.5rem,8vw,6rem)] leading-none tracking-wide text-white/20 hover:text-white transition-all duration-300 hover:translate-x-4 hover:text-shadow-glow"
                      >
                        {link.label}
                      </TransitionLink>
                    </motion.div>
                  ))}
                </nav>
              </div>
              
              {/* Right side - External Links (ajouter lien blog) */}
              <div className="hidden md:flex flex-col justify-center px-16 lg:px-24 border-l border-white/5">
                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs tracking-[0.3em] uppercase text-white/40 mb-8"
                >
                  {content.menu.external}
                </motion.p>
                
                <div className="space-y-6">
                  {externalLinks.map((link, index) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
