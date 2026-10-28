// Dev-only catalogue of every component in every state (route /design, absent from production builds).
// The ScoreBar values are fixed layout samples (-1, 0, 0.5, 1), not model output.
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { EmbeddingDots } from '../components/visuals/EmbeddingDots'
import { VinylDisc } from '../components/visuals/VinylDisc'
import { WaveformRibbon } from '../components/visuals/WaveformRibbon'
import { AudioPlayer } from '../components/ui/AudioPlayer'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ChartContainer } from '../components/ui/ChartContainer'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { MetricCard } from '../components/ui/MetricCard'
import { PageIntro } from '../components/ui/PageIntro'
import { ScoreBar } from '../components/ui/ScoreBar'
import { SectionHeading } from '../components/ui/SectionHeading'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Tooltip } from '../components/ui/Tooltip'
import { UploadCard } from '../components/ui/UploadCard'

/** One second of a 440 Hz tone as a WAV, so the player has something real to decode. */
function toneFile(): File {
  const rate = 8000
  const samples = new Int16Array(rate)
  for (let i = 0; i < rate; i++) samples[i] = Math.sin((2 * Math.PI * 440 * i) / rate) * 12000
  const header = new DataView(new ArrayBuffer(44))
  const text = (offset: number, s: string) => [...s].forEach((c, i) => header.setUint8(offset + i, c.charCodeAt(0)))
  text(0, 'RIFF')
  header.setUint32(4, 36 + samples.byteLength, true)
  text(8, 'WAVEfmt ')
  header.setUint32(16, 16, true)
  header.setUint16(20, 1, true)
  header.setUint16(22, 1, true)
  header.setUint32(24, rate, true)
  header.setUint32(28, rate * 2, true)
  header.setUint16(32, 2, true)
  header.setUint16(34, 16, true)
  text(36, 'data')
  header.setUint32(40, samples.byteLength, true)
  return new File([header, samples], 'test-tone.wav', { type: 'audio/wav' })
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="container-page py-8">
      <h2 className="eyebrow mb-4 border-b border-line pb-2">{title}</h2>
      {children}
    </section>
  )
}

export default function Design() {
  const tone = useMemo(toneFile, [])
  const [uploaded, setUploaded] = useState<File | null>(null)
  const [duration, setDuration] = useState<number | null>(null)

  return (
    <>
      <PageIntro eyebrow="Dev only" title="Design system" lead="Every component in each state. This route is not part of the production build." />

      <Section title="Colour tokens">
        <div className="flex flex-wrap gap-3">
          {[
            ['bg', 'bg-bg'],
            ['surface', 'bg-surface'],
            ['accent', 'bg-accent'],
            ['accent-2', 'bg-accent-2'],
            ['ink', 'bg-ink'],
            ['muted', 'bg-muted'],
            ['muted-soft', 'bg-muted-soft'],
          ].map(([name, cls]) => (
            <div key={name} className="w-28">
              <div className={`h-14 rounded-card border border-line ${cls}`} />
              <p className="mt-1 text-xs">{name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <p className="text-display">Display</p>
        <p className="text-page">Page headline</p>
        <h2 className="mt-4 text-3xl">Section heading</h2>
        <p className="eyebrow mt-4">Technical label</p>
        <p className="mt-2 max-w-xl">Body text at 17 px with a 1.6 line height, set in DM Sans, self-hosted.</p>
        <p className="mt-2 text-muted">Muted body text.</p>
      </Section>

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button to="/">As link</Button>
        </div>
      </Section>

      <Section title="Card, StatusBadge, Tooltip, MetricCard">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>Outline card</Card>
          <Card tone="surface">Surface card</Card>
          <MetricCard label="Metric label" value="—" hint="Hint text" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <StatusBadge>Neutral</StatusBadge>
          <StatusBadge tone="highlight">Highlight</StatusBadge>
          <StatusBadge tone="accent">Accent</StatusBadge>
          <StatusBadge tone="inverse">Inverse</StatusBadge>
          <Tooltip content="Shown on hover and keyboard focus. Escape closes it.">
            <Button variant="secondary" size="sm">
              Hover or focus me
            </Button>
          </Tooltip>
        </div>
      </Section>

      <Section title="UploadCard">
        <div className="grid gap-4 md:grid-cols-3">
          <UploadCard label="Empty" file={null} duration={null} onFile={setUploaded} onRemove={() => {}} onDuration={() => {}} />
          <UploadCard
            label="Interactive"
            file={uploaded}
            duration={duration}
            onFile={setUploaded}
            onRemove={() => {
              setUploaded(null)
              setDuration(null)
            }}
            onDuration={setDuration}
          />
          <UploadCard label="With error" file={null} duration={null} error="File is too large" onFile={() => {}} onRemove={() => {}} onDuration={() => {}} />
        </div>
      </Section>

      <Section title="AudioPlayer">
        <Card className="max-w-xl">
          <p className="text-sm text-muted">Generated 440 Hz test tone</p>
          <AudioPlayer src={tone} label="test tone" />
        </Card>
      </Section>

      <Section title="ScoreBar (layout samples, not results)">
        <div className="grid gap-6 md:grid-cols-2">
          <ScoreBar label="Sample at -1" value={-1} />
          <ScoreBar label="Sample at 0" value={0} description="Description text under the label." />
          <ScoreBar label="Sample at 0.5" value={0.5} />
          <ScoreBar label="Sample at 1" value={1} />
        </div>
      </Section>

      <Section title="ChartContainer, SectionHeading">
        <ChartContainer title="Chart title" caption="Caption says what the chart shows and where the data comes from.">
          <div className="flex h-32 items-center justify-center rounded-card bg-surface text-sm text-muted">Chart area</div>
        </ChartContainer>
        <div className="mt-8">
          <SectionHeading eyebrow="Eyebrow" title="Section heading" description="Supporting description under the heading." />
        </div>
      </Section>

      <Section title="EmptyState, LoadingState, ErrorState">
        <div className="grid gap-4 md:grid-cols-3">
          <EmptyState title="Nothing here yet" description="Explains what to do next." action={<Button to="/compare">Compare two songs</Button>} />
          <Card>
            <LoadingState message="Analysing on the server" slowAfterMs={3000} slowMessage="Still working. The first request after the server wakes can take about a minute." />
          </Card>
          <ErrorState title="Can't reach the CVSM service" message="Check that the backend is running, then try again." action={<Button variant="secondary" size="sm">Try again</Button>} />
        </div>
      </Section>

      <Section title="Visuals (illustrations)">
        <div className="grid items-center gap-6 md:grid-cols-3">
          <WaveformRibbon className="h-32 w-full overflow-hidden" />
          <VinylDisc className="mx-auto h-40 w-40" />
          <EmbeddingDots className="mx-auto h-40 w-40" />
        </div>
      </Section>
    </>
  )
}
