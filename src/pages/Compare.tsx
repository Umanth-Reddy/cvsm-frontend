import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { describeError } from '../api/client'
import { Button } from '../components/ui/Button'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { PageIntro } from '../components/ui/PageIntro'
import { UploadCard } from '../components/ui/UploadCard'
import { MAX_BYTES } from '../lib/audio'
import { useComparison } from '../store/useComparison'

export default function Compare() {
  const { fileA, fileB, durations, status, error, setFile, setDuration, run } = useComparison()
  const navigate = useNavigate()
  const mounted = useRef(true)
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoError, setDemoError] = useState<string | null>(null)
  const loading = status === 'loading' || demoLoading
  const filesTooLarge = !!fileA && !!fileB && fileA.size + fileB.size > MAX_BYTES

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

  const sendDemo = async () => {
    setDemoError(null)
    setDemoLoading(true)
    try {
      const paths = ['singin-in-the-rain-a.mp3', 'singin-in-the-rain-b.mp3']
      const files = await Promise.all(paths.map(async (name) => {
        const response = await fetch(`${import.meta.env.BASE_URL}demo/${name}`)
        if (!response.ok) throw new Error('Demo audio could not be loaded')
        return new File([await response.blob()], name, { type: 'audio/mpeg' })
      }))
      setFile('a', files[0])
      setFile('b', files[1])
      setDuration('a', 16)
      setDuration('b', 16)
      setDemoLoading(false)
      if (mounted.current) await submit()
    } catch (e) {
      setDemoLoading(false)
      if (mounted.current) setDemoError(e instanceof Error ? e.message : 'Demo audio could not be loaded')
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="Compare"
        title="Compare two songs."
        lead="Choose two audio clips. Each of the three models returns a cosine similarity score for the pair, using the middle four seconds of each clip."
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

        <div className="mt-8 border-t border-line pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-xs text-muted">
              {fileA && fileB ? 'Ready to compare.' : 'Select two clips to enable similarity analysis.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={sendDemo} disabled={loading} loading={demoLoading}>
                Send demo audio
              </Button>
              <Button onClick={submit} disabled={!fileA || !fileB || filesTooLarge || demoLoading} loading={status === 'loading'}>
                Compare <span className="text-accent" aria-hidden="true">→</span>
              </Button>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">
            Demo: two excerpts of <a className="underline underline-offset-4" href="https://commons.wikimedia.org/wiki/File:Singin%27_in_the_Rain.mp3">“Singin’ in the Rain” performed by Cary Bass-Deschenes</a>. Cropped and converted to mono from the <a className="underline underline-offset-4" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> recording.
          </p>
          {filesTooLarge && <p role="alert" className="mt-3 text-sm font-medium">These files exceed the 4 MiB combined upload limit.</p>}
          {demoError && <p role="alert" className="mt-3 text-sm font-medium">{demoError}</p>}
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
