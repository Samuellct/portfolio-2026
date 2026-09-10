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
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        body: ['var(--font-syne)', 'sans-serif'],
        'display-accent': ['var(--font-unbounded)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        fraunces: ['var(--font-fraunces)', 'serif'],
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
            '--tw-prose-links': '#00f0ff',
            '--tw-prose-bold': '#ffffff',
            '--tw-prose-counters': 'rgba(255, 255, 255, 0.5)',
            '--tw-prose-bullets': 'rgba(255, 255, 255, 0.4)',
            '--tw-prose-hr': 'rgba(255, 255, 255, 0.1)',
            '--tw-prose-quotes': 'rgba(255, 255, 255, 0.8)',
            '--tw-prose-quote-borders': '#a855f7',
            '--tw-prose-captions': 'rgba(255, 255, 255, 0.5)',
            '--tw-prose-code': '#00f0ff',
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
