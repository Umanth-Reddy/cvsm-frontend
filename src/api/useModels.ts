import { useEffect, useState } from 'react'
import { api } from './client'
import { MODEL_INFO } from './types'
import type { ModelInfo } from './types'

let request: Promise<ModelInfo[]> | null = null

/** Labels and descriptions for the served models. Empty until loaded, and if the call fails. */
export function useModels(): ModelInfo[] {
  const [models, setModels] = useState<ModelInfo[]>([])

  useEffect(() => {
    request ??= api.health().then((r) => r.models.map((id) => MODEL_INFO[id]).filter(Boolean))
    request.then(setModels).catch(() => {
      request = null // let the next page try again
    })
  }, [])

  return models
}
