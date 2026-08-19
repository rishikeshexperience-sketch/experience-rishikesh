import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { VENUES, ZONES } from '../data/venues';

const moodColors = {
  buzzing: '#ff6b6b', vibrant: '#f0a500', golden: '#fbbf24',
  serene: '#a78bfa', quiet: '#5bc4f5', happening: '#fb923c',
  spiritual: '#c084fc', open: '#4fd186',
};
const typeColors = { cafe: '#f0a500', yoga: '#a78bfa', view: '#5bc4f5', event: '#4fd186' };
const typeIcons = { cafe: '☕', yoga: '🧘', view: '🌅', event: '🎉' };

// Open turn-by-turn directions cross-device. On iOS, tries maps: → Google Maps → web fallback.
function openDirections(v) {
  const { lat, lng, name } = v;
  const label = encodeURIComponent(name || 'destination');
  const web = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=driving`;
  try {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      // Prefer Apple Maps on iOS if user has it, else Google Maps app URL, else web.
      const apple = `maps://maps.apple.com/?daddr=${lat},${lng}&q=${label}`;
      window.location.href = apple;
      setTimeout(() => window.open(web, '_blank', 'noopener'), 700);
      return;
    }
    const isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid) {
      // Trigger Google Maps app via intent, fallback to web.
      const geo = `geo:${lat},${lng}?q=${lat},${lng}(${label})`;
      window.location.href = geo;
      setTimeout(() => window.open(web, '_blank', 'noopener'), 700);
      return;
    }
    window.open(web, '_blank', 'noopener,noreferrer');
  } catch {
    window.open(web, '_blank', 'noopener,noreferrer');
  }
}

function createIcon(v) {
  return L.divIcon({
    className: '',
    html: `<div style="width:36px;height:36px;border-radius:50%;background:${typeColors[v.type]};display:flex;align-items:center;justify-content:center;font-size:17px;border:2.5px solid #fff;box-shadow:0 3px 12px rgba(0,0,0,.5);cursor:pointer">${v.icon}</div>`,
    iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -22],
  });
}

function MapBounds({ venues }) {
  const map = useMap();
  useEffect(() => {
    if (venues.length) {
      const bounds = L.latLngBounds(venues.map(v => [v.lat, v.lng]));
      map.fitBounds(bounds.pad(.15));
    }
  }, [venues]);
  return null;
}

export default function MoodMap() {
  const [zone, setZone] = useState('all');
  const [type, setType] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = VENUES.filter(v =>
    (zone === 'all' || v.zone === zone) &&
    (type === 'all' || v.type === type)
  );

  const moodBg = (m) => ({ background: `${moodColors[m] || '#4fd186'}22`, color: moodColors[m] || '#4fd186' });

  return (
    <div style={{ paddingTop: 'var(--nav-h)', paddingBottom: 'env(safe-area-inset-bottom, 0px)', minHeight: '100vh', background: '#0a1510', display: 'flex', flexDirection: 'column' }} className="moodmap-shell">
      {/* Header */}
      <div style={{ background: '#0d1a13', borderBottom: '1px solid #2a4030', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fd186', display: 'inline-block', animation: 'livePulse 1.8s infinite' }} />
            <style>{`@keyframes livePulse{0%,100%{box-shadow:0 0 0 0 rgba(79,209,134,.7)}50%{box-shadow:0 0 0 7px rgba(79,209,134,0)}}`}</style>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.2rem,3vw,1.8rem)', fontWeight: 900, color: '#e8f0ea' }}>Tapovan Live Mood Map</h1>
            <span style={{ marginLeft: 8, fontSize: '.7rem', fontWeight: 800, letterSpacing: '.6px', background: 'rgba(79,209,134,.12)', border: '1px solid rgba(79,209,134,.3)', color: '#4fd186', padding: '3px 10px', borderRadius: 20 }}>LIVE</span>
          </div>
          <p style={{ fontSize: '.78rem', color: '#7a9a82' }}>Upper Tapovan · Lower Tapovan · Laxman Jhula · Joey's Area · {filtered.length} venues showing</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: '#0d1a13', borderBottom: '1px solid #1a2d20', padding: '10px 24px', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {/* Zone filter */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: '.68rem', color: '#4a6a52', fontWeight: 700, letterSpacing: '.5px', marginRight: 2 }}>AREA</span>
            {ZONES.map(z => (
              <button key={z.id} onClick={() => setZone(z.id)} style={{
                padding: '5px 12px', borderRadius: 20, fontSize: '.72rem', fontWeight: 700,
                background: zone === z.id ? z.color : '#1a2d20', color: zone === z.id ? '#0d1a13' : '#7a9a82',
                border: `1.5px solid ${zone === z.id ? z.color : '#2a4030'}`, cursor: 'pointer', transition: '.2s',
                whiteSpace: 'nowrap',
              }}>
                {z.label}
              </button>
            ))}
          </div>
          {/* Type filter */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: '.68rem', color: '#4a6a52', fontWeight: 700, letterSpacing: '.5px', marginRight: 2 }}>TYPE</span>
            {[['all', '🌐 All'], ['cafe', '☕ Cafes'], ['yoga', '🧘 Yoga'], ['view', '🌅 Views'], ['event', '🎉 Events']].map(([k, l]) => (
              <button key={k} onClick={() => setType(k)} style={{
                padding: '5px 12px', borderRadius: 20, fontSize: '.72rem', fontWeight: 700,
                background: type === k ? '#4fd186' : '#1a2d20', color: type === k ? '#0d1a13' : '#7a9a82',
                border: `1.5px solid ${type === k ? '#4fd186' : '#2a4030'}`, cursor: 'pointer', transition: '.2s',
              }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="mm-layout">
        {/* Map */}
        <div className="mm-map-wrap" style={{ position: 'relative' }}>
          <MapContainer
            center={[30.1060, 78.3140]}
            zoom={15}
            style={{ height: '100%', width: '100%', minHeight: 320 }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
            />
            <style>{`.leaflet-tile{filter:brightness(.65) saturate(.7) hue-rotate(160deg)}`}</style>
            <MapBounds venues={filtered} />
            {filtered.map(v => (
              <Marker key={v.id} position={[v.lat, v.lng]} icon={createIcon(v)} eventHandlers={{ click: () => setSelected(v) }}>
                <Popup>
                  <div style={{ minWidth: 210 }}>
                    <div style={{ fontSize: '.9rem', fontWeight: 800, color: '#e8f0ea', marginBottom: 6 }}>{v.icon} {v.name}</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '.65rem', fontWeight: 800, padding: '3px 9px', borderRadius: 20, marginBottom: 8, ...moodBg(v.mood) }}>
                      {v.moodLabel}
                    </div>
                    <div style={{ fontSize: '.72rem', color: '#9aaa94', lineHeight: 1.5, marginBottom: 6 }}>{v.updateText}</div>
                    <div style={{ fontSize: '.62rem', color: '#4a6a52' }}>🕐 {v.lastUpdate}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Zone legend */}
          <div style={{
            position: 'absolute', bottom: 16, left: 16, zIndex: 1000,
            background: 'rgba(13,26,19,.9)', backdropFilter: 'blur(8px)',
            border: '1px solid #2a4030', borderRadius: 10, padding: '10px 14px',
          }}>
            <div style={{ fontSize: '.62rem', color: '#4a6a52', fontWeight: 800, letterSpacing: '.5px', marginBottom: 7 }}>AREAS COVERED</div>
            {ZONES.slice(1).map(z => (
              <div key={z.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: z.color, flexShrink: 0 }} />
                <span style={{ fontSize: '.68rem', color: '#9aaa94' }}>{z.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="mm-sidebar" style={{
          background: '#fffaf1', borderLeft: '1px solid #e6dcc7',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          color: '#17221a',
        }}>
          {/* Selected venue detail */}
          {selected && (
            <div style={{ background: '#fff', borderBottom: '1px solid #e6dcc7', padding: '14px 16px', boxShadow: '0 2px 12px rgba(23,34,26,.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.68rem', color: '#6f7a6f', marginBottom: 4, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase' }}>{ZONES.find(z => z.id === selected.zone)?.label}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#17221a', marginBottom: 6 }}>{selected.icon} {selected.name}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '.68rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20, marginBottom: 8, ...moodBg(selected.mood) }}>
                    {selected.moodLabel}
                  </div>
                  <p style={{ fontSize: '.82rem', color: '#2d3a30', lineHeight: 1.6 }}>{selected.updateText}</p>
                  <p style={{ fontSize: '.72rem', color: '#6f7a6f', marginTop: 6 }}>📍 {selected.desc}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDirections(selected);
                    }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      marginTop: 10, padding: '8px 14px', borderRadius: 999,
                      background: '#1f4a2c', color: '#fff',
                      fontSize: '.78rem', fontWeight: 800, border: 'none', cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(31,74,44,.2)',
                    }}>
                    🧭 Navigate
                  </button>
                </div>
                <button onClick={() => setSelected(null)} aria-label="Close" style={{ background: 'rgba(23,34,26,.06)', border: 'none', color: '#6f7a6f', fontSize: 14, width: 26, height: 26, borderRadius: 999, padding: 0, flexShrink: 0, cursor: 'pointer' }}>✕</button>
              </div>
            </div>
          )}

          {/* Feed */}
          <div style={{ padding: '12px 14px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e6dcc7' }}>
            <span style={{ fontSize: '.75rem', fontWeight: 800, color: '#17221a', letterSpacing: '.04em', textTransform: 'uppercase' }}>Live Updates</span>
            <span style={{ fontSize: '.65rem', background: 'rgba(31,74,44,.09)', color: '#1f4a2c', padding: '3px 10px', borderRadius: 20, fontWeight: 800, border: '1px solid rgba(31,74,44,.15)' }}>{filtered.length} venues</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px 20px' }}>
            {filtered.map(v => {
              const isOn = selected?.id === v.id;
              return (
                <div key={v.id}
                  onClick={() => setSelected(v)}
                  style={{
                    background: '#fff',
                    border: `1px solid ${isOn ? '#4fd186' : '#e6dcc7'}`,
                    boxShadow: isOn ? '0 6px 16px rgba(79,209,134,.18)' : '0 1px 4px rgba(23,34,26,.04)',
                    borderRadius: 12, padding: '11px 13px', marginBottom: 10, cursor: 'pointer', transition: 'all .18s ease',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                    <span style={{ fontSize: 16 }}>{v.icon}</span>
                    <span style={{ fontSize: '.82rem', fontWeight: 800, color: '#17221a', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</span>
                    <span style={{ fontSize: '.62rem', color: '#8a9285' }}>{v.lastUpdate}</span>
                  </div>
                  <div style={{ display: 'inline-flex', gap: 4, alignItems: 'center', fontSize: '.63rem', fontWeight: 800, padding: '3px 9px', borderRadius: 20, marginBottom: 6, ...moodBg(v.mood) }}>
                    {v.moodLabel}
                  </div>
                  <div style={{ fontSize: '.75rem', color: '#3d4a3f', lineHeight: 1.55 }}>
                    {v.updateText.length > 90 ? v.updateText.substring(0, 90) + '…' : v.updateText}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, gap: 8 }}>
                    <span style={{ fontSize: '.65rem', color: typeColors[v.type] || '#1f4a2c', fontWeight: 700 }}>
                      {typeIcons[v.type]} {ZONES.find(z => z.id === v.zone)?.label}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDirections(v);
                      }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: '.72rem', fontWeight: 800,
                        padding: '6px 12px', borderRadius: 999,
                        background: '#1f4a2c', color: '#fff', border: 'none', cursor: 'pointer',
                        boxShadow: '0 3px 10px rgba(31,74,44,.25)',
                      }}>
                      🧭 Navigate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .mm-layout {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 360px;
          min-height: 0;
        }
        .mm-map-wrap { height: calc(100vh - 200px); min-height: 320px; }
        .mm-sidebar  { height: calc(100vh - 200px); }
        @media (max-width: 900px) {
          .mm-layout   { grid-template-columns: 1fr; grid-template-rows: 55vh auto; }
          .mm-map-wrap { height: 55vh; min-height: 320px; }
          .mm-sidebar  { height: auto; max-height: none; border-left: none; border-top: 1px solid #e6dcc7; }
        }
      `}</style>
    </div>
  );
}
