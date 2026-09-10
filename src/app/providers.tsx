'use client'

import { ReactNode, useState, useEffect, useCallback } from 'react'
import { usePathname } from '@/i18n/navigation'
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
  const [showLanding, setShowLanding] = useState(false)

  const markLandingSeen = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, 'true')
    } catch {
      // sessionStorage unavailable (private mode, blocked storage): in-memory only
    }
  }, [])

  // The landing screen is a client-only overlay. The page content below always
  // renders on the server, so first paint and crawlers get the real content.
  // Decide on mount whether to lay the overlay on top, from a per-session flag,
  // and only on the home route.
  useEffect(() => {
    if (pathname !== '/') return
    let seen = false
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === 'true'
    } catch {
      seen = false
    }
    if (!seen) setShowLanding(true)
  }, [pathname])

  // Persist the flag as soon as the overlay appears, so navigating away mid
  // animation does not replay it on the next in-session visit.
  useEffect(() => {
    if (showLanding) markLandingSeen()
  }, [showLanding, markLandingSeen])

  // Lock body scroll while the overlay covers the page.
  useEffect(() => {
    if (!showLanding) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [showLanding])

  const handleEnter = useCallback(() => {
    setIsLandingTransitioning(true)
  }, [])

  const handleTransitionComplete = useCallback(() => {
    setHasEnteredSite(true)
    setIsLandingTransitioning(false)
    setShowLanding(false)
    markLandingSeen()
  }, [markLandingSeen])

  return (
    <EasterEggProvider>
      <SiteProvider value={{ hasEnteredSite, setHasEnteredSite }}>
        <SmoothScrollProvider>
          <TransitionProvider>
            <MainLayout>{children}</MainLayout>
            <AnimatePresence>
              {showLanding && (
                <Landing
                  key="landing"
                  onEnter={handleEnter}
                  isTransitioning={isLandingTransitioning}
                  onTransitionComplete={handleTransitionComplete}
                />
              )}
            </AnimatePresence>
            <EasterEggManager />
          </TransitionProvider>
        </SmoothScrollProvider>
      </SiteProvider>
    </EasterEggProvider>
  )
}
