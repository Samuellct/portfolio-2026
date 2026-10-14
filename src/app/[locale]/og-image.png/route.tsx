import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { RISO } from '@/lib/theme'
import { routing } from '@/i18n/routing'
import { toLocale } from '@/i18n/locale'
import { getShareImage, SHARE_IMAGE_SIZE } from '@/lib/shareImage'

// Share image per locale (Open Graph and Twitter), prerendered at build time:
// rendering it on request would cost Worker CPU, and the fonts are read from
// disk, which only the build has. Unknown locales are not generated.
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const FONT_DIR = join(process.cwd(), 'src/assets/fonts')

// Halftone patch: dots on a square grid, their radius shrinking with the
// distance from the corner they grow out of (the site's printed screen).
function Halftone({ width, height, corner }: { width: number; height: number; corner: 'top-right' | 'bottom-left' }) {
  const step = 18
  const maxRadius = step * 0.46
  const reach = Math.hypot(width, height) * 0.8
  const originX = corner === 'top-right' ? width : 0
  const originY = corner === 'top-right' ? 0 : height
  const dots: { cx: number; cy: number; r: number }[] = []
  for (let cy = step / 2; cy < height; cy += step) {
    for (let cx = step / 2; cx < width; cx += step) {
      const r = maxRadius * (1 - Math.hypot(cx - originX, cy - originY) / reach)
      if (r > 0.8) dots.push({ cx, cy, r })
    }
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {dots.map((d) => (
        <circle key={`${d.cx}-${d.cy}`} cx={d.cx} cy={d.cy} r={d.r} fill={RISO.pink} />
      ))}
    </svg>
  )
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { subtitle } = await getShareImage(toLocale((await params).locale))
  const [regular, black] = await Promise.all([
    readFile(join(FONT_DIR, 'schibsted-grotesk-latin-400-normal.ttf')),
    readFile(join(FONT_DIR, 'schibsted-grotesk-latin-900-normal.ttf')),
  ])
  const nameSize = 104

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: RISO.paper,
          fontFamily: 'Schibsted Grotesk',
        }}
      >
        <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex' }}>
          <Halftone width={340} height={220} corner="top-right" />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, display: 'flex' }}>
          <Halftone width={220} height={160} corner="bottom-left" />
        </div>

        <div
          style={{
            fontSize: nameSize,
            fontWeight: 900,
            lineHeight: 0.95,
            textTransform: 'uppercase',
            color: RISO.pinkTitle,
            // Misregistration, as `.misregister` in globals.css (0.04em 0.035em)
            textShadow: `${nameSize * 0.04}px ${nameSize * 0.035}px 0 ${RISO.blue}`,
          }}
        >
          Samuel Lecomte
        </div>
        <div style={{ marginTop: 36, fontSize: 36, fontWeight: 400, color: RISO.ink }}>
          {subtitle}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 44,
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: '0.15em',
            color: RISO.ink,
          }}
        >
          samuel-lecomte.fr
        </div>
      </div>
    ),
    {
      ...SHARE_IMAGE_SIZE,
      fonts: [
        { name: 'Schibsted Grotesk', data: regular, style: 'normal', weight: 400 },
        { name: 'Schibsted Grotesk', data: black, style: 'normal', weight: 900 },
      ],
    }
  )
}
