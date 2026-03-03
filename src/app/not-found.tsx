import Link from 'next/link'

export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#030308', color: '#fff', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h1 style={{ fontSize: '6rem', opacity: 0.1, margin: 0 }}>404</h1>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', marginTop: '-1rem' }}>Page Not Found</h2>
            <p style={{ opacity: 0.5, marginBottom: '2rem' }}>
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
              href="/en"
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: '#00f0ff',
                color: '#000',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
