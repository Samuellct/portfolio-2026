'use client'

import { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import TransitionLink from '@/components/navigation/TransitionLink'

export interface BreadcrumbItem {
  label: ReactNode
  /** Omitted on the last item when it is the current page. */
  href?: string
}

// AUDIT-025: position trail on deep pages, always starting from Home.
export default function Breadcrumb({ items, className = '' }: { items: BreadcrumbItem[]; className?: string }) {
  const t = useTranslations('projects')
  const tNav = useTranslations('nav')
  const trail: BreadcrumbItem[] = [{ label: tNav('home'), href: '/' }, ...items]

  return (
    <nav aria-label={t('breadcrumbLabel')} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
        {trail.map((item, i) => (
          <li key={i} className="flex items-center gap-x-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <TransitionLink href={item.href} className="tap-target inline-flex items-center gap-1.5 hover:text-white transition-colors">
                {item.label}
              </TransitionLink>
            ) : (
              <span aria-current="page" className="inline-flex items-center gap-1.5">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
