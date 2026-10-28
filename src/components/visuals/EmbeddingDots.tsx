// Decorative cluster of dots: positions are pseudo-random and carry no data.
function dots(count: number) {
  let seed = 7
  const next = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  return Array.from({ length: count }, (_, i) => {
    const angle = next() * Math.PI * 2
    const radius = 70 * Math.sqrt(next())
    return {
      x: 100 + radius * Math.cos(angle),
      y: 100 + radius * Math.sin(angle),
      r: 2 + next() * 3,
      accent: i % 5 === 0,
      delay: next() * 4,
    }
  })
}

const DOTS = dots(48)

export function EmbeddingDots({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustration: a cluster of dots">
      {DOTS.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill={d.accent ? '#f16b50' : '#171717'}
          className="motion-safe:animate-breathe"
          style={{ animationDelay: `${d.delay}s` }}
        />
      ))}
    </svg>
  )
}
