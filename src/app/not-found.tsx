import Link from 'next/link'
import type { CSSProperties } from 'react'
import { routing } from '@/i18n/routing'
import { RISO, SURFACE } from '@/lib/theme'

// Paths without a locale prefix: no next-intl context here, so the default
// locale's strings are read straight from its message file, matching `lang`.
// Outside the app layout (no Tailwind, no fonts), so the paper 404 of the
// localized page is written inline from the theme tokens (V6-DES-03, P11-D3).
const recovery: CSSProperties = {
  color: RISO.ink,
  textDecoration: 'underline',
  textUnderlineOffset: '4px',
  padding: '0.75rem 0',
}

export default async function RootNotFound() {
  const messages = (await import(`../../messages/${routing.defaultLocale}.json`)).default
  const t = messages.common.notFound as Record<'code' | 'title' | 'description' | 'backHome', string>
  const home = `/${routing.defaultLocale}`
  return (
    <html lang={routing.defaultLocale}>
      <body style={{ backgroundColor: RISO.paper, color: RISO.ink, margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <p
              aria-hidden="true"
              style={{
                fontSize: 'clamp(4.5rem, 18vw, 8rem)',
                fontWeight: 900,
                lineHeight: 1,
                margin: 0,
                color: RISO.pinkTitle,
                textShadow: `0.04em 0.035em 0 ${RISO.blue}`,
              }}
            >
              {t.code}
            </p>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em', margin: '1.5rem 0 1rem' }}>
              {t.title}
            </h1>
            {/* --muted on paper (globals.css), 5.02:1 */}
            <p style={{ color: 'rgb(24 105 154)', margin: '0 0 2.5rem' }}>{t.description}</p>
            <Link
              href={home}
              style={{
                display: 'inline-block',
                padding: '0.875rem 1.75rem',
                borderRadius: '999px',
                backgroundColor: RISO.pink,
                color: SURFACE.primary,
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              {t.backHome}
            </Link>
            <p style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', margin: '1.5rem 0 0', fontSize: '0.875rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              <Link href={`${home}/projects`} style={recovery}>
                {messages.hero.cta}
              </Link>
              <Link href={`${home}/contact`} style={recovery}>
                {messages.nav.contact}
              </Link>
            </p>
          </div>
        </main>
      </body>
    </html>
  )
}
