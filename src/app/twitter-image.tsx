import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Samuel Lecomte - Graduate in Physics and Data Science'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#030308',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #0a0a1a 0%, transparent 50%), radial-gradient(circle at 75% 75%, #1a0a2e 0%, transparent 50%)',
        }}
      >
        {/* test nouvelle deco */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#00f0ff',
            boxShadow: '0 0 20px #00f0ff',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30%',
            right: '15%',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#a855f7',
            boxShadow: '0 0 15px #a855f7',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '25%',
            left: '20%',
            width: 5,
            height: 5,
            borderRadius: '50%',
            backgroundColor: '#f472b6',
            boxShadow: '0 0 12px #f472b6',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '35%',
            right: '25%',
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#00f0ff',
            boxShadow: '0 0 18px #00f0ff',
          }}
        />

        {/* Main */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          {/* Name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.05em',
              marginBottom: 16,
            }}
          >
            Samuel Lecomte
          </div>

          {/* line */}
          <div
            style={{
              width: 120,
              height: 2,
              background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)',
              marginBottom: 24,
            }}
          />

          {/* Title */}
          <div
            style={{
              fontSize: 32,
              color: '#00f0ff',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Particle Physics
          </div>
          
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.6)',
              letterSpacing: '0.05em',
            }}
          >
            & Data Science
          </div>
        </div>

        {/* Bottom deco */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 40,
              height: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}
          />
          <div
            style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Portfolio 2026
          </div>
          <div
            style={{
              width: 40,
              height: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
