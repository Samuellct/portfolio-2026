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

/** Night surfaces (hero, navigation band). */
export const SURFACE = {
  /** Hero and navigation band. Also the Tailwind `primary` colour. */
  primary: '#06060e',
  /** Static shell colour: the viewport `themeColor`. */
  shell: '#030308',
} as const

/**
 * Page background written directly to `document.body` or to a page wrapper.
 * Homepage sections take theirs from the scheme (`.section` in globals.css):
 * night for the hero, paper elsewhere.
 */
export const PAGE_BG = RISO.paper

/** Accent inks for canvas, SVG and generated images. */
export const ACCENT = {
  pink: RISO.pink,
  blue: RISO.blue,
  yellow: RISO.yellow,
} as const

/**
 * Project categories: the label stays in the one ink, the glyph sits on a
 * small spot-colour plate (DEC-13h, option C chosen by DEC-18c), so colour
 * helps spotting but never carries the meaning alone. `glyph` is the icon
 * colour on its `plate` (6.78, 3.99 and 5.84:1).
 */
export const CATEGORY = {
  personal: { plate: RISO.pink, glyph: RISO.night },
  academic: { plate: RISO.blue, glyph: RISO.paper },
  internship: { plate: RISO.yellow, glyph: RISO.ink },
} as const

/** Status signals. `success` and `error` clear 4.5:1 on paper. */
export const STATUS = {
  success: '#1b6e37',
  error: '#b3261e',
} as const

/** Third-party brand colours of the logos in the About homelab graph. */
export const BRAND = {
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
