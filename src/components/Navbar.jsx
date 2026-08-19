import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WA_NUMBER } from '../lib/util';
import { InstallAppButton } from './InstallAppButton';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/discover', label: 'Discover' },
    { to: '/map', label: 'Live Map' },
    { to: '/services', label: 'Services' },
  ];

  const onHome = pathname === '/';
  const glass = onHome && !scrolled;

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 3000, height: 'var(--nav-h)',
        background: glass ? 'linear-gradient(to bottom,rgba(15,25,18,.55),rgba(15,25,18,0))' : 'rgba(247,242,233,.9)',
        backdropFilter: scrolled || !onHome ? 'saturate(180%) blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled || !onHome ? 'saturate(180%) blur(14px)' : 'none',
        borderBottom: scrolled || !onHome ? '1px solid rgba(23,34,26,.06)' : 'none',
        transition: 'background .25s, border-color .25s',
      }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 20 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <span style={{
              width: 38, height: 38, borderRadius: 12,
              background: '#0b0714',
              display: 'grid', placeItems: 'center',
              boxShadow: '0 4px 14px rgba(124,58,237,.35)',
            }}>
              <img src="/logo.jpeg" alt="Experience Rishikesh" width="26" height="26" style={{ display: 'block' }} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div className="serif" style={{
                fontSize: '1rem', lineHeight: 1.05,
                color: glass ? '#fff' : 'var(--ink)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                Experience Rishikesh
              </div>
              <div style={{
                fontSize: '.6rem', letterSpacing: '.15em',
                color: glass ? 'rgba(255,255,255,.65)' : 'var(--muted)',
              }}>
                TAPOVAN · LIVE
              </div>
            </div>
          </Link>

          <div className="hide-mobile" style={{ marginLeft: 'auto', display: 'flex', gap: 4, alignItems: 'center' }}>
            {links.map(l => {
              const active = pathname === l.to || (l.to !== '/' && pathname.startsWith(l.to));
              return (
                <Link key={l.to} to={l.to} style={{
                  padding: '8px 14px', borderRadius: 999, fontSize: '.85rem', fontWeight: 700,
                  color: active ? (glass ? '#fff' : 'var(--forest)') : (glass ? 'rgba(255,255,255,.85)' : 'var(--ink-2)'),
                  background: active ? (glass ? 'rgba(255,255,255,.14)' : 'rgba(31,74,44,.09)') : 'transparent',
                  transition: 'all .18s',
                }}>{l.label}</Link>
              );
            })}
            <InstallAppButton variant={glass ? 'ghost' : 'nav'} label="Install app" style={{ marginLeft: 8 }} />
            <Link to="/book" className="btn btn-primary btn-sm">Book Now</Link>
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer"
              className="btn btn-wa btn-sm">💬 WhatsApp</a>
          </div>

          <button
            aria-label="Menu"
            className="show-mobile"
            onClick={() => setOpen(o => !o)}
            style={{
              marginLeft: 'auto', width: 40, height: 40, borderRadius: 12,
              display: 'grid', placeItems: 'center',
              background: glass ? 'rgba(255,255,255,.15)' : 'rgba(23,34,26,.06)',
              color: glass ? '#fff' : 'var(--ink)',
              fontSize: 20,
            }}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {open && (
        <div className="show-mobile" style={{
          position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0, bottom: 0, zIndex: 2999,
          background: 'rgba(23,34,26,.55)', backdropFilter: 'blur(4px)',
        }} onClick={() => setOpen(false)}>
          <div style={{
            background: '#fff', padding: '16px 20px 24px', margin: 16, borderRadius: 22,
            boxShadow: '0 20px 60px rgba(0,0,0,.35)',
          }} onClick={e => e.stopPropagation()}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 6px', fontSize: '1.02rem', fontWeight: 700, color: 'var(--ink)',
                borderBottom: '1px solid var(--line)',
              }}>
                {l.label} <span style={{ color: 'var(--muted)' }}>›</span>
              </Link>
            ))}
            <div style={{ marginTop: 16 }}>
              <InstallAppButton variant="primary" label="📲 Install as app" style={{ display: 'flex', width: '100%', justifyContent: 'center' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <Link to="/book" className="btn btn-primary btn-block" style={{ flex: 1 }}>Book</Link>
              <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" className="btn btn-wa btn-block" style={{ flex: 1 }}>💬 Chat</a>
            </div>
            <Link to="/cafe-login" style={{
              display: 'block', textAlign: 'center', marginTop: 12,
              fontSize: '.78rem', color: 'var(--muted)',
            }}>🏪 Cafe Owner Login</Link>
          </div>
        </div>
      )}
    </>
  );
}
