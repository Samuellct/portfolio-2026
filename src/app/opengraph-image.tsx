import { ImageResponse } from 'next/og'
import { ACCENT, OG_DECOR, SURFACE } from '@/lib/theme'

// No `runtime = 'edge'`: unsupported by the Cloudflare Workers adapter
// (@opennextjs/cloudflare); ImageResponse runs fine on the default runtime.
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
          backgroundColor: SURFACE.shell,
          backgroundImage: `radial-gradient(circle at 25% 25%, ${OG_DECOR.glowBlue} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${OG_DECOR.glowPurple} 0%, transparent 50%)`,
        }}
      >
        {/* deco */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: ACCENT.cyan,
            boxShadow: `0 0 20px ${ACCENT.cyan}`,
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
            backgroundColor: ACCENT.purple,
            boxShadow: `0 0 15px ${ACCENT.purple}`,
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
            backgroundColor: ACCENT.pink,
            boxShadow: `0 0 12px ${ACCENT.pink}`,
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
            backgroundColor: ACCENT.cyan,
            boxShadow: `0 0 18px ${ACCENT.cyan}`,
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

          {/* Divider line */}
          <div
            style={{
              width: 120,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${ACCENT.cyan}, transparent)`,
              marginBottom: 24,
            }}
          />

          {/* Title */}
          <div
            style={{
              fontSize: 32,
              color: ACCENT.cyan,
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

        {/* Bottom decoration */}
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
