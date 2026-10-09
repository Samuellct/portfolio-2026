import { FlaskConical, GraduationCap, Wrench, type LucideProps } from 'lucide-react'
import { CATEGORY, RISO } from '@/lib/theme'

/**
 * Category glyph on its spot-colour plate (DEC-13h, option C per DEC-18c):
 * the label next to it stays in ink, the plate only helps spotting.
 * Decorative: the label always sits next to it. The thin paper ring keeps the
 * blue plate apart from the ink of an active filter.
 */
const ICONS = {
  personal: Wrench,
  academic: GraduationCap,
  internship: FlaskConical,
} as const

type Category = keyof typeof ICONS

export function CategoryIcon({ category, ...props }: { category: string } & LucideProps) {
  const key: Category = category in ICONS ? (category as Category) : 'personal'
  const Icon = ICONS[key]
  return (
    <span
      aria-hidden="true"
      className="inline-grid place-items-center w-[18px] h-[18px] shrink-0"
      style={{ backgroundColor: CATEGORY[key].plate, boxShadow: `0 0 0 1px ${RISO.paper}` }}
    >
      <Icon aria-hidden="true" focusable="false" size={12} strokeWidth={2.25} color={CATEGORY[key].glyph} {...props} />
    </span>
  )
}
