import { useState } from 'react';
import { useServices } from '../lib/useServices';

const WA = '917985543842';
const EMAIL = 'rishikeshexperience@gmail.com';

export default function Booking() {
  const SERVICES = useServices();
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', date: '', size: '', msg: '' });
  const [sent, setSent] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.name || !form.phone || !form.service) { alert('Please fill in your name, WhatsApp number, and service.'); return; }
    const text = `🏔️ *Experience Rishikesh — Booking Inquiry*\n\n👤 Name: ${form.name}\n📱 Phone: ${form.phone}${form.email ? '\n✉️ Email: ' + form.email : ''}\n📌 Service: ${form.service}${form.date ? '\n📅 Date: ' + form.date : ''}${form.size ? '\n👥 Group: ' + form.size + ' people' : ''}${form.msg ? '\n💬 Notes: ' + form.msg : ''}\n\n_Sent via experiencerishikesh.in_`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank');
    setSent(true);
  };

  const inp = { width: '100%', padding: '11px 15px', borderRadius: 10, background: 'rgba(255,255,255,.08)', border: '1.5px solid rgba(255,255,255,.18)', color: '#fff', fontSize: '.87rem', fontFamily: 'Inter,sans-serif', outline: 'none' };
  const lbl = { display: 'block', fontSize: '.73rem', fontWeight: 700, color: 'rgba(255,255,255,.65)', marginBottom: 6, letterSpacing: '.3px' };

  const allServices = Object.values(SERVICES).flatMap(s => s.items.map(i => `${s.icon} ${i.name} (${i.price}–${i.priceTo})`));

  return (
    <div className="booking-shell" style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Hero */}
      <section style={{ minHeight: '42vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(160deg,#0a1a0e,#1f4a2c)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1559057788-baa75bcec5e0?w=1400&q=75)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: .25 }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '80px 32px', textAlign: 'center', width: '100%' }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', marginBottom: 14 }}>
            Book Your <span style={{ color: '#f5a623' }}>Experience</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,.72)', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
            Fill the form — we'll reply on WhatsApp within 30 minutes. Zero booking fees.
          </p>
        </div>
      </section>

      <section style={{ padding: '72px 24px', background: '#1f4a2c' }}>
        <div className="booking-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 40, alignItems: 'start' }}>

          {/* Info column */}
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: '#fff', fontWeight: 900, marginBottom: 16 }}>
              Why Book<br />With Us?
            </h2>
            <p style={{ fontSize: '.92rem', color: 'rgba(255,255,255,.68)', lineHeight: 1.8, marginBottom: 32 }}>
              We're locals who grew up in Tapovan. We know every hidden cafe, every trusted rafting operator, and every sacred spot. Let us plan it right.
            </p>
            {[
              ['⚡', 'Instant WhatsApp response', 'We reply within 30 minutes, even on weekends and evenings'],
              ['💰', 'Best prices, zero markup', 'Pay directly to operators — we charge no booking fees whatsoever'],
              ['🧭', 'Real local expertise', 'Born and raised in Tapovan — we know every corner'],
              ['🔒', 'Verified & safe partners', 'Every operator is vetted for safety and quality'],
              ['🎯', 'Fully customizable', 'Mix and match services to create your perfect itinerary'],
            ].map(([ico, title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: 16, marginBottom: 22 }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: 2 }}>{ico}</span>
                <div>
                  <div style={{ fontSize: '.9rem', fontWeight: 700, color: '#fff', marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}

            <div style={{ borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: 24, marginTop: 8 }}>
              <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.5)', marginBottom: 12 }}>Or reach us directly:</div>
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4fd186', fontSize: '.88rem', fontWeight: 700, marginBottom: 8 }}>
                💬 +91 79855 43842
              </a>
              <a href={`mailto:${EMAIL}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#5bc4f5', fontSize: '.88rem', fontWeight: 700 }}>
                ✉️ {EMAIL}
              </a>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 24, padding: 36 }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', color: '#fff', marginBottom: 12 }}>Message Sent!</h3>
                <p style={{ color: 'rgba(255,255,255,.7)', lineHeight: 1.7, marginBottom: 24 }}>Your WhatsApp message has been opened. We'll respond within 30 minutes. Namaste! 🙏</p>
                <button onClick={() => setSent(false)} style={{ background: '#e8890a', color: '#fff', fontWeight: 700, padding: '10px 24px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '.88rem' }}>
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginBottom: 26 }}>📋 Inquiry Form</h3>
                <div className="form-row">
                  <div><label style={lbl}>Your Name *</label><input style={inp} placeholder="John Doe" value={form.name} onChange={set('name')} /></div>
                  <div><label style={lbl}>WhatsApp Number *</label><input style={inp} placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} /></div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Email (optional)</label>
                  <input style={inp} type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Service You're Interested In *</label>
                  <select style={{ ...inp, cursor: 'pointer' }} value={form.service} onChange={set('service')}>
                    <option value="">-- Select a service --</option>
                    {Object.values(SERVICES).map(s => (
                      <optgroup key={s.id} label={`${s.icon} ${s.title}`}>
                        {s.items.map(item => (
                          <option key={item.name} value={`${item.name} (${item.price}–${item.priceTo})`} style={{ background: '#1f4a2c' }}>
                            {item.name} — {item.price}–{item.priceTo}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <div><label style={lbl}>Arrival Date</label><input style={inp} type="date" value={form.date} onChange={set('date')} /></div>
                  <div><label style={lbl}>Group Size</label><input style={inp} type="number" placeholder="1" min="1" value={form.size} onChange={set('size')} /></div>
                </div>
                <div style={{ marginBottom: 22 }}>
                  <label style={lbl}>Anything specific? (optional)</label>
                  <textarea style={{ ...inp, height: 96, resize: 'vertical' }} placeholder="e.g. 'Private yoga session for 2, early morning preferred'" value={form.msg} onChange={set('msg')} />
                </div>
                <button onClick={submit} style={{
                  width: '100%', padding: '14px', background: '#e8890a', color: '#fff',
                  fontWeight: 800, fontSize: '.95rem', borderRadius: 28, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 6px 20px rgba(232,137,10,.35)',
                }}>
                  💬 Send to WhatsApp
                </button>
                <p style={{ textAlign: 'center', fontSize: '.68rem', color: 'rgba(255,255,255,.35)', marginTop: 12 }}>
                  We reply within 30 minutes · No spam, ever
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '72px 24px', background: '#f5f0e8' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, color: '#1a2010', marginBottom: 40 }}>Common Questions</h2>
          {[
            ['How do I book?', 'Fill the form above or tap any "Book via WhatsApp" button. We connect you with the right operator instantly. Payment is made directly — we charge no fees.'],
            ['How quickly do you reply?', 'Within 30 minutes during the day, and usually within 2 hours in the evening. We\'re based in Tapovan so we keep local hours (7 AM–10 PM IST).'],
            ['Is Rishikesh safe for solo travelers?', 'Tapovan and Rishikesh are considered one of India\'s safer destinations for travelers of all backgrounds. Our guide service is ideal for first-time visitors.'],
            ['Can I customize a package?', 'Absolutely. Yoga + rafting + camping + spiritual tour — we build custom multi-day itineraries for groups, couples, and solo travelers.'],
          ].map(([q, a]) => <FaqItem key={q} q={q} a={a} />)}
        </div>
      </section>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #e2d9c8', padding: '18px 0', textAlign: 'left' }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: '.95rem', fontWeight: 700, color: '#1a2010' }}>
        {q}
        <span style={{ color: '#1f4a2c', fontSize: '1.2rem', lineHeight: 1 }}>{open ? '−' : '+'}</span>
      </div>
      {open && <p style={{ fontSize: '.85rem', color: '#6b7c65', lineHeight: 1.75, paddingTop: 12 }}>{a}</p>}
    </div>
  );
}
