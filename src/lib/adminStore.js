import { SERVICES as SEED } from '../data/services';

const KEY_LOCAL = 'er_admin_services_v1';
const KEY_PWD = 'er_admin_pwd_v1';
import { api } from './apiBase';
const API = api('/api');

// ── auth ──
export const isAuthed = () => !!sessionStorage.getItem(KEY_PWD);
export const getPwd = () => sessionStorage.getItem(KEY_PWD) || '';
export const signOut = () => sessionStorage.removeItem(KEY_PWD);

export async function tryAuth(pwd) {
  try {
    const res = await fetch(`${API}/auth`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd }),
    });
    if (res.ok) {
      sessionStorage.setItem(KEY_PWD, pwd);
      return { ok: true, backend: true };
    }
    return { ok: false, backend: true };
  } catch {
    // No backend reachable — fall back to a local-only session (dev / offline).
    const fallback = 'tapovan2026';
    if (pwd === fallback) {
      sessionStorage.setItem(KEY_PWD, pwd);
      return { ok: true, backend: false };
    }
    return { ok: false, backend: false };
  }
}

// ── services CRUD ──
export async function loadServices() {
  // Prefer backend; fall back to localStorage, then bundled seed.
  try {
    const res = await fetch(`${API}/services`);
    if (res.ok) {
      const { services } = await res.json();
      if (services && Object.keys(services).length) return { services, source: 'backend' };
    }
  } catch { /* offline */ }
  try {
    const raw = localStorage.getItem(KEY_LOCAL);
    if (raw) return { services: JSON.parse(raw), source: 'local' };
  } catch { /* corrupt */ }
  return { services: structuredClone(SEED), source: 'seed' };
}

export async function saveServices(services) {
  // Always mirror to localStorage as a safety net.
  localStorage.setItem(KEY_LOCAL, JSON.stringify(services));
  try {
    const res = await fetch(`${API}/services`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': getPwd() },
      body: JSON.stringify({ services }),
    });
    if (res.ok) return { ok: true, backend: true };
    return { ok: false, backend: true, status: res.status };
  } catch {
    return { ok: true, backend: false };  // saved locally at least
  }
}

export async function resetServices() {
  localStorage.removeItem(KEY_LOCAL);
  try {
    const res = await fetch(`${API}/services/reset`, {
      method: 'POST', headers: { 'x-admin-password': getPwd() },
    });
    if (res.ok) {
      const { services } = await res.json();
      return { services, backend: true };
    }
  } catch { /* offline */ }
  return { services: structuredClone(SEED), backend: false };
}

export function exportServices(services) {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const body = `export const SERVICES = ${JSON.stringify(services, null, 2)};\n`;
  const blob = new Blob([body], { type: 'text/javascript' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `services-${stamp}.js`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ── image upload ──
export async function uploadImage(file) {
  const fd = new FormData();
  fd.append('image', file);
  const res = await fetch(`${API}/upload`, {
    method: 'POST',
    headers: { 'x-admin-password': getPwd() },
    body: fd,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Upload failed (${res.status})`);
  }
  const data = await res.json();
  // In prod, uploads live on the backend origin — return a fully qualified URL
  // so the frontend on Vercel can render it directly.
  if (data.url && data.url.startsWith('/uploads/')) {
    data.url = api(data.url);
  }
  return data;
}
