import type { ComponentPropsWithoutRef } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'

/**
 * A link that opens a new tab and says so (V6-CTA-05, P11-D4): screen readers
 * hear "opens in a new tab" after the visible text, which stays the start of
 * the accessible name (WCAG 2.5.3). `inline` adds a small arrow for links
 * inside running text, where nothing else shows that the link leaves the site
 * (P11-D5); pills, menu and footer keep their own icons.
 */
type ExternalLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'target' | 'rel'> & {
  href: string
  inline?: boolean
}

export function ExternalLink({ children, inline = false, ...rest }: ExternalLinkProps) {
  const t = useTranslations('common')
  return (
    <a target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      {inline && <ArrowUpRight size={12} aria-hidden="true" className="inline-block align-baseline ml-0.5" />}
      <span className="sr-only"> ({t('newTab')})</span>
    </a>
  )
}
