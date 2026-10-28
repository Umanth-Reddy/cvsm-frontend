import type { ReactNode } from 'react'

interface Props {
  title?: string
  message: string
  action?: ReactNode
}

export function ErrorState({ title = 'Something went wrong', message, action }: Props) {
  return (
    <div role="alert" className="rounded-card border border-ink border-l-8 border-l-accent bg-bg p-5 sm:p-6">
      <h2 className="text-lg">{title}</h2>
      <p className="mt-1 text-muted">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
