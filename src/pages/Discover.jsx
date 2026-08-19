import { useMemo, useState } from 'react';
import { useServices, useAllExperiences } from '../lib/useServices';
import ActivityCard from '../components/ActivityCard';

const priceValue = (p) => parseInt((p || '').replace(/[^\d]/g, '')) || 0;

export default function Discover() {
  const SERVICES = useServices();
  const all = useAllExperiences();
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('featured');

  const filtered = useMemo(() => {
    let list = all;
    if (cat !== 'all') list = list.filter(e => e.catId === cat);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(e => (e.name + ' ' + e.desc + ' ' + e.highlights.join(' ')).toLowerCase().includes(s));
    }
    if (sort === 'price-asc') list = [...list].sort((a, b) => priceValue(a.price) - priceValue(b.price));
    if (sort === 'price-desc') list = [...list].sort((a, b) => priceValue(b.price) - priceValue(a.price));
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [all, cat, q, sort]);

  const cats = ['all', ...Object.keys(SERVICES)];

  return (
    <main className="page" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <section style={{ background: 'linear-gradient(180deg, var(--forest-3), var(--forest))', color: '#fff', padding: '40px 0 30px' }}>
        <div className="wrap">
          <div className="eyebrow" style={{ color: 'var(--sun)' }}>Discover</div>
          <h1 className="h-display h1" style={{ color: '#fff', margin: '6px 0 12px' }}>Every experience, one search away.</h1>
          <p style={{ color: 'rgba(255,255,255,.72)', maxWidth: 620, fontSize: '.95rem' }}>
            {all.length} bookable experiences across yoga, adventure, spiritual, cultural and travel — sorted by what fits your trip.
          </p>

          <div style={{
            marginTop: 22, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)',
            borderRadius: 16, padding: 8, display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <span style={{ paddingLeft: 10, color: 'rgba(255,255,255,.6)', fontSize: 18 }}>🔎</span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search yoga, rafting, temple tour, cafe..." style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '1rem', padding: '10px 0',
            }} />
            <select value={sort} onChange={e => setSort(e.target.value)} style={{
              background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.15)',
              padding: '9px 12px', borderRadius: 10, fontSize: '.82rem', fontWeight: 700, outline: 'none',
            }}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low → high</option>
              <option value="price-desc">Price: high → low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </section>

      {/* Filter chips */}
      <div className="wrap" style={{ padding: '20px 20px 4px' }}>
        <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
          {cats.map(c => {
            const on = cat === c;
            const label = c === 'all' ? '🌐 All' : `${SERVICES[c].icon} ${SERVICES[c].title}`;
            return (
              <button key={c} onClick={() => setCat(c)} className="tap" style={{
                flexShrink: 0, padding: '9px 16px', borderRadius: 999,
                fontSize: '.82rem', fontWeight: 700,
                background: on ? 'var(--forest)' : '#fff',
                color: on ? '#fff' : 'var(--ink)',
                border: `1.5px solid ${on ? 'var(--forest)' : 'var(--line)'}`,
              }}>{label}</button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div style={{ fontSize: '.85rem', color: 'var(--muted)', marginBottom: 16 }}>
            Showing <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> {filtered.length === 1 ? 'experience' : 'experiences'}
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
              No experiences match. Try clearing filters or search.
            </div>
          ) : (
            <div className="grid">
              {filtered.map(e => <ActivityCard key={`${e.catId}-${e.slug}`} exp={e} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
