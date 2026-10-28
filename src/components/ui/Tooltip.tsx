import { cloneElement, useEffect, useId, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { cx } from '../../lib/cx'

interface Props {
  content: string
  /** A single focusable element, e.g. a button. */
  children: ReactElement<{ 'aria-describedby'?: string }>
}

export function Tooltip({ content, children }: Props) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLSpanElement>(null)

  // Touch browsers may not focus a tapped button, so a tap elsewhere has to close it.
  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open])

  return (
    <span
      ref={root}
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen(true)}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      {cloneElement(children, { 'aria-describedby': id })}
      <span
        id={id}
        role="tooltip"
        className={cx(
          'pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-max max-w-xs -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-sm text-bg transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        )}
      >
        {content}
      </span>
    </span>
  )
}
