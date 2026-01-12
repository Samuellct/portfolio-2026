'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface ScrollIndicatorProps {
  hideAfterPx?: number
}

export default function ScrollIndicator({ hideAfterPx = 100 }: ScrollIndicatorProps) {
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
        >
          {/* Mouse icon */}
          <div className="relative w-6 h-10 rounded-full border border-white/30 flex justify-center">
            {/* Scroll wheel animation */}
            <motion.div
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
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <ChevronDown size={16} className="text-white/40" />
          </motion.div>
          
          {/* Label */}
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">
            Scroll
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
