import { useEffect, useState } from 'react'
import { Spinner } from './Spinner'

interface Props {
  message: string
  /** After this many ms, `slowMessage` is shown too. No fake progress is ever drawn. */
  slowAfterMs?: number
  slowMessage?: string
}

export function LoadingState({ message, slowAfterMs, slowMessage }: Props) {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    if (!slowAfterMs) return
    const timer = setTimeout(() => setSlow(true), slowAfterMs)
    return () => clearTimeout(timer)
  }, [slowAfterMs])

  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 py-10 text-center">
      <Spinner className="h-8 w-8" />
      <p className="font-medium">{message}</p>
      {slow && slowMessage && <p className="max-w-md text-sm text-muted">{slowMessage}</p>}
    </div>
  )
}
