import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { PageIntro } from '../components/ui/PageIntro'
import { cx } from '../lib/cx'
import evidence from '../data/improvements.json'

const source = `${import.meta.env.BASE_URL}research/`
const paperClass = 'text-accent-ink underline decoration-accent/50 underline-offset-4 hover:decoration-current'

const chapters = [
  { id: 'what-we-tested', label: 'What we tested' },
  { id: 'the-echo-test', label: 'The echo test' },
  { id: 'production-effects', label: '19 production settings' },
  { id: 'room-filters', label: 'Room filters' },
  { id: 'separated-vocals', label: 'Separated vocals' },
  { id: 'what-helped', label: 'What helped' },
  { id: 'verify', label: 'Verify the evidence' },
]

const stages = [
  {
    id: '000',
    title: 'All clean',
    description: 'All three clips are dry. This is the starting error rate for these singers and recordings.',
  },
  {
    id: '010',
    title: 'Echo on the right singer',
    description: 'Add echo to the right singer’s clip. The wrong singer stays dry, just like the clip we started with.',
  },
  {
    id: '011',
    title: 'Echo on both candidates',
    description: 'Leave the starting clip and the right singer alone. Add the same kind of echo to the wrong singer. Now the wrong voice wins far less often.',
  },
] as const

const coreTables = [
  ['B2', 'CVSM-ART'],
  ['B3', 'CVSM-A'],
  ['B4', 'Torres SSL'],
  ['B5', 'ECAPA-TDNN'],
  ['B6', 'MERT'],
] as const

type TableId = keyof typeof evidence.tables

function Chapter({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-line pt-8 sm:scroll-mt-28 sm:pt-10">
      <h2 id={`${id}-title`} className="max-w-2xl text-3xl sm:text-4xl">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  )
}

function EvidenceTable({ id, title, open = false }: { id: TableId; title: string; open?: boolean }) {
  const { caption, headers, rows } = evidence.tables[id]
  return (
    <details open={open} className="group overflow-hidden rounded-2xl border border-line bg-card">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold hover:bg-surface/50 [&::-webkit-details-marker]:hidden sm:px-5">
        <span>{title}</span>
        <span className="flex items-center gap-3 font-mono text-xs font-normal text-muted">
          <span className="whitespace-nowrap">{id}</span>
          <span aria-hidden="true" className="text-base leading-none text-accent-ink group-open:hidden">+</span>
          <span aria-hidden="true" className="hidden text-base leading-none text-accent-ink group-open:inline">−</span>
        </span>
      </summary>
      <div
        role="region"
        aria-label={`Table ${id}: ${title}`}
        tabIndex={0}
        className="overflow-x-auto border-t border-line focus-visible:outline-offset-[-2px]"
      >
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <caption className="caption-top px-4 py-3 text-left text-sm text-muted sm:px-5">{caption}</caption>
          <thead className="bg-surface/60 text-xs">
            <tr>
              {headers.map((header, column) => (
                <th key={column} scope="col" className="px-4 py-3 font-semibold sm:px-5">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([first, ...cells], row) => (
              <tr key={row} className="border-b border-line/60 last:border-0 even:bg-bg/60">
                <th scope="row" className="px-4 py-3 font-semibold sm:px-5">{first}</th>
                {cells.map((cell, column) => (
                  <td key={column} className="px-4 py-3 align-top tabular-nums sm:px-5">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

function EchoExperiment() {
  const [stage, setStage] = useState(1)
  const current = stages[stage]
  const result = evidence.jvs[current.id]
  const scores = [
    { label: 'Right singer', value: result.genuine_cosine, color: 'bg-ink' },
    { label: 'Wrong singer', value: result.impostor_cosine, color: 'bg-accent' },
  ]

  return (
    <Card className="p-5 sm:p-7">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Try the three saved conditions</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {stages.map((entry, index) => (
            <label key={entry.id} className="relative cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="echo-stage"
                checked={stage === index}
                onChange={() => setStage(index)}
              />
              <span
                className={cx(
                  'flex min-h-12 h-full items-center rounded-xl border px-3 py-2.5 text-sm font-semibold',
                  'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink',
                  stage === index ? 'border-ink bg-ink text-bg' : 'border-line bg-bg hover:bg-surface',
                )}
              >
                {entry.title}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div aria-live="polite" aria-atomic="true" className="mt-5 grid gap-5 rounded-2xl bg-bg p-4 sm:p-6 lg:grid-cols-[1.35fr_0.8fr]">
        <div>
          <p className="text-base text-ink">{current.description}</p>
          <dl className="mt-5 space-y-4">
            {scores.map((score) => (
              <div key={score.label}>
                <div className="flex justify-between gap-3 text-sm">
                  <dt>{score.label}</dt>
                  <dd className="font-mono text-xs tabular-nums">{score.value.toFixed(6)}</dd>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface" aria-hidden="true">
                  <div className={cx('h-full rounded-full', score.color)} style={{ width: `${score.value * 100}%` }} />
                </div>
              </div>
            ))}
          </dl>
        </div>
        <div className="border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <p className="text-4xl font-extrabold tracking-tight tabular-nums xl:text-5xl">{result.ranking_error_pct.toFixed(2)}%</p>
          <p className="mt-1 text-sm font-semibold">Ranking error</p>
          <p className="mt-2 text-sm text-muted">How often the wrong singer tied or beat the right singer in a pair.</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted">
        CVSM-ART on JVS-MuSiC, with the common song as the dry starting clip. Bars show mean cosine scores on the displayed 0–1 range.
        Error comes from counting the outcomes of the individual comparisons.
      </p>
    </Card>
  )
}

export default function Improvements() {
  const { hash } = useLocation()

  useEffect(() => {
    const section = hash && document.getElementById(hash.slice(1))
    if (section) section.scrollIntoView()
    else if (!hash) window.scrollTo(0, 0)
  }, [hash])

  return (
    <>
      <PageIntro
        eyebrow="Improvements"
        title="Singer or Studio?"
        lead="Same singer. Different echo. Now the computer can pick the wrong voice. This follow-up study shows when that happens and how to test for it."
      />
      <div className="container-page grid items-start gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] xl:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
        <nav aria-label="Study sections" className="border-y border-line py-3 lg:sticky lg:top-28 lg:border-y-0 lg:border-r lg:py-0 lg:pr-5">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 lg:block lg:space-y-1">
            {chapters.map(({ id, label }) => (
              <li key={id}>
                <Link to={`#${id}`} className={cx(
                  'block rounded-lg py-2 text-sm font-medium hover:text-accent-ink lg:px-2',
                  hash === `#${id}` && 'text-accent-ink lg:bg-surface/50',
                )}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <article className="min-w-0 space-y-12 sm:space-y-16">
          <div className="space-y-5">
            <EchoExperiment />
            <p className="max-w-prose text-muted">
              Look at the last two buttons. The right singer’s score stays at <strong className="text-ink">0.888241</strong>.
              Only the wrong singer changes. Error drops by <strong className="text-ink">28.72 points</strong> (95% interval 22.76 to 35.17).
              How the other recordings are processed can decide who wins.
            </p>
          </div>

          <Chapter id="what-we-tested" title="Same people, same clips. Change the sound.">
            <div className="max-w-prose space-y-4 text-muted">
              <p>
                Start with one voice clip. Give the model two choices. One clip is the <strong className="text-ink">right singer</strong> on another
                recording. The other is a <strong className="text-ink">different singer</strong>. The model turns each clip into a list of numbers
                (an embedding) and compares the lists. The bigger cosine score wins. A tie with the wrong singer counts as an error.
              </p>
              <p>
                We used the same performers and the same audio windows while we added echo, compressed the audio, changed its tone,
                or mixed it with backing music and pulled the voice back out. The five models were already trained. We kept their weights fixed.
              </p>
              <p>
                <strong className="text-ink">Pairwise error</strong> compares one right clip with one wrong clip. Each singer gets equal weight.
                <strong className="text-ink"> Top-rank error</strong> asks whether any wrong clip in the whole list wins.
                The JVS archive also reports EER, a separate threshold-based metric for the original song direction.
              </p>
            </div>
            <EvidenceTable id="1" title="Which singers and tracks went into each test" />
            <EvidenceTable id="2" title="Every audio treatment and strength" />
            <Card tone="surface">
              <h3 className="text-lg">How we kept it fair</h3>
              <div className="mt-3 max-w-prose space-y-3 text-sm text-muted">
                <p>
                  VocalSet used 20 singers and 59 clips of three songs. GTSinger used 19 singers and 76 clips across eight languages.
                  Each model saw the same four-second windows and trials. The wrong singer matched the query’s corpus sex label and
                  the right clip’s song or recording slot. GTSinger slots can contain different songs. VocalSet had 116 genuine pairs and
                  1,032 comparisons per setting. GTSinger had 228 pairs and 1,944 comparisons. Zero crops were skipped.
                </p>
                <p>
                  JVS used the middle four seconds. Each of 100 singers had one shared song and one singer-specific song. We ran both
                  query directions and chose wrong singers within six voice-range groups. Each direction had 100 genuine pairs and
                  1,568 comparisons. The five core encoders were CVSM-ART, CVSM-A, Torres SSL, ECAPA-TDNN and MERT.
                </p>
                <p>
                  To show uncertainty, we repeatedly sampled singers and recomputed the differences. We used 2,000 draws for
                  VocalSet and GTSinger and 5,000 for JVS and the measured-room follow-up. Intervals apply to the trials and
                  recording conditions we used.
                </p>
              </div>
            </Card>
          </Chapter>

          <Chapter id="the-echo-test" title="Echo on which clip matters">
            <div className="max-w-prose space-y-4 text-muted">
              <p>
                In JVS we ran every on/off combination across the starting clip, the right match and the wrong match. We did this
                for synthetic reverb and 64 kb/s MP3. In the eight-cell tables, <strong className="text-ink">0 means clean and 1 means processed</strong>.
                The digits are in that order. The echo recipe used a 20% wet blend and a fixed seed per recording.
              </p>
              <p>
                For CVSM-ART, putting echo only on the starting clip gave 14.15% error. Putting it only on the right match gave
                46.24%. This gap was 32.09 points [25.45, 39.10] and stayed 28.93 points [22.47, 35.78] when we swapped the songs.
                CVSM-A and Torres SSL also kept a positive gap after the swap. The swap reused the same singers and clips.
              </p>
              <p>
                At 64 kb/s MP3, processing only the genuine clip raised error by 7.3 points for CVSM-ART, 1.5 for CVSM-A and
                9.5 for Torres SSL with the common-song query. CVSM-A’s interval crossed zero. The strong result is specific
                to the tested reverb and comparison.
              </p>
            </div>
            <EvidenceTable id="3" title="Reverb results and direction gaps" />
            <EvidenceTable id="A1" title="All eight assignments for reverb and MP3" />
            <EvidenceTable id="A2" title="Exact similarities and error intervals for the interactive example" />
            <EvidenceTable id="A3" title="Clean score gaps across singers" />
          </Chapter>

          <Chapter id="production-effects" title="Different models break under different changes">
            <div className="max-w-prose space-y-4 text-muted">
              <p>
                We started with 19 settings on VocalSet. A setting counted as a strong increase if the error rose at least 10 points
                and its interval stayed above zero. We took the union of settings flagged by CVSM-ART and Torres SSL, then used that
                same set of 17 for every model on both datasets. GTSinger used different recordings and singers.
              </p>
              <p>
                On GTSinger, the extra error on those same settings was <strong className="text-ink">31.2 points for CVSM-ART,
                17.5 for CVSM-A and 44.5 for Torres SSL</strong>. The speech model ECAPA-TDNN and the music model MERT
                went up 4.4 and 5.2 points. The table includes each model’s starting error so you can see both numbers.
              </p>
              <p>
                On the original 14 VocalSet settings flagged for CVSM-ART, the average error was 8.1% clean, 65.2% with only the right
                singer processed, and 18.2% when both candidates were processed. The starting clip was always clean. For Torres SSL,
                cutting the high frequencies alone added 7.8 or 9.3 points of error, while 128 kb/s MP3 added 21.1 points.
              </p>
            </div>
            <EvidenceTable id="4" title="Five models on the same 17 settings" open />
            <figure className="overflow-hidden rounded-2xl border border-line bg-card">
              <a href={`${source}condition-plot.png`} className="block p-3 sm:p-5">
                <img
                  src={`${source}condition-plot.png`}
                  alt="Ten line charts showing how the five models' ranking errors change across reverberation, EnCodec, MP3, EQ and separation on VocalSet and GTSinger."
                  width={8640}
                  height={4620}
                  loading="lazy"
                  className="h-auto w-full"
                />
              </a>
              <figcaption className="border-t border-line px-4 py-3 text-sm text-muted sm:px-5">
                Each plot changes only the right singer’s clip. Select the figure to see it at full size.
              </figcaption>
            </figure>
            <EvidenceTable id="B1" title="Original model-specific benchmark results" />
            {coreTables.map(([id, model]) => <EvidenceTable key={id} id={id} title={`All 19 conditions for ${model}`} />)}
          </Chapter>

          <Chapter id="room-filters" title="Room effects depend on the filter and the amount of echo">
            <div className="max-w-prose space-y-4 text-muted">
              <p>
                First, we used eight measured room responses as filters on existing recordings. With only the genuine clip changed,
                Torres SSL rose 42.7 points on VocalSet and 27.4 on GTSinger on average. CVSM-ART rose 5.2 and 4.6.
                CVSM-A rose 7.7 and 6.7.
              </p>
              <p>
                Then we used four new pairs of filters with similar decay times. Each wrong singer either shared the starting
                clip’s exact filter or received its paired alternative. The two recording sets were CoVox (22 singers, 44 clips)
                and NUS-48E (12 singers, 48 clips).
              </p>
              <p>
                At the main 20% wet setting, pairing the wrong clip with the starting clip’s filter increased Torres SSL error
                <strong className="text-ink"> 2.29 points on CoVox and 4.44 on NUS</strong>. Both estimates fell below the study’s
                5-point threshold. CVSM-ART moved by 0.20 and 0.16 points. Wet here means the amount of filtered signal mixed
                into the clip. The experiment applied exact digital filters to existing recordings.
              </p>
              <p>
                At 50% wet, the Torres SSL pairwise increases were 22.40 and 14.39 points. An extra analysis done after seeing the
                data compared balanced mixed lists against lists where every wrong clip used the alternate filter. Top-rank error
                went from 54.0% to 75.0% on CoVox and from 39.2% to 61.9% on NUS. Those results describe a deliberately strong
                echo setting and the chosen lists. Testing actual singers in one room would require multiple mic and singer positions.
              </p>
            </div>
            <EvidenceTable id="5" title="Both wet settings with paired and whole-list errors" open />
            <EvidenceTable id="C1" title="The exact response files and decay times" />
            <EvidenceTable id="C2" title="Each room pair at 20% wet" />
            <EvidenceTable id="C3" title="Each room pair at 50% wet" />
            <EvidenceTable id="C4" title="Absolute top-rank errors across list designs" />
            <EvidenceTable id="C5" title="Clean score gaps and impostor score changes" />
          </Chapter>

          <Chapter id="separated-vocals" title="Pulling the voice out can change the match">
            <div className="max-w-prose space-y-4 text-muted">
              <p>
                We mixed voices with five extra backing tracks, then used HTDemucs to pull each voice back out. Error went up
                55.9 and 46.5 points for CVSM-ART on VocalSet and GTSinger, 42.9 and 18.3 for Torres SSL, and 6.3 and 4.3 for CVSM-A.
              </p>
              <p>
                We also tested songs that were already recorded as mixes. From 150 MUSDB18 tracks, 147 had eligible comparisons
                after the silence check, including 100 training-split and 47 test-split tracks. We compared two different windows
                of each track. The query used the original voice stem. The right clip used either its original stem or the voice
                pulled from the full mix. Wrong clips came from other credited artists.
              </p>
              <p>
                CVSM-ART rose from 1.1% error on original stems to 18.0% when only the right clip was separated. When both candidates
                were separated it was 4.6%. The paired increase before rounding was 16.8 points [14.2, 19.8]. The other models rose by
                0.7 to 2.6 points. This is a same-track result, and the separator was trained on material from the MUSDB18 domain.
              </p>
            </div>
            <EvidenceTable id="D1" title="All five encoders on the 147 recorded mixtures" open />
          </Chapter>

          <Chapter id="what-helped" title="Two ways to help, with trade-offs">
            <div className="max-w-prose space-y-4 text-muted">
              <p>
                <strong className="text-ink">Train on more kinds of production.</strong> Giving CVSM-A more varied right matches
                during training cut the penalty by 7.0 points on VocalSet [6.0, 7.9] and 4.4 on GTSinger [3.6, 5.4].
                Clean error moved less than 0.2 points on either dataset. The reductions fell short of the 50% target.
              </p>
              <p>
                <strong className="text-ink">Teach a small adapter that two versions of a clip belong together.</strong> CVSM-ART’s
                shifted error fell from 60.7% to 21.9% on VocalSet and from 46.1% to 23.0% on GTSinger.
                Clean error rose from 7.8% to 13.9% and from 8.9% to 13.2%, respectively. These were experimental changes
                with a clean-audio cost. The Compare page uses the original released models.
              </p>
              <p>
                A separate Music4All check used 72 full mixes from 12 artist labels. At 32 kb/s, the extra error was 35.26 points for
                CVSM-ART, 14.84 for Torres SSL and 24.46 for MERT. The local Yakura model started at 47.29% error and changed by
                +0.35 points [−5.25, 6.01], an inconclusive result. Those files were already compressed and the labels are for
                artists. CVSM’s training included Music4All.
              </p>
            </div>
          </Chapter>

          <Chapter id="verify" title="Follow the numbers back to the tests">
            <div className="max-w-prose space-y-4 text-muted">
              <p>
                The saved JVS scores reproduce all 96 test cells and 84 contrasts. The saved singer counts reproduce all
                200 core model-and-setting rows and 10 shared-condition intervals. Selected F2/G1 crops were also run
                through the models again. Six selected VocalSet settings were regenerated from source audio, with errors matching
                within one point. The tested level and RMS changes left scores unchanged at the recorded precision.
              </p>
              <p>
                For a new benchmark, keep track of what happened to the starting clip, right clip and wrong clip. Repeat the test
                with matching and mismatched processing. Report clean error, changes by model, and uncertainty. These experiments
                measured model rankings using recorded identity labels.
              </p>
            </div>
            <Card tone="surface">
              <h3 className="text-lg">Manuscript and data</h3>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
                <li><a className={paperClass} href={`${source}singer-or-studio.pdf`}>Read the draft (PDF)</a></li>
                <li><a className={paperClass} href={`${source}verification.zip`} download>Download the verification ZIP</a></li>
                <li><a className={paperClass} href={`${source}results.json`} download>Download full-precision results (JSON)</a></li>
                <li><a className={paperClass} href="https://github.com/hawkeye007-dev/singer-or-studio">Open the research repository</a></li>
              </ul>
            </Card>
          </Chapter>
        </article>
      </div>
    </>
  )
}
