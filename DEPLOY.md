# Deploy — pick one

Three ways to deploy, all free. Pick based on what you value most.

| Option              | Cost  | Cold starts?      | Setup    | Best for                          |
|---------------------|-------|-------------------|----------|-----------------------------------|
| **A. Render (one service)**   | Free  | ~30 s after 15 min idle | 5 min GUI | Simplest — one deploy, one URL |
| **B. Fly.io (one service)**   | Free  | ~1 s wake       | CLI      | Always-on, Mumbai region        |
| **C. Vercel + Render (split)** | Free  | ~30 s (API only)   | 10 min GUI | Fastest frontend (Vercel CDN) |

**All three are truly free.** Data + uploads persist on a mounted disk in A & B, and on Render in C.

---

## Option A · Render, one service (recommended)

The Express server serves both the API and the built React frontend. One repo, one deploy, one URL.

**Step 1 — push to GitHub**

```bash
git init
git add .
git commit -m "Ready to deploy"
git branch -M main
git remote add origin https://github.com/<you>/experience-rishikesh.git
git push -u origin main
```

**Step 2 — deploy on Render**

1. Go to <https://dashboard.render.com> → **New +** → **Blueprint**.
2. Connect GitHub, pick the repo, click **Apply**.
   Render reads `render.yaml` and provisions one Web Service + a 1 GB persistent disk.
3. When it asks for `ADMIN_PASSWORD`, paste a strong secret. Click **Create Blueprint**.
4. Wait ~3 min for the first build. You'll get a URL like `https://experience-rishikesh.onrender.com`.

That's it. Site + API + admin all live there.

**Free-tier note:** the service sleeps after 15 min idle and takes ~30 s to wake on the next request. Upgrade to Render Starter ($7/mo) to kill the cold starts, or use option B.

---

## Option B · Fly.io, one service (no cold starts)

Same single-service setup but hosted on Fly.io in Mumbai (closest region to Rishikesh users).

**Step 1 — install the Fly CLI + sign up**

```bash
curl -L https://fly.io/install.sh | sh
fly auth signup
```

**Step 2 — provision + deploy**

```bash
cd experience-rishikesh
fly launch --no-deploy --copy-config          # keeps our fly.toml
fly volumes create er_data --size 1 --region bom
fly secrets set ADMIN_PASSWORD='your-strong-secret'
fly deploy
```

You'll get a URL like `https://experience-rishikesh.fly.dev`. Done.

Fly's free tier gives you 3 × shared-cpu-1x VMs + 3 GB volume across all your apps — this deploy uses 1 VM + 1 GB.

---

## Option C · Vercel + Render, split (fastest frontend)

Only pick this if you specifically want Vercel's CDN for the frontend. Two hosts, two URLs, but the frontend serves from Vercel's global edge network.

Setup steps are in the [old split-mode instructions here](#option-c-split-mode-details) — skip unless you know you want it.

---

## Verify after deploying (A or B)

Open your URL and check:

1. Home hero + LivePulse strip render.
2. **Live Map** loads venues, **🧭 Navigate** opens Google Maps.
3. Go to `/admin`, sign in with the password you set.
4. Header should say **⚡ Live backend**.
5. Edit a service name → **Save (live)** → refresh → change persists.
6. Upload an image → renders on the site.

---

## Custom domain (both A and B)

**On Render:** Settings → Custom Domains → add `experiencerishikesh.com` → point your DNS at the CNAME they give you. HTTPS is automatic.

**On Fly:** `fly certs create experiencerishikesh.com` → point your DNS at the A/AAAA records they show → cert issued automatically.

---

## Ongoing

- Every push to `main` on GitHub auto-redeploys.
- Secrets (`ADMIN_PASSWORD`, etc.) live in the host's dashboard/CLI, not in git.
- Backups: hit **Export JSON** in `/admin` periodically and commit the file as an offline snapshot. The persistent disk itself is durable on both Render and Fly.

---

## Option C · split-mode details

Frontend on Vercel, backend on Render. Two dashboards, but Vercel's CDN serves the frontend from edge locations globally.

1. Deploy the API to Render exactly like option A above (you'll get an `onrender.com` URL).
2. Go to <https://vercel.com/new>, import the same repo.
3. Add env var: `VITE_API_ORIGIN = https://experience-rishikesh.onrender.com`
4. Deploy.
5. Back on Render, set `CORS_ORIGIN` env var to your Vercel URL and save.

The frontend on Vercel will read `VITE_API_ORIGIN` at build time and point all `/api` and `/uploads` calls at the Render origin.

---

## When to move off free

- More than a few dozen active users → Render Starter ($7/mo, no sleeps) or Fly paid.
- Image uploads bigger than the disk quota → move to S3/Cloudinary/Vercel Blob and store the URL only in `data.json`.
- Multi-user editing / real accounts → replace `server/data.json` with Postgres (Supabase free tier is generous) and add proper auth (Clerk, Firebase Auth, or Supabase Auth).
