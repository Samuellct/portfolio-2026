'use client'

import TransitionLink from '@/components/navigation/TransitionLink'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Pill } from '@/components/ui/Pill'

const RECOVERY_LINK = 'tap-target text-accent underline decoration-1 underline-offset-4 hover:decoration-2'

// Paper 404 (V6-DES-03, P11-D3): the code is decoration, the heading says what
// happened, one pink way home and two ways back into the site.
export default function NotFound() {
  const t = useTranslations('common')
  const tHero = useTranslations('hero')
  const tNav = useTranslations('nav')
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center px-6 py-24">
        <p aria-hidden="true" className="misregister font-display font-black text-display leading-none text-riso-pinkTitle">
          {t('notFound.code')}
        </p>
        <h1 className="mt-6 font-display uppercase font-black text-heading leading-display-snug tracking-wide">
          {t('notFound.title')}
        </h1>
        <p className="mt-4 text-muted max-w-md mx-auto">{t('notFound.description')}</p>
        <div className="mt-10 flex flex-col items-center gap-6">
          <Pill as="link" href="/">
            {t('notFound.backHome')}
            <ArrowRight size={16} aria-hidden="true" />
          </Pill>
          <p className="flex gap-6 text-sm tracking-caps uppercase">
            <TransitionLink href="/projects" className={RECOVERY_LINK}>
              {tHero('cta')}
            </TransitionLink>
            <TransitionLink href="/contact" className={RECOVERY_LINK}>
              {tNav('contact')}
            </TransitionLink>
          </p>
        </div>
      </div>
    </div>
  )
}
