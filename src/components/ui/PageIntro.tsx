import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'

interface Props {
  eyebrow?: string
  title: string
  lead?: string
  /** `display` is the oversized home headline; `page` suits inner pages. */
  size?: 'display' | 'page'
  /** Buttons or links under the lead. */
  children?: ReactNode
}

export function PageIntro({ eyebrow, title, lead, size = 'page', children }: Props) {
  return (
    <header className="container-page pb-10 pt-12 sm:pt-16">
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h1 className={cx('max-w-4xl font-medium', size === 'display' ? 'text-display' : 'text-page')}>{title}</h1>
      {lead && <p className="mt-6 max-w-2xl text-lg text-muted">{lead}</p>}
      {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
    </header>
  )
}
