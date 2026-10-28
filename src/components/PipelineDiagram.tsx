// Training stages are research context; the inference lane mirrors cvsm-demo/embedder.py step by step.
const TRAINING = [
  { title: 'Vocal excerpt', detail: ['a short clip of', 'singing voice'] },
  { title: 'Mixture', detail: ['music that contains', 'that vocal'] },
  { title: 'Encoder', detail: ['EfficientNet-B0'] },
  { title: 'Contrastive', detail: ['objective', 'pairs the two'] },
]

const INFERENCE = [
  { title: 'Audio file', detail: ['first 30 s'] },
  { title: '16 kHz mono', detail: ['resampled'] },
  { title: '5 s chunks', detail: ['each L2-', 'normalised'] },
  { title: '1 s windows', detail: ['log-mel,', '64 bands'] },
  { title: 'Encoder', detail: ['EfficientNet-B0,', '1280-d'] },
  { title: 'Mean', detail: ['over windows,', 'L2-normalised'] },
  { title: 'Cosine', detail: ['of two clip', 'embeddings'] },
]

const BOX_W = 120
const STEP = 140

function Box({ x, y, title, detail, live }: { x: number; y: number; title: string; detail: string[]; live: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={BOX_W}
        height={80}
        rx={12}
        className={live ? 'fill-accent-2 stroke-ink' : 'fill-surface stroke-muted-soft'}
        strokeDasharray={live ? undefined : '5 4'}
      />
      <text x={x + BOX_W / 2} y={y + 30} textAnchor="middle" className="fill-ink text-[13px] font-medium">
        {title}
      </text>
      {detail.map((line, i) => (
        <text key={line} x={x + BOX_W / 2} y={y + 49 + i * 15} textAnchor="middle" className="fill-muted text-[11px]">
          {line}
        </text>
      ))}
    </g>
  )
}

function Arrow({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y} h14 m-5 -4 l5 4 l-5 4`} className="fill-none stroke-ink" strokeWidth={1.5} />
}

const SUMMARY = `Two lanes. Training, as research: a vocal excerpt and a mixture containing it feed an encoder under a contrastive objective. This demo: ${INFERENCE.map((s) => s.title).join(', then ')}.`

export function PipelineDiagram() {
  return (
    <figure>
      {/* The list is the accessible version, and the visible one on narrow screens. */}
      <ol className="space-y-2 md:sr-only">
        <li className="eyebrow pt-2">Training (research)</li>
        {TRAINING.map((s) => (
          <li key={s.title}>
            {s.title}: {s.detail.join(' ')}
          </li>
        ))}
        <li className="eyebrow pt-4">This demo (inference)</li>
        {INFERENCE.map((s, i) => (
          <li key={s.title + i}>
            {i + 1}. {s.title}: {s.detail.join(' ')}
          </li>
        ))}
      </ol>

      <svg viewBox="0 0 960 340" className="hidden w-full md:block" aria-hidden="true">
        <text x={0} y={16} className="fill-muted text-[11px] font-medium uppercase tracking-[0.14em]">
          Training (research)
        </text>
        {TRAINING.map((s, i) => (
          <g key={s.title}>
            <Box x={i * STEP} y={28} live={false} {...s} />
            {i < TRAINING.length - 1 && <Arrow x={i * STEP + BOX_W + 3} y={68} />}
          </g>
        ))}

        {/* The trained encoder is the one the demo loads. */}
        <path d="M340 108 C340 170 620 150 620 232" className="fill-none stroke-ink" strokeWidth={1.5} strokeDasharray="5 4" />
        <text x={470} y={150} textAnchor="middle" className="fill-muted text-[11px]">
          trained weights
        </text>

        <text x={0} y={216} className="fill-muted text-[11px] font-medium uppercase tracking-[0.14em]">
          This demo (inference)
        </text>
        {INFERENCE.map((s, i) => (
          <g key={s.title + i}>
            <Box x={i * STEP} y={232} live {...s} />
            {i < INFERENCE.length - 1 && <Arrow x={i * STEP + BOX_W + 3} y={272} />}
          </g>
        ))}
      </svg>
      <figcaption className="sr-only">{SUMMARY}</figcaption>
    </figure>
  )
}
