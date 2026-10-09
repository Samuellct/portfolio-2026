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
 * - Text colours that depend on the surface (paper or night) are CSS variables
 *   set in `globals.css` (`:root` for paper, `.scheme-night` for night).
 */

/**
 * Risograph print run: two spot inks over paper, one night plate for the hero.
 * Contrast on paper (WCAG): ink 6.15:1 (body text), blue 3.99:1 (large text,
 * rules, frames), pinkTitle 3.04:1 (large titles only), pink 2.60:1 (fills,
 * pills, misregistration, and text on night only: 6.36:1).
 */
export const RISO = {
  paper: '#f1ebe0',
  ink: '#005a92',
  blue: '#0078bf',
  pink: '#ff48b0',
  pinkTitle: '#ff159a',
  yellow: '#ffe800',
  night: '#0b0b10',
} as const

/** Night surfaces (hero, landing, navigation band). */
export const SURFACE = {
  /** Hero and navigation band. Also the Tailwind `primary` DEFAULT. */
  primary: '#06060e',
  /** Slightly lifted primary (Tailwind `primary.light`). */
  primaryLight: '#0a0a18',
  /** Static shell used by server-rendered surfaces: root not-found, viewport
   *  `themeColor`, and the OG / Twitter image generators. */
  shell: '#030308',
} as const

/**
 * Page background colours written directly to `document.body` or to a page
 * wrapper. Homepage sections take theirs from the scheme (`.section` in
 * globals.css): night for the hero, paper elsewhere.
 */
export const SECTION_BG = {
  aboutIntro: RISO.paper,
  aboutExperience: RISO.paper,
  aboutStack: RISO.paper,
  aboutEducation: RISO.paper,
  aboutInterests: RISO.paper,
  listing: RISO.paper,
  projectDetail: RISO.paper,
} as const

/** Accent inks for canvas, SVG and generated images. */
export const ACCENT = {
  pink: RISO.pink,
  blue: RISO.blue,
  yellow: RISO.yellow,
} as const

/**
 * Project categories share one ink and are told apart by a glyph and their
 * label (DEC-13h). `muted` is the paper shade behind the home project list.
 */
export const CATEGORY = {
  personal: { accent: RISO.ink, muted: '#e8dfcf' },
  academic: { accent: RISO.ink, muted: '#e8dfcf' },
  internship: { accent: RISO.ink, muted: '#e8dfcf' },
} as const

/** Status signals. `success` and `error` clear 4.5:1 on paper. */
export const STATUS = {
  success: '#1b6e37',
  error: '#b3261e',
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

/** Palettes of the About page illustrations (AUDIT-034), recoloured to the inks. */
export const ILLUSTRATION = {
  cinema: RISO.pink,
  cinemaDeep: RISO.paper,
  mountain: RISO.blue,
  mountainLow: RISO.ink,
  homelab: RISO.blue,
  homelabNode: RISO.paper,
  overprint: RISO.pink,
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
