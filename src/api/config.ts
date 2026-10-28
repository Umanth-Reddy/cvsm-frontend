// Relative by default so the same build works behind the Vite proxy and when FastAPI serves it.
export const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'
