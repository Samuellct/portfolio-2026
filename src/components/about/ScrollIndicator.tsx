'use client'

import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ScrollIndicatorProps {
  hideAfterPx?: number
}

export default function ScrollIndicator({ hideAfterPx = 100 }: ScrollIndicatorProps) {
  const t = useTranslations('hero')
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > hideAfterPx) {
        setIsVisible(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hideAfterPx])
  
  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          // ICON-02: a mouse hint means nothing on touch screens, and on a phone the
          // fixed hint sat over the intro text, so it is desktop only.
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 [@media(hover:none)]:hidden"
        >
          {/* Mouse icon */}
          <div className="relative w-6 h-10 rounded-full border border-white/30 flex justify-center">
            {/* Scroll wheel animation */}
            <m.div
              className="w-1 h-2 bg-white/50 rounded-full mt-2"
              animate={{ 
                y: [0, 6, 0],
                opacity: [1, 0.3, 1]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>
          
          {/* Chevron with bounce */}
          <m.div
            animate={{ y: [0, 4, 0] }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <ChevronDown aria-hidden="true" size={16} className="text-muted" />
          </m.div>
          
          {/* Label */}
          <span className="text-meta tracking-caps-wide uppercase text-muted">
            {t('scrollHint')}
          </span>
        </m.div>
      )}
    </AnimatePresence>
  )
}
