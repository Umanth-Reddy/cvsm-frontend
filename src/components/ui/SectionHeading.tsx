interface Props {
  eyebrow?: string
  title: string
  description?: string
}

export function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="eyebrow mb-3 text-accent-ink">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-muted">{description}</p>}
    </div>
  )
}
