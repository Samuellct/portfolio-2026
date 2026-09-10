import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import { ACCENT, SECTION_BG, SURFACE } from './src/lib/theme'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: SURFACE.primary,
          light: SURFACE.primaryLight,
        },
        shell: SURFACE.shell,
        accent: {
          cyan: ACCENT.cyan,
          purple: ACCENT.purple,
          pink: ACCENT.pink,
          amber: ACCENT.amber,
        },
        section: SECTION_BG,
        // Text grey scale (AUDIT-029). `muted` clears WCAG AA (>= 4.5:1) on
        // every section background; `subtle` is for large or non-interactive
        // text only; `faint` is decorative / rest-state only (documented
        // AUDIT-029 derogation for the fullscreen menu links at rest).
        muted: 'rgb(255 255 255 / 0.62)',
        subtle: 'rgb(255 255 255 / 0.45)',
        faint: 'rgb(255 255 255 / 0.20)',
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        body: ['var(--font-syne)', 'sans-serif'],
        'display-accent': ['var(--font-unbounded)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        fraunces: ['var(--font-fraunces)', 'serif'],
      },
      // Named type scale (AUDIT-047). Each token preserves the exact computed
      // value of the ad-hoc utilities it replaces; near-duplicate values are
      // kept distinct here and flagged for unification in Phase 12.
      fontSize: {
        'micro-2xs': '0.58rem',
        'micro-xs': '0.6rem',
        'micro-sm': '0.65rem',
        'micro-11': '11px',
        stat: '54px',
        'ghost-15': '15vw',
        'ghost-20': '20vw',
        'ghost-25': '25vw',
        'ghost-35': '35vw',
        'ghost-40': '40vw',
        lead: 'clamp(1.1rem,2.5vw,1.8rem)',
        'display-hero': 'clamp(1.5rem, 9vw, 8rem)',
        'display-project': 'clamp(1.8rem,6vw,5rem)',
        'display-page': 'clamp(2rem,5vw,3.5rem)',
        'display-about-heading': 'clamp(2.5rem,7vw,5rem)',
        'display-menu': 'clamp(2.5rem,8vw,6rem)',
        'display-section': 'clamp(3rem,10vw,7rem)',
        'display-contact': 'clamp(3rem,10vw,6rem)',
        'display-listing': 'clamp(3rem,10vw,8rem)',
        'display-404': 'clamp(6rem,20vw,15rem)',
      },
      letterSpacing: {
        label: '0.1em',
        caps: '0.15em',
        'caps-wide': '0.2em',
        'hero-caps': '0.22em',
        hint: '0.25em',
        'menu-label': '0.3em',
        'hero-tight': '-0.03em',
      },
      lineHeight: {
        'display-tight': '0.85',
        display: '0.9',
        hero: '0.92',
        'display-snug': '0.95',
        'display-loose': '1.05',
        heading: '1.1',
      },
      borderRadius: {
        // Sharp angles are the signature (AUDIT-080): the bare `rounded`
        // utility resolves to 0. `code` keeps the inline-code chip at its
        // historical radius; `rounded-sm` / `rounded-full` usages remain and
        // are flagged for arbitration in Phase 9 / 12.
        DEFAULT: '0',
        code: '0.25rem',
      },
      animation: {
        'scroll-line': 'scrollLine 1.5s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scrollLine: {
          '0%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgba(255, 255, 255, 0.7)',
            '--tw-prose-headings': '#ffffff',
            '--tw-prose-lead': 'rgba(255, 255, 255, 0.6)',
            '--tw-prose-links': ACCENT.cyan,
            '--tw-prose-bold': '#ffffff',
            '--tw-prose-counters': 'rgba(255, 255, 255, 0.5)',
            '--tw-prose-bullets': 'rgba(255, 255, 255, 0.4)',
            '--tw-prose-hr': 'rgba(255, 255, 255, 0.1)',
            '--tw-prose-quotes': 'rgba(255, 255, 255, 0.8)',
            '--tw-prose-quote-borders': ACCENT.purple,
            '--tw-prose-captions': 'rgba(255, 255, 255, 0.5)',
            '--tw-prose-code': ACCENT.cyan,
            '--tw-prose-pre-code': 'rgba(255, 255, 255, 0.9)',
            '--tw-prose-pre-bg': 'rgba(255, 255, 255, 0.05)',
            '--tw-prose-th-borders': 'rgba(255, 255, 255, 0.2)',
            '--tw-prose-td-borders': 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config
