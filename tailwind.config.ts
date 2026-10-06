import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import { ACCENT, BRAND, ILLUSTRATION, RISO, SECTION_BG, STATUS, SURFACE } from './src/lib/theme'
import { withAlpha } from './src/lib/color'

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
        // Scheme-driven colours (globals.css): `white` is the foreground and
        // `black` the surface of the current scheme, so the existing
        // `text-white/..`, `border-white/..` and `bg-black` classes follow
        // paper (ink on paper) or night (white on night) without rewriting.
        white: 'rgb(var(--fg) / <alpha-value>)',
        black: 'rgb(var(--surface) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        snow: '#ffffff',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          line: 'rgb(var(--accent-line) / <alpha-value>)',
        },
        riso: RISO,
        brand: BRAND,
        illustration: ILLUSTRATION,
        status: STATUS,
        section: SECTION_BG,
        // Secondary text (AUDIT-029, COL-02), solid per scheme. `muted` clears
        // WCAG AA (>= 4.5:1) on paper and night; `subtle` is for large or
        // non-interactive text only; `faint` is decorative / rest-state only
        // (documented AUDIT-029 derogation for the fullscreen menu links).
        muted: 'var(--muted)',
        subtle: 'var(--subtle)',
        faint: 'rgb(var(--fg) / 0.2)',
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
      boxShadow: {
        'glow-accent': `0 0 25px ${withAlpha(ACCENT.pink, 0.2)}`,
        'glow-accent-strong': `0 0 30px ${withAlpha(ACCENT.pink, 0.25)}`,
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
            '--tw-prose-body': 'var(--muted)',
            '--tw-prose-headings': 'rgb(var(--fg))',
            '--tw-prose-lead': 'var(--muted)',
            '--tw-prose-links': 'rgb(var(--accent))',
            '--tw-prose-bold': 'rgb(var(--fg))',
            '--tw-prose-counters': 'rgb(var(--fg) / 0.5)',
            '--tw-prose-bullets': 'rgb(var(--fg) / 0.4)',
            '--tw-prose-hr': 'rgb(var(--fg) / 0.1)',
            '--tw-prose-quotes': 'rgb(var(--fg))',
            '--tw-prose-quote-borders': ACCENT.pink,
            '--tw-prose-captions': 'var(--muted)',
            '--tw-prose-code': 'rgb(var(--accent))',
            '--tw-prose-pre-code': 'rgb(var(--fg))',
            '--tw-prose-pre-bg': 'rgb(var(--fg) / 0.05)',
            '--tw-prose-th-borders': 'rgb(var(--fg) / 0.2)',
            '--tw-prose-td-borders': 'rgb(var(--fg) / 0.1)',
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config
