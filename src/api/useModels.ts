import { useEffect, useState } from 'react'
import { api } from './client'
import type { ModelInfo } from './types'

let request: Promise<ModelInfo[]> | null = null

/** Labels and descriptions for the served models. Empty until loaded, and if the call fails. */
export function useModels(): ModelInfo[] {
  const [models, setModels] = useState<ModelInfo[]>([])

  useEffect(() => {
    request ??= api.models().then((r) => r.models)
    request.then(setModels).catch(() => {
      request = null // let the next page try again
    })
  }, [])

  return models
}
