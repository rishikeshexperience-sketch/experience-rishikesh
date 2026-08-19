import { useState } from 'react';
import { useInstallApp } from '../lib/useInstallApp';

// A small pill button that shows only when installable.
// `variant`: 'primary' | 'nav' | 'ghost'
export function InstallAppButton({ variant = 'primary', label = 'Install app', style }) {
  const { canOffer, canInstallNative, canInstallIOS, promptInstall } = useInstallApp();
  const [showIOS, setShowIOS] = useState(false);

  if (!canOffer) return null;

  const onClick = async () => {
    if (canInstallNative) {
      await promptInstall();
    } else if (canInstallIOS) {
      setShowIOS(true);
    }
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
      {showIOS && <IOSInstructionsModal onClose={() => setShowIOS(false)} />}
    </>
  );
}

function IOSInstructionsModal({ onClose }) {
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
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#7c3aed,#4a1f8c)',
            display: 'grid', placeItems: 'center',
          }}>
            <img src="/logo.svg" alt="" width="22" height="22" />
          </span>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 900, color: 'var(--ink)' }}>
              Install on iPhone
            </div>
            <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>Add to your Home Screen in 3 taps</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            marginLeft: 'auto', width: 30, height: 30, borderRadius: 999,
            background: 'rgba(23,34,26,.06)', color: 'var(--muted)',
            fontSize: 14, border: 'none', cursor: 'pointer',
          }}>✕</button>
        </div>

        <ol style={{ marginTop: 12, paddingLeft: 0, listStyle: 'none' }}>
          {[
            { n: 1, text: <>Tap the <strong>Share</strong> button <span aria-hidden style={{ display: 'inline-flex', width: 22, height: 22, borderRadius: 6, background: '#eef1ff', color: '#3949e5', alignItems: 'center', justifyContent: 'center', margin: '0 4px', verticalAlign: 'middle' }}>⇧</span> at the bottom of Safari</> },
            { n: 2, text: <>Scroll and tap <strong>Add to Home Screen</strong></> },
            { n: 3, text: <>Tap <strong>Add</strong> — the Experience Rishikesh icon lands on your home screen</> },
          ].map(step => (
            <li key={step.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
              <span style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: 999,
                background: 'var(--forest)', color: '#fff',
                display: 'grid', placeItems: 'center',
                fontWeight: 800, fontSize: '.82rem',
              }}>{step.n}</span>
              <div style={{ fontSize: '.9rem', color: 'var(--ink-2)', lineHeight: 1.55, paddingTop: 3 }}>
                {step.text}
              </div>
            </li>
          ))}
        </ol>

        <p style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: 14, lineHeight: 1.6 }}>
          After adding, you can open Experience Rishikesh straight from your home screen — full-screen, no Safari address bar, and it works offline for the pages you\'ve already visited.
        </p>

        <button onClick={onClose} className="btn btn-primary btn-block" style={{ marginTop: 12 }}>Got it</button>
      </div>
    </div>
  );
}

// Larger, dismissable banner for the top of Home.
export function InstallAppBanner() {
  const { canOffer, canInstallNative, canInstallIOS, promptInstall, dismiss, wasRecentlyDismissed, os } = useInstallApp();
  const [hidden, setHidden] = useState(wasRecentlyDismissed());
  const [showIOS, setShowIOS] = useState(false);

  if (!canOffer || hidden) return null;

  const onInstall = async () => {
    if (canInstallNative) await promptInstall();
    else if (canInstallIOS) setShowIOS(true);
  };
  const onDismiss = () => { dismiss(); setHidden(true); };

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
          <img src="/logo.svg" alt="" width="24" height="24" />
        </span>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontWeight: 800, fontSize: '.95rem' }}>
            {os.isIOS ? 'Add Rishikesh to your iPhone home screen' : 'Install the Rishikesh app'}
          </div>
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
      {showIOS && <IOSInstructionsModal onClose={() => setShowIOS(false)} />}
    </>
  );
}
