import { EmbeddingDots } from './visuals/EmbeddingDots'
import { VinylDisc } from './visuals/VinylDisc'
import { WaveformRibbon } from './visuals/WaveformRibbon'

/** Home hero illustration: two records whose waveforms flow into one shared cluster. Decorative. */
export function HeroVisual() {
  return (
    <div
      role="img"
      aria-label="Illustration: two records whose waveforms flow into one shared cluster of dots"
      className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-6 sm:gap-x-5"
    >
      <VinylDisc className="h-16 w-16 sm:h-24 sm:w-24" />
      <WaveformRibbon className="h-24 w-full overflow-hidden sm:h-28" />
      <EmbeddingDots className="row-span-2 h-32 w-32 sm:h-44 sm:w-44" />
      <VinylDisc className="h-16 w-16 sm:h-24 sm:w-24" />
      <WaveformRibbon className="h-24 w-full -scale-y-100 overflow-hidden sm:h-28" />
    </div>
  )
}
