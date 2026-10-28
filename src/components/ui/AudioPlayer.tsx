import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { formatDuration } from '../../lib/audio'

export interface AudioPlayerHandle {
  play: () => void
  pause: () => void
  /** Restart from the beginning. */
  replay: () => void
}

interface Props {
  /** A local File, or a URL string. */
  src: File | string
  /** Names the clip for screen readers, e.g. "Audio A". */
  label: string
  onDuration?: (seconds: number) => void
  /** Start playing once the audio has loaded. */
  autoPlay?: boolean
}

export const AudioPlayer = forwardRef<AudioPlayerHandle, Props>(function AudioPlayer({ src, label, onDuration, autoPlay }, ref) {
  const container = useRef<HTMLDivElement>(null)
  const wave = useRef<WaveSurfer | null>(null)
  const onDurationRef = useRef(onDuration)
  onDurationRef.current = onDuration
  const autoPlayRef = useRef(autoPlay)
  autoPlayRef.current = autoPlay

  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!container.current) return
    const url = typeof src === 'string' ? src : URL.createObjectURL(src)
    let disposed = false
    setFailed(false)
    setDuration(null)
    setTime(0)
    setPlaying(false)

    const ws = WaveSurfer.create({
      container: container.current,
      url,
      height: 64,
      waveColor: '#b9b2a4',
      progressColor: '#171717',
      cursorColor: '#f16b50', // the playhead is one of the places coral is allowed
      cursorWidth: 2,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      normalize: true,
    })
    wave.current = ws
    ws.on('ready', (d) => {
      setDuration(d)
      onDurationRef.current?.(d)
      if (autoPlayRef.current) void ws.play()
    })
    ws.on('timeupdate', setTime)
    ws.on('play', () => setPlaying(true))
    ws.on('pause', () => setPlaying(false))
    ws.on('error', () => !disposed && setFailed(true))

    return () => {
      disposed = true
      ws.destroy()
      wave.current = null
      if (typeof src !== 'string') URL.revokeObjectURL(url)
    }
  }, [src])

  useImperativeHandle(ref, () => ({
    play: () => void wave.current?.play(),
    pause: () => wave.current?.pause(),
    replay: () => {
      wave.current?.seekTo(0)
      void wave.current?.play()
    },
  }))

  return (
    <div className="mt-4">
      <div ref={container} className={failed ? 'hidden' : undefined} />
      {failed ? (
        <p role="alert" className="text-sm">
          This browser couldn't decode the audio for a preview. You can still compare it.
        </p>
      ) : (
        <div className="mt-3 flex items-center gap-4">
          <button
            type="button"
            onClick={() => wave.current?.playPause()}
            disabled={duration === null}
            aria-label={`${playing ? 'Pause' : 'Play'} ${label}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-bg disabled:opacity-40"
          >
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <rect x="2" y="1" width="3.5" height="12" fill="currentColor" />
                <rect x="8.5" y="1" width="3.5" height="12" fill="currentColor" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3 1l10 6-10 6z" fill="currentColor" />
              </svg>
            )}
          </button>
          <span className="text-sm tabular-nums text-muted">
            {formatDuration(time)} / {duration === null ? '–:––' : formatDuration(duration)}
          </span>
        </div>
      )}
    </div>
  )
})
