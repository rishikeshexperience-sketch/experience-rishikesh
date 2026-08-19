// One place to resolve the API origin.
//
// In dev we proxy /api and /uploads through Vite (vite.config.js), so an empty
// string works — the browser hits the same origin. In production the frontend
// lives on Vercel and the backend on Render (or wherever), so set
// VITE_API_ORIGIN=https://your-backend.example.com at build time.
export const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN || '').replace(/\/$/, '');
export const api = (path) => `${API_ORIGIN}${path.startsWith('/') ? path : '/' + path}`;
