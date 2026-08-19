import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  loadServices, saveServices, resetServices, exportServices, uploadImage,
  isAuthed, tryAuth, signOut,
} from '../lib/adminStore';

function Login({ onOk }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    const r = await tryAuth(pwd);
    setBusy(false);
    if (r.ok) onOk(r.backend);
    else setErr(r.backend ? 'Wrong password.' : 'Wrong password. (backend unreachable — offline mode)');
  };
  return (
    <main className="page" style={{ background: 'var(--cream)' }}>
      <div className="wrap wrap-sm" style={{ paddingTop: 40 }}>
        <div className="card" style={{ padding: 28, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🔐</div>
          <h1 className="h-display" style={{ fontSize: '1.5rem', marginBottom: 8 }}>Admin Sign-in</h1>
          <p style={{ color: 'var(--muted)', fontSize: '.88rem', marginBottom: 22 }}>
            Enter the admin password to edit services.
          </p>
          <form onSubmit={submit}>
            <input autoFocus type="password" className="input" placeholder="Password"
              value={pwd} onChange={e => { setPwd(e.target.value); setErr(''); }} />
            {err && <div style={{ color: 'var(--rose)', fontSize: '.8rem', marginTop: 8 }}>{err}</div>}
            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 16 }} disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p style={{ fontSize: '.72rem', color: 'var(--muted)', marginTop: 16 }}>
            Default: <code>tapovan2026</code>. Override with the <code>ADMIN_PASSWORD</code> env var on the server.
          </p>
          <Link to="/" style={{ display: 'block', marginTop: 12, fontSize: '.82rem', color: 'var(--forest-2)' }}>← Back to site</Link>
        </div>
      </div>
    </main>
  );
}

function ImageField({ label, value, onChange }) {
  const inputRef = useRef();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const pick = () => inputRef.current?.click();
  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true); setErr('');
    try {
      const { url } = await uploadImage(f);
      onChange(url);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };
  return (
    <div>
      <label className="label">{label}</label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        <input className="input" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="/uploads/... or https://..." style={{ flex: 1 }} />
        <button type="button" onClick={pick} className="btn btn-outline btn-sm" disabled={busy} style={{ whiteSpace: 'nowrap' }}>
          {busy ? '…' : '📤 Upload'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
      </div>
      {err && <div style={{ color: 'var(--rose)', fontSize: '.75rem', marginTop: 6 }}>{err}</div>}
      {value && (
        <img src={value} alt="" loading="lazy"
          onError={(e) => { e.currentTarget.style.opacity = .3; }}
          style={{ marginTop: 8, width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)' }} />
      )}
    </div>
  );
}

function ItemEditor({ item, onChange, onDelete }) {
  const setField = (k) => (e) => onChange({ ...item, [k]: e.target.value });
  const setHighlights = (e) => onChange({ ...item, highlights: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) });
  return (
    <div className="card" style={{ padding: 16, marginBottom: 14 }}>
      <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label className="label">Name</label>
          <input className="input" value={item.name} onChange={setField('name')} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label className="label">Description</label>
          <textarea className="input" rows="3" value={item.desc} onChange={setField('desc')} />
        </div>
        <div>
          <label className="label">Price (from)</label>
          <input className="input" value={item.price} onChange={setField('price')} placeholder="₹1,000" />
        </div>
        <div>
          <label className="label">Price (to)</label>
          <input className="input" value={item.priceTo} onChange={setField('priceTo')} placeholder="₹2,000" />
        </div>
        <div>
          <label className="label">Unit</label>
          <input className="input" value={item.unit} onChange={setField('unit')} placeholder="per class" />
        </div>
        <div>
          <label className="label">Duration</label>
          <input className="input" value={item.duration} onChange={setField('duration')} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label className="label">Group size</label>
          <input className="input" value={item.groupSize} onChange={setField('groupSize')} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <ImageField label="Item image" value={item.image} onChange={(url) => onChange({ ...item, image: url })} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label className="label">Highlights (one per line)</label>
          <textarea className="input" rows="4" value={(item.highlights || []).join('\n')} onChange={setHighlights} />
        </div>
      </div>
      <button onClick={onDelete} className="btn btn-outline btn-sm" style={{ marginTop: 12, color: 'var(--rose)', borderColor: 'var(--rose)' }}>
        Delete this item
      </button>
    </div>
  );
}

function CategoryEditor({ catId, cat, onChange }) {
  const setField = (k) => (e) => onChange({ ...cat, [k]: e.target.value });
  const setItem = (i) => (patch) => {
    const items = [...cat.items];
    items[i] = patch;
    onChange({ ...cat, items });
  };
  const delItem = (i) => () => {
    if (!confirm(`Delete "${cat.items[i].name}"?`)) return;
    onChange({ ...cat, items: cat.items.filter((_, k) => k !== i) });
  };
  const addItem = () => {
    onChange({ ...cat, items: [...cat.items, {
      name: 'New Experience', desc: '', price: '₹0', priceTo: '₹0', unit: 'per person',
      image: '', highlights: [], duration: '', groupSize: '',
    }] });
  };

  return (
    <details className="card" style={{ padding: 16, marginBottom: 20 }} open>
      <summary style={{ cursor: 'pointer', fontWeight: 800, fontSize: '1.05rem', color: cat.color }}>
        {cat.icon} {cat.title} <span style={{ color: 'var(--muted)', fontWeight: 500, fontSize: '.85rem' }}>· {cat.items.length} items · <code>{catId}</code></span>
      </summary>
      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr', marginBottom: 14 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="label">Category title</label>
            <input className="input" value={cat.title} onChange={setField('title')} />
          </div>
          <div>
            <label className="label">Subtitle</label>
            <input className="input" value={cat.subtitle} onChange={setField('subtitle')} />
          </div>
          <div>
            <label className="label">Tagline</label>
            <input className="input" value={cat.tagline} onChange={setField('tagline')} />
          </div>
          <div>
            <label className="label">Icon (emoji)</label>
            <input className="input" value={cat.icon} onChange={setField('icon')} />
          </div>
          <div>
            <label className="label">Color (hex)</label>
            <input className="input" value={cat.color} onChange={setField('color')} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <ImageField label="Category hero image" value={cat.heroImage} onChange={(url) => onChange({ ...cat, heroImage: url })} />
          </div>
        </div>

        <div style={{ borderTop: '1px dashed var(--line)', paddingTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="eyebrow">Items ({cat.items.length})</div>
            <button onClick={addItem} className="btn btn-outline btn-sm">+ Add item</button>
          </div>
          {cat.items.map((item, i) => (
            <ItemEditor key={i} item={item} onChange={setItem(i)} onDelete={delItem(i)} />
          ))}
        </div>
      </div>
    </details>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(isAuthed());
  const [services, setServices] = useState(null);
  const [source, setSource] = useState('');
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authed) return;
    loadServices().then(({ services: s, source }) => {
      setServices(s); setSource(source);
    });
  }, [authed]);

  useEffect(() => {
    const beforeUnload = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty]);

  if (!authed) return <Login onOk={() => setAuthed(true)} />;

  if (!services) return (
    <main className="page"><div className="wrap" style={{ padding: 40, textAlign: 'center' }}>Loading services…</div></main>
  );

  const updateCat = (id) => (patch) => {
    setServices(s => ({ ...s, [id]: patch }));
    setDirty(true);
  };
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3200); };

  const doSave = async () => {
    setSaving(true);
    const r = await saveServices(services);
    setSaving(false); setDirty(false);
    flash(r.backend ? '✔ Saved to backend (live on the site).' : '⚠️ Saved locally only — backend unreachable.');
  };
  const doReset = async () => {
    if (!confirm('Reset all changes and reload defaults?')) return;
    const { services: s } = await resetServices();
    setServices(s); setDirty(false);
    flash('Reset to defaults.');
  };
  const doExport = () => { exportServices(services); flash('Downloaded services-*.js — commit into src/data/services.js for a static fallback.'); };
  const doSignOut = () => { signOut(); setAuthed(false); };

  const cats = Object.entries(services);
  const itemCount = cats.reduce((n, [, c]) => n + c.items.length, 0);

  return (
    <main className="page" style={{ background: 'var(--cream)' }}>
      {/* Toolbar */}
      <div style={{
        position: 'sticky', top: 'var(--nav-h)', zIndex: 1000,
        background: 'rgba(255,250,241,.96)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--line)',
        padding: '14px 20px',
      }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0 }}>
            <div className="serif" style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>Admin — Services</div>
            <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>
              {cats.length} categories · {itemCount} experiences ·{' '}
              <span style={{
                fontWeight: 700,
                color: source === 'backend' ? 'var(--forest-2)' : source === 'local' ? 'var(--saffron)' : 'var(--muted)',
              }}>{source === 'backend' ? '⚡ Live backend' : source === 'local' ? '💾 Local draft' : '📦 Seed'}</span>
              {dirty && <span style={{ color: 'var(--rose)', marginLeft: 8, fontWeight: 700 }}>· unsaved changes</span>}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={doReset} className="btn btn-outline btn-sm">Reset</button>
            <button onClick={doExport} className="btn btn-outline btn-sm">⬇ Export JSON</button>
            <button onClick={doSave} className="btn btn-forest btn-sm" disabled={!dirty || saving} style={{ opacity: (dirty && !saving) ? 1 : .6 }}>
              {saving ? '…Saving' : '💾 Save (live)'}
            </button>
            <button onClick={doSignOut} className="btn btn-outline btn-sm">Sign out</button>
          </div>
        </div>
        {msg && (
          <div className="wrap" style={{ marginTop: 10, fontSize: '.82rem', color: 'var(--forest)', background: 'rgba(31,74,44,.08)', padding: '8px 12px', borderRadius: 10 }}>
            {msg}
          </div>
        )}
      </div>

      <div className="wrap" style={{ padding: '24px 20px 60px' }}>
        {cats.map(([id, cat]) => (
          <CategoryEditor key={id} catId={id} cat={cat} onChange={updateCat(id)} />
        ))}
      </div>
    </main>
  );
}
