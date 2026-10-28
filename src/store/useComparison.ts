import { create } from 'zustand'
import { ApiError, api } from '../api/client'
import type { CompareResponse, Pair } from '../api/types'

type Slot = 'a' | 'b'
type Status = 'idle' | 'loading' | 'success' | 'error'

const STORAGE_KEY = 'cvsm.comparison'

interface Saved {
  response: CompareResponse
  names: Pair<string>
}

// File objects live only in memory; scores, durations and filenames survive a refresh.
function load(): Saved | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Saved) : null
  } catch {
    return null
  }
}

function save(saved: Saved | null) {
  try {
    if (saved) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable: results just won't survive a refresh */
  }
}

interface ComparisonState {
  fileA: File | null
  fileB: File | null
  /** Seconds, measured in the browser when the waveform decodes. */
  durations: Pair<number | null>
  status: Status
  response: CompareResponse | null
  /** Filenames the stored response belongs to (the Files may be gone after a refresh). */
  names: Pair<string> | null
  error: ApiError | null
  setFile: (slot: Slot, file: File | null) => void
  setDuration: (slot: Slot, seconds: number | null) => void
  run: () => Promise<boolean>
  reset: () => void
}

const saved = load()

export const useComparison = create<ComparisonState>((set, get) => ({
  fileA: null,
  fileB: null,
  durations: { a: null, b: null },
  status: saved ? 'success' : 'idle',
  response: saved?.response ?? null,
  names: saved?.names ?? null,
  error: null,

  // Changing a file invalidates any earlier result.
  setFile: (slot, file) => {
    save(null)
    set((s) => ({
      [slot === 'a' ? 'fileA' : 'fileB']: file,
      durations: { ...s.durations, [slot]: null },
      status: 'idle',
      response: null,
      names: null,
      error: null,
    }))
  },

  setDuration: (slot, seconds) => set((s) => ({ durations: { ...s.durations, [slot]: seconds } })),

  run: async () => {
    const { fileA, fileB } = get()
    if (!fileA || !fileB) return false
    set({ status: 'loading', error: null })
    try {
      const response = await api.compare(fileA, fileB)
      const names = { a: fileA.name, b: fileB.name }
      save({ response, names })
      set({ status: 'success', response, names })
      return true
    } catch (e) {
      set({ status: 'error', response: null, names: null, error: e instanceof ApiError ? e : new ApiError(0, String(e)) })
      return false
    }
  },

  reset: () => {
    save(null)
    set({ fileA: null, fileB: null, durations: { a: null, b: null }, status: 'idle', response: null, names: null, error: null })
  },
}))
