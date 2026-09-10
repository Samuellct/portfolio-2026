'use client'

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'

interface LanguageSwitcherProps {
  className?: string
  label?: string
}

export default function LanguageSwitcher({ className, label }: LanguageSwitcherProps) {
  const locale = useLocale()
  const pathname = usePathname()
  const otherLocale = locale === 'en' ? 'fr' : 'en'

  return (
    <Link
      href={pathname}
      locale={otherLocale}
      className={className}
    >
      {label || otherLocale.toUpperCase()}
    </Link>
  )
}
