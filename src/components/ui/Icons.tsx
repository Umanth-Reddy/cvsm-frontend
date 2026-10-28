import type { ReactNode } from 'react'

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

export const MusicIcon = () => (
  <Icon>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </Icon>
)

export const LayersIcon = () => (
  <Icon>
    <path d="m12 2 10 5-10 5L2 7z" />
    <path d="m2 17 10 5 10-5" />
    <path d="m2 12 10 5 10-5" />
  </Icon>
)

export const SparkIcon = () => (
  <Icon>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="m12 8 1.5 3.5L17 13l-3.5 1.5L12 18l-1.5-3.5L7 13l3.5-1.5z" />
  </Icon>
)

export const UploadIcon = () => (
  <Icon>
    <path d="M12 16V4M7 9l5-5 5 5" />
    <path d="M4 20h16" />
  </Icon>
)
