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
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        line: 'var(--border)',
      },
      fontFamily: { sans: ['"DM Sans"', 'system-ui', 'sans-serif'] },
      borderRadius: { card: '12px' },
      fontSize: {
        display: ['clamp(3rem, 2rem + 6vw, 7rem)', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
        page: ['clamp(2.5rem, 1.75rem + 3.5vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
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
