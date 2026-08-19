import { useState } from 'react';
import { useInstallApp } from '../lib/useInstallApp';

export function InstallAppButton({ variant = 'primary', label = 'Install app', style }) {
  const { canOffer, strategy, promptInstall } = useInstallApp();
  const [modal, setModal] = useState(null);   // null | strategy string

  if (!canOffer) return null;

  const onClick = async () => {
    if (strategy === 'native') {
      const r = await promptInstall();
      if (r.outcome !== 'accepted') setModal('android-manual');
      return;
    }
    setModal(strategy);
  };

  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '8px 14px', borderRadius: 999,
    fontSize: '.82rem', fontWeight: 800, cursor: 'pointer',
    border: 'none', whiteSpace: 'nowrap',
    ...style,
  };
  const variants = {
    primary: { background: 'linear-gradient(135deg,#7c3aed,#8b3ff5)', color: '#fff', boxShadow: '0 6px 20px rgba(124,58,237,.35)' },
    nav:     { background: 'rgba(124,58,237,.14)', color: '#7c3aed', border: '1px solid rgba(124,58,237,.35)' },
    ghost:   { background: 'rgba(255,255,255,.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,.28)' },
  };

  return (
    <>
      <button type="button" onClick={onClick} style={{ ...base, ...variants[variant] }}>
        <span aria-hidden>📲</span> {label}
      </button>
      {modal && <InstallModal strategy={modal} onClose={() => setModal(null)} />}
    </>
  );
}

// One modal, four flavors — the strategy picks which body renders.
function InstallModal({ strategy, onClose }) {
  const bodies = {
    'ios-safari': {
      title: 'Install on iPhone',
      subtitle: 'Add to your Home Screen in 3 taps',
      steps: [
        <>Tap the <strong>Share</strong> button <IconChip label="⇧"/> at the bottom of Safari</>,
        <>Scroll and tap <strong>Add to Home Screen</strong></>,
        <>Tap <strong>Add</strong> — the icon lands on your home screen</>,
      ],
      note: 'After adding, open Experience Rishikesh from your home screen — full-screen, no address bar, works offline for pages you\'ve visited.',
    },
    'ios-other': {
      title: 'Open in Safari to install',
      subtitle: 'iPhone install only works from Safari',
      steps: [
        <>Copy this page\'s URL from the address bar</>,
        <>Open the <strong>Safari</strong> app and paste the URL</>,
        <>Tap <strong>Share</strong> <IconChip label="⇧"/> → <strong>Add to Home Screen</strong> → <strong>Add</strong></>,
      ],
      note: 'Chrome and Firefox on iPhone cannot install web apps — Apple only allows it from Safari.',
    },
    'android-manual': {
      title: 'Install on Android',
      subtitle: 'Add to Home Screen in 3 taps',
      steps: [
        <>Tap the <strong>⋮ menu</strong> at the top-right of Chrome</>,
        <>Tap <strong>Install app</strong> (or <strong>Add to Home screen</strong>)</>,
        <>Confirm — the icon lands on your home screen</>,
      ],
      note: 'If you don\'t see "Install app", scroll the page a bit and try again — Chrome sometimes waits for engagement before offering it in the menu.',
    },
    'desktop-manual': {
      title: 'Install on your computer',
      subtitle: 'Add it as a desktop app',
      steps: [
        <>Click the <strong>install icon</strong> <IconChip label="⇩"/> in the address bar (right side)</>,
        <>Click <strong>Install</strong> in the popup</>,
        <>Experience Rishikesh opens as a standalone app window</>,
      ],
      note: 'If you don\'t see the install icon, try in Chrome, Edge, or Brave. Some browsers don\'t support installing web apps.',
    },
  };

  const b = bodies[strategy] || bodies['android-manual'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 5000,
        background: 'rgba(15,25,18,.65)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: 16,
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 460,
          background: '#fff', borderRadius: 22,
          padding: 22, boxShadow: '0 20px 60px rgba(0,0,0,.35)',
          maxHeight: '85vh', overflowY: 'auto',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#7c3aed,#4a1f8c)',
            display: 'grid', placeItems: 'center',
          }}>
            <img src="/logo.jpeg" alt="" width="22" height="22" />
          </span>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 900, color: 'var(--ink)' }}>
              {b.title}
            </div>
            <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{b.subtitle}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            marginLeft: 'auto', width: 30, height: 30, borderRadius: 999,
            background: 'rgba(23,34,26,.06)', color: 'var(--muted)',
            fontSize: 14, border: 'none', cursor: 'pointer',
          }}>✕</button>
        </div>

        <ol style={{ marginTop: 12, paddingLeft: 0, listStyle: 'none' }}>
          {b.steps.map((s, i) => (
            <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
              <span style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: 999,
                background: 'var(--forest)', color: '#fff',
                display: 'grid', placeItems: 'center',
                fontWeight: 800, fontSize: '.82rem',
              }}>{i + 1}</span>
              <div style={{ fontSize: '.9rem', color: 'var(--ink-2)', lineHeight: 1.55, paddingTop: 3 }}>{s}</div>
            </li>
          ))}
        </ol>

        <p style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: 14, lineHeight: 1.6 }}>{b.note}</p>

        <button onClick={onClose} className="btn btn-primary btn-block" style={{ marginTop: 12 }}>Got it</button>
      </div>
    </div>
  );
}

// Floating pill that sits above the bottom nav on mobile — hard to miss.
export function InstallAppFloating() {
  const { canOffer, strategy, promptInstall, dismiss, wasRecentlyDismissed, platform } = useInstallApp();
  const [hidden, setHidden] = useState(wasRecentlyDismissed());
  const [modal, setModal] = useState(null);

  if (!canOffer || hidden || !platform.isMobile) return null;

  const onClick = async () => {
    if (strategy === 'native') {
      const r = await promptInstall();
      if (r.outcome !== 'accepted') setModal('android-manual');
      return;
    }
    setModal(strategy);
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        left: 12, right: 12,
        bottom: 'calc(var(--bottom-h) + env(safe-area-inset-bottom) + 12px)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'linear-gradient(135deg,#3b1477,#7c3aed)',
        color: '#fff', padding: '10px 12px 10px 14px', borderRadius: 999,
        boxShadow: '0 10px 30px rgba(59,20,119,.4)',
        border: '1px solid rgba(255,255,255,.15)',
      }}>
        <img src="/logo.jpeg" alt="" width="26" height="26" />
        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
          <div style={{ fontSize: '.82rem', fontWeight: 800 }}>Install as an app</div>
          <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.75)' }}>
            {strategy === 'ios-safari' ? 'Add to iPhone home screen'
              : strategy === 'ios-other' ? 'Open in Safari to install'
              : 'One-tap on home screen'}
          </div>
        </div>
        <button onClick={onClick} style={{
          background: '#fff', color: '#4a1f8c',
          padding: '8px 14px', borderRadius: 999,
          fontWeight: 800, fontSize: '.78rem', border: 'none', cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}>Install</button>
        <button onClick={() => { dismiss(); setHidden(true); }} aria-label="Dismiss" style={{
          background: 'rgba(255,255,255,.14)', color: '#fff',
          width: 28, height: 28, borderRadius: 999, border: 'none',
          fontSize: 13, cursor: 'pointer', flexShrink: 0,
        }}>✕</button>
      </div>
      {modal && <InstallModal strategy={modal} onClose={() => setModal(null)} />}
    </>
  );
}

function IconChip({ label }) {
  return (
    <span aria-hidden style={{
      display: 'inline-flex', width: 22, height: 22, borderRadius: 6,
      background: '#eef1ff', color: '#3949e5',
      alignItems: 'center', justifyContent: 'center',
      margin: '0 4px', verticalAlign: 'middle', fontSize: 12, fontWeight: 700,
    }}>{label}</span>
  );
}

// The purple banner near the top of Home.
export function InstallAppBanner() {
  const { canOffer, strategy, promptInstall, dismiss, wasRecentlyDismissed, platform } = useInstallApp();
  const [hidden, setHidden] = useState(wasRecentlyDismissed());
  const [modal, setModal] = useState(null);

  if (!canOffer || hidden) return null;

  const onInstall = async () => {
    if (strategy === 'native') {
      const r = await promptInstall();
      if (r.outcome !== 'accepted') setModal('android-manual');
      return;
    }
    setModal(strategy);
  };
  const onDismiss = () => { dismiss(); setHidden(true); };

  const headline = strategy === 'ios-safari'
    ? 'Add Rishikesh to your iPhone home screen'
    : strategy === 'ios-other'
    ? 'Install Rishikesh (open in Safari)'
    : 'Install the Rishikesh app';

  return (
    <>
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg,#3b1477,#7c3aed 55%,#a855f7)',
        color: '#fff',
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      }}>
        <span style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'rgba(0,0,0,.35)', display: 'grid', placeItems: 'center',
          flexShrink: 0,
        }}>
          <img src="/logo.jpeg" alt="" width="24" height="24" />
        </span>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontWeight: 800, fontSize: '.95rem' }}>{headline}</div>
          <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.78)' }}>
            One-tap access, full-screen, live venue vibes, works offline
          </div>
        </div>
        <button onClick={onInstall} style={{
          background: '#fff', color: '#4a1f8c',
          padding: '9px 18px', borderRadius: 999,
          fontWeight: 800, fontSize: '.85rem', border: 'none', cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}>
          📲 Install
        </button>
        <button onClick={onDismiss} aria-label="Dismiss" style={{
          background: 'rgba(255,255,255,.16)', color: '#fff',
          width: 32, height: 32, borderRadius: 999, border: 'none',
          fontSize: 14, cursor: 'pointer',
        }}>✕</button>
      </div>
      {modal && <InstallModal strategy={modal} onClose={() => setModal(null)} />}
    </>
  );
}
