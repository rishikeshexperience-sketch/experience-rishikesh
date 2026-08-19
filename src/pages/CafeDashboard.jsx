import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MOOD_OPTIONS = [
  { value: 'buzzing',   label: '🔥 Buzzing',     desc: 'Very busy, high energy, must-visit right now', color: '#ff6b6b' },
  { value: 'vibrant',   label: '✨ Vibrant',     desc: 'Lively, good crowd, great atmosphere', color: '#f0a500' },
  { value: 'golden',    label: '🌅 Golden Hour', desc: 'Sunset magic — special atmosphere right now', color: '#fbbf24' },
  { value: 'serene',    label: '🕊️ Serene',     desc: 'Calm, peaceful, meditative environment', color: '#a78bfa' },
  { value: 'quiet',     label: '🌊 Quiet',       desc: 'Slow & relaxed — great for focussed work', color: '#5bc4f5' },
  { value: 'happening', label: '🎉 Happening',   desc: 'Live event or special activity on right now', color: '#fb923c' },
  { value: 'spiritual', label: '🪷 Spiritual',   desc: 'Deep spiritual or meditative energy', color: '#c084fc' },
  { value: 'open',      label: '✅ Open',         desc: 'Normal operations, all good', color: '#4fd186' },
];

const CROWD_OPTIONS = ['Empty', 'Very Quiet', 'Quiet', 'Moderate', 'Busy', 'Very Busy', 'Packed'];
const WAIT_OPTIONS = ['No wait', '5 min', '10 min', '15 min', '20+ min', '30+ min'];
const WIFI_OPTIONS = ['No WiFi', 'Slow', 'Good', 'Fast', 'Very Fast'];
const MUSIC_OPTIONS = ['None', 'Background music', 'Live acoustic', 'Live band', 'DJ', 'Drum circle'];
const SPECIAL_TAGS = ['Live Music 🎵', 'Happy Hour 🍺', "Today's Special 🍽️", 'Yoga Class 🧘', 'Discount 💰', 'Event 🎉', 'New Menu 📋', 'Closing Soon ⚠️', 'Full House 🏠', 'Outdoor Seating 🌿'];

function Section({ title, children }) {
  return (
    <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: '20px 22px', marginBottom: 18 }}>
      <div style={{ fontSize: '.72rem', fontWeight: 800, color: 'rgba(255,255,255,.4)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  );
}

export default function CafeDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [form, setForm] = useState({
    mood: '', crowd: '', wait: '', wifi: '', music: '',
    specialTags: [], customText: '', seatingAvail: true, kitchenOpen: true, specialOffer: '',
  });
  const [updates, setUpdates] = useState([]);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('cafeSession');
    if (!s) { navigate('/cafe-login'); return; }
    setSession(JSON.parse(s));
    // Load any saved updates
    const saved = localStorage.getItem('cafeUpdates');
    if (saved) setUpdates(JSON.parse(saved));
  }, []);

  const logout = () => { localStorage.removeItem('cafeSession'); navigate('/cafe-login'); };

  const toggleTag = tag => {
    setForm(f => ({
      ...f,
      specialTags: f.specialTags.includes(tag)
        ? f.specialTags.filter(t => t !== tag)
        : [...f.specialTags, tag],
    }));
  };

  const post = () => {
    if (!form.mood) { alert('Please select the current vibe / mood.'); return; }
    setPosting(true);
    setTimeout(() => {
      const update = {
        ...form,
        venue: session?.name,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-IN'),
        id: Date.now(),
      };
      const newUpdates = [update, ...updates].slice(0, 10);
      setUpdates(newUpdates);
      localStorage.setItem('cafeUpdates', JSON.stringify(newUpdates));
      setPosting(false);
      setPosted(true);
      setForm({ mood: '', crowd: '', wait: '', wifi: '', music: '', specialTags: [], customText: '', seatingAvail: true, kitchenOpen: true, specialOffer: '' });
      setTimeout(() => setPosted(false), 4000);
    }, 900);
  };

  const moodColor = (m) => MOOD_OPTIONS.find(o => o.value === m)?.color || '#4fd186';
  const inp = { background: 'rgba(255,255,255,.07)', border: '1.5px solid rgba(255,255,255,.15)', color: '#fff', borderRadius: 10, padding: '8px 12px', fontSize: '.83rem', fontFamily: 'Inter,sans-serif', width: '100%', outline: 'none' };

  if (!session) return null;

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: '#0a1510', color: '#e8f0ea' }}>
      {/* Top bar */}
      <div style={{ background: '#0d1a13', borderBottom: '1px solid #2a4030', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 20 }}>🏪</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '.95rem', fontWeight: 800, color: '#e8f0ea' }}>{session.name}</div>
          <div style={{ fontSize: '.68rem', color: '#7a9a82' }}>Venue Dashboard · Tapovan Mood Map</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4fd186', display: 'inline-block', animation: 'livePulse 1.8s infinite' }} />
          <style>{`@keyframes livePulse{0%,100%{box-shadow:0 0 0 0 rgba(79,209,134,.7)}50%{box-shadow:0 0 0 6px rgba(79,209,134,0)}}`}</style>
          <span style={{ fontSize: '.7rem', color: '#4fd186', fontWeight: 700 }}>LIVE</span>
          <button onClick={logout} style={{ marginLeft: 12, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.6)', fontSize: '.72rem', padding: '5px 12px', borderRadius: 20, cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28 }}>

        {/* LEFT: Update form */}
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', fontWeight: 900, color: '#e8f0ea', marginBottom: 6 }}>Post a Live Update</h2>
          <p style={{ fontSize: '.78rem', color: '#7a9a82', marginBottom: 24, lineHeight: 1.6 }}>Share what's happening at your venue right now. Updates go live on the map instantly.</p>

          {posted && (
            <div style={{ background: 'rgba(79,209,134,.15)', border: '1px solid rgba(79,209,134,.35)', borderRadius: 12, padding: '12px 16px', marginBottom: 18, fontSize: '.82rem', color: '#4fd186', display: 'flex', alignItems: 'center', gap: 8 }}>
              🎉 Update posted! Visible on the Tapovan Mood Map now.
            </div>
          )}

          {/* 1. Current Vibe / Mood */}
          <Section title="1 · Current Vibe *">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {MOOD_OPTIONS.map(m => (
                <button key={m.value} onClick={() => setForm(f => ({ ...f, mood: m.value }))} style={{
                  padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${form.mood === m.value ? m.color : 'rgba(255,255,255,.1)'}`,
                  background: form.mood === m.value ? `${m.color}22` : 'rgba(255,255,255,.04)',
                  color: form.mood === m.value ? m.color : '#9aaa94', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', transition: '.2s',
                }}>
                  <div>{m.label}</div>
                  <div style={{ fontSize: '.62rem', opacity: .75, fontWeight: 400, marginTop: 2 }}>{m.desc}</div>
                </button>
              ))}
            </div>
          </Section>

          {/* 2. Crowd & Wait */}
          <Section title="2 · Crowd & Wait Time">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '.68rem', color: '#7a9a82', fontWeight: 700, display: 'block', marginBottom: 5 }}>Crowd Level</label>
                <select style={inp} value={form.crowd} onChange={e => setForm(f => ({ ...f, crowd: e.target.value }))}>
                  <option value="">Select...</option>
                  {CROWD_OPTIONS.map(c => <option key={c} style={{ background: '#0d1a13' }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '.68rem', color: '#7a9a82', fontWeight: 700, display: 'block', marginBottom: 5 }}>Wait for Table</label>
                <select style={inp} value={form.wait} onChange={e => setForm(f => ({ ...f, wait: e.target.value }))}>
                  <option value="">Select...</option>
                  {WAIT_OPTIONS.map(w => <option key={w} style={{ background: '#0d1a13' }}>{w}</option>)}
                </select>
              </div>
            </div>
          </Section>

          {/* 3. Amenities */}
          <Section title="3 · Amenities Right Now">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: '.68rem', color: '#7a9a82', fontWeight: 700, display: 'block', marginBottom: 5 }}>WiFi Speed</label>
                <select style={inp} value={form.wifi} onChange={e => setForm(f => ({ ...f, wifi: e.target.value }))}>
                  <option value="">Select...</option>
                  {WIFI_OPTIONS.map(w => <option key={w} style={{ background: '#0d1a13' }}>{w}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '.68rem', color: '#7a9a82', fontWeight: 700, display: 'block', marginBottom: 5 }}>Music / Entertainment</label>
                <select style={inp} value={form.music} onChange={e => setForm(f => ({ ...f, music: e.target.value }))}>
                  <option value="">Select...</option>
                  {MUSIC_OPTIONS.map(m => <option key={m} style={{ background: '#0d1a13' }}>{m}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[['seatingAvail', '🪑 Seating Available'], ['kitchenOpen', '🍽️ Kitchen Open']].map(([key, label]) => (
                <button key={key} onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))} style={{
                  padding: '7px 14px', borderRadius: 20, fontSize: '.75rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                  background: form[key] ? 'rgba(79,209,134,.2)' : 'rgba(255,255,255,.05)',
                  color: form[key] ? '#4fd186' : 'rgba(255,255,255,.35)',
                  transition: '.2s',
                }}>
                  {label} {form[key] ? '✓' : '✗'}
                </button>
              ))}
            </div>
          </Section>

          {/* 4. Special Tags */}
          <Section title="4 · Special Tags (select all that apply)">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SPECIAL_TAGS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} style={{
                  padding: '6px 12px', borderRadius: 20, fontSize: '.72rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid',
                  borderColor: form.specialTags.includes(tag) ? '#f5a623' : 'rgba(255,255,255,.12)',
                  background: form.specialTags.includes(tag) ? 'rgba(245,166,35,.15)' : 'rgba(255,255,255,.04)',
                  color: form.specialTags.includes(tag) ? '#f5a623' : 'rgba(255,255,255,.5)', transition: '.2s',
                }}>
                  {tag}
                </button>
              ))}
            </div>
          </Section>

          {/* 5. Special Offer */}
          <Section title="5 · Today's Special / Offer (optional)">
            <input style={inp} placeholder="e.g. 'Masala chai + samosa combo ₹80'" value={form.specialOffer} onChange={e => setForm(f => ({ ...f, specialOffer: e.target.value }))} />
          </Section>

          {/* 6. Custom Message */}
          <Section title="6 · Your Message to Visitors (optional)">
            <textarea style={{ ...inp, height: 80, resize: 'vertical' }} placeholder="e.g. 'Live acoustic set starting in 20 mins! Rooftop has a few spots left.'" value={form.customText} onChange={e => setForm(f => ({ ...f, customText: e.target.value }))} />
          </Section>

          <button onClick={post} disabled={posting} style={{
            width: '100%', padding: '14px', borderRadius: 26, border: 'none', cursor: posting ? 'default' : 'pointer',
            background: posting ? '#2d6b3e' : 'linear-gradient(135deg,#e8890a,#f5a623)',
            color: '#fff', fontWeight: 800, fontSize: '1rem',
            boxShadow: '0 6px 24px rgba(232,137,10,.35)', transition: '.25s',
          }}>
            {posting ? '⏳ Posting Update...' : '🚀 Post Live Update Now'}
          </button>
        </div>

        {/* RIGHT: Previous updates + tips */}
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', fontWeight: 900, color: '#e8f0ea', marginBottom: 6 }}>Your Recent Updates</h2>
          <p style={{ fontSize: '.78rem', color: '#7a9a82', marginBottom: 24 }}>Last 10 updates from your venue</p>

          {updates.length === 0 ? (
            <div style={{ background: '#132019', border: '1px solid #2a4030', borderRadius: 14, padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📝</div>
              <div style={{ fontSize: '.88rem', color: '#7a9a82' }}>No updates yet. Post your first live update!</div>
            </div>
          ) : updates.map(u => {
            const mood = MOOD_OPTIONS.find(m => m.value === u.mood);
            return (
              <div key={u.id} style={{ background: '#132019', border: '1px solid #2a4030', borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: '.7rem', fontWeight: 800, padding: '2px 10px', borderRadius: 20, background: `${mood?.color || '#4fd186'}22`, color: mood?.color || '#4fd186' }}>{mood?.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '.62rem', color: '#4a6a52' }}>{u.date} · {u.time}</span>
                </div>
                {u.crowd && <div style={{ fontSize: '.72rem', color: '#9aaa94' }}>👥 {u.crowd} | ⏱ {u.wait || 'N/A'} wait | 📶 WiFi: {u.wifi || 'N/A'}</div>}
                {u.specialOffer && <div style={{ fontSize: '.72rem', color: '#f5a623', marginTop: 5 }}>🌟 {u.specialOffer}</div>}
                {u.customText && <div style={{ fontSize: '.78rem', color: '#9aaa94', marginTop: 6, lineHeight: 1.5 }}>"{u.customText}"</div>}
                {u.specialTags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 7 }}>
                    {u.specialTags.map(t => <span key={t} style={{ fontSize: '.62rem', background: 'rgba(245,166,35,.12)', color: '#f5a623', padding: '2px 7px', borderRadius: 20 }}>{t}</span>)}
                  </div>
                )}
              </div>
            );
          })}

          {/* Tips box */}
          <div style={{ background: 'rgba(79,209,134,.07)', border: '1px solid rgba(79,209,134,.2)', borderRadius: 16, padding: '20px 20px', marginTop: 24 }}>
            <div style={{ fontSize: '.72rem', fontWeight: 800, color: '#4fd186', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>💡 Pro Tips</div>
            {['Post updates at least 3x daily — morning, afternoon & evening peak times', 'Mention events or specials — it drives the most traffic', 'Keep it conversational — write like you\'re texting a friend', 'Tag "Live Music" when it starts for maximum engagement', 'Always update "Closing Soon" 30 mins before you close'].map((t, i) => (
              <div key={i} style={{ fontSize: '.75rem', color: '#7a9a82', marginBottom: 8, paddingLeft: 14, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: '#4fd186' }}>·</span>
                {t}
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
            {[['📊', 'Updates Today', updates.filter(u => u.date === new Date().toLocaleDateString('en-IN')).length], ['🏆', 'Total Updates', updates.length]].map(([icon, label, val]) => (
              <div key={label} style={{ background: '#132019', border: '1px solid #2a4030', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem' }}>{icon}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4fd186', marginTop: 4 }}>{val}</div>
                <div style={{ fontSize: '.68rem', color: '#4a6a52' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){ .dash-grid{grid-template-columns:1fr!important} }
      `}</style>
    </div>
  );
}
