/**
 * Experience Rishikesh — tiny backend for admin edits and image uploads.
 * Storage is a JSON file + a public uploads folder. Auth is a shared admin
 * password sent in the `x-admin-password` header on write endpoints.
 *
 * Env:
 *   PORT            (default 3001)
 *   ADMIN_PASSWORD  (default 'tapovan2026' — override this in production)
 *   SEED_FROM_CODE  (default '1' — reseed data.json from src/data/services.js on first run)
 */

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// PERSIST_DIR points at the persistent disk when the platform mounts one
// (e.g. Render's /opt/render/project/src/persist). Locally we default to
// `server/` so nothing changes for dev, and `public/uploads/` is still where
// files land in dev — Vite serves them directly.
const PERSIST_DIR = process.env.PERSIST_DIR || __dirname;
const DATA_FILE = path.join(PERSIST_DIR, 'data.json');
const UPLOAD_DIR = process.env.PERSIST_DIR
  ? path.join(PERSIST_DIR, 'uploads')
  : path.join(ROOT, 'public', 'uploads');

const PORT = Number(process.env.PORT || 3001);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'tapovan2026';
const SEED = process.env.SEED_FROM_CODE !== '0';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Ensure storage dirs exist.
fs.mkdirSync(PERSIST_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ── Storage ────────────────────────────────────────────────
function readServices() {
  if (!fs.existsSync(DATA_FILE)) return null;
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch (e) { console.error('data.json is corrupt:', e.message); return null; }
}

function writeServices(obj) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2));
}

// Optionally seed from the frontend source of truth on first run.
async function seedIfNeeded() {
  if (!SEED) return;
  if (fs.existsSync(DATA_FILE)) return;
  try {
    // Vite JS import via file URL. We only need SERVICES at build/seed time.
    const url = 'file://' + path.join(ROOT, 'src', 'data', 'services.js');
    const mod = await import(url);
    if (mod?.SERVICES) {
      writeServices(mod.SERVICES);
      console.log('Seeded data.json from src/data/services.js');
    }
  } catch (e) {
    console.warn('Could not seed from src/data/services.js:', e.message);
    writeServices({});
  }
}

// ── App ────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',').map(s => s.trim()) }));
app.use(express.json({ limit: '2mb' }));

// Serve uploaded images directly from the persistent disk when hosted.
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d', fallthrough: true }));

function requireAuth(req, res, next) {
  const pwd = req.get('x-admin-password') || '';
  if (pwd !== ADMIN_PASSWORD) return res.status(401).json({ error: 'unauthorized' });
  next();
}

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true, port: PORT }));

// Verify password without doing anything else — used by the admin login screen.
app.post('/api/auth', (req, res) => {
  const pwd = req.body?.password || '';
  if (pwd !== ADMIN_PASSWORD) return res.status(401).json({ ok: false });
  res.json({ ok: true });
});

// Public read.
app.get('/api/services', (_req, res) => {
  const data = readServices();
  res.json({ services: data || {} });
});

// Full replace (write). Frontend sends the whole map keyed by categoryId.
app.put('/api/services', requireAuth, (req, res) => {
  const body = req.body?.services;
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'services object required' });
  writeServices(body);
  res.json({ ok: true });
});

// Reset to code defaults (deletes data.json so next request re-seeds if enabled).
app.post('/api/services/reset', requireAuth, async (_req, res) => {
  if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE);
  await seedIfNeeded();
  res.json({ ok: true, services: readServices() || {} });
});

// Image upload — accepts multipart/form-data with field name 'image'.
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => {
      const safe = String(file.originalname || 'img')
        .toLowerCase()
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 40) || 'img';
      const ext = (path.extname(file.originalname) || '.jpg').toLowerCase();
      cb(null, `${safe}-${randomUUID().slice(0, 8)}${ext}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB per image
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif|svg\+xml)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image uploads are allowed'));
  },
});

app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ ok: true, url, filename: req.file.filename, size: req.file.size });
});

// ── Serve the built React frontend (single-service deployment) ──
// Only kicks in when `dist/` exists — i.e. after `npm run build`. In dev the
// Vite server owns the frontend, so we don't touch this at all.
const DIST_DIR = path.join(ROOT, 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, { maxAge: '1h', index: false }));
  // SPA fallback: any GET that isn't /api/* or /uploads/* returns index.html
  // so React Router owns client-side routes.
  app.get(/^\/(?!api\/|uploads\/).*/, (_req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
  console.log(`▲ Serving built frontend from ${DIST_DIR}`);
} else {
  console.log('▲ No dist/ found — frontend not served by this process (run `npm run build` for single-service mode).');
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'server error' });
});

seedIfNeeded().then(() => {
  app.listen(PORT, () => {
    console.log(`▲ Experience Rishikesh backend listening on http://localhost:${PORT}`);
    console.log(`▲ Admin password: ${ADMIN_PASSWORD === 'tapovan2026' ? '(default) — set ADMIN_PASSWORD env to override' : '(set via env)'}`);
    console.log(`▲ Uploads served from ${UPLOAD_DIR}`);
  });
});
