import { cn } from '@/lib/cn'

/**
 * Project status badge (AUDIT-047). Consolidates the two historical
 * implementations behind one component:
 * - `tone="card"` renders a `<div>` with the frosted overlay look used on the
 *   listing grid (positioning classes are passed via `className`);
 * - `tone="inline"` renders a `<span>` for flowing next to the category on the
 *   detail page.
 * Class strings are preserved exactly so the rendered output does not move.
 */
export type ProjectStatusValue = 'in-progress' | 'paused'

const TONE = {
  card: 'px-2.5 py-1 backdrop-blur-sm text-micro-xs tracking-caps uppercase',
  inline: 'px-2 py-1 text-micro-xs tracking-wider uppercase',
} as const

const STATUS = {
  'in-progress': {
    card: 'bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan',
    inline: 'bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan',
  },
  paused: {
    card: 'bg-white/10 border border-white/20 text-white/60',
    inline: 'bg-white/10 border border-white/20 text-white/60',
  },
} as const

export function Badge({
  status,
  tone,
  className,
  children,
}: {
  status: ProjectStatusValue
  tone: 'card' | 'inline'
  className?: string
  children: React.ReactNode
}) {
  const classes = cn(TONE[tone], STATUS[status][tone], className)
  return tone === 'card' ? (
    <div className={classes}>{children}</div>
  ) : (
    <span className={classes}>{children}</span>
  )
}
