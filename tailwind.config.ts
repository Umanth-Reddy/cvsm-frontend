import type { Config } from 'tailwindcss'

// Colour values live in CSS variables (src/index.css) so there is one source of truth.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        ink: 'var(--text)',
        surface: 'var(--surface)',
        muted: 'var(--muted)',
        'muted-soft': 'var(--muted-soft)',
        card: 'var(--card)',
        accent: 'var(--accent)',
        'accent-ink': 'var(--accent-ink)',
        'accent-2': 'var(--accent-2)',
        line: 'var(--border)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: { card: '1.5rem' },
      fontSize: {
        display: ['clamp(2.5rem, 1.5rem + 3.6vw, 4.5rem)', { lineHeight: '1.06', letterSpacing: '-0.035em' }],
        page: ['clamp(2.25rem, 1.5rem + 2.6vw, 3.5rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
      },
      keyframes: {
        drift: { to: { transform: 'translateX(-400px)' } },
        spin: { to: { transform: 'rotate(360deg)' } },
        breathe: { '0%,100%': { opacity: '0.55' }, '50%': { opacity: '1' } },
      },
      animation: {
        drift: 'drift 14s linear infinite',
        'spin-slow': 'spin 24s linear infinite',
        breathe: 'breathe 4s ease-in-out infinite',
      },
    },
  },
} satisfies Config
