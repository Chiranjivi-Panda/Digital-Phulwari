// Local dev: uses localhost automatically.
// On Vercel: we set VITE_API_URL to the Render backend URL.
export const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'