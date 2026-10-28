export function VinylDisc({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustration: a vinyl record">
      <g className="origin-center motion-safe:animate-spin-slow" style={{ transformOrigin: '100px 100px' }}>
        <circle cx="100" cy="100" r="96" fill="#171717" />
        {[84, 74, 64, 54].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#3a3a3a" strokeWidth="1" />
        ))}
        <path d="M100 4a96 96 0 0 1 68 28" fill="none" stroke="#6b6b6b" strokeWidth="2" strokeLinecap="round" />
        <circle cx="100" cy="100" r="30" fill="#f16b50" />
        <circle cx="100" cy="100" r="4" fill="#f7f5f0" />
      </g>
    </svg>
  )
}
