'use client'

import { ReactNode, useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { EasterEggProvider } from '@/context/EasterEggContext'
import { SiteProvider } from '@/context/SiteContext'
import { SmoothScrollProvider } from '@/context/SmoothScrollContext'
import { TransitionProvider } from '@/context/TransitionContext'
import EasterEggManager from '@/components/easter-egg/EasterEggManager'
import Landing from '@/components/landing/Landing'
import MainLayout from '@/components/layout/MainLayout'

/**
 * Providers V4.6.1
 * 
 * Architecture des responsabilités :
 * - EasterEggProvider : Gère l'easter egg
 * - SiteProvider : Gère l'état global (landing passé ou non)
 * - SmoothScrollProvider : Gère le smooth scroll
 * - TransitionProvider : Gère les transitions de navigation + overlay intégré
 * - MainLayout : Structure de la page (NavBar, Footer)
 */

export function Providers({ children }: { children: ReactNode }) {
  const [hasEnteredSite, setHasEnteredSite] = useState(false)
  const [isLandingTransitioning, setIsLandingTransitioning] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleEnter = () => {
    setIsLandingTransitioning(true)
  }
  
  const handleTransitionComplete = () => {
    setHasEnteredSite(true)
    setIsLandingTransitioning(false)
  }
  
  if (!mounted) {
    return null
  }
  
  return (
    <EasterEggProvider>
      <SiteProvider value={{ hasEnteredSite, setHasEnteredSite }}>
        <SmoothScrollProvider>
          <TransitionProvider>
            <AnimatePresence mode="wait">
              {!hasEnteredSite ? (
                <Landing
                  key="landing"
                  onEnter={handleEnter}
                  isTransitioning={isLandingTransitioning}
                  onTransitionComplete={handleTransitionComplete}
                />
              ) : (
                <MainLayout key="main">
                  {children}
                </MainLayout>
              )}
            </AnimatePresence>
            
            {/* Easter Egg overlays */}
            <EasterEggManager />
          </TransitionProvider>
        </SmoothScrollProvider>
      </SiteProvider>
    </EasterEggProvider>
  )
}
