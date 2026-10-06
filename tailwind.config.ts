import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import { ACCENT, SECTION_BG, SURFACE } from './src/lib/theme'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    // AUDIT-088: TransitionContext.tsx lives here and carries the page
    // transition overlay's `z-[200]` class, which this content list did not
    // scan. Tailwind silently dropped the rule, so the overlay rendered with
    // `z-index: auto` and the "curtain" sat behind the page it should cover.
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
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
        display: ['var(--font-schibsted)', 'sans-serif'],
        body: ['var(--font-schibsted)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        fraunces: ['var(--font-fraunces)', 'serif'],
      },
      // Role type scale (TYPO-03, TYPO-04): six steps, body text stays at the
      // 1rem default. `meta` is the floor for informative text (12px).
      // `ghost-*` are decorative watermarks, outside the reading scale.
      fontSize: {
        meta: ['0.75rem', { lineHeight: '1.4' }],
        lead: 'clamp(1.125rem, 2.2vw, 1.5rem)',
        title: 'clamp(1.25rem, 2vw, 1.5rem)',
        heading: 'clamp(2rem, 4.5vw, 3.5rem)',
        page: 'clamp(2.5rem, 6.5vw, 5rem)',
        display: 'clamp(2.75rem, 9vw, 6rem)',
        'ghost-15': '15vw',
        'ghost-20': '20vw',
        'ghost-25': '25vw',
        'ghost-35': '35vw',
        'ghost-40': '40vw',
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
