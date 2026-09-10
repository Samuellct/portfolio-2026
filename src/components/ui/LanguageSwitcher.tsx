'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

interface LanguageSwitcherProps {
  className?: string
  label?: string
}

export default function LanguageSwitcher({ className, label }: LanguageSwitcherProps) {
  const locale = useLocale()
  const t = useTranslations('menu')
  const pathname = usePathname()
  const otherLocale = locale === 'en' ? 'fr' : 'en'

  return (
    <Link
      href={pathname}
      locale={otherLocale}
      hrefLang={otherLocale}
      aria-label={t('switchLangAria')}
      className={cn('tap-target', className)}
    >
      {label || otherLocale.toUpperCase()}
    </Link>
  )
}
