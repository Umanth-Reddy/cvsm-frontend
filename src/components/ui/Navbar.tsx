import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { cx } from '../../lib/cx'

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/compare', label: 'Compare' },
  { to: '/results', label: 'Results' },
  { to: '/gallery', label: 'Gallery' },
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
    <header className="sticky top-0 z-20 border-b border-line bg-bg print:hidden">
      <nav ref={nav} aria-label="Main" className="container-page flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-medium" onClick={() => setOpen(false)}>
          <span className="h-3 w-3 rounded-full bg-accent" aria-hidden="true" />
          CVSM
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
            'lg:static lg:flex lg:flex-row lg:border-0 lg:p-0',
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
                    'flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors lg:min-h-0 lg:py-2',
                    isActive ? 'bg-accent text-ink' : 'text-ink hover:bg-surface',
                  )
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
