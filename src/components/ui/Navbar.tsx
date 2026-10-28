import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { cx } from '../../lib/cx'

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/compare', label: 'Compare' },
  { to: '/results', label: 'Results' },
  { to: '/gallery', label: 'Demo audio' },
  { to: '/evaluation', label: 'Evaluation' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const nav = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  // Escape closes the menu (focus returns to its button); so does a tap outside it.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    const onPointer = (e: PointerEvent) => {
      if (!nav.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur-md print:hidden">
      <nav ref={nav} aria-label="Main" className="container-page flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link to="/" className="flex items-center gap-3 text-left" onClick={() => setOpen(false)}>
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-ink shadow-sm" aria-hidden="true">
            <span className="h-5 w-5 rounded-full border-2 border-bg/70" />
            <span className="absolute h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight">CVSM</span>
              <span className="hidden rounded bg-surface px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted sm:inline">
                IEEE TASLP '26
              </span>
            </span>
            <span className="hidden text-[11px] text-muted xl:block">Contrastive Vocal Similarity</span>
          </span>
        </Link>

        <button
          ref={toggle}
          type="button"
          className="min-h-11 rounded-full border border-line px-5 text-sm font-medium lg:hidden"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <ul
          id="nav-links"
          className={cx(
            'absolute left-0 right-0 top-full flex-col gap-1 border-b border-line bg-bg px-5 py-3 sm:px-8',
            'lg:static lg:flex lg:flex-row lg:gap-0 lg:rounded-full lg:border lg:bg-[#efece6]/80 lg:p-1.5',
            open ? 'flex' : 'hidden',
          )}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cx(
                    'flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors lg:min-h-0 lg:py-1.5 lg:text-xs',
                    isActive ? 'bg-black text-bg shadow-sm' : 'text-ink hover:bg-[#e2ddd5]/70',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />}
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <Link
          to="/compare"
          className="hidden items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-semibold text-bg shadow-sm transition-all hover:bg-[#1f1f1f] active:scale-95 xl:inline-flex"
        >
          Compare Songs
          <span className="text-accent" aria-hidden="true">↗</span>
        </Link>
      </nav>
    </header>
  )
}
