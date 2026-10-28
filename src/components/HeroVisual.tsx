import { VinylDisc } from './visuals/VinylDisc'

/** Home hero illustration: a framed latent-space card with a vinyl record. Decorative. */
export function HeroVisual() {
  return (
    <div
      role="img"
      aria-label="Illustration: a vinyl record inside a card labelled latent embedding space"
      className="relative mx-auto flex aspect-square w-full max-w-md flex-col justify-between overflow-hidden rounded-[2rem] border border-line bg-[#efece6] p-6 shadow-sm sm:p-8"
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 400" fill="none" aria-hidden="true">
        <path d="M0 100Q150 200 300 200T400 300" stroke="#171717" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M0 300Q150 200 300 200T400 100" stroke="#f16b50" strokeWidth="2" />
        <circle cx="250" cy="200" r="45" fill="#f2efa0" fillOpacity="0.5" />
      </svg>

      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 font-mono text-[11px]">
          <span className="h-2 w-2 rounded-full bg-accent" />
          LATENT EMBEDDING SPACE
        </span>
        <span className="font-mono text-xs text-muted">Fig 1.1</span>
      </div>

      <div className="relative my-auto flex justify-center py-4">
        <VinylDisc className="h-44 w-44 drop-shadow-xl sm:h-56 sm:w-56" />
        <span className="absolute right-2 top-0 rounded-full bg-accent-2 px-3 py-1 font-mono text-[11px] shadow-sm sm:right-6">
          Disentangled Timbre
        </span>
      </div>

      <div className="relative flex items-end justify-between gap-3">
        <div className="rounded-xl bg-card px-3 py-2 shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Pairing protocol</p>
          <p className="text-xs font-semibold">Vocal ↔ Musical Mixture</p>
        </div>
        <p className="font-mono text-[11px] text-muted">16 kHz mono · Cosine sim</p>
      </div>
    </div>
  )
}
