import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Neutral inline tag (AUDIT-047). Used for the technology list on project
 * detail pages; the sharp-edged, low-contrast chip is the canonical form for
 * Phases 5 to 12 to reuse (e.g. AUDIT-010 project-card technologies).
 */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('px-3 py-1.5 text-xs bg-white/[0.03] border border-white/10', className)}>
      {children}
    </span>
  )
}
