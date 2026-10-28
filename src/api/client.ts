// The only file that calls fetch.
import { API_BASE } from './config'
import type {
  CompareResponse,
  EmbedResponse,
  GalleryResponse,
  HealthResponse,
  ModelId,
  ModelsResponse,
  SimilarityResponse,
} from './types'

/** status 0 means the request never got a response (backend down, offline). */
export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
    public retryAfter?: number,
  ) {
    super(detail)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, init)
  } catch {
    throw new ApiError(0, 'Network error')
  }
  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = await res.json()
      if (typeof body?.detail === 'string') detail = body.detail
    } catch {
      /* non-JSON error body: keep the status text */
    }
    const retry = Number(res.headers.get('Retry-After'))
    throw new ApiError(res.status, detail, retry > 0 ? retry : undefined)
  }
  return res.json() as Promise<T>
}

function form(files: Record<string, File>): FormData {
  const body = new FormData()
  for (const [key, file] of Object.entries(files)) body.append(key, file)
  return body
}

export const api = {
  health: () => request<HealthResponse>('/health'),
  models: () => request<ModelsResponse>('/models'),
  gallery: () => request<GalleryResponse>('/gallery'),
  embed: (file: File, model: ModelId) =>
    request<EmbedResponse>(`/embed?model=${model}`, { method: 'POST', body: form({ file }) }),
  similarity: (fileA: File, fileB: File, model: ModelId) =>
    request<SimilarityResponse>(`/similarity?model=${model}`, {
      method: 'POST',
      body: form({ file_a: fileA, file_b: fileB }),
    }),
  compare: (fileA: File, fileB: File) =>
    request<CompareResponse>('/compare', {
      method: 'POST',
      body: form({ file_a: fileA, file_b: fileB }),
    }),
}

/** User-facing wording for each failure the brief names. */
export function describeError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Something went wrong'
  switch (error.status) {
    case 0:
    case 502: // a proxy in front of a stopped or still-starting backend
    case 503:
    case 504:
      return "Can't reach the CVSM service"
    case 413:
      return 'File is over 15 MB'
    case 415:
      return 'Unsupported audio format'
    case 422:
      return "Couldn't decode this audio or it's too short"
    case 429:
      return error.retryAfter
        ? `Too many requests, try again in ${error.retryAfter} s`
        : 'Too many requests, try again shortly'
    default:
      return error.status >= 500 ? 'The CVSM service had a problem. Try again.' : error.detail
  }
}
