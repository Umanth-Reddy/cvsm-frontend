import type { CalibrationReference } from '../../api/types'

interface Props {
  label: string
  /** Mean-centred cosine similarity of this pair. */
  value: number
  reference: CalibrationReference
}

/** Second line under the raw bar: the centred score against two reference markers. The axis is fitted to the data. */
export function CalibrationLine({ label, value, reference }: Props) {
  const { diff_artist_median: diff, same_artist_median: same } = reference
  const pad = 0.1 * Math.max(Math.abs(same - diff), 0.05)
  const lo = Math.min(value, diff, same) - pad
  const hi = Math.max(value, diff, same) + pad
  const at = (v: number) => `${((v - lo) / (hi - lo)) * 100}%`
  const text = value.toFixed(3)

  return (
    <div className="mt-6 border-t border-line pt-4">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium">Mean-centred</span>
        <span className="text-lg font-medium tabular-nums">{text}</span>
      </div>

      <div className="relative mx-6 mb-16 mt-16">
        <div
          role="meter"
          aria-label={`${label}, mean-centred cosine similarity`}
          aria-valuemin={lo}
          aria-valuemax={hi}
          aria-valuenow={value}
          aria-valuetext={`Mean-centred cosine ${text}; typical different-artist pair ${diff.toFixed(3)}; typical same-artist pair ${same.toFixed(3)}`}
          className="relative h-2 rounded-full bg-surface"
        >
          <span
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-accent"
            style={{ left: at(value) }}
          />
        </div>
        <span className="absolute top-[-6px] h-5 w-px bg-ink" style={{ left: at(diff) }} />
        <span className="absolute top-[-6px] h-5 w-px bg-ink" style={{ left: at(same) }} />
        <span
          className="absolute bottom-full mb-1 w-36 -translate-x-1/2 text-center text-xs leading-tight text-muted"
          style={{ left: at(Math.min(diff, same)) }}
        >
          {diff <= same ? 'typical different-artist pair' : 'typical same-artist pair'}
          <br />
          <span className="tabular-nums">{Math.min(diff, same).toFixed(3)}</span>
        </span>
        <span
          className="absolute top-full mt-2 w-36 -translate-x-1/2 text-center text-xs leading-tight text-muted"
          style={{ left: at(Math.max(diff, same)) }}
        >
          {diff <= same ? 'typical same-artist pair' : 'typical different-artist pair'}
          <br />
          <span className="tabular-nums">{Math.max(diff, same).toFixed(3)}</span>
        </span>
      </div>

      <p className="text-xs text-muted">
        Based on {reference.n_clips} clips from {reference.n_artists} artists; not a universal scale.
      </p>
    </div>
  )
}
