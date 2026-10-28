import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { describeError } from '../api/client'
import { Button } from '../components/ui/Button'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { PageIntro } from '../components/ui/PageIntro'
import { UploadCard } from '../components/ui/UploadCard'
import { useComparison } from '../store/useComparison'

export default function Compare() {
  const { fileA, fileB, durations, status, error, setFile, setDuration, run } = useComparison()
  const navigate = useNavigate()
  const mounted = useRef(true)
  const loading = status === 'loading'

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const submit = async () => {
    // Don't pull the visitor back to Results if they navigated away while waiting.
    if ((await run()) && mounted.current) navigate('/results')
  }

  return (
    <>
      <PageIntro
        eyebrow="Compare"
        title="Compare two songs."
        lead="Choose two audio clips. Each of the three models returns a cosine similarity score for the pair. Only the first 30 s of each clip are analysed."
      />

      <div className="container-page">
        <div className="grid gap-4 md:grid-cols-2">
          <UploadCard
            label="Audio A"
            file={fileA}
            duration={durations.a}
            disabled={loading}
            onFile={(f) => setFile('a', f)}
            onRemove={() => setFile('a', null)}
            onDuration={(s) => setDuration('a', s)}
          />
          <UploadCard
            label="Audio B"
            file={fileB}
            duration={durations.b}
            disabled={loading}
            onFile={(f) => setFile('b', f)}
            onRemove={() => setFile('b', null)}
            onDuration={(s) => setDuration('b', s)}
          />
        </div>

        <div className="mt-6">
          <Button onClick={submit} disabled={!fileA || !fileB} loading={loading}>
            Compare
          </Button>
        </div>

        <div className="mt-6" aria-live="polite">
          {loading && (
            <LoadingState
              message="Analysing on the server"
              slowAfterMs={8000}
              slowMessage="This is taking longer than usual. The first request after the server wakes can take about a minute."
            />
          )}
          {status === 'error' && error && (
            <ErrorState
              title="Comparison failed"
              message={describeError(error)}
              action={
                <Button variant="secondary" size="sm" onClick={submit}>
                  Try again
                </Button>
              }
            />
          )}
        </div>
      </div>
    </>
  )
}
