'use client'

import { Fragment } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/cn'

interface LanguageSwitcherProps {
  className?: string
  /** Full-word link to the other language (menu). Without it, the compact "FR | EN" pair. */
  label?: string
}

// Default locale first, so the pair always reads "FR | EN".
const ORDER = [routing.defaultLocale, ...routing.locales.filter((l) => l !== routing.defaultLocale)]

export default function LanguageSwitcher({ className, label }: LanguageSwitcherProps) {
  const locale = useLocale()
  const t = useTranslations('menu')
  const pathname = usePathname()
  const otherLocale = locale === 'en' ? 'fr' : 'en'

  if (label) {
    return (
      <Link
        href={pathname}
        locale={otherLocale}
        hrefLang={otherLocale}
        aria-label={t('switchLangAria')}
        className={cn('tap-target', className)}
      >
        {label}
      </Link>
    )
  }

  // AUDIT-038: both codes visible, the active one marked, the other one a link.
  return (
    <div className={cn('flex items-center', className)}>
      {ORDER.map((loc, i) => (
        <Fragment key={loc}>
          {i > 0 && <span aria-hidden="true" className="opacity-40">|</span>}
          {loc === locale ? (
            <span aria-current="true" lang={loc} className="inline-flex min-w-[44px] justify-center">
              {loc.toUpperCase()}
            </span>
          ) : (
            <Link
              href={pathname}
              locale={loc}
              hrefLang={loc}
              lang={loc}
              aria-label={t('switchLangAria')}
              className="tap-target inline-flex min-w-[44px] justify-center opacity-70 hover:opacity-100 transition-opacity"
            >
              {loc.toUpperCase()}
            </Link>
          )}
        </Fragment>
      ))}
    </div>
  )
}
