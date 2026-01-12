'use client'

import TransitionLink from '@/components/navigation/TransitionLink'
import content from '@/lib/content.json'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="relative py-8 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <div className="text-xs text-white/30">
          <span>© {currentYear} Samuel Lecomte</span>
        </div>
        
        {/* Links */}
        <nav className="flex items-center gap-6 text-xs text-white/30">
          <TransitionLink 
            href="/about"
            className="hover:text-white transition-colors"
          >
            {content.nav.about}
          </TransitionLink>
          <TransitionLink 
            href="/projects"
            className="hover:text-white transition-colors"
          >
            {content.nav.projects}
          </TransitionLink>
          <TransitionLink 
            href="/contact"
            className="hover:text-white transition-colors"
          >
            {content.nav.contact}
          </TransitionLink>
          <a 
            href="/Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            {content.footer.resume}
          </a>
        </nav>
      </div>
    </footer>
  )
}
