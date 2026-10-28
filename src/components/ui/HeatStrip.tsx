import { useEffect, useRef } from 'react'

const ZERO = [247, 245, 240] // page background
const POSITIVE = [241, 107, 80] // coral
const NEGATIVE = [23, 23, 23] // ink

interface Props {
  label: string
  values: number[]
  /** Largest absolute value, shared by every strip so they are on one scale. */
  scale: number
}

const mix = (to: number[], t: number) => ZERO.map((z, i) => Math.round(z + (to[i] - z) * t))

/** One embedding as a single row of cells: coral above zero, dark below, pale at zero. */
export function HeatStrip({ label, values, scale }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d')
    if (!ctx) return
    const image = ctx.createImageData(values.length, 1)
    values.forEach((v, i) => {
      const [r, g, b] = mix(v >= 0 ? POSITIVE : NEGATIVE, Math.min(1, Math.abs(v) / scale))
      image.data.set([r, g, b, 255], i * 4)
    })
    ctx.putImageData(image, 0, 0)
  }, [values, scale])

  return (
    <canvas
      ref={canvas}
      width={values.length}
      height={1}
      role="img"
      aria-label={`${label}: raw embedding values, ${values.length} cells`}
      className="h-10 w-full rounded border border-line"
    />
  )
}
