import { defineConfig } from 'vite'
import type { ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'

// A dead backend should read as "unreachable" (502), not Vite's default 500.
const api: Record<string, ProxyOptions> = {
  '/api': {
    target: 'http://localhost:8000',
    configure: (proxy) => {
      proxy.on('error', (_err, _req, res) => {
        if ('writeHead' in res && !res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ detail: 'Backend unreachable' }))
        }
      })
    },
  },
}

export default defineConfig({
  plugins: [react()],
  server: { proxy: api },
  preview: { proxy: api },
})
