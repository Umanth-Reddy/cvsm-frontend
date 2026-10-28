import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'

interface Props {
  label: string
  description?: string
  /** Raw cosine similarity, -1 to 1. Shown as a number, never as a percentage. */
  value: number
  className?: string
  /** Extra content under the raw bar, such as the calibrated line. */
  children?: ReactNode
}

export function ScoreBar({ label, description, value, className, children }: Props) {
  const position = ((Math.min(1, Math.max(-1, value)) + 1) / 2) * 100
  const text = value.toFixed(3)

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-medium">{label}</span>
        <span className="text-2xl font-medium tabular-nums">{text}</span>
      </div>
      {description && <p className="text-sm text-muted">{description}</p>}

      <div
        role="meter"
        aria-label={`${label}, cosine similarity`}
        aria-valuemin={-1}
        aria-valuemax={1}
        aria-valuenow={value}
        aria-valuetext={`Cosine similarity ${text}`}
        className="relative mt-4 h-2 rounded-full bg-surface"
      >
        {/* Centre tick marks zero; the dark segment runs from zero to the value. */}
        <span
          className="absolute top-0 h-2 bg-ink"
          style={{ left: `${Math.min(50, position)}%`, width: `${Math.abs(position - 50)}%` }}
        />
        <span className="absolute left-1/2 top-[-4px] h-4 w-px bg-muted-soft" />
        <span
          className={cx('absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-accent')}
          style={{ left: `${position}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs tabular-nums text-muted" aria-hidden="true">
        <span>-1</span>
        <span>0</span>
        <span>1</span>
      </div>
      <p className="eyebrow mt-1 text-center">cosine similarity</p>
      {children}
    </div>
  )
}
