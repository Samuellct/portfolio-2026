'use client'

import { ReactNode, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { EasterEggProvider } from '@/context/EasterEggContext'
import { SiteProvider } from '@/context/SiteContext'
import { SmoothScrollProvider } from '@/context/SmoothScrollContext'
import { TransitionProvider } from '@/context/TransitionContext'
import EasterEggManager from '@/components/easter-egg/EasterEggManager'
import Landing from '@/components/landing/Landing'
import MainLayout from '@/components/layout/MainLayout'

const SESSION_KEY = 'portfolio-landing-seen'

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [hasEnteredSite, setHasEnteredSite] = useState(false)
  const [isLandingTransitioning, setIsLandingTransitioning] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [shouldShowLanding, setShouldShowLanding] = useState(true)
  
  useEffect(() => {
    setMounted(true)
    
    // Check if user has already seen the landing page this session
    const hasSeenLanding = sessionStorage.getItem(SESSION_KEY) === 'true'
    
    // Determine if we should show the landing page:
    // - Don't show if already seen this session
    // - Don't show if user accesses an internal page directly (ex : une page projet ouverte dans un new onglet)
    const isHomePage = pathname === '/'
    const skipLanding = hasSeenLanding || !isHomePage
    
    if (skipLanding) {
      setShouldShowLanding(false)
      setHasEnteredSite(true)
    }
  }, [pathname])
  
  const handleEnter = () => {
    setIsLandingTransitioning(true)
  }
  
  const handleTransitionComplete = () => {
    setHasEnteredSite(true)
    setIsLandingTransitioning(false)
    // Save user has seen the landing page
    sessionStorage.setItem(SESSION_KEY, 'true')
  }
  
  if (!mounted) return null
  
  // Determine if we should show the landing page
  const showLanding = shouldShowLanding && !hasEnteredSite
  
  return (
    <EasterEggProvider>
      <SiteProvider value={{ hasEnteredSite, setHasEnteredSite }}>
        <SmoothScrollProvider>
          <TransitionProvider>
            <AnimatePresence mode="wait">
              {showLanding ? (
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
            <EasterEggManager />
          </TransitionProvider>
        </SmoothScrollProvider>
      </SiteProvider>
    </EasterEggProvider>
  )
}
