'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface EasterEggContextType {
  collectedIcons: Set<string>
  collectIcon: (iconId: string) => void
  isTerminalActive: boolean
  setTerminalActive: (active: boolean) => void
  easterEggPhase: 'idle' | 'glitch' | 'terminal' | 'fireworks' | 'restored'
  setEasterEggPhase: (phase: 'idle' | 'glitch' | 'terminal' | 'fireworks' | 'restored') => void
  resetEasterEgg: () => void
}

const EasterEggContext = createContext<EasterEggContextType | null>(null)

export function EasterEggProvider({ children }: { children: ReactNode }) {
  const [collectedIcons, setCollectedIcons] = useState<Set<string>>(new Set())
  const [isTerminalActive, setTerminalActive] = useState(false)
  const [easterEggPhase, setEasterEggPhase] = useState<'idle' | 'glitch' | 'terminal' | 'fireworks' | 'restored'>('idle')
  
  const collectIcon = useCallback((iconId: string) => {
    setCollectedIcons(prev => {
      const newSet = new Set(prev)
      newSet.add(iconId)
      
      // Si 3 icônes trouvees, easter egg activé
      if (newSet.size === 3) {
        setTimeout(() => {
          setEasterEggPhase('glitch')
        }, 400)
      }
      
      return newSet
    })
  }, [])
  
  const resetEasterEgg = useCallback(() => {
    setCollectedIcons(new Set())
    setTerminalActive(false)
    setEasterEggPhase('idle')
  }, [])
  
  return (
    <EasterEggContext.Provider value={{
      collectedIcons,
      collectIcon,
      isTerminalActive,
      setTerminalActive,
      easterEggPhase,
      setEasterEggPhase,
      resetEasterEgg
    }}>
      {children}
    </EasterEggContext.Provider>
  )
}

export function useEasterEgg() {
  const context = useContext(EasterEggContext)
  if (!context) {
    throw new Error('useEasterEgg must be used within EasterEggProvider')
  }
  return context
}
