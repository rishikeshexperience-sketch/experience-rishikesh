import { Link } from 'react-router-dom';
import { priceRange, bookOnWhatsApp } from '../lib/util';

export default function ActivityCard({ exp, compact = false }) {
  return (
    <Link
      to={`/e/${exp.catId}/${exp.slug}`}
      className="card tap"
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <div style={{ position: 'relative', aspectRatio: compact ? '4/3' : '5/4', overflow: 'hidden' }}>
        <img
          src={exp.image}
          alt={exp.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }}
        />
        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(6px)',
          padding: '5px 11px', borderRadius: 999,
          fontSize: '.7rem', fontWeight: 800, color: exp.catColor,
          display: 'inline-flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ fontSize: '.9rem' }}>{exp.catIcon}</span>
          {exp.catTitle}
        </div>
        {exp.badge && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: exp.badgeColor || 'var(--rose)', color: '#fff',
            padding: '4px 10px', borderRadius: 999, fontSize: '.65rem', fontWeight: 800, letterSpacing: '.03em',
          }}>{exp.badge}</div>
        )}
      </div>
      <div style={{ padding: '16px 18px 18px' }}>
        <h3 className="serif" style={{ fontSize: '1.05rem', color: 'var(--ink)', marginBottom: 6, lineHeight: 1.25 }}>
          {exp.name}
        </h3>
        <p className="line-clamp-2" style={{ fontSize: '.83rem', color: 'var(--muted)', lineHeight: 1.55, marginBottom: 14 }}>
          {exp.desc}
        </p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <span className="chip" style={{ fontSize: '.68rem' }}>⏱ {exp.duration}</span>
          <span className="chip" style={{ fontSize: '.68rem' }}>👥 {exp.groupSize}</span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px dashed var(--line)', paddingTop: 12, gap: 10,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '.66rem', color: 'var(--muted)', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>
              From
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--ink)', fontFamily: 'var(--serif)', lineHeight: 1.1 }}>
              {priceRange(exp)}
              <span style={{ fontSize: '.65rem', color: 'var(--muted)', fontWeight: 500, marginLeft: 4 }}>
                {exp.unit}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              bookOnWhatsApp(exp.name, `💰 ${priceRange(exp)} ${exp.unit}`);
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'var(--wa)', color: '#fff',
              fontSize: '.78rem', fontWeight: 800,
              padding: '8px 14px', borderRadius: 999,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,211,102,.28)',
              whiteSpace: 'nowrap',
            }}>
            💬 Book
          </button>
        </div>
      </div>
    </Link>
  );
}
