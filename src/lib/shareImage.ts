import type { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 }

/**
 * Text and metadata of the per-locale share image ([locale]/og-image.png).
 * The subtitle is the job title of the JSON-LD Person, without its closing
 * full stop.
 * Every layout that defines `openGraph` lists it, since a child layout's
 * `openGraph` replaces its parent's, image included (V6-COD-33).
 */
export async function getShareImage(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'metadata' })
  const subtitle = t('jsonLd.jobTitle').replace(/\.$/, '')
  return {
    subtitle,
    image: {
      url: `/${locale}/og-image.png`,
      alt: `Samuel Lecomte - ${subtitle}`,
      type: 'image/png',
      ...SHARE_IMAGE_SIZE,
    },
  }
}
