/**
 * Single source of truth for the design system's colour tokens.
 *
 * This module is imported both by application code and by `tailwind.config.ts`
 * (resolved through jiti), so it must stay free of any React / Next / node
 * imports and export plain serialisable constants only.
 *
 * Scope notes:
 * - Brand colours for technologies live in `src/lib/technologies.ts` (AUDIT-011).
 * - Translucent variants are derived with `withAlpha` (`src/lib/color.ts`).
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
  /** Page transition curtain. */
  curtain: '#1a0a2e',
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
  aboutIntro: '#050e20',
  aboutExperience: '#0a1024',
  aboutStack: '#051525',
  aboutEducation: '#0e200e',
  aboutInterests: '#200a0a',
  listing: '#0c0c1e',
  projectDetail: '#080810',
} as const

/** Accent palette. Mirrors the Tailwind `accent` colours. */
export const ACCENT = {
  cyan: '#00f0ff',
  purple: '#a855f7',
  pink: '#f472b6',
  amber: '#d9713a',
  green: '#10b981',
} as const

/** Project category colours: label tint and muted card fill (`projects.ts`). */
export const CATEGORY = {
  personal: { accent: ACCENT.cyan, muted: '#1a4a5c' },
  academic: { accent: ACCENT.purple, muted: '#3d2a5c' },
  internship: { accent: ACCENT.green, muted: '#1a4a3d' },
} as const

/** Status signals. */
export const STATUS = {
  available: '#22c55e',
} as const

/** Third-party brand colours (logos and their hover states). */
export const BRAND = {
  linkedin: '#0077b5',
  linkedinAlt: '#0e76a8',
  github: '#fafbfc',
  githubButton: '#238636',
  githubButtonHover: '#2ea043',
  docker: '#2496ed',
  nextcloud: '#0082c9',
  proxmox: '#e57000',
  jellyfin: '#00a4dc',
  truenas: '#0095d5',
} as const

/** Palettes of the About page illustrations (AUDIT-034). */
export const ILLUSTRATION = {
  cinema: '#e5737d',
  cinemaDeep: '#1a0810',
  mountain: ACCENT.cyan,
  mountainLow: '#00c8ff',
  mountainHigh: '#66f7ff',
  homelab: '#e57000',
  homelabNode: '#1a1a2e',
} as const

/** Fixed text colours chosen against a computed background. */
export const CONTRAST_TEXT = {
  onLight: '#000000',
  onDark: '#ffffff',
} as const

/** Decorative-only colours used by the OG / Twitter image generators. */
export const OG_DECOR = {
  glowBlue: '#0a0a1a',
  glowPurple: '#1a0a2e',
} as const

export type SectionBgName = keyof typeof SECTION_BG
