import { useModels } from '../api/useModels'
import { ResultsTable } from '../components/ResultsTable'
import type { EvaluationEntry } from '../components/ResultsTable'
import { Card } from '../components/ui/Card'
import { PageIntro } from '../components/ui/PageIntro'
import { SectionHeading } from '../components/ui/SectionHeading'
import evaluation from '../data/evaluation.json'
import methods from '../data/methods.json'

const entries = evaluation as EvaluationEntry[]
const sources = [...new Set(entries.map((e) => e.source))]

const MARK: Record<string, { symbol: string; label: string }> = {
  yes: { symbol: '✓', label: 'yes' },
  no: { symbol: '✗', label: 'no' },
  na: { symbol: '–', label: 'not applicable' },
}

// Which paper variant and vocal separator each demo checkpoint corresponds to, by checkpoint name.
const DEMO_MODELS: Record<string, string> = {
  cvsm_art: 'CVSM-ART with HT-Demucs vocals. Its results are in Table III.',
  cvsm_a: 'CVSM-A with open-unmix vocals. Its results are in Table II.',
  cvsm_ah: 'CVSM-AH with HT-Demucs vocals. Its results are in Table III.',
}

const TASKS = [
  {
    title: 'Gender identification',
    body: 'Classify the singer as male or female. Artist-stratified 10-fold cross-validation, reported as accuracy.',
  },
  {
    title: 'Artist identification',
    body: 'Classify the artist among 50 randomly sampled test-set artists, repeated 5 times, reported as accuracy and macro-F1.',
  },
  {
    title: 'Artist similarity',
    body: 'Compare embeddings of pairs from the same or different artists, reported as EER, MNR and MedNR. Lower is better.',
  },
]

export default function Evaluation() {
  const models = useModels()

  return (
    <>
      <PageIntro
        eyebrow="Evaluation"
        title="What the paper reports."
        lead="Everything on this page is copied from the published paper (IEEE Transactions on Audio, Speech and Language Processing, vol. 34, 2026). The demo reports no accuracy figures of its own."
      />

      <section className="container-page py-10">
        <SectionHeading
          title="What is evaluated"
          description="The encoder is frozen and a linear classifier is trained on top of its embeddings. Every task is run on complete musical mixtures and on isolated vocals."
        />
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {TASKS.map((t) => (
            <li key={t.title}>
              <Card className="h-full">
                <h3 className="text-xl">{t.title}</h3>
                <p className="mt-2 text-muted">{t.body}</p>
              </Card>
            </li>
          ))}
        </ul>
        <Card className="mt-4">
          <h3 className="text-xl">Listening test</h3>
          <p className="mt-2 text-muted">
            37 participants compared pairs of recommendations retrieved by different models, in a recommendation-by-query
            setting, and chose which was more similar to the query overall and which was more similar in the vocals.
          </p>
        </Card>
      </section>

      <section className="container-page py-10">
        <SectionHeading
          title="The compared methods"
          description="Which ingredients each method's pre-training uses. All of them are contrastively pre-trained."
        />
        <div tabIndex={0} role="region" aria-label={methods.source} className="relative mt-6 overflow-x-auto rounded-card border border-line">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <caption className="border-b border-line bg-surface px-4 py-2 text-left text-sm text-muted">{methods.source}</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-4 py-2 text-left font-medium">
                  Method
                </th>
                {methods.columns.map((c) => (
                  <th key={c} scope="col" className="px-3 py-2 text-center font-normal text-muted">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {methods.rows.map((r) => (
                <tr key={r.method} className="border-t border-line">
                  <th scope="row" className="px-4 py-2 text-left font-medium">
                    {r.method}
                  </th>
                  {r.cells.map((c, i) => (
                    <td key={i} className="px-3 py-2 text-center">
                      <span aria-hidden="true">{MARK[c].symbol}</span>
                      <span className="sr-only">{MARK[c].label}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {models.length > 0 && (
        <section className="container-page py-10">
          <SectionHeading
            title="Models in the demo"
            description="These are the checkpoints the Compare page runs, matched to the paper by their names."
          />
          <dl className="mt-6 grid gap-4 md:grid-cols-3">
            {models.map((m) => (
              <Card key={m.id}>
                <dt className="text-xl">{m.label}</dt>
                <dd className="mt-2 text-muted">{DEMO_MODELS[m.id] ?? m.description}</dd>
              </Card>
            ))}
          </dl>
        </section>
      )}

      <section className="container-page py-10">
        <SectionHeading
          title="Results"
          description="Values are mean ± the spread printed in the paper. Bold is as typeset in the paper. An asterisk marks a statistically significant (p < 0.05) improvement, as defined in the paper."
        />
        <div className="mt-6 space-y-8">
          {sources.map((s) => (
            <ResultsTable key={s} entries={entries.filter((e) => e.source === s)} />
          ))}
        </div>
      </section>

      <section className="container-page py-10">
        <SectionHeading title="From the listening test" description="Quoted from the paper's Section VI (pp. 2734 to 2735)." />
        <ul className="mt-6 max-w-3xl list-disc space-y-3 pl-5 text-lg">
          <li>
            CVSM-ART's scores of 52/26 for overall similarity and 42/24 for vocal similarity supersede random chance at the
            p &lt; 0.05 level (p = 0.005 for musical mixtures and p = 0.012 for isolated vocals).
          </li>
          <li>
            Among the label-agnostic models, CVSM-AH did best on vocal similarity, and none of their overall-similarity
            Bradley-Terry scores is significantly different from random chance.
          </li>
          <li>All contrastive models outperform MERT in both settings.</li>
        </ul>
      </section>

      <section className="container-page py-10">
        <SectionHeading title="A note on method" />
        <p className="mt-4 max-w-2xl text-muted">
          Numbers here are quoted, not reproduced, and variants aren't ranked beyond what the paper states. Table III repeats
          part of the experiment with vocals separated by HT-Demucs instead of open-unmix.
        </p>
      </section>
    </>
  )
}
