import Link from 'next/link'
import { routing } from '@/i18n/routing'
import { ACCENT, SURFACE } from '@/lib/theme'

// Paths without a locale prefix: no next-intl context here, so the default
// locale's strings are read straight from its message file, matching `lang`.
export default async function RootNotFound() {
  const { common } = (await import(`../../messages/${routing.defaultLocale}.json`)).default
  const t = common.notFound as Record<'code' | 'title' | 'description' | 'backHome', string>
  return (
    <html lang={routing.defaultLocale}>
      <body style={{ backgroundColor: SURFACE.shell, color: '#fff', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h1 style={{ fontSize: '6rem', opacity: 0.1, margin: 0 }}>{t.code}</h1>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', marginTop: '-1rem' }}>{t.title}</h2>
            <p style={{ opacity: 0.5, marginBottom: '2rem' }}>
              {t.description}
            </p>
            <Link
              href={`/${routing.defaultLocale}`}
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: ACCENT.pink,
                color: '#000',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
              }}
            >
              {t.backHome}
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
