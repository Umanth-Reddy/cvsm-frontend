export type ModelId = 'cvsm_art' | 'cvsm_a' | 'cvsm_ah'

export const MODEL_IDS: ModelId[] = ['cvsm_art', 'cvsm_a', 'cvsm_ah']

export interface ModelInfo {
  id: ModelId
  label: string
  description: string
}

export const MODEL_INFO: Record<ModelId, ModelInfo> = {
  cvsm_art: { id: 'cvsm_art', label: 'CVSM-ART', description: 'Artist-informed training with HT-Demucs vocal stems.' },
  cvsm_a: { id: 'cvsm_a', label: 'CVSM-A', description: 'Label-agnostic training with Open-Unmix vocal stems.' },
  cvsm_ah: { id: 'cvsm_ah', label: 'CVSM-AH', description: 'Label-agnostic hybrid training with HT-Demucs vocal stems.' },
}

export interface HealthResponse {
  status: 'ok'
  models: ModelId[]
}

export interface Pair<T> {
  a: T
  b: T
}

export interface SimilarityResponse {
  model: ModelId
  similarity: number
  embedding1: number[]
  embedding2: number[]
}

export interface ModelScore {
  model: ModelId
  cosine: number
}

export interface CompareResponse {
  results: ModelScore[]
  embeddings: Pair<number[]>
}
