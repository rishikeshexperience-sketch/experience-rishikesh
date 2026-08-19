import { useParams, Link } from 'react-router-dom';
import { bookOnWhatsApp } from '../lib/util';
import { useServices, useAllExperiences } from '../lib/useServices';
import ActivityCard from '../components/ActivityCard';

export default function ServiceDetail() {
  const { id } = useParams();
  const SERVICES = useServices();
  const cat = SERVICES[id];
  if (!cat) return (
    <main className="page">
      <div className="wrap" style={{ textAlign: 'center', paddingTop: 40 }}>
        <h2 className="h-display h2">Category not found</h2>
        <Link to="/services" className="btn btn-primary" style={{ marginTop: 16 }}>All Services →</Link>
      </div>
    </main>
  );

  const allExp = useAllExperiences();
  const experiences = allExp.filter(e => e.catId === id);

  return (
    <main className="page" style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '48vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', color: '#fff' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${cat.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg,rgba(0,0,0,.35) 0%,rgba(0,0,0,.15) 40%,rgba(0,0,0,.85) 100%)` }} />
        <div className="wrap" style={{ position: 'relative', padding: '56px 20px 40px', width: '100%' }}>
          <div className="chip" style={{ background: cat.color, color: '#fff', border: 'none', marginBottom: 14 }}>
            {cat.icon} {cat.title}
          </div>
          <h1 className="h-display h1" style={{ color: '#fff', maxWidth: 780, marginBottom: 12 }}>{cat.tagline}</h1>
          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '1rem', maxWidth: 560, lineHeight: 1.7 }}>{cat.subtitle}</p>
          <div style={{ marginTop: 22, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => bookOnWhatsApp(cat.title)} className="btn btn-wa">💬 Book this category</button>
            <Link to="/discover" className="btn btn-ghost">← All experiences</Link>
          </div>
        </div>
      </section>

      {/* Value strip */}
      <section style={{ background: cat.color, color: '#fff', padding: '20px 0' }}>
        <div className="wrap" style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', textAlign: 'center' }}>
          {[['⚡','Reply in 30 min'],['💰','No booking fees'],['🧭','Local Tapovan experts'],['🔒','Verified partners']].map(([i, t]) => (
            <div key={t}>
              <div style={{ fontSize: '1.1rem' }}>{i} <strong style={{ fontWeight: 800 }}>{t}</strong></div>
            </div>
          ))}
        </div>
      </section>

      {/* Experiences */}
      <section className="section">
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Choose your experience</div>
            <h2 className="h-display h2" style={{ color: 'var(--ink)' }}>{experiences.length} handpicked {cat.title.toLowerCase()}</h2>
          </div>
          <div className="grid">
            {experiences.map(exp => <ActivityCard key={exp.slug} exp={exp} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
