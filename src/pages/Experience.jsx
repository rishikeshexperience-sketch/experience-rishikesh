import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { bookOnWhatsApp, priceRange, WA_NUMBER } from '../lib/util';
import { useServices, useAllExperiences } from '../lib/useServices';
import ActivityCard from '../components/ActivityCard';

export default function Experience() {
  const { catId, slug } = useParams();
  const nav = useNavigate();
  const SERVICES = useServices();
  const allExp = useAllExperiences();
  const exp = allExp.find(e => e.catId === catId && e.slug === slug);
  const [imgIdx, setImgIdx] = useState(0);

  if (!exp) return (
    <main className="page">
      <div className="wrap" style={{ paddingTop: 40, textAlign: 'center' }}>
        <h2 className="h-display h2">Experience not found</h2>
        <p style={{ color: 'var(--muted)', margin: '10px 0 20px' }}>Maybe try browsing all experiences?</p>
        <Link to="/discover" className="btn btn-primary">Browse all →</Link>
      </div>
    </main>
  );

  const cat = SERVICES[catId];
  const related = allExp.filter(e => e.catId === catId && e.slug !== slug).slice(0, 3);
  const gallery = [exp.image, cat.heroImage, ...cat.items.filter(i => i.image !== exp.image).map(i => i.image)].slice(0, 4);

  return (
    <main className="page" style={{ background: 'var(--cream)' }}>
      {/* Breadcrumb + back */}
      <div className="wrap" style={{ padding: '18px 20px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => nav(-1)} className="tap" style={{ padding: '6px 10px', borderRadius: 999, background: '#fff', border: '1px solid var(--line)', fontSize: '.82rem', fontWeight: 700 }}>← Back</button>
        <span style={{ fontSize: '.76rem', color: 'var(--muted)' }}>
          <Link to="/discover" style={{ color: 'var(--muted)' }}>Discover</Link> ·{' '}
          <Link to={`/services/${catId}`} style={{ color: 'var(--muted)' }}>{cat.title}</Link>
        </span>
      </div>

      {/* Product header */}
      <div className="wrap" style={{ padding: '10px 20px 24px' }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr', alignItems: 'start' }}>
          {/* Gallery */}
          <div>
            <div style={{
              position: 'relative', borderRadius: 22, overflow: 'hidden',
              aspectRatio: '16/10', boxShadow: 'var(--shadow)',
            }}>
              <img src={gallery[imgIdx]} alt={exp.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', top: 14, left: 14,
                background: exp.catColor, color: '#fff',
                padding: '5px 12px', borderRadius: 999,
                fontSize: '.7rem', fontWeight: 800, letterSpacing: '.03em',
              }}>{cat.icon} {cat.title}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto' }} className="no-scrollbar">
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className="tap" style={{
                  flexShrink: 0, width: 74, height: 56,
                  borderRadius: 10, overflow: 'hidden',
                  border: i === imgIdx ? '2.5px solid var(--forest)' : '2.5px solid transparent',
                  padding: 0,
                }}>
                  <img src={g} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="h-display h1" style={{ color: 'var(--ink)', marginBottom: 12 }}>{exp.name}</h1>
            <p style={{ fontSize: '1rem', color: 'var(--ink-2)', lineHeight: 1.7, marginBottom: 18 }}>{exp.desc}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
              <span className="chip">⏱ {exp.duration}</span>
              <span className="chip">👥 {exp.groupSize}</span>
              <span className="chip">📍 Tapovan, Rishikesh</span>
              <span className="chip chip-live"><span className="dot-live" /> Verified partner</span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 20,
              padding: '18px 20px', background: '#fff',
              border: '1px solid var(--line)', borderRadius: 18,
              boxShadow: 'var(--shadow-sm)', marginBottom: 22, flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontSize: '.68rem', color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 700 }}>Price</div>
                <div className="serif" style={{ fontSize: '1.6rem', color: 'var(--ink)' }}>
                  {priceRange(exp)}
                  <span style={{ fontSize: '.75rem', color: 'var(--muted)', fontWeight: 500, marginLeft: 6 }}>{exp.unit}</span>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 200, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={() => bookOnWhatsApp(exp.name, `💰 ${priceRange(exp)} ${exp.unit}`)}
                  className="btn btn-wa" style={{ flex: 1 }}>💬 Book via WhatsApp</button>
              </div>
            </div>

            <h3 className="serif" style={{ fontSize: '1.1rem', marginBottom: 12 }}>What's included</h3>
            <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', marginBottom: 26 }}>
              {exp.highlights.map(h => (
                <div key={h} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  padding: '10px 12px', background: '#fff',
                  border: '1px solid var(--line)', borderRadius: 12, fontSize: '.85rem', color: 'var(--ink-2)',
                }}>
                  <span style={{ color: 'var(--forest-2)', fontWeight: 900 }}>✓</span>{h}
                </div>
              ))}
            </div>

            <h3 className="serif" style={{ fontSize: '1.1rem', marginBottom: 12 }}>Why book with us</h3>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', marginBottom: 30 }}>
              {[['⚡','Reply in 30 min'],['💰','Zero booking fees'],['🧭','Local Tapovan experts'],['🔒','Safety-verified partners']].map(([i,t]) => (
                <div key={t} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: '1.15rem' }}>{i}</span>
                  <span style={{ fontSize: '.82rem', color: 'var(--ink-2)', fontWeight: 600 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--cream-2)', paddingTop: 40, paddingBottom: 40 }}>
          <div className="wrap">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
              <h2 className="h-display" style={{ fontSize: '1.6rem', color: 'var(--ink)' }}>More in {cat.title}</h2>
              <Link to={`/services/${catId}`} style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--forest-2)' }}>See all →</Link>
            </div>
            <div className="grid">
              {related.map(r => <ActivityCard key={r.slug} exp={r} />)}
            </div>
          </div>
        </section>
      )}

      {/* Sticky mobile book bar */}
      <div className="show-mobile" style={{
        position: 'fixed', bottom: 'calc(var(--bottom-h) + env(safe-area-inset-bottom, 0px))',
        left: 0, right: 0, zIndex: 2999,
        background: 'rgba(255,255,255,.97)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--line)', padding: '10px 16px',
        display: 'flex', gap: 10, alignItems: 'center',
        boxShadow: '0 -8px 24px rgba(0,0,0,.08)',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '.65rem', color: 'var(--muted)', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase' }}>From</div>
          <div className="serif" style={{ fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.1 }}>
            {priceRange(exp)}
            <span style={{ fontSize: '.68rem', color: 'var(--muted)', fontWeight: 500, marginLeft: 4 }}>{exp.unit}</span>
          </div>
        </div>
        <button
          onClick={() => bookOnWhatsApp(exp.name, `💰 ${priceRange(exp)} ${exp.unit}`)}
          className="btn btn-wa" style={{ flex: 1.2 }}>
          💬 Book Now
        </button>
      </div>
    </main>
  );
}
