'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import Lenis from 'lenis'
import { publishLenis } from '@/lib/lenis'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface SmoothScrollContextType {
  lenis: Lenis | null
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null })

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    // Under reduced motion, keep native scrolling: no Lenis instance at all.
    if (prefersReducedMotion) {
      setLenis(null)
      return
    }

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      // Its own frame loop: GSAP is not loaded on every route (V6-COD-09);
      // lib/gsap.ts syncs ScrollTrigger where it is.
      autoRaf: true,
    })

    publishLenis(instance)
    setLenis(instance)

    return () => {
      publishLenis(null)
      instance.destroy()
      setLenis(null)
    }
  }, [prefersReducedMotion])

  return (
    <SmoothScrollContext.Provider value={{ lenis }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}
