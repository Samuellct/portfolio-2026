'use client'

import { createContext, useContext, ReactNode } from 'react'

interface SiteContextType {
  hasEnteredSite: boolean
  setHasEnteredSite: (value: boolean) => void
}

const SiteContext = createContext<SiteContextType | null>(null)

export function SiteProvider({ 
  children, 
  value 
}: { 
  children: ReactNode
  value: SiteContextType 
}) {
  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const context = useContext(SiteContext)
  if (!context) {
    throw new Error('useSite must be used within SiteProvider')
  }
  return context
}
