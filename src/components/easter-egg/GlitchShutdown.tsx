'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEasterEgg } from '@/context/EasterEggContext'

export default function GlitchShutdown() {
  const { easterEggPhase, setEasterEggPhase } = useEasterEgg()
  const [glitchStep, setGlitchStep] = useState<'glitch' | 'shutdown' | 'black'>('glitch')
  
  useEffect(() => {
    if (easterEggPhase !== 'glitch') return
    
    // Phase 1: Glitch (0.8s)
    const glitchTimer = setTimeout(() => {
      setGlitchStep('shutdown')
    }, 800)
    
    // Phase 2: Shutdown CRT (0.5s)
    const shutdownTimer = setTimeout(() => {
      setGlitchStep('black')
    }, 1300)
    
    // Phase 3: Transition vers terminal
    const terminalTimer = setTimeout(() => {
      setEasterEggPhase('terminal')
    }, 1800)
    
    return () => {
      clearTimeout(glitchTimer)
      clearTimeout(shutdownTimer)
      clearTimeout(terminalTimer)
    }
  }, [easterEggPhase, setEasterEggPhase])
  
  if (easterEggPhase !== 'glitch') return null
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] pointer-events-none"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Glitch overlay */}
        {glitchStep === 'glitch' && (
          <div className="absolute inset-0 glitch-container">
            {/* RGB shift layers */}
            <div className="absolute inset-0 bg-red-500/20 animate-glitch-r" />
            <div className="absolute inset-0 bg-green-500/20 animate-glitch-g" />
            <div className="absolute inset-0 bg-blue-500/20 animate-glitch-b" />
            
            {/* Noise lines */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-px bg-white/30"
                  style={{
                    top: `${Math.random() * 100}%`,
                    animation: `glitch-line ${50 + Math.random() * 100}ms linear infinite`,
                    animationDelay: `${Math.random() * 100}ms`,
                  }}
                />
              ))}
            </div>
            
            {/* Screen shake */}
            <div className="absolute inset-0 animate-shake" />
          </div>
        )}
        
        {/* CRT Shutdown effect */}
        {glitchStep === 'shutdown' && (
          <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
            {/* Horizontal line collapsing */}
            <motion.div
              className="w-full bg-white"
              initial={{ height: '100vh', opacity: 1 }}
              animate={{ 
                height: ['100vh', '2px', '2px'],
                opacity: [1, 1, 0],
              }}
              transition={{ 
                duration: 0.5,
                times: [0, 0.7, 1],
                ease: 'easeIn'
              }}
            />
            
            {/* Flash */}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.15, delay: 0.35 }}
            />
          </div>
        )}
        
        {/* Black screen before terminal */}
        {glitchStep === 'black' && (
          <div className="absolute inset-0 bg-black" />
        )}
      </motion.div>
      
      {/* Inline styles for glitch animations */}
      <style>{`
        @keyframes glitch-r {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-3px, 2px); }
          40% { transform: translate(3px, -2px); }
          60% { transform: translate(-2px, -3px); }
          80% { transform: translate(2px, 3px); }
        }
        
        @keyframes glitch-g {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(3px, -2px); }
          40% { transform: translate(-3px, 2px); }
          60% { transform: translate(2px, 3px); }
          80% { transform: translate(-2px, -3px); }
        }
        
        @keyframes glitch-b {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-2px, -3px); }
          40% { transform: translate(2px, 3px); }
          60% { transform: translate(3px, -2px); }
          80% { transform: translate(-3px, 2px); }
        }
        
        @keyframes glitch-line {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translate(0, 0) skewX(0); }
          10% { transform: translate(-2px, 1px) skewX(-1deg); }
          20% { transform: translate(2px, -1px) skewX(1deg); }
          30% { transform: translate(-1px, 2px) skewX(-0.5deg); }
          40% { transform: translate(1px, -2px) skewX(0.5deg); }
          50% { transform: translate(-2px, -1px) skewX(-1deg); }
          60% { transform: translate(2px, 1px) skewX(1deg); }
          70% { transform: translate(-1px, -2px) skewX(-0.5deg); }
          80% { transform: translate(1px, 2px) skewX(0.5deg); }
          90% { transform: translate(-2px, 1px) skewX(-1deg); }
        }
        
        .animate-glitch-r { animation: glitch-r 100ms linear infinite; }
        .animate-glitch-g { animation: glitch-g 100ms linear infinite; animation-delay: 33ms; }
        .animate-glitch-b { animation: glitch-b 100ms linear infinite; animation-delay: 66ms; }
        .animate-shake { animation: shake 100ms linear infinite; }
      `}</style>
    </AnimatePresence>
  )
}
