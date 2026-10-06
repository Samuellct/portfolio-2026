/**
 * `rgba()` string from a `#rrggbb` token, for canvas and inline styles that
 * need a translucent variant of a theme colour. Free of React / Next imports
 * so `tailwind.config.ts` can use it too.
 */
export function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}
