import { Link } from 'react-router-dom'
import { NAV_LINKS } from './Navbar'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-[#efece6]/60 print:hidden">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-ink" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">CVSM</span>
            <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-xs uppercase text-muted">IEEE TASLP 2026</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Contrastive Vocal Similarity Modeling explores audio representations for perceived singing-voice similarity,
            pairing vocal excerpts with musical mixtures containing instrumental accompaniment.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow mb-3">Navigation</p>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="transition-colors hover:text-accent-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="eyebrow mb-3">Source publication</p>
          <div className="space-y-2 rounded-2xl border border-line bg-bg p-4 text-xs">
            <p className="font-semibold">CVSM: Contrastive Vocal Similarity Modeling</p>
            <p className="text-muted">Christos Garoufis, Athanasia Zlatintsi and Petros Maragos</p>
            <p className="italic text-muted">IEEE TASLP, vol. 34, 2026</p>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-2 font-mono text-[11px]">
              <a className="text-accent-ink hover:underline" href="https://doi.org/10.1109/TASLPRO.2026.3677618">
                DOI ↗
              </a>
              <a className="text-muted hover:underline" href="https://arxiv.org/abs/2510.03025">
                arXiv:2510.03025 ↗
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="container-page py-5 text-xs text-muted">
          Code and model weights come from{' '}
          <a className="underline underline-offset-4" href="https://github.com/cgaroufis/CVSM">
            github.com/cgaroufis/CVSM
          </a>
          , which has no licence file; public hosting depends on the authors' permission.
        </p>
      </div>
    </footer>
  )
}
