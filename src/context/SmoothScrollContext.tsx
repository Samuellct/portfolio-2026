'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger)

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
    })

    // Documented Lenis + GSAP integration: keep ScrollTrigger in sync with Lenis,
    // and drive Lenis from GSAP's ticker instead of a hand-rolled rAF loop.
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    setLenis(instance)

    return () => {
      gsap.ticker.remove(tick)
      instance.off('scroll', ScrollTrigger.update)
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
