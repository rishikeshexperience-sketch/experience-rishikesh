import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { VENUES } from '../data/venues';
import { WA_NUMBER } from '../lib/util';
import { useServices, useAllExperiences } from '../lib/useServices';
import ActivityCard from '../components/ActivityCard';
import { InstallAppBanner } from '../components/InstallAppButton';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85&auto=format&fit=crop', // Himalayan mountains at sunset
  'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=1800&q=85&auto=format&fit=crop', // Prayer flags on Himalayan mountain
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1800&q=85&auto=format&fit=crop', // Yoga silhouette at sunset
];

const TICKER = [
  '🔥 Little Buddha Cafe — live acoustic set tonight',
  '🌅 Tapovan High Point — clear skies, sunset in 45 min',
  '🌊 Ganga Rafting departures every hour · ₹500',
  '🧘 Purple Valley Yoga — evening pranayama, 10 spots',
  '🍺 Joey\'s by the Ganges — happy hour until 7 PM',
  '🕉️ Ganga Aarti at Parmarth Niketan · 6:30 PM',
  '🔥 Fire circle at Ram Jhula tonight · 7:30 PM',
];

function Hero() {
  const [bg, setBg] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setBg(i => (i + 1) % HERO_IMAGES.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
      {HERO_IMAGES.map((src, i) => (
        <div key={src} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: bg === i ? 1 : 0, transition: 'opacity 1.6s ease',
          transform: bg === i ? 'scale(1.05)' : 'scale(1)',
        }} />
      ))}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg,rgba(8,20,12,.5) 0%,rgba(8,20,12,.15) 35%,rgba(8,20,12,.8) 100%)',
      }} />
      <div className="wrap" style={{ position: 'relative', padding: '120px 20px 60px', width: '100%' }}>
        <div className="chip chip-live" style={{ background: 'rgba(79,209,134,.16)', color: '#a8f0c5', border: '1px solid rgba(79,209,134,.35)', marginBottom: 18 }}>
          <span className="dot-live" /> LIVE · TAPOVAN, RISHIKESH
        </div>
        <h1 className="h-display" style={{ fontSize: 'clamp(2.4rem, 8vw, 5.2rem)', color: '#fff', marginBottom: 18, maxWidth: 820 }}>
          Rishikesh, <span style={{ color: 'var(--sun)', fontStyle: 'italic' }}>uncomplicated.</span>
        </h1>
        <p style={{ fontSize: 'clamp(1rem,1.6vw,1.2rem)', color: 'rgba(255,255,255,.85)', maxWidth: 620, lineHeight: 1.6, marginBottom: 32 }}>
          A live storefront for Tapovan — 17 curated experiences, one-tap WhatsApp booking, and a real-time map of every cafe, yoga hall, and viewpoint.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 42 }}>
          <Link to="/discover" className="btn btn-primary btn-lg">Browse Experiences →</Link>
          <Link to="/map" className="btn btn-ghost btn-lg">🗺️ See Live Map</Link>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', maxWidth: 620,
          background: 'rgba(23,34,26,.45)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,.1)', borderRadius: 18, overflow: 'hidden',
        }}>
          {[['17', 'Experiences'], ['21+', 'Live Venues'], ['₹100', 'From'], ['30 min', 'Reply']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center', padding: '16px 6px', borderRight: '1px solid rgba(255,255,255,.07)' }}>
              <div className="serif" style={{ fontSize: 'clamp(1.15rem,2.5vw,1.7rem)', color: 'var(--sun)' }}>{n}</div>
              <div style={{ fontSize: '.62rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.62)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  return (
    <div style={{ background: 'var(--forest-3)', padding: '10px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
      <div style={{
        display: 'inline-block', animation: 'tickerScroll 55s linear infinite',
        fontSize: '.78rem', color: 'rgba(255,255,255,.78)', paddingLeft: '100%',
      }}>
        {[...TICKER, ...TICKER].map((t, i) => (
          <span key={i} style={{ marginRight: 44 }}>{t}</span>
        ))}
      </div>
      <style>{`@keyframes tickerScroll{from{transform:translateX(0)}to{transform:translateX(-100%)}}`}</style>
    </div>
  );
}

function LivePulse() {
  const hot = VENUES.filter(v => ['buzzing', 'happening', 'vibrant', 'golden'].includes(v.mood));
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % hot.length), 3200);
    return () => clearInterval(t);
  }, [hot.length]);
  const v = hot[i];
  if (!v) return null;

  return (
    <section style={{
      background: 'linear-gradient(120deg,#0d1a13 0%,#143820 40%,#1f4a2c 100%)',
      padding: '18px 0',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: .35,
        background: 'radial-gradient(600px 200px at 20% 50%, rgba(79,209,134,.28), transparent 60%), radial-gradient(500px 180px at 85% 60%, rgba(245,166,35,.22), transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div className="wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '7px 14px', borderRadius: 999,
          background: 'rgba(255,68,68,.15)', border: '1px solid rgba(255,88,88,.4)',
          color: '#ff8f8f', fontWeight: 900, fontSize: '.72rem', letterSpacing: '.15em',
          flexShrink: 0,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: '#ff5b5b',
            boxShadow: '0 0 0 0 rgba(255,91,91,.7)', animation: 'redPulse 1.4s infinite',
          }} />
          LIVE NOW
        </div>
        <style>{`@keyframes redPulse{0%{box-shadow:0 0 0 0 rgba(255,91,91,.7)}70%{box-shadow:0 0 0 10px rgba(255,91,91,0)}100%{box-shadow:0 0 0 0 rgba(255,91,91,0)}}`}</style>

        <Link to="/map" style={{ flex: 1, minWidth: 240, color: '#fff', minHeight: 44, display: 'flex', alignItems: 'center' }}>
          <div key={i} style={{ animation: 'fadeIn .5s ease' }}>
            <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.55)', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>
              {v.icon} {v.name} · {v.lastUpdate}
            </div>
            <div style={{ fontSize: '.96rem', lineHeight: 1.35, fontWeight: 600, color: '#e8f0ea' }}>
              {v.updateText}
            </div>
          </div>
        </Link>
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>

        <Link to="/map" style={{
          flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg,#f5a623,#e8890a)',
          color: '#fff', fontWeight: 800, fontSize: '.88rem',
          padding: '10px 18px', borderRadius: 999,
          boxShadow: '0 6px 20px rgba(232,137,10,.4)',
          animation: 'pulseCta 2.6s ease-in-out infinite',
        }}>
          🗺️ Open Live Map
        </Link>
        <style>{`@keyframes pulseCta{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}`}</style>
      </div>
      <div className="wrap" style={{ position: 'relative', marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {hot.slice(0, 6).map((h, idx) => (
          <button key={h.id} onClick={() => setI(hot.indexOf(h))} style={{
            padding: '3px 10px', borderRadius: 999, cursor: 'pointer',
            fontSize: '.66rem', fontWeight: 700, border: 'none',
            background: i === idx ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.06)',
            color: i === idx ? '#fff' : 'rgba(255,255,255,.55)',
          }}>
            {h.icon} {h.name.split(' ')[0]}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '.68rem', color: 'rgba(255,255,255,.5)' }}>
          {hot.length} venues live now · updates every ~5 min
        </span>
      </div>
    </section>
  );
}

function LiveNow() {
  const buzzing = VENUES.filter(v => ['buzzing', 'happening', 'vibrant', 'golden'].includes(v.mood)).slice(0, 8);
  return (
    <section style={{ background: 'var(--forest-3)', padding: '48px 0' }}>
      <div className="wrap">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span className="dot-live" />
          <div>
            <div className="serif" style={{ color: '#fff', fontSize: '1.4rem' }}>Happening right now</div>
            <div style={{ color: 'rgba(255,255,255,.55)', fontSize: '.8rem' }}>Updated live from Tapovan cafes and venues</div>
          </div>
          <Link to="/map" style={{ marginLeft: 'auto', fontSize: '.82rem', fontWeight: 700, color: 'var(--leaf)' }}>Full map →</Link>
        </div>
        <div className="no-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollSnapType: 'x mandatory' }}>
          {buzzing.map(v => (
            <Link key={v.id} to="/map" style={{
              scrollSnapAlign: 'start', minWidth: 240, maxWidth: 240, flexShrink: 0,
              background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 14, padding: 14, color: '#e8f0ea',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{v.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
                  <div className={`chip mood-${v.mood}`} style={{ fontSize: '.62rem', padding: '2px 8px', marginTop: 4, border: 'none' }}>
                    {v.moodLabel}
                  </div>
                </div>
              </div>
              <p className="line-clamp-2" style={{ fontSize: '.75rem', lineHeight: 1.5, color: 'rgba(255,255,255,.72)' }}>
                {v.updateText}
              </p>
              <div style={{ fontSize: '.62rem', color: 'rgba(255,255,255,.45)', marginTop: 8 }}>🕐 {v.lastUpdate}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryTiles() {
  const SERVICES = useServices();
  const cats = Object.entries(SERVICES);
  return (
    <section className="section" style={{ background: 'var(--cream)' }}>
      <div className="wrap">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Browse by Category</div>
          <h2 className="h-display h2" style={{ color: 'var(--ink)' }}>Everything Tapovan offers</h2>
        </div>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {cats.map(([id, s]) => (
            <Link key={id} to={`/services/${id}`} className="tap" style={{
              position: 'relative', overflow: 'hidden', borderRadius: 18,
              aspectRatio: '1/1', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              padding: 16, color: '#fff',
              backgroundImage: `linear-gradient(180deg,rgba(0,0,0,0) 30%,rgba(0,0,0,.75) 100%),url(${s.heroImage})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{
                position: 'absolute', top: 12, left: 12,
                width: 34, height: 34, borderRadius: 10,
                background: 'rgba(255,255,255,.92)', display: 'grid', placeItems: 'center',
                fontSize: 18,
              }}>{s.icon}</div>
              <div className="serif" style={{ fontSize: '1.05rem', lineHeight: 1.1 }}>{s.title}</div>
              <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.75)', marginTop: 3 }}>{s.items.length} experiences</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function AllExperiences() {
  const SERVICES = useServices();
  const all = useAllExperiences();
  const cats = ['all', ...Object.keys(SERVICES)];
  const [active, setActive] = useState('all');
  const list = active === 'all' ? all : all.filter(e => e.catId === active);

  return (
    <section className="section" style={{ background: '#fff' }}>
      <div className="wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>The Full Catalogue</div>
            <h2 className="h-display h2" style={{ color: 'var(--ink)' }}>All experiences in Tapovan</h2>
            <p style={{ color: 'var(--muted)', fontSize: '.95rem', marginTop: 6 }}>
              {list.length} bookable experiences · locally verified · zero booking fees
            </p>
          </div>
          <Link to="/discover" className="btn btn-outline btn-sm">Advanced filters →</Link>
        </div>

        <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 22 }}>
          {cats.map(c => {
            const label = c === 'all' ? 'All' : `${SERVICES[c].icon} ${SERVICES[c].title}`;
            const on = active === c;
            return (
              <button key={c} onClick={() => setActive(c)} className="tap" style={{
                flexShrink: 0, padding: '9px 16px', borderRadius: 999,
                fontSize: '.82rem', fontWeight: 700,
                background: on ? 'var(--forest)' : '#fff',
                color: on ? '#fff' : 'var(--ink)',
                border: `1.5px solid ${on ? 'var(--forest)' : 'var(--line)'}`,
                transition: 'all .18s',
              }}>{label}</button>
            );
          })}
        </div>

        <div className="grid">
          {list.map(exp => (
            <ActivityCard key={`${exp.catId}-${exp.slug}`} exp={exp} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MapPitch() {
  return (
    <section style={{ padding: '80px 0', background: 'linear-gradient(160deg,var(--forest-3),var(--forest) 60%,var(--forest-3))', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1567591370084-d98e9b879c5d?w=1600&q=70)',
        backgroundSize: 'cover', backgroundPosition: 'center', opacity: .16,
      }} />
      <div className="wrap" style={{ position: 'relative', display: 'grid', gap: 40, gridTemplateColumns: '1fr', alignItems: 'center' }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--sun)' }}>🗺️ Tapovan Mood Map</div>
          <h2 className="h-display h2" style={{ color: '#fff', margin: '10px 0 14px' }}>Know the vibe before you walk over.</h2>
          <p style={{ color: 'rgba(255,255,255,.78)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 22, maxWidth: 620 }}>
            Every cafe, yoga hall, viewpoint and ashram — with real-time mood updates from Upper Tapovan, Lower Tapovan, Laxman Jhula and Joey\'s area.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/map" className="btn btn-primary">Open the Live Map</Link>
            <Link to="/discover" className="btn btn-ghost">Book an experience</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { quote: 'The mood map is genius — I walked to Little Buddha because it showed a live gig. Best spontaneous night of my trip.', name: 'Anika Sharma', loc: 'Mumbai' },
    { quote: 'Booked rafting and the temple tour over WhatsApp. Reply in 5 minutes, honest pricing, unforgettable day.', name: 'Lars Müller', loc: 'Berlin' },
    { quote: "Joey\'s said buzzing on the map and it was — cold beer, sunset, mountains. This should be default for Rishikesh visitors.", name: 'Priya R.', loc: 'Bangalore' },
  ];
  return (
    <section className="section" style={{ background: 'var(--cream-2)' }}>
      <div className="wrap">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Loved by Travelers</div>
          <h2 className="h-display h2" style={{ color: 'var(--ink)' }}>Stories from Tapovan</h2>
        </div>
        <div className="grid-3">
          {items.map((t, i) => (
            <div key={i} className="card" style={{ padding: '22px 24px' }}>
              <div style={{ color: 'var(--saffron-2)', fontSize: '1rem', marginBottom: 12 }}>★★★★★</div>
              <p style={{ fontSize: '.92rem', color: 'var(--ink-2)', lineHeight: 1.65, marginBottom: 18 }}>“{t.quote}”</p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--forest)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{t.name}</div>
                  <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{t.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section style={{ background: 'var(--forest)', padding: '64px 0', color: '#fff', textAlign: 'center' }}>
      <div className="wrap wrap-sm">
        <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>💬</div>
        <h2 className="h-display h2" style={{ color: '#fff', marginBottom: 12 }}>Ready when you are.</h2>
        <p style={{ color: 'rgba(255,255,255,.75)', marginBottom: 28 }}>
          Message us on WhatsApp — we craft your Tapovan trip within 30 minutes. No fees, no funny business.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={`https://wa.me/${WA_NUMBER}?text=Hi!%20I%20want%20to%20plan%20a%20Rishikesh%20trip.`}
            target="_blank" rel="noreferrer" className="btn btn-wa btn-lg">💬 Chat on WhatsApp</a>
          <Link to="/book" className="btn btn-ghost btn-lg">📋 Inquiry form</Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <InstallAppBanner />
      <LivePulse />
      <Ticker />
      <LiveNow />
      <CategoryTiles />
      <AllExperiences />
      <MapPitch />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
