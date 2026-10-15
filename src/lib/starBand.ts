import { SKY_DENSITY, pickSkyColor, seeded } from '@/lib/sky'

// The starry night bands of the bar and footer (V6-NAV-01, P10-D1): a still
// frame of the hero's sky printed as an SVG tile, with no canvas and no
// runtime cost. Density A, chosen by the owner on the mockup
// (`maquettes/bandeaux-etoiles.html`): the hero's density x1.5. Halos and
// crosses sit whole in the free strips above and below the text rows; only
// faint pinpricks fall behind the labels.

interface BandOptions {
  width: number
  height: number
  seed: number
  /** Rows [top, bottom] in px where text sits, or a rule runs. */
  keep: Array<[number, number]>
}

const DENSITY_FACTOR = 1.5
// Halftone screen angle of the hero halos (15 degrees).
const COS = Math.cos(Math.PI / 12)
const SIN = Math.sin(Math.PI / 12)

const n = (v: number) => v.toFixed(1)
const ink = (c: readonly number[], a: number) => `rgb(${c[0]} ${c[1]} ${c[2]} / ${a.toFixed(2)})`

function starBandSvg({ width, height, seed, keep }: BandOptions) {
  const rand = seeded(seed)
  const target = Math.max(6, Math.round(width * height * SKY_DENSITY * DENSITY_FACTOR))
  const inKeep = (y: number) => keep.some(([a, b]) => y > a && y < b)

  // Free strips: the band minus the kept rows, 2 px from the top, 4 px from the bottom.
  const free: Array<[number, number]> = []
  let lo = 2
  for (const [a, b] of keep) {
    if (a > lo) free.push([lo, a])
    lo = Math.max(lo, b)
  }
  if (height - 4 > lo) free.push([lo, height - 4])

  let out = ''
  for (let i = 0; i < target; i++) {
    let x = rand() * width
    let y = rand() * height
    const roll = rand()
    const soft = rand()
    const col = pickSkyColor(rand())
    const pick = rand()
    let kind = roll < 0.06 ? 2 : roll < 0.3 ? 1 : 0
    const R = kind === 2 ? 6 + soft * 3 : 4 + soft * 4
    const L = kind === 2 ? R * 1.4 : R
    if (kind) {
      const fits = free.filter(([a, b]) => b - a >= 2 * L)
      if (fits.length === 0) kind = 0
      else {
        const [a, b] = fits[Math.floor(pick * fits.length)]
        y = a + L + rand() * (b - a - 2 * L)
        // Clear of the tile seams, so a repeated tile never cuts a halo.
        x = L + (x / width) * (width - 2 * L)
      }
    }

    if (kind === 0) {
      const alpha = (0.35 + soft * 0.4) * (inKeep(y) ? 0.6 : 1)
      out += `<circle cx="${n(x)}" cy="${n(y)}" r="${(0.6 + soft * 0.8).toFixed(2)}" fill="${ink(col, alpha)}"/>`
      continue
    }
    // Halftone halo: dots on the rotated screen, shrinking away from the core.
    for (let u = -R; u <= R; u += 3) {
      for (let v = -R; v <= R; v += 3) {
        const dx = u * COS - v * SIN
        const dy = u * SIN + v * COS
        const d = Math.hypot(dx, dy) / R
        if (d >= 1) continue
        const r = 1.05 * Math.pow(1 - d, 1.3)
        if (r < 0.25) continue
        out += `<circle cx="${n(x + dx)}" cy="${n(y + dy)}" r="${r.toFixed(2)}" fill="${ink(col, 0.75)}"/>`
      }
    }
    out += `<circle cx="${n(x)}" cy="${n(y)}" r="${kind === 2 ? 1.8 : 1.4}" fill="${ink([255, 250, 242], 0.95)}"/>`
    if (kind === 2) {
      out += `<path d="M${n(x - L)} ${n(y)}H${n(x + L)}M${n(x)} ${n(y - L)}V${n(y + L)}" stroke="${ink(col, 0.7)}" stroke-width="0.8"/>`
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${out}</svg>`
}

const url = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`

/** Bar: 80 px, labels between 26 and 54 px, double rule at the bottom. */
export const BAR_SKY = url(starBandSvg({ width: 1600, height: 80, seed: 7, keep: [[26, 54]] }))

/** Footer, one tile per layout; the rows match the footer's text (top rule kept clear). */
export const FOOTER_SKY = {
  desktop: url(starBandSvg({ width: 1600, height: 96, seed: 11, keep: [[0, 8], [24, 70]] })),
  mobile: url(starBandSvg({ width: 800, height: 240, seed: 13, keep: [[0, 8], [30, 210]] })),
}
