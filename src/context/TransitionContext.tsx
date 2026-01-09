'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * TransitionContext V4.6.1
 * 
 * Architecture robuste pour les transitions de page :
 * 1. Intercepte la navigation via TransitionLink
 * 2. Affiche l'overlay (phase 'covering')
 * 3. Attend que l'overlay couvre l'écran
 * 4. Navigue avec router.push()
 * 5. Détecte le changement de pathname (navigation terminée)
 * 6. Cache l'overlay (phase 'revealing')
 */

const COVER_DURATION = 500 // ms - durée pour couvrir l'écran

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
  
  // Détecter quand la navigation est terminée (pathname a changé)
  useEffect(() => {
    if (pathname !== previousPathname.current) {
      previousPathname.current = pathname
      
      // Si on était en train de naviguer, passer à la phase 'revealing'
      if (isNavigating.current) {
        isNavigating.current = false
        pendingHref.current = null
        
        // Petit délai pour laisser le contenu se rendre
        requestAnimationFrame(() => {
          setPhase('revealing')
        })
      }
    }
  }, [pathname])
  
  const startTransition = useCallback((href: string) => {
    // Ne pas démarrer si déjà en transition ou même page
    if (phase !== 'idle' || href === pathname) return
    
    pendingHref.current = href
    isNavigating.current = true
    setPhase('covering')
    
    // Après que l'overlay ait couvert l'écran, naviguer
    setTimeout(() => {
      if (pendingHref.current) {
        window.scrollTo(0, 0)
        setPhase('covered')
        router.push(pendingHref.current)
      }
    }, COVER_DURATION)
  }, [phase, pathname, router])
  
  // Callback pour quand l'animation de sortie est terminée
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

// Overlay interne au provider pour accéder directement au state
function TransitionOverlayInternal({ 
  phase, 
  onRevealComplete 
}: { 
  phase: TransitionPhase
  onRevealComplete: () => void 
}) {
  const isVisible = phase === 'covering' || phase === 'covered' || phase === 'revealing'
  
  // Calculer l'état de l'animation
  const getClipPath = () => {
    switch (phase) {
      case 'covering':
        return 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' // Animate to full
      case 'covered':
        return 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' // Stay full
      case 'revealing':
        return 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' // Exit right
      default:
        return 'polygon(0 0, 0 0, 0 100%, 0 100%)' // Hidden left
    }
  }
  
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
        if (phase === 'revealing') {
          onRevealComplete()
        }
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
