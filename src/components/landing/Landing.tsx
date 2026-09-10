'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Starfield from './Starfield'
import { useTranslations } from 'next-intl'

interface LandingProps {
  onEnter: () => void
  isTransitioning: boolean
  onTransitionComplete: () => void
}

export default function Landing({ onEnter, isTransitioning, onTransitionComplete }: LandingProps) {
  const t = useTranslations('landing')

  useEffect(() => {
    const timer = setTimeout(() => {
      onEnter()
    }, 1500)
    return () => clearTimeout(timer)
  }, [onEnter])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Starfield Canvas */}
      <Starfield
        isHyperspace={isTransitioning}
        onHyperspaceComplete={onTransitionComplete}
      />

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.h1
          className="font-display text-[clamp(3rem,12vw,10rem)] leading-none tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isTransitioning ? 0 : 1,
            scale: isTransitioning ? 1.5 : 1,
          }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{
            background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.6) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('title').split(' ').map((word: string, i: number) => (
            <span key={i} className="block">{word}</span>
          ))}
        </motion.h1>
      </div>

      {/* Transition overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-40"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isTransitioning ? 1 : 0,
        }}
        transition={{ duration: 0.5, delay: isTransitioning ? 1.5 : 0 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, transparent 20%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.8) 80%, white 100%)',
          }}
        />
      </motion.div>

      {/* White flash */}
      <motion.div
        className="fixed inset-0 bg-white pointer-events-none z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? [0, 0, 0.8, 1] : 0 }}
        transition={{
          duration: 2.2,
          times: [0, 0.75, 0.9, 1],
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  )
}
