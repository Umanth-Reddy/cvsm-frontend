import { useEffect, useState } from 'react'
import { api, describeError } from '../api/client'
import type { GalleryClip } from '../api/types'
import { AudioPlayer } from '../components/ui/AudioPlayer'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { PageIntro } from '../components/ui/PageIntro'

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'done'; clips: GalleryClip[] }

const W = 640
const H = 420
const PAD = 36

/** Maps one axis onto the plot, padded so points never touch the edge. */
function axis(values: number[], size: number) {
  const lo = Math.min(...values)
  const span = Math.max(...values) - lo || 1
  return (v: number) => PAD + ((v - lo) / span) * (size - 2 * PAD)
}

function Scatter({ clips, selected, onSelect }: { clips: GalleryClip[]; selected: string | null; onSelect: (c: GalleryClip) => void }) {
  const sx = axis(clips.map((c) => c.x), W)
  const sy = axis(clips.map((c) => c.y), H)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-card border border-line bg-bg" role="group" aria-label="Clip positions">
      {clips.map((c) => {
        const active = c.id === selected
        return (
          <g
            key={c.id}
            role="button"
            tabIndex={0}
            aria-label={c.label}
            aria-pressed={active}
            className="cursor-pointer"
            onClick={() => onSelect(c)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(c)
              }
            }}
          >
            <title>{c.label}</title>
            {/* A 22 px-radius hit area keeps small points easy to tap. */}
            <circle cx={sx(c.x)} cy={sy(c.y)} r={22} fill="transparent" />
            <circle cx={sx(c.x)} cy={sy(c.y)} r={active ? 9 : 7} className={active ? 'fill-accent stroke-ink' : 'fill-ink stroke-bg'} strokeWidth={2} />
          </g>
        )
      })}
    </svg>
  )
}

export default function Gallery() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [selected, setSelected] = useState<GalleryClip | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    setState({ status: 'loading' })
    api
      .gallery()
      .then((r) => setState({ status: 'done', clips: r.clips }))
      .catch((e) => setState({ status: 'error', message: describeError(e) }))
  }, [attempt])

  return (
    <>
      <PageIntro
        eyebrow="Gallery"
        title="Explore the embedding space."
        lead="Pick a point to hear the clip. Clips that sit close together received similar embeddings from CVSM-ART."
      />

      <div className="container-page">
        {state.status === 'loading' && <LoadingState message="Loading the gallery" />}
        {state.status === 'error' && (
          <ErrorState
            title="Couldn't load the gallery"
            message={state.message}
            action={
              <Button variant="secondary" size="sm" onClick={() => setAttempt((n) => n + 1)}>
                Try again
              </Button>
            }
          />
        )}
        {state.status === 'done' && state.clips.length === 0 && (
          <EmptyState
            title="No gallery clips yet"
            description="The gallery shows clips built with scripts/build_gallery.py from audio that is the owner's own or openly licensed."
            action={<Button to="/compare">Compare your own clips</Button>}
          />
        )}
        {state.status === 'done' && state.clips.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <Scatter clips={state.clips} selected={selected?.id ?? null} onSelect={setSelected} />
              <p className="mt-3 text-sm text-muted">
                Positions come from a 2-D projection of CVSM-ART embeddings; distances in the plot are approximate.
              </p>
            </div>
            <Card aria-live="polite">
              {selected ? (
                <>
                  <p className="eyebrow">Selected clip</p>
                  <p className="mt-2 text-lg font-medium">{selected.label}</p>
                  <AudioPlayer key={selected.id} src={selected.audio_url} label={selected.label} autoPlay />
                </>
              ) : (
                <p className="text-muted">Choose a point to see its label and play it.</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </>
  )
}
