// Decorative illustration only: not derived from any audio and not a result.
const PERIOD = 400
const WIDTH = PERIOD * 4 // two visible periods plus one drift cycle of overlap

function wavePath(amplitude: number, phase: number) {
  const points: string[] = []
  for (let x = 0; x <= WIDTH; x += 8) {
    const y = 60 + amplitude * Math.sin(((x + phase) / PERIOD) * 2 * Math.PI)
    points.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`)
  }
  return points.join(' ')
}

const RIBBONS = [
  { amplitude: 38, phase: 0, stroke: '#171717', width: 2 },
  { amplitude: 26, phase: 90, stroke: '#f16b50', width: 2 },
  { amplitude: 14, phase: 200, stroke: '#77736d', width: 1.5 },
]

export function WaveformRibbon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 120"
      className={className}
      role="img"
      aria-label="Illustration: flowing waveform lines"
      preserveAspectRatio="none"
    >
      <g className="motion-safe:animate-drift" fill="none" strokeLinecap="round">
        {RIBBONS.map((r) => (
          <path key={r.phase} d={wavePath(r.amplitude, r.phase)} stroke={r.stroke} strokeWidth={r.width} />
        ))}
      </g>
    </svg>
  )
}
