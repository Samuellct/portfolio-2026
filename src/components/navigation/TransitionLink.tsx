'use client'

import { ReactNode, MouseEvent } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTransition } from '@/context/TransitionContext'

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
    onClick?.(e)
    if (e.defaultPrevented) return
    
    const isExternal = href.startsWith('http') || href.startsWith('//')
    const isSamePage = pathname === href
    const isTransitioning = phase !== 'idle'
    const hasModifier = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
    const isAnchor = href.startsWith('#')
    
    if (isExternal || isSamePage || isTransitioning || hasModifier || isAnchor) {
      return
    }
    
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
