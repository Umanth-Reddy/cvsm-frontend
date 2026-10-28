import { useRef, useState } from 'react'
import { ACCEPT, formatBytes, formatDuration, validateAudioFile } from '../../lib/audio'
import { AudioPlayer } from './AudioPlayer'
import { Button } from './Button'
import { Card } from './Card'

interface Props {
  label: string
  file: File | null
  duration: number | null
  onFile: (file: File) => void
  onRemove: () => void
  onDuration: (seconds: number) => void
  /** An error from outside the card, e.g. a failed upload. */
  error?: string
  disabled?: boolean
}

export function UploadCard({ label, file, duration, onFile, onRemove, onDuration, error, disabled }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [rejection, setRejection] = useState<string | null>(null)

  const accept = (candidate: File | undefined) => {
    if (!candidate) return
    const problem = validateAudioFile(candidate)
    setRejection(problem)
    if (!problem) onFile(candidate)
  }
  const shown = error ?? rejection

  // The whole card is the drop target, so a file dropped on a loaded card replaces it.
  return (
    <Card
      tone={dragging ? 'highlight' : 'outline'}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        if (!disabled) accept(e.dataTransfer.files[0])
      }}
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        {file && (
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            aria-label={`Remove ${label}`}
            onClick={() => {
              setRejection(null)
              onRemove()
            }}
          >
            Remove
          </Button>
        )}
      </div>

      {file ? (
        <>
          <p className="mt-3 truncate font-medium" title={file.name}>
            {file.name}
          </p>
          <p className="text-sm text-muted">
            {formatBytes(file.size)}
            {duration !== null && ` · ${formatDuration(duration)}`}
          </p>
          <AudioPlayer src={file} label={label} onDuration={onDuration} />
        </>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => input.current?.click()}
          className="mt-3 flex w-full flex-col items-center gap-1 rounded-card border border-dashed border-muted-soft px-4 py-10 text-center transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="font-medium">Drop audio here or choose a file</span>
          <span className="text-sm text-muted">WAV, MP3, FLAC, OGG or M4A · 4 MiB combined</span>
        </button>
      )}

      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-label={`Choose a file for ${label}`}
        onChange={(e) => {
          accept(e.target.files?.[0])
          e.target.value = '' // lets the same file be picked again after a rejection
        }}
      />

      {shown && (
        <p role="alert" className="mt-3 border-l-4 border-accent pl-3 text-sm font-medium">
          {shown}
        </p>
      )}
    </Card>
  )
}
