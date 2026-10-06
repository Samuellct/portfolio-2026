'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react'
import { useRouter, usePathname } from '@/i18n/navigation'
// Short paper fade (ANIM-01): the veil covers in 160 ms, the route swaps
// underneath, then it lifts in 220 ms.
const COVER_DURATION = 160
const REVEAL_DURATION = 220

type TransitionPhase = 'idle' | 'covering' | 'covered' | 'revealing'

interface TransitionContextType {
  phase: TransitionPhase
  startTransition: (href: string) => void
}

const TransitionContext = createContext<TransitionContextType | null>(null)

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const pendingHref = useRef<string | null>(null)
  const previousPathname = useRef(pathname)
  const isNavigating = useRef(false)
  
  // Detect when navigation is complete (???)
  useEffect(() => {
    if (pathname !== previousPathname.current) {
      previousPathname.current = pathname
      
      if (isNavigating.current) {
        isNavigating.current = false
        pendingHref.current = null
        requestAnimationFrame(() => setPhase('revealing'))
      }
    }
  }, [pathname])
  
  const startTransition = useCallback((href: string) => {
    if (phase !== 'idle' || href === pathname) return
    
    pendingHref.current = href
    isNavigating.current = true
    setPhase('covering')
    
    setTimeout(() => {
      if (pendingHref.current) {
        window.scrollTo(0, 0)
        setPhase('covered')
        router.push(pendingHref.current)
      }
    }, COVER_DURATION)
  }, [phase, pathname, router])
  
  const handleRevealComplete = useCallback(() => {
    setPhase('idle')
  }, [])
  
  return (
    <TransitionContext.Provider value={{ phase, startTransition }}>
      {children}
      <TransitionOverlayInternal phase={phase} onRevealComplete={handleRevealComplete} />
    </TransitionContext.Provider>
  )
}

function TransitionOverlayInternal({ 
  phase, 
  onRevealComplete 
}: { 
  phase: TransitionPhase
  onRevealComplete: () => void 
}) {
  const isVisible = phase === 'covering' || phase === 'covered' || phase === 'revealing'
  
  if (!isVisible) return null
  
  return (
    <div
      className="fixed inset-0 z-[200] pointer-events-none bg-surface"
      style={{
        opacity: phase === 'covering' ? 0 : undefined,
        animation: phase === 'covering'
          ? `veilIn ${COVER_DURATION}ms ease-out forwards`
          : phase === 'revealing'
          ? `veilOut ${REVEAL_DURATION}ms ease-in forwards`
          : undefined,
      }}
      onAnimationEnd={() => {
        if (phase === 'revealing') onRevealComplete()
      }}
    />
  )
}

export function useTransition() {
  const context = useContext(TransitionContext)
  if (!context) {
    throw new Error('useTransition must be used within TransitionProvider')
  }
  return context
}

export { COVER_DURATION }
