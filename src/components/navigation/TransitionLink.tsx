'use client'

import { ComponentProps, MouseEvent, useState } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useTransition } from '@/context/TransitionContext'

// Every prop of the locale-aware Link, with a plain string path.
type TransitionLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string
}

// Data saver on, or a 2G/3G connection (Network Information API, Chromium only)
function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined') return false
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection
  return !!connection && (!!connection.saveData || /2g|3g/.test(connection.effectiveType ?? ''))
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
  const router = useRouter()
  // On a slow or metered connection, prefetch on intent (hover, focus, touch)
  // instead of for every link in view (V6-COD-34). Read once on the client;
  // the prefetch prop does not reach the markup, so hydration is unaffected.
  const [prefetchOnIntent] = useState(isSlowConnection)
  const prefetchNow = () => {
    if (prefetchOnIntent && href.startsWith('/')) router.prefetch(href)
  }
  
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
      {...(prefetchOnIntent && {
        prefetch: false,
        onMouseEnter: prefetchNow,
        onFocus: prefetchNow,
        onTouchStart: prefetchNow,
      })}
      {...props}
    >
      {children}
    </Link>
  )
}
