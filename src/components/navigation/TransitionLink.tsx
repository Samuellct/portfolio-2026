'use client'

import { ComponentProps, MouseEvent } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import { useTransition } from '@/context/TransitionContext'

// Every prop of the locale-aware Link, with a plain string path.
type TransitionLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string
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
