import { cn } from '@/lib/cn'

/**
 * Project status label (AUDIT-047, P12-D4), one form on the listing card and
 * the project page (V6-LST-07). A square printed label, not a pill, so it never
 * reads as an action. "In progress" is pink with its blue plate 3 px off, the
 * yellow being kept for the research category alone (V6-LST-01); "paused" is
 * paper with a dashed rule. The word always carries the meaning, so the status
 * reads without colour.
 */
export type ProjectStatusValue = 'in-progress' | 'paused'

const BASE = 'inline-block whitespace-nowrap text-meta font-bold leading-none tracking-caps uppercase'

const STATUS = {
  'in-progress': 'px-2.5 py-1.5 bg-riso-pink text-primary shadow-plate-3',
  paused: 'px-2 py-[0.3125rem] bg-riso-paper text-muted border-[1.5px] border-dashed border-muted',
} as const

export function Badge({
  status,
  className,
  children,
}: {
  status: ProjectStatusValue
  className?: string
  children: React.ReactNode
}) {
  return <span className={cn(BASE, STATUS[status], className)}>{children}</span>
}
