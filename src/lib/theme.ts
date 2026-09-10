/**
 * Single source of truth for the design system's colour tokens.
 *
 * This module is imported both by application code and by `tailwind.config.ts`
 * (resolved through jiti), so it must stay free of any React / Next / node
 * imports and export plain serialisable constants only.
 *
 * Scope notes:
 * - Brand colours for technologies live in `src/lib/technologies.ts` (AUDIT-011).
 * - SVG illustration palettes (MountainProfile, NetworkGraph, CinemaSpotlight)
 *   are out of scope here (AUDIT-034). Where a value below is also duplicated
 *   inside one of those SVGs, a comment flags it so the two stay in sync.
 */

/** Near-black surfaces. Four historically distinct values, kept as-is. */
export const SURFACE = {
  /** App shell / hero. Also the Tailwind `primary` DEFAULT and the CSS `--bg-color`. */
  primary: '#06060e',
  /** Slightly lifted primary (Tailwind `primary.light`). */
  primaryLight: '#0a0a18',
  /** Static shell used by server-rendered surfaces: root not-found, viewport
   *  `themeColor`, and the OG / Twitter image generators. */
  shell: '#030308',
} as const

/**
 * Per-section background colours driven by GSAP (homepage) or written directly
 * to `document.body` / a page wrapper. GSAP tweens the computed `backgroundColor`
 * from inline styles, so these must remain plain constants (a CSS variable would
 * interpolate differently); they are centralised here, not moved into CSS.
 */
export const SECTION_BG = {
  hero: '#06060e',
  about: '#081828',
  projects: '#1c1008',
  contact: '#081c10',
  aboutIntro: '#050e20', // also CinemaSpotlight.tsx SVG fill (AUDIT-034)
  aboutStack: '#051525',
  aboutEducation: '#0e200e',
  aboutInterests: '#200a0a', // also MountainProfile.tsx SVG gradient (AUDIT-034)
  listing: '#0c0c1e',
  projectDetail: '#080810',
} as const

/** Accent palette. Mirrors the Tailwind `accent` colours. */
export const ACCENT = {
  cyan: '#00f0ff',
  purple: '#a855f7',
  pink: '#f472b6',
  amber: '#d9713a',
} as const

/** Decorative-only colours used by the OG / Twitter image generators. */
export const OG_DECOR = {
  glowBlue: '#0a0a1a',
  glowPurple: '#1a0a2e',
} as const

export type SectionBgName = keyof typeof SECTION_BG
