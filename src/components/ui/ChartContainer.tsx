import type { ReactNode } from 'react'
import { Card } from './Card'

interface Props {
  title: string
  caption?: string
  children: ReactNode
}

/** Frame for a chart: title, the chart itself, and a caption that says what it shows. */
export function ChartContainer({ title, caption, children }: Props) {
  return (
    <Card>
      <figure>
        <h3 className="text-lg">{title}</h3>
        <div className="mt-4">{children}</div>
        {caption && <figcaption className="mt-4 text-sm text-muted">{caption}</figcaption>}
      </figure>
    </Card>
  )
}
