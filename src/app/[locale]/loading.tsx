'use client'

import { useTranslations } from 'next-intl'

export default function Loading() {
  const t = useTranslations('common')
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-accent-line/20 border-t-accent-line rounded-full animate-spin" />
        <span className="text-sm text-muted tracking-widest uppercase">{t('loading')}</span>
      </div>
    </div>
  )
}
