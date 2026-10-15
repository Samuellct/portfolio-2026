// The night sky shared by the hero (HeroSky, WebGL) and the starry bands of the
// bar and footer (starBand, SVG). Parameters chosen by the owner on the variant
// bench (audit 2, 2026-10-08).

/** Star inks with their draw weights. */
const SKY_PALETTE: ReadonlyArray<readonly [number, readonly [number, number, number]]> = [
  [0.2, [255, 179, 220]], // pink ink, pastel
  [0.2, [158, 201, 240]], // blue ink, pastel
  [0.2, [255, 244, 232]], // warm white
  [0.14, [255, 72, 176]], // pink ink
  [0.14, [70, 160, 230]], // blue ink, lightened
  [0.07, [255, 232, 0]], // yellow ink
  [0.05, [255, 243, 160]], // yellow ink, pastel
]

/** Stars for a 1440 x 900 viewport, scaled with the area. */
export const SKY_DENSITY = 110 / (1440 * 900)

/** Lifted, slightly warm black: the plate is printed, not a screen void. */
export const SKY_BASE: readonly [number, number, number] = [17, 16, 23]

/** Park-Miller generator: the same seed gives the same sky everywhere. */
export function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function pickSkyColor(t: number) {
  let acc = 0
  for (const [weight, rgb] of SKY_PALETTE) {
    acc += weight
    if (t <= acc) return rgb
  }
  return SKY_PALETTE[0][1]
}
