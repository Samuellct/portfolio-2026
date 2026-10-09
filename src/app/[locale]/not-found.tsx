'use client'

import TransitionLink from '@/components/navigation/TransitionLink'
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('common')
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center px-6">
        <h1 className="font-display uppercase font-black text-display leading-none text-white/10">
          {t('notFound.code')}
        </h1>
        <h2 className="font-display uppercase font-black text-heading mb-4 -mt-8">
          {t('notFound.title')}
        </h2>
        <p className="text-muted mb-8 max-w-md mx-auto">
          {t('notFound.description')}
        </p>
        <TransitionLink
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-riso-pink text-primary hover:text-black text-sm font-medium tracking-caps uppercase transition-all hover:bg-white"
        >
          {t('notFound.backHome')}
        </TransitionLink>
      </div>
    </div>
  )
}
