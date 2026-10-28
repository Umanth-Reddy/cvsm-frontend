// Client-side checks mirror the backend limits (cvsm-demo/app.py); the server stays authoritative.
export const ALLOWED_EXTENSIONS = ['.wav', '.mp3', '.flac', '.ogg', '.m4a']
export const ACCEPT = ALLOWED_EXTENSIONS.join(',')
export const MAX_BYTES = 15 * 1024 * 1024

export function validateAudioFile(file: File): string | null {
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) return 'Unsupported audio format'
  if (file.size > MAX_BYTES) return 'File is over 15 MB'
  return null
}

export function formatBytes(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function formatDuration(seconds: number): string {
  const s = Math.round(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
