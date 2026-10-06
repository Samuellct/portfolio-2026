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
  card: 'px-2.5 py-1 backdrop-blur-sm text-meta tracking-caps uppercase',
  inline: 'px-2 py-1 text-meta tracking-wider uppercase',
} as const

const STATUS = {
  'in-progress': {
    card: 'bg-surface border border-accent-line/60 text-accent',
    inline: 'bg-accent-line/10 border border-accent-line/20 text-accent',
  },
  paused: {
    card: 'bg-surface border border-white/20 text-muted',
    inline: 'bg-white/10 border border-white/20 text-muted',
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
