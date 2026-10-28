import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../../lib/cx'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'ghost'

type Props = {
  variant?: Variant
  size?: 'md' | 'sm'
  loading?: boolean
  /** Render as a router link instead of a button. */
  to?: string
  children: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

const variants: Record<Variant, string> = {
  // Near-black text on coral: coral on ivory is too low-contrast for text the other way round.
  primary: 'bg-accent text-ink hover:brightness-95',
  secondary: 'border border-ink text-ink hover:bg-surface',
  ghost: 'text-ink hover:bg-surface',
}

export function Button({ variant = 'primary', size = 'md', loading, to, className, children, disabled, ...rest }: Props) {
  const classes = cx(
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors',
    size === 'md' ? 'px-6 py-3' : 'min-h-11 px-4 py-1.5 text-sm', // 44 px touch target
    variants[variant],
    (disabled || loading) && 'cursor-not-allowed opacity-50',
    className,
  )
  if (to && !disabled) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }
  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}
