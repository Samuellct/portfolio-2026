'use client'

import { Fragment } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/cn'

interface LanguageSwitcherProps {
  className?: string
  /** `pair`: the compact "FR | EN" of the bar. `segment`: the 48 px FR / EN control of the menu. */
  variant?: 'pair' | 'segment'
}

// Default locale first, so the pair always reads "FR | EN".
const ORDER = [routing.defaultLocale, ...routing.locales.filter((l) => l !== routing.defaultLocale)]

export default function LanguageSwitcher({ className, variant = 'pair' }: LanguageSwitcherProps) {
  const locale = useLocale()
  const t = useTranslations('menu')
  const pathname = usePathname()
  const segment = variant === 'segment'

  // AUDIT-038: both codes visible, the active one marked, the other one a link.
  // V6-CTA-01: the link is named by its visible code (WCAG 2.5.3), after a
  // hidden prefix in the page's language; only the code carries the target `lang`.
  return (
    <div className={cn('flex items-center', segment && 'rounded-full border-[1.5px] border-current', className)}>
      {ORDER.map((loc, i) => (
        <Fragment key={loc}>
          {i > 0 && !segment && <span aria-hidden="true" className="opacity-40">|</span>}
          {loc === locale ? (
            <span
              aria-current="true"
              lang={loc}
              className={cn(
                'inline-flex justify-center items-center',
                segment ? 'min-w-12 min-h-12 px-4 rounded-full bg-riso-ink text-riso-paper' : 'min-w-tap',
              )}
            >
              {loc.toUpperCase()}
            </span>
          ) : (
            <Link
              href={pathname}
              locale={loc}
              hrefLang={loc}
              className={cn(
                'tap-target inline-flex justify-center items-center transition-[opacity,color]',
                segment ? 'min-w-12 min-h-12 px-4 rounded-full hover:text-riso-blue' : 'min-w-tap opacity-70 hover:opacity-100',
              )}
            >
              <span className="sr-only">{t('switchLangPrefix')} </span>
              <span lang={loc}>{loc.toUpperCase()}</span>
            </Link>
          )}
        </Fragment>
      ))}
    </div>
  )
}
