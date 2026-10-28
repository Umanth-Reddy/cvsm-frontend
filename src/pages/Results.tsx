import { useRef } from 'react'
import type { RefObject } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { describeError } from '../api/client'
import { useModels } from '../api/useModels'
import type { CompareResponse, ModelId, Pair } from '../api/types'
import { EmbeddingProfile } from '../components/EmbeddingProfile'
import { AudioPlayer } from '../components/ui/AudioPlayer'
import type { AudioPlayerHandle } from '../components/ui/AudioPlayer'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { PageIntro } from '../components/ui/PageIntro'
import { ScoreBar } from '../components/ui/ScoreBar'
import { CalibrationLine } from '../components/ui/CalibrationLine'
import { formatDuration } from '../lib/audio'
import { useComparison } from '../store/useComparison'

function ClipCard({
  label,
  name,
  duration,
  file,
  playerRef,
}: {
  label: string
  name: string
  duration: number
  file: File | null
  playerRef: RefObject<AudioPlayerHandle>
}) {
  return (
    <Card>
      <p className="eyebrow">{label}</p>
      <p className="mt-3 truncate font-medium" title={name}>
        {name}
      </p>
      <p className="text-sm text-muted">{formatDuration(duration)}</p>
      {file && <AudioPlayer ref={playerRef} src={file} label={label} />}
    </Card>
  )
}

function download(response: CompareResponse, names: Pair<string>) {
  const report = {
    files: {
      a: { name: names.a, duration_s: response.duration_s.a },
      b: { name: names.b, duration_s: response.duration_s.b },
    },
    results: response.results,
  }
  const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'cvsm-results.json'
  link.click()
  URL.revokeObjectURL(url)
}

export default function Results() {
  const { status, response, names, fileA, fileB, error, reset } = useComparison()
  const navigate = useNavigate()
  const models = useModels()
  const playerA = useRef<AudioPlayerHandle>(null)
  const playerB = useRef<AudioPlayerHandle>(null)

  const info = (id: ModelId) => models.find((m) => m.id === id)

  const replay = (own: RefObject<AudioPlayerHandle>, other: RefObject<AudioPlayerHandle>) => {
    other.current?.pause()
    own.current?.replay()
  }

  let body
  if (status === 'loading') {
    body = <LoadingState message="Analysing on the server" />
  } else if (status === 'error' && error) {
    body = (
      <ErrorState
        title="Comparison failed"
        message={describeError(error)}
        action={<Button to="/compare" variant="secondary" size="sm">Back to Compare</Button>}
      />
    )
  } else if (!response || !names) {
    body = (
      <EmptyState
        title="No comparison yet"
        description="Choose two audio clips on the Compare page and the scores will appear here."
        action={<Button to="/compare">Go to Compare</Button>}
      />
    )
  } else {
    const clipped = [response.clipped.a && 'Audio A', response.clipped.b && 'Audio B'].filter(Boolean)
    body = (
      <div className="space-y-6">
        {(!fileA || !fileB) && (
          <p className="rounded-card bg-accent-2 px-4 py-3 text-sm">
            Audio previews aren't available after a refresh.{' '}
            <Link to="/compare" className="font-medium underline underline-offset-4">
              Back to Compare
            </Link>
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <ClipCard label="Audio A" name={names.a} duration={response.duration_s.a} file={fileA} playerRef={playerA} />
          <ClipCard label="Audio B" name={names.b} duration={response.duration_s.b} file={fileB} playerRef={playerB} />
        </div>

        <Card>
          <h2 className="text-xl">Similarity by model</h2>
          <div className="mt-6 space-y-8">
            {response.results.map((r) => (
              <ScoreBar
                key={r.model}
                label={info(r.model)?.label ?? r.model}
                description={info(r.model)?.description}
                value={r.cosine}
              >
                {r.centred_cosine !== undefined && r.reference && (
                  <CalibrationLine label={info(r.model)?.label ?? r.model} value={r.centred_cosine} reference={r.reference} />
                )}
              </ScoreBar>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted">
            Scores from different models are not calibrated against each other. Each bar shows that model's own value,
            so they shouldn't be read as one model being "right".
          </p>
          {clipped.length > 0 && (
            <p className="mt-2 text-sm font-medium">Only the first 30 s of {clipped.join(' and ')} were analysed.</p>
          )}
        </Card>

        <EmbeddingProfile fileA={fileA} fileB={fileB} />

        <div className="flex flex-wrap gap-3 print:hidden">
          <Button
            onClick={() => {
              reset()
              navigate('/compare')
            }}
          >
            Compare another pair
          </Button>
          <Button variant="secondary" disabled={!fileA} onClick={() => replay(playerA, playerB)}>
            Replay A
          </Button>
          <Button variant="secondary" disabled={!fileB} onClick={() => replay(playerB, playerA)}>
            Replay B
          </Button>
          <Button variant="secondary" onClick={() => download(response, names)}>
            Download results (JSON)
          </Button>
          <Button variant="secondary" onClick={() => window.print()}>
            Print / save as PDF
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageIntro eyebrow="Analysis report" title="A closer look at vocal similarity.">
        <Button to="/compare" variant="ghost" className="-ml-6 print:hidden">
          Back to Compare
        </Button>
      </PageIntro>
      <div className="container-page" aria-live="polite">
        {body}
      </div>
    </>
  )
}
