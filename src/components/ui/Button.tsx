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
  primary: 'bg-black text-bg shadow-sm hover:bg-[#1f1f1f] active:scale-95',
  secondary: 'border border-line bg-surface text-ink hover:bg-[#ded6ca]',
  ghost: 'text-ink hover:bg-surface',
}

export function Button({ variant = 'primary', size = 'md', loading, to, className, children, disabled, ...rest }: Props) {
  const classes = cx(
    'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all',
    size === 'md' ? 'px-6 py-3.5' : 'min-h-11 px-4 py-1.5 text-sm', // 44 px touch target
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
