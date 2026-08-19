import { Link, useLocation } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home', icon: '🏠', match: (p) => p === '/' },
  { to: '/discover', label: 'Discover', icon: '🧭', match: (p) => p.startsWith('/discover') || p.startsWith('/e/') || p.startsWith('/services') },
  { to: '/map', label: 'Live Map', icon: '🗺️', match: (p) => p.startsWith('/map') },
  { to: '/book', label: 'Book', icon: '📲', match: (p) => p.startsWith('/book') },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="show-mobile" style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 3000,
      height: 'calc(var(--bottom-h) + env(safe-area-inset-bottom, 0px))',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      background: 'rgba(255,255,255,.94)',
      backdropFilter: 'saturate(180%) blur(18px)',
      WebkitBackdropFilter: 'saturate(180%) blur(18px)',
      borderTop: '1px solid rgba(23,34,26,.08)',
      boxShadow: '0 -6px 24px rgba(23,34,26,.06)',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        height: 'var(--bottom-h)', maxWidth: 480, margin: '0 auto',
      }}>
        {items.map(it => {
          const active = it.match(pathname);
          return (
            <Link key={it.to} to={it.to} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 3, fontSize: '.65rem', fontWeight: 700, letterSpacing: '.01em',
              color: active ? 'var(--forest)' : 'var(--muted)',
              position: 'relative',
            }}>
              {active && (
                <span style={{
                  position: 'absolute', top: 6, width: 26, height: 3, borderRadius: 3,
                  background: 'var(--saffron)',
                }} />
              )}
              <span style={{ fontSize: '1.35rem', filter: active ? 'none' : 'grayscale(.15)' }}>{it.icon}</span>
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
