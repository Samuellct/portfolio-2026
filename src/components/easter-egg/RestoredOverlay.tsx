'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useEasterEgg } from '@/context/EasterEggContext'

export default function RestoredOverlay() {
  const { easterEggPhase, resetEasterEgg } = useEasterEgg()
  const [showContent, setShowContent] = useState(false)
  
  useEffect(() => {
    if (easterEggPhase !== 'restored') return
    
    // Show content after boot animation
    const timer = setTimeout(() => setShowContent(true), 1500)
    
    // Auto-close after showing message
    const closeTimer = setTimeout(() => {
      resetEasterEgg()
    }, 5000)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(closeTimer)
    }
  }, [easterEggPhase, resetEasterEgg])
  
  if (easterEggPhase !== 'restored') return null
  
  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#030308] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Boot sequence */}
      {!showContent && (
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-white/60 font-mono text-sm">Restoring interface...</p>
        </div>
      )}
      
      {/* Success message */}
      {showContent && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          
          <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
            System Restored
          </h2>
          <p className="text-white/50 mb-2">
            Threat neutralized successfully.
          </p>
          <p className="text-white/30 text-sm">
            Returning to normal operation...
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
