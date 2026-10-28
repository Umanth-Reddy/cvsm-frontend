// Mirrors the API contract in implementation.txt section 3 and cvsm-demo/app.py.

export type ModelId = 'cvsm_art' | 'mscol' | 'cvsm_a'

export interface HealthResponse {
  status: 'ok'
  models_loaded: string[]
}

export interface ModelInfo {
  id: ModelId
  label: string
  description: string
}

export interface ModelsResponse {
  models: ModelInfo[]
}

export interface EmbedResponse {
  model: ModelId
  dim: number
  embedding: number[]
  duration_s: number
  clipped: boolean
}

export interface Pair<T> {
  a: T
  b: T
}

export interface SimilarityResponse {
  model: ModelId
  cosine: number
  duration_s: Pair<number>
  clipped: Pair<boolean>
}

/** Present when the server has a reference.json (scripts/eval_reference.py). */
export interface CalibrationReference {
  diff_artist_p10: number
  diff_artist_median: number
  same_artist_median: number
  n_clips: number
  n_artists: number
}

export interface ModelScore {
  model: ModelId
  cosine: number
  centred_cosine?: number
  reference?: CalibrationReference
}

export interface CompareResponse {
  results: ModelScore[]
  duration_s: Pair<number>
  clipped: Pair<boolean>
}

export interface GalleryClip {
  id: string
  label: string
  x: number
  y: number
  audio_url: string
}

export interface GalleryResponse {
  clips: GalleryClip[]
}
