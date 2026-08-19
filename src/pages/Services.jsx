import { Link } from 'react-router-dom';
import { useServices } from '../lib/useServices';

export default function Services() {
  const SERVICES = useServices();
  const cats = Object.entries(SERVICES);
  return (
    <main className="page" style={{ background: 'var(--cream)' }}>
      <section style={{
        background: 'linear-gradient(180deg,var(--forest-3),var(--forest))', color: '#fff', padding: '54px 0 40px',
      }}>
        <div className="wrap">
          <div className="eyebrow" style={{ color: 'var(--sun)' }}>Services</div>
          <h1 className="h-display h1" style={{ color: '#fff', margin: '6px 0 10px' }}>Five curated ways to Tapovan.</h1>
          <p style={{ color: 'rgba(255,255,255,.72)', maxWidth: 620 }}>
            Pick a category — every experience inside is one WhatsApp message from being booked.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid-3">
            {cats.map(([id, s]) => (
              <Link key={id} to={`/services/${id}`} className="card tap" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  position: 'relative', aspectRatio: '5/3',
                  backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.55)),url(${s.heroImage})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }}>
                  <div style={{
                    position: 'absolute', top: 14, left: 14,
                    background: '#fff', padding: '5px 12px', borderRadius: 999,
                    fontSize: '.72rem', fontWeight: 800, color: s.color,
                  }}>{s.icon} {s.title}</div>
                  <div style={{ position: 'absolute', bottom: 12, left: 14, color: '#fff' }}>
                    <div className="serif" style={{ fontSize: '1.15rem', lineHeight: 1.15 }}>{s.tagline}</div>
                  </div>
                </div>
                <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: '.87rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 14 }}>{s.subtitle}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {s.items.slice(0, 3).map(i => (
                      <span key={i.name} className="chip" style={{ fontSize: '.68rem' }}>{i.name}</span>
                    ))}
                    {s.items.length > 3 && <span className="chip" style={{ fontSize: '.68rem' }}>+{s.items.length - 3} more</span>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px dashed var(--line)', marginTop: 'auto' }}>
                    <div>
                      <div style={{ fontSize: '.65rem', color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 700 }}>Starting from</div>
                      <div className="serif" style={{ fontSize: '1.15rem', color: s.color }}>{s.items[0]?.price}</div>
                    </div>
                    <span style={{ fontSize: '.82rem', fontWeight: 800, color: 'var(--forest-2)' }}>Browse →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
