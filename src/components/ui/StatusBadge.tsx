import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'

const tones = {
  neutral: 'border border-line bg-bg text-ink',
  highlight: 'bg-accent-2 text-ink',
  accent: 'bg-accent text-ink',
  inverse: 'bg-ink text-bg',
}

export function StatusBadge({ tone = 'neutral', children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return (
    <span className={cx('inline-flex items-center rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.1em]', tones[tone])}>
      {children}
    </span>
  )
}
