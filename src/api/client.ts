import { API_BASE } from './config'
import { MODEL_IDS } from './types'
import type { CompareResponse, HealthResponse, ModelId, SimilarityResponse } from './types'

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

async function request<T>(init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/cvsm`, init)
  } catch {
    throw new ApiError(0, 'Network error')
  }
  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = await res.json()
      if (typeof body?.error === 'string') detail = body.error
    } catch {
      /* non-JSON error body: keep the status text */
    }
    const retry = Number(res.headers.get('Retry-After'))
    throw new ApiError(res.status, detail, retry > 0 ? retry : undefined)
  }
  return res.json() as Promise<T>
}

function similarity(fileA: File, fileB: File, model: ModelId) {
  const body = new FormData()
  body.append('model', model)
  body.append('audio1', fileA)
  body.append('audio2', fileB)
  return request<SimilarityResponse>({ method: 'POST', body })
}

export const api = {
  health: () => request<HealthResponse>(),
  compare: async (fileA: File, fileB: File): Promise<CompareResponse> => {
    const responses = await Promise.all(MODEL_IDS.map((model) => similarity(fileA, fileB, model)))
    for (const [index, result] of responses.entries()) {
      if (result.model !== MODEL_IDS[index] || !Number.isFinite(result.similarity) ||
          result.similarity < -1 || result.similarity > 1 ||
          !Array.isArray(result.embedding1) || result.embedding1.length !== 1280 ||
          !Array.isArray(result.embedding2) || result.embedding2.length !== 1280 ||
          !result.embedding1.every(Number.isFinite) || !result.embedding2.every(Number.isFinite)) {
        throw new ApiError(502, 'The CVSM service returned an invalid result.')
      }
    }
    return {
      results: responses.map(({ model, similarity }) => ({ model, cosine: similarity })),
      embeddings: { a: responses[0].embedding1, b: responses[0].embedding2 },
    }
  },
}

export function describeError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Something went wrong'
  switch (error.status) {
    case 0:
    case 503:
    case 504:
      return "Can't reach the CVSM service"
    case 413:
      return 'The two files are too large for this service (4 MiB combined)'
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
