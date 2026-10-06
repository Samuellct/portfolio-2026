import { FlaskConical, GraduationCap, Wrench, type LucideProps } from 'lucide-react'

/**
 * Category glyph (DEC-13h): categories share one ink, so the glyph and the
 * label tell them apart. Decorative: the label always sits next to it.
 */
const ICONS = {
  personal: Wrench,
  academic: GraduationCap,
  internship: FlaskConical,
} as const

export function CategoryIcon({ category, ...props }: { category: string } & LucideProps) {
  const Icon = category in ICONS ? ICONS[category as keyof typeof ICONS] : ICONS.personal
  return <Icon aria-hidden="true" focusable="false" size={14} strokeWidth={2} {...props} />
}
