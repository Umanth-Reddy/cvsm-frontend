import { useState } from 'react'
import { api, describeError } from '../api/client'
import type { Pair } from '../api/types'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { ErrorState } from './ui/ErrorState'
import { HeatStrip } from './ui/HeatStrip'
import { LoadingState } from './ui/LoadingState'

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'done'; vectors: Pair<number[]> }

interface Props {
  fileA: File | null
  fileB: File | null
}

export function EmbeddingProfile({ fileA, fileB }: Props) {
  const [state, setState] = useState<State>({ status: 'idle' })

  const load = async () => {
    if (!fileA || !fileB) return
    setState({ status: 'loading' })
    try {
      const [a, b] = await Promise.all([api.embed(fileA, 'cvsm_art'), api.embed(fileB, 'cvsm_art')])
      setState({ status: 'done', vectors: { a: a.embedding, b: b.embedding } })
    } catch (e) {
      setState({ status: 'error', message: describeError(e) })
    }
  }

  const scale =
    state.status === 'done' ? Math.max(...state.vectors.a.map(Math.abs), ...state.vectors.b.map(Math.abs)) : 1

  return (
    <Card>
      <h2 className="text-xl">Embedding view</h2>
      <p className="mt-1 max-w-2xl text-muted">
        The raw 1280-value embedding each clip gets from CVSM-ART. It is a profile of one clip and is not a measure of
        similarity on its own.
      </p>

      <div className="mt-5" aria-live="polite">
        {state.status === 'idle' && (
          <Button variant="secondary" onClick={load} disabled={!fileA || !fileB} className="print:hidden">
            Show embedding profile
          </Button>
        )}
        {state.status === 'idle' && (!fileA || !fileB) && (
          <p className="mt-2 text-sm text-muted">Needs the original audio, which is gone after a refresh.</p>
        )}
        {state.status === 'loading' && <LoadingState message="Computing embeddings" />}
        {state.status === 'error' && (
          <ErrorState
            title="Couldn't load the embeddings"
            message={state.message}
            action={
              <Button variant="secondary" size="sm" onClick={load}>
                Try again
              </Button>
            }
          />
        )}
        {state.status === 'done' && (
          <div className="space-y-4">
            <div>
              <p className="eyebrow mb-1">Audio A</p>
              <HeatStrip label="Audio A" values={state.vectors.a} scale={scale} />
            </div>
            <div>
              <p className="eyebrow mb-1">Audio B</p>
              <HeatStrip label="Audio B" values={state.vectors.b} scale={scale} />
            </div>
            <p className="text-sm tabular-nums text-muted">
              Both strips share one scale: dark is negative, coral is positive, pale is zero. The largest absolute value
              is {scale.toFixed(3)}.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
