import type { ReactNode } from 'react'
import { Card } from './Card'

interface Props {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <Card tone="surface" className="py-12 text-center">
      <h2 className="text-xl">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-md text-muted">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </Card>
  )
}
