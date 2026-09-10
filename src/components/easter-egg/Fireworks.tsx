'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Fireworks } from '@fireworks-js/react'
import type { FireworksHandlers } from '@fireworks-js/react'
import { useEasterEgg } from '@/context/EasterEggContext'

export default function FireworksOverlay() {
  const { easterEggPhase, resetEasterEgg } = useEasterEgg()
  const [isFadingOut, setIsFadingOut] = useState(false)
  const fireworksRef = useRef<FireworksHandlers>(null)
  
  useEffect(() => {
    if (easterEggPhase !== 'fireworks') return
    
    // Start
    if (fireworksRef.current) {
      fireworksRef.current.start()
    }
    
    // fade out after 4s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true)
      
      // Stop fireworks
      if (fireworksRef.current) {
        fireworksRef.current.stop()
      }
    }, 4000)
    
    // After fade completes reset and go back to site
    const resetTimer = setTimeout(() => {
      resetEasterEgg()
    }, 5000)
    
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(resetTimer)
    }
  }, [easterEggPhase, resetEasterEgg])
  
  if (easterEggPhase !== 'fireworks') return null
  
  return (
    <motion.div
      className="fixed inset-0 z-[200]"
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <Fireworks
        ref={fireworksRef}
        options={{
          rocketsPoint: {
            min: 0,
            max: 100
          },
          hue: {
            min: 150,
            max: 300
          },
          acceleration: 1.02,
          brightness: {
            min: 50,
            max: 80
          },
          decay: {
            min: 0.015,
            max: 0.03
          },
          delay: {
            min: 15,
            max: 30
          },
          explosion: 6,
          flickering: 50,
          intensity: 40,
          friction: 0.96,
          gravity: 1.5,
          opacity: 0.5,
          particles: 120,
          traceLength: 3,
          traceSpeed: 10,
          lineWidth: {
            explosion: {
              min: 1,
              max: 3
            },
            trace: {
              min: 1,
              max: 2
            }
          },
          lineStyle: 'round',
        }}
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          position: 'fixed',
          background: '#030308'
        }}
      />
    </motion.div>
  )
}
