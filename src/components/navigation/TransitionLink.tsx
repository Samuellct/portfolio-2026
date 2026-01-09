'use client'

import { ReactNode, MouseEvent } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTransition } from '@/context/TransitionContext'

/**
 * TransitionLink V4.6.1
 * 
 * Remplace next/link pour les liens internes.
 * Intercepte le clic et déclenche une transition animée
 * AVANT que la navigation ne se produise.
 * 
 * Utilise next/link en fallback pour :
 * - Les liens externes
 * - Les clics avec modificateur (Ctrl+clic, etc.)
 * - Quand on est déjà sur la même page
 */

interface TransitionLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  [key: string]: unknown
}

export default function TransitionLink({ 
  href, 
  children, 
  className,
  onClick,
  ...props 
}: TransitionLinkProps) {
  const pathname = usePathname()
  const { startTransition, phase } = useTransition()
  
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Appeler le onClick personnalisé s'il existe
    onClick?.(e)
    
    // Si déjà traité, ne rien faire
    if (e.defaultPrevented) return
    
    // Ne pas intercepter si :
    const isExternal = href.startsWith('http') || href.startsWith('//')
    const isSamePage = pathname === href
    const isTransitioning = phase !== 'idle'
    const hasModifier = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
    const isAnchor = href.startsWith('#')
    
    if (isExternal || isSamePage || isTransitioning || hasModifier || isAnchor) {
      return // Laisser le comportement par défaut de next/link
    }
    
    // Intercepter la navigation
    e.preventDefault()
    startTransition(href)
  }
  
  return (
    <Link 
      href={href} 
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  )
}
