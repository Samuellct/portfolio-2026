'use client'

import { ReactNode, useState, useEffect, useLayoutEffect, useCallback } from 'react'
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

// Runs before paint on the client, falls back to useEffect on the server so the
// landing decision lands before the first painted frame (no flash of content).
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

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

  // The page content is server-rendered: `showLanding` is false on the server and
  // on the first client render, so `MainLayout` (and its children) are in the HTML
  // for crawlers and no-JS visitors. On the home route, first visit of the session,
  // the landing overlay then takes over and `AnimatePresence` animates the reveal
  // back to the content.
  useIsomorphicLayoutEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === 'true'
    } catch {
      seen = false
    }
    if (pathname === '/' && !seen) {
      setShowLanding(true)
    } else {
      setHasEnteredSite(true)
    }
  }, [pathname])

  // Persist the flag as soon as the overlay appears, so navigating away mid
  // animation does not replay it on the next in-session visit.
  useEffect(() => {
    if (showLanding) markLandingSeen()
  }, [showLanding, markLandingSeen])

  // Lock body scroll while the landing covers the page.
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
            <AnimatePresence mode="wait">
              {showLanding ? (
                <Landing
                  key="landing"
                  onEnter={handleEnter}
                  isTransitioning={isLandingTransitioning}
                  onTransitionComplete={handleTransitionComplete}
                />
              ) : (
                <MainLayout key="main">{children}</MainLayout>
              )}
            </AnimatePresence>
            <EasterEggManager />
          </TransitionProvider>
        </SmoothScrollProvider>
      </SiteProvider>
    </EasterEggProvider>
  )
}
