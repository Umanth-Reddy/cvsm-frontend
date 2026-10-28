import { Link } from 'react-router-dom'
import { NAV_LINKS } from './Navbar'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface print:hidden">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-medium">CVSM Demo</p>
          <p className="mt-2 text-sm text-muted">A working demo of Contrastive Vocal Similarity Modeling.</p>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow mb-3">Pages</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="underline-offset-4 hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <p className="eyebrow mb-3">Paper</p>
          <p className="font-medium">CVSM: Contrastive Vocal Similarity Modeling</p>
          <p className="text-muted">Christos Garoufis, Athanasia Zlatintsi and Petros Maragos</p>
          <p className="text-muted">IEEE TASLP, vol. 34, 2026</p>
          <p className="mt-1">
            <a className="underline underline-offset-4" href="https://doi.org/10.1109/TASLPRO.2026.3677618">
              DOI
            </a>
            {' · '}
            <a className="underline underline-offset-4" href="https://arxiv.org/abs/2510.03025">
              arXiv:2510.03025
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="container-page py-4 text-xs text-muted">
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
