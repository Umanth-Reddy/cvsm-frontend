import { useModels } from '../api/useModels'
import { PipelineDiagram } from '../components/PipelineDiagram'
import { Card } from '../components/ui/Card'
import { PageIntro } from '../components/ui/PageIntro'
import { SectionHeading } from '../components/ui/SectionHeading'

const PAIRS = [
  {
    title: 'Label-informed pairs',
    body: 'A complete musical mixture is paired with an isolated vocal excerpt from the same artist. The two can come from different songs. No augmentation is applied.',
  },
  {
    title: 'Label-agnostic pairs',
    body: 'A vocal excerpt is superimposed on accompaniment from a randomly chosen, different piece. That artificial mixture is paired with the isolated vocals from the same segment. The aim is a latent space invariant to instrumental properties.',
  },
  {
    title: 'Closing the domain gap',
    body: 'Artificial mixtures differ from real music. The paper therefore tries mixing real and artificial mixtures during pre-training (hybrid, probability p = 0.5), and a final fine-tuning stage on real pairs only.',
  },
]

const TRAINING = [
  ['Data', 'Music4All: 109,269 songs by 16,269 artists, as 30 s previews, resampled to 16 kHz and cut into 5 s segments.'],
  ['Vocals', 'Separated from the mixtures with open-unmix. HT-Demucs is tested in additional experiments.'],
  ['Encoder', 'EfficientNet-B0 (5.3 M parameters) on a 64-band mel spectrogram, with a 25 ms window and 10 ms hop. It outputs a 1280-value embedding.'],
  ['Projection head', 'A 512-unit linear layer, layer normalisation and tanh. It is used only during pre-training.'],
  ['Objective', 'A bilinear similarity between every anchor and positive in the batch, turned into a softmax-normalised loss.'],
  ['Optimisation', 'Adam with an initial learning rate of 0.001, for up to 8,000 steps of 64 mini-batches of 128 pairs.'],
]

export default function HowItWorks() {
  const models = useModels()

  return (
    <>
      <PageIntro
        eyebrow="How it works"
        title="From audio to similarity."
        lead="CVSM learns from pairs of an isolated vocal excerpt and a musical mixture. The demo then compares two clips through the embeddings the trained models produce."
      />

      <section className="container-page py-10">
        <SectionHeading title="How training pairs are made" description="Training is research and happens elsewhere. The demo only runs the trained models." />
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {PAIRS.map((p) => (
            <li key={p.title}>
              <Card className="h-full">
                <h3 className="text-xl">{p.title}</h3>
                <p className="mt-2 text-muted">{p.body}</p>
              </Card>
            </li>
          ))}
        </ul>
        <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {TRAINING.map(([term, detail]) => (
            <div key={term} className="border-t border-line pt-3">
              <dt className="font-medium">{term}</dt>
              <dd className="mt-1 text-muted">{detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-page py-10">
        <SectionHeading
          title="Training and this demo"
          description="Pressing Compare runs only the lower lane, with the weights the upper lane produced."
        />
        <div className="mt-8 rounded-card border border-line p-5 sm:p-8">
          <PipelineDiagram />
        </div>
      </section>

      <section className="container-page py-10">
        <SectionHeading
          title="What a score means"
          description="Each clip becomes a 1280-value embedding. The score is the cosine of the two embeddings, from -1 to 1."
        />
        <div className="mt-4 max-w-2xl space-y-3 text-muted">
          <p>
            In the paper's artist-similarity task, a clip's embedding is the L2-normalised average over its 1 s excerpts
            that contain vocals. This service has no vocal detector. It uses four 1 s windows from the middle of each clip.
          </p>
          <p>
            Scores from different models aren't calibrated against each other, and the demo never turns a score into a
            verdict. It reports the number and nothing else.
          </p>
        </div>
      </section>

      {models.length > 0 && (
        <section className="container-page py-10">
          <SectionHeading title="Models in the demo" description="Compare runs your clips through all three." />
          <dl className="mt-6 grid gap-4 md:grid-cols-3">
            {models.map((m) => (
              <Card key={m.id}>
                <dt className="text-xl">{m.label}</dt>
                <dd className="mt-2 text-muted">{m.description}</dd>
              </Card>
            ))}
          </dl>
        </section>
      )}
    </>
  )
}
