# Experience Rishikesh

A live-mood storefront for Tapovan — curated experiences, real-time venue vibes, one-tap WhatsApp booking, and a password-gated admin panel that runs against a tiny Node backend.

## Quick start

```bash
npm install
npm run dev:all        # runs the Vite frontend and the API together
```

- Frontend: http://localhost:5173
- API:      http://localhost:3001

To run them separately:

```bash
npm run dev        # frontend only (Vite dev server on :5173)
npm run server     # API only (Node/Express on :3001)
```

The Vite dev server proxies `/api/*` and `/uploads/*` to the backend, so from the browser everything looks like a single origin.

## Admin

- Route: `/admin`
- Default password: `tapovan2026`
- Override with an env var when running the API:

```bash
ADMIN_PASSWORD='your-strong-password' npm run server
```

The admin panel talks to the backend for reads and writes:

- **Save (live)** — writes services to `server/data.json` on the API server; every visitor sees the change on next load.
- **Export JSON** — downloads a `services-*.js` you can paste into `src/data/services.js` as a static fallback (also useful for git history of pricing changes).
- **Reset** — deletes `data.json` on the server and reseeds from `src/data/services.js`.
- **Upload image** — sends the file to `POST /api/upload`; the server saves it under `public/uploads/` and returns a `/uploads/<filename>` URL that the site can render directly.

If the backend is not running, the admin still works in "local draft" mode (writes go to `localStorage`) and the site falls back to the bundled data in `src/data/services.js`.

## Data + storage

- Services live in `server/data.json` at runtime.
- On first startup the API seeds `data.json` from `src/data/services.js` (this is a one-way seed — subsequent edits go through the admin panel).
- Uploaded images live in `public/uploads/`. Both `server/data.json` and `public/uploads/` are gitignored — deploy your backend somewhere with persistent storage (a small VPS, Fly.io, Railway, Render).

## API surface

| Method | Route                | Auth | Purpose |
|--------|----------------------|------|---------|
| GET    | `/api/health`        | no   | Liveness ping |
| GET    | `/api/services`      | no   | Read current services |
| PUT    | `/api/services`      | yes  | Replace services (body: `{ services: {...} }`) |
| POST   | `/api/services/reset`| yes  | Delete + reseed from source |
| POST   | `/api/auth`          | no   | Verify password |
| POST   | `/api/upload`        | yes  | Multipart image upload |

Write endpoints require the header `x-admin-password: <ADMIN_PASSWORD>`.

## Going to production

- Set `ADMIN_PASSWORD` to a strong secret via env, not the default.
- Serve the built frontend (`npm run build` → `dist/`) from any static host; point it at the API origin (add a runtime `VITE_API_ORIGIN` if you split them).
- When you outgrow the JSON file, swap `server/index.js` for the same routes backed by Postgres (Supabase) or Firestore — the frontend contract stays the same.

## PWA

The site ships with `manifest.webmanifest` + a small `public/sw.js` for offline-friendly app-shell caching. Add-to-home-screen works on iOS + Android.
