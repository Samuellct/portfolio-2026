'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEasterEgg } from '@/context/EasterEggContext'

interface HiddenIconProps {
  id: string
  className?: string
}

export default function HiddenIcon({ id, className = '' }: HiddenIconProps) {
  const { collectedIcons, collectIcon } = useEasterEgg()
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(true) // Start as true to hide initially
  
  // Check for mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Animation de disparition puis collecte
    setIsVisible(false)
    setTimeout(() => {
      collectIcon(id)
    }, 300)
  }
  
  // Si déjà collectée ou mobile, ne pas afficher
  if (collectedIcons.has(id) || isMobile) {
    return null
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0.5 }}
          exit={{ 
            scale: [1, 1.5, 0],
            opacity: [0.5, 1, 0],
            rotate: [0, 180, 360],
          }}
          whileHover={{ 
            opacity: 1,
            scale: 1.3,
            textShadow: '0 0 10px rgba(0, 240, 255, 0.8)',
          }}
          transition={{ 
            duration: 0.3,
            exit: { duration: 0.4, ease: 'easeOut' }
          }}
          onClick={handleClick}
          className={`text-white/50 hover:text-accent-cyan cursor-pointer select-none transition-colors ${className}`}
          style={{ 
            fontSize: '0.85rem',
            lineHeight: 1,
          }}
          aria-label="Hidden easter egg icon"
        >
          ✧
        </motion.button>
      )}
    </AnimatePresence>
  )
}
