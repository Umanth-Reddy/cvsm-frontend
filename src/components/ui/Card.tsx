import type { HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'

const tones = { outline: 'bg-card', surface: 'bg-surface', highlight: 'bg-accent-2' }

type Props = { tone?: keyof typeof tones } & HTMLAttributes<HTMLDivElement>

export function Card({ tone = 'outline', className, ...rest }: Props) {
  return <div className={cx('rounded-card border border-line p-5 sm:p-6', tones[tone], className)} {...rest} />
}
