'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const COVER_DURATION = 500

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
  
  // Détecte quand la navigation est terminée
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
      className="fixed inset-0 z-[200] pointer-events-none"
      style={{
        backgroundColor: '#1a0a2e',
        clipPath: phase === 'covering' ? 'polygon(0 0, 0 0, 0 100%, 0 100%)' : undefined,
        animation: phase === 'covering' 
          ? `coverScreen ${COVER_DURATION}ms cubic-bezier(0.76, 0, 0.24, 1) forwards`
          : phase === 'revealing'
          ? `revealScreen ${COVER_DURATION}ms cubic-bezier(0.76, 0, 0.24, 1) forwards`
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
