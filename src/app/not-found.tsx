import Link from 'next/link'
import type { CSSProperties } from 'react'
import { routing } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'
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

// Inline styles cannot carry states: hover and focus of the pill, as in `Pill`.
const STATES = `
.root404-pill:hover { background-color: ${RISO.ink} !important; color: ${RISO.paper} !important; }
.root404-pill:focus-visible, .root404-link:focus-visible { outline: 2px solid ${RISO.blue}; outline-offset: 2px; }
`

export default async function RootNotFound() {
  const messages = (await import(`../../messages/${routing.defaultLocale}.json`)).default
  const t = messages.common.notFound as Record<'code' | 'title' | 'description' | 'backHome', string>
  const home = `/${routing.defaultLocale}`
  return (
    <html lang={routing.defaultLocale}>
      <body style={{ backgroundColor: RISO.paper, color: RISO.ink, margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {/* React hoists both into the head */}
        <title>{t.title}</title>
        <style>{STATES}</style>
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <p
              aria-hidden="true"
              style={{
                fontSize: 'clamp(2.75rem, 9vw, 6rem)', // text-display
                fontWeight: 900,
                lineHeight: 1,
                margin: 0,
                color: RISO.pinkTitle,
                textShadow: `0.04em 0.035em 0 ${RISO.blue}`,
              }}
            >
              {t.code}
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 0.95, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em', margin: '1.5rem 0 1rem' }}>
              {t.title}
            </h1>
            {/* --muted on paper (globals.css), 5.02:1 */}
            <p style={{ color: 'rgb(24 105 154)', margin: '0 0 2.5rem' }}>{t.description}</p>
            <Link
              href={home}
              className="root404-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
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
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <p style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', margin: '1.5rem 0 0', fontSize: '0.875rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              <Link href={`${home}/projects`} className="root404-link" style={recovery}>
                {messages.hero.cta}
              </Link>
              <Link href={`${home}/contact`} className="root404-link" style={recovery}>
                {messages.nav.contact}
              </Link>
            </p>
          </div>
        </main>
      </body>
    </html>
  )
}
