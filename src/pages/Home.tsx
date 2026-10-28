import { HeroVisual } from '../components/HeroVisual'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { MetricCard } from '../components/ui/MetricCard'
import { SectionHeading } from '../components/ui/SectionHeading'
import { LayersIcon, MusicIcon, SparkIcon } from '../components/ui/Icons'
import { StatusBadge } from '../components/ui/StatusBadge'
import type { EvaluationEntry } from '../components/ResultsTable'
import evaluation from '../data/evaluation.json'

// Table III, top: artist identification accuracy on musical mixtures with HT-Demucs vocals.
const PREVIEW = (evaluation as EvaluationEntry[]).filter(
  (e) => e.source.startsWith('Table III, top') && e.task === 'Artist identification',
)

const FEATURES = [
  {
    icon: <MusicIcon />,
    title: 'Vocal similarity',
    body: 'Upload two clips and get one cosine similarity score from each of three models.',
  },
  {
    icon: <LayersIcon />,
    title: 'Beyond the accompaniment',
    body: 'Some training pairs put a vocal over accompaniment from a different song. The aim is a representation that depends less on the instruments.',
  },
  {
    icon: <SparkIcon />,
    title: 'Contrastive learning',
    body: 'Pairs are chosen with artist labels or, without labels, by building artificial mixtures. The paper studies both.',
  },
]

const STEPS = [
  {
    title: 'Input audio',
    badge: 'Live demo' as const,
    body: 'You upload two clips. The service analyses the middle four seconds of each, resampled to 16 kHz mono.',
  },
  {
    title: 'Learn representations',
    badge: 'Research' as const,
    body: 'In the paper, an encoder learns from isolated vocal excerpts paired with musical mixtures. The demo loads the trained weights; it does not train.',
  },
  {
    title: 'Evaluate similarity',
    badge: 'Live demo' as const,
    body: 'Each clip becomes one embedding. The score is the cosine between the two.',
  },
]

export default function Home() {
  return (
    <>
      <section className="container-page grid items-center gap-12 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="chip">
            <span className="h-2 w-2 rounded-full bg-accent motion-safe:animate-pulse" aria-hidden="true" />
            IEEE TASLP 2026 Research Project
          </p>
          <h1 className="mt-6 text-display">Hear the voice beyond the music.</h1>
          <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
            Exploring singing-voice similarity through contrastive audio representation learning, even when instruments
            and production shape what we hear.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/compare">
              Compare two songs <span className="text-accent" aria-hidden="true">→</span>
            </Button>
            <Button to="/how-it-works" variant="secondary">
              Explore the research
            </Button>
          </div>
          <dl className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 font-mono text-xs text-muted">
            <div className="flex gap-1.5">
              <dt className="font-bold text-ink">Backbone:</dt>
              <dd>EfficientNet-B0 (5.3M params)</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-bold text-ink">Latent dim:</dt>
              <dd>1280-d embedding</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-bold text-ink">Dataset:</dt>
              <dd>Music4All (109k songs)</dd>
            </div>
          </dl>
        </div>
        <HeroVisual />
      </section>

      <section className="container-page py-8">
        <Card className="grid gap-8 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionHeading eyebrow="Research foundation" title="What makes two voices sound alike?" />
          <div className="space-y-4 text-lg">
            <p>
              A singing voice reaches us mixed with instruments and production, so comparing two voices means comparing
              them through the music around them.
            </p>
            <p>
              CVSM is a contrastive method that learns audio representations by pairing isolated vocal excerpts with
              musical mixtures. The paper tests the representations on gender identification, artist identification and
              artist similarity, and in a listening test.
            </p>
            <p className="rounded-2xl border border-line bg-surface/60 p-4 text-sm text-muted">
              <span className="font-semibold text-ink">Scientific nuance: </span>
              This demo shows what the trained models output for your clips. It doesn't claim to isolate a voice or to
              remove the influence of the accompaniment.
            </p>
          </div>
        </Card>
      </section>

      <section className="container-page py-12">
        <p className="eyebrow mb-3">Key scientific pillars</p>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <li key={f.title}>
              <Card className="flex h-full flex-col">
                <span className="icon-tile">{f.icon}</span>
                <h2 className="mt-5 text-xl font-semibold tracking-tight">{f.title}</h2>
                <p className="mt-3 flex-1 text-muted">{f.body}</p>
                <p className="mt-5 border-t border-line pt-3 text-right font-mono text-xs text-accent-ink">
                  {String(i + 1).padStart(2, '0')}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page py-8">
        <Card tone="surface" className="sm:p-10">
          <SectionHeading
            eyebrow="Research methodology"
            title="From audio to a similarity score"
            description="Three steps. Only the first and last run when you press Compare."
          />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <Card className="h-full">
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm text-bg ${
                        s.badge === 'Research' ? 'bg-accent text-ink' : 'bg-ink'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <StatusBadge tone={s.badge === 'Research' ? 'neutral' : 'highlight'}>{s.badge}</StatusBadge>
                  </div>
                  <h3 className="mt-5 text-xl">{s.title}</h3>
                  <p className="mt-2 text-muted">{s.body}</p>
                </Card>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Button to="/how-it-works" variant="secondary">
              See the full pipeline
            </Button>
          </div>
        </Card>
      </section>

      <section className="container-page py-8">
        <Card tone="surface" className="sm:p-10">
          <SectionHeading
            title="What the paper evaluates"
            description="Artist identification accuracy (%) on musical mixtures, with vocals separated by HT-Demucs. From Table III of the paper."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {PREVIEW.map((e) => (
              <MetricCard key={e.model_variant} label={e.model_variant} value={e.value.toFixed(2)} hint={`± ${e.std.toFixed(2)}`} />
            ))}
          </div>
          <div className="mt-8">
            <Button to="/evaluation" variant="secondary">
              Go to evaluation
            </Button>
          </div>
        </Card>
      </section>

      <section className="container-page py-16 sm:py-20">
        <p className="eyebrow mb-3 text-accent-ink">The paper</p>
        <h2 className="max-w-3xl text-3xl sm:text-4xl">CVSM: Contrastive Vocal Similarity Modeling</h2>
        <p className="mt-3 text-lg text-muted">Christos Garoufis, Athanasia Zlatintsi and Petros Maragos</p>
        <p className="mt-1 text-muted">IEEE Transactions on Audio, Speech and Language Processing, vol. 34, 2026.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            className="inline-flex min-h-11 items-center rounded-full bg-black px-6 text-sm font-medium text-bg shadow-sm hover:bg-[#1f1f1f]"
            href="https://doi.org/10.1109/TASLPRO.2026.3677618"
          >
            Read the paper
          </a>
          <Button to="/about" variant="secondary">
            Cite and credits
          </Button>
        </div>
      </section>
    </>
  )
}
