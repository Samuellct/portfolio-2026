'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Starfield from './Starfield'
import content from '@/lib/content.json'

interface LandingProps {
  onEnter: () => void
  isTransitioning: boolean
  onTransitionComplete: () => void
}

export default function Landing({ onEnter, isTransitioning, onTransitionComplete }: LandingProps) {
  const [showContent, setShowContent] = useState(true)
  
  const handleEnterClick = () => {
    setShowContent(false)
    onEnter()
  }
  
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
      <motion.div
        className="relative z-10 text-center"
        animate={{
          opacity: showContent ? 1 : 0,
          scale: showContent ? 1 : 1.5,
        }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <motion.h1 
          className="font-display text-[clamp(3rem,12vw,10rem)] leading-none tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.6) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {content.landing.title.split(' ').map((word, i) => (
            <span key={i} className="block">{word}</span>
          ))}
        </motion.h1>
        
        <motion.p 
          className="mt-4 text-sm tracking-[0.3em] text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {content.landing.subtitle}
        </motion.p>
        
        <motion.button
          onClick={handleEnterClick}
          className="mt-12 relative px-12 py-4 font-display text-lg tracking-[0.4em] text-white border border-white/20 
                     overflow-hidden transition-all duration-300
                     hover:border-accent-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.2),inset_0_0_30px_rgba(0,240,255,0.05)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10">{content.landing.enter}</span>
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-accent-cyan/20 to-transparent"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 2, opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ transformOrigin: 'center' }}
          />
        </motion.button>
      </motion.div>
      
      {/* Transition overlay - circular reveal effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-40"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isTransitioning ? 1 : 0,
        }}
        transition={{ duration: 0.5, delay: isTransitioning ? 1.5 : 0 }}
      >
        {/* Radial gradient that creates tunnel effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, transparent 20%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.8) 80%, white 100%)',
          }}
        />
      </motion.div>
      
      {/* Final white flash - softer */}
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
