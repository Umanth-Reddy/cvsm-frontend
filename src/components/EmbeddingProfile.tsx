import type { Pair } from '../api/types'
import { Card } from './ui/Card'
import { HeatStrip } from './ui/HeatStrip'

export function EmbeddingProfile({ vectors }: { vectors: Pair<number[]> }) {
  const scale = Math.max(...vectors.a.map(Math.abs), ...vectors.b.map(Math.abs))

  return (
    <Card>
      <h2 className="text-xl">Embedding view</h2>
      <p className="mt-1 max-w-2xl text-muted">
        The raw 1280-value embedding each clip gets from CVSM-ART. It is a profile of one clip and is not a measure of
        similarity on its own.
      </p>
      <div className="mt-5 space-y-4">
        <div>
          <p className="eyebrow mb-1">Audio A</p>
          <HeatStrip label="Audio A" values={vectors.a} scale={scale} />
        </div>
        <div>
          <p className="eyebrow mb-1">Audio B</p>
          <HeatStrip label="Audio B" values={vectors.b} scale={scale} />
        </div>
        <p className="text-sm tabular-nums text-muted">
          Both strips share one scale: dark is negative, coral is positive, pale is zero. The largest absolute value
          is {scale.toFixed(3)}.
        </p>
      </div>
    </Card>
  )
}
