// Frontend -> FastAPI base URL.
// We can override with: VITE_API_BASE="https://your-backend.example.com"
export const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000';
