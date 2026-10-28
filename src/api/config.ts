// Override at build time if the backend is deployed to another origin.
export const API_BASE = (import.meta.env.VITE_API_BASE ?? 'https://cvsm-backend.vercel.app/api').replace(/\/$/, '')
