import { cn } from '@/lib/cn'

/**
 * Project status badge (AUDIT-047). Consolidates the two historical
 * implementations behind one component (the listing card shows its status as
 * meta text since UI-01):
 * - `tone="inline"` renders a `<span>` for flowing next to the category on the
 *   detail page.
 * Class strings are preserved exactly so the rendered output does not move.
 */
export type ProjectStatusValue = 'in-progress' | 'paused'

const TONE = {
  inline: 'px-2 py-1 text-meta tracking-wider uppercase',
  // Project page header (DEC-14g): a printed pill next to the links.
  pill: 'inline-flex items-center px-4 py-2.5 rounded-full text-sm font-semibold tracking-caps uppercase',
} as const

const STATUS = {
  'in-progress': {
    inline: 'bg-accent-line/10 border border-accent-line/20 text-accent',
    pill: 'bg-riso-pink text-primary border border-riso-pink',
  },
  paused: {
    inline: 'bg-white/10 border border-white/20 text-muted',
    pill: 'border border-dashed border-white text-white',
  },
} as const

export function Badge({
  status,
  tone,
  className,
  children,
}: {
  status: ProjectStatusValue
  tone: 'inline' | 'pill'
  className?: string
  children: React.ReactNode
}) {
  const classes = cn(TONE[tone], STATUS[status][tone], className)
  return <span className={classes}>{children}</span>
}
