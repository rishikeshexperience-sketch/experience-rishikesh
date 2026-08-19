import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Demo credentials (in a real app these would be backend-verified)
const DEMO_ACCOUNTS = [
  { user: 'littlebuddha', pass: 'buddha@123', name: 'Little Buddha Cafe', id: 1 },
  { user: 'freedomcafe',  pass: 'freedom@123', name: 'Freedom Cafe', id: 9 },
  { user: 'joeysganges',  pass: 'joeys@123', name: "Joey's by the Ganges", id: 18 },
  { user: 'demo',         pass: 'demo', name: 'Demo Cafe', id: 99 },
];

export default function CafeLogin() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = () => {
    setErr('');
    setLoading(true);
    setTimeout(() => {
      const found = DEMO_ACCOUNTS.find(a => a.user === user.trim() && a.pass === pass);
      if (found) {
        localStorage.setItem('cafeSession', JSON.stringify({ ...found, loginAt: Date.now() }));
        navigate('/cafe-dashboard');
      } else {
        setErr('Invalid username or password. Try user: demo | pass: demo');
      }
      setLoading(false);
    }, 800);
  };

  const inp = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    background: 'rgba(255,255,255,.08)', border: '1.5px solid rgba(255,255,255,.18)',
    color: '#fff', fontSize: '.88rem', fontFamily: 'Inter,sans-serif', outline: 'none',
    marginTop: 6,
  };

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: 'linear-gradient(160deg,#061009,#0d1a13,#132019)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px' }}>
      <div style={{ maxWidth: 460, width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏪</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: 8 }}>Venue Owner Login</h1>
          <p style={{ fontSize: '.85rem', color: '#7a9a82', lineHeight: 1.7 }}>
            Post live updates about your cafe, yoga studio, or event space directly to the Tapovan Mood Map.
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,.05)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 24, padding: '36px 32px' }}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: '.73rem', fontWeight: 700, color: 'rgba(255,255,255,.6)', letterSpacing: '.3px' }}>Username</label>
            <input style={inp} placeholder="your-cafe-username" value={user} onChange={e => setUser(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: '.73rem', fontWeight: 700, color: 'rgba(255,255,255,.6)', letterSpacing: '.3px' }}>Password</label>
            <input style={inp} type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
          </div>

          {err && (
            <div style={{ background: 'rgba(255,107,107,.15)', border: '1px solid rgba(255,107,107,.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: '.78rem', color: '#ff6b6b' }}>
              ⚠️ {err}
            </div>
          )}

          <button onClick={login} disabled={loading} style={{
            width: '100%', padding: '13px', background: loading ? '#4a6a52' : '#e8890a', color: '#fff',
            fontWeight: 800, fontSize: '.95rem', borderRadius: 24, border: 'none', cursor: loading ? 'default' : 'pointer',
            transition: '.2s',
          }}>
            {loading ? '⏳ Logging in...' : '🚀 Login to Dashboard'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '.72rem', color: 'rgba(255,255,255,.3)', marginTop: 16 }}>
            Demo: username <strong style={{ color: 'rgba(255,255,255,.5)' }}>demo</strong> / password <strong style={{ color: 'rgba(255,255,255,.5)' }}>demo</strong>
          </p>
        </div>

        {/* Register CTA */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <p style={{ fontSize: '.8rem', color: '#7a9a82', marginBottom: 10 }}>Don't have an account? Register your venue:</p>
          <a href="https://wa.me/917985543842?text=Hi!%20I%20want%20to%20register%20my%20venue%20on%20the%20Tapovan%20Mood%20Map."
             target="_blank" rel="noreferrer" style={{
               display: 'inline-flex', alignItems: 'center', gap: 7,
               background: '#25d366', color: '#fff', fontWeight: 700, fontSize: '.82rem',
               padding: '9px 20px', borderRadius: 20,
             }}>
            💬 Register via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
