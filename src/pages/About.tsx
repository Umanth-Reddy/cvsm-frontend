import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageIntro } from '../components/ui/PageIntro'
import { SectionHeading } from '../components/ui/SectionHeading'

// Every field here is on the paper's first page (the arXiv eprint is listed on its arXiv page).
const BIBTEX = `@article{garoufis2026cvsm,
  title={CVSM: Contrastive Vocal Similarity Modeling},
  author={Garoufis, Christos and Zlatintsi, Athanasia and Maragos, Petros},
  journal={IEEE Transactions on Audio, Speech and Language Processing},
  volume={34},
  pages={2724--2737},
  year={2026},
  doi={10.1109/TASLPRO.2026.3677618},
  note={arXiv:2510.03025}
}`

export default function About() {
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(BIBTEX)
      setCopied('done')
    } catch {
      setCopied('failed')
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="About"
        title="About this project."
        lead="A working demo of CVSM, built on the authors' released code and model weights."
      />

      <section className="container-page grid gap-10 py-10 md:grid-cols-2">
        <div>
          <SectionHeading title="Why" />
          <p className="mt-4 text-muted">
            A singing voice reaches the listener mixed with instruments and production. Comparing voices across songs
            therefore means comparing them through the mix. CVSM learns audio representations for that setting.
          </p>
        </div>
        <div>
          <SectionHeading title="Approach" />
          <p className="mt-4 text-muted">
            The model is trained contrastively on pairs of an isolated vocal excerpt and a musical mixture, with pairs chosen
            using artist labels or built from artificial mixtures. The authors evaluate it with linear probing on gender
            identification, artist identification and artist similarity, and with a listening test.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <SectionHeading title="Scope of this demo" />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="text-xl">What it does</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
              <li>Compares two clips you upload.</li>
              <li>Analyses the middle four seconds of each.</li>
              <li>Returns a cosine similarity from each of three models.</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-xl">What it doesn't do</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
              <li>Name singers or label voices.</li>
              <li>Turn a score into a verdict or a percentage.</li>
              <li>Store your audio.</li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="container-page py-10">
        <SectionHeading title="Authors and citation" />
        <p className="mt-4 text-lg">Christos Garoufis, Athanasia Zlatintsi and Petros Maragos</p>
        <p className="text-muted">
          Robotics Institute, Athena Research Center, Greece. Garoufis and Maragos are also with the National Technical
          University of Athens.
        </p>
        <p className="mt-3 text-muted">
          IEEE Transactions on Audio, Speech and Language Processing, vol. 34, pp. 2724 to 2737, 2026.{' '}
          <a className="underline underline-offset-4" href="https://doi.org/10.1109/TASLPRO.2026.3677618">
            doi:10.1109/TASLPRO.2026.3677618
          </a>
          {' · '}
          <a className="underline underline-offset-4" href="https://arxiv.org/abs/2510.03025">
            arXiv:2510.03025
          </a>
          . The paper is licensed under CC BY 4.0.
        </p>
        <Card tone="surface" className="mt-6">
          <pre tabIndex={0} role="region" aria-label="BibTeX citation" className="overflow-x-auto text-sm leading-relaxed">
            <code>{BIBTEX}</code>
          </pre>
          <div className="mt-4 flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={copy}>
              Copy BibTeX
            </Button>
            <span role="status" className="text-sm text-muted">
              {copied === 'done' && 'Copied'}
              {copied === 'failed' && "Couldn't copy. Select the text instead."}
            </span>
          </div>
        </Card>
      </section>

      <section className="container-page py-10">
        <SectionHeading title="Status and licence" />
        <p className="mt-4 max-w-2xl text-muted">
          This is a working demo. The model weights come from the authors' public repository,{' '}
          <a className="underline underline-offset-4" href="https://github.com/cgaroufis/CVSM">
            github.com/cgaroufis/CVSM
          </a>
          , which has no licence file. Public hosting depends on the authors' permission.
        </p>
      </section>
    </>
  )
}
