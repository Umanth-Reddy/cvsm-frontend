import { Card } from './Card'

interface Props {
  label: string
  value: string
  hint?: string
}

export function MetricCard({ label, value, hint }: Props) {
  return (
    <Card>
      <p className="eyebrow">{label}</p>
      <p className="mt-2 text-4xl font-medium tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </Card>
  )
}
