import { Link } from 'react-router-dom';
import { WA_NUMBER, BRAND_EMAIL } from '../lib/util';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg,#0b1710 0%,#0d1a13 100%)',
      color: 'rgba(255,255,255,.7)', padding: '56px 0 96px',
      marginTop: 'auto',
    }}>
      <div className="wrap" style={{ display: 'grid', gap: 32, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div style={{ gridColumn: 'span 2', minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ width: 38, height: 38, borderRadius: 12, background: '#0b0714', display: 'grid', placeItems: 'center' }}>
              <img src="/logo.jpeg" alt="Experience Rishikesh" width="26" height="26" />
            </span>
            <div>
              <div className="serif" style={{ fontSize: '1.1rem', color: '#fff' }}>Experience Rishikesh</div>
              <div style={{ fontSize: '.62rem', color: 'rgba(255,255,255,.4)', letterSpacing: '.14em' }}>TAPOVAN · RISHIKESH · UTTARAKHAND</div>
            </div>
          </div>
          <p style={{ fontSize: '.85rem', lineHeight: 1.7, maxWidth: 360, marginBottom: 16 }}>
            Your live guide to Tapovan — real-time venue vibes, curated experiences, one-tap WhatsApp booking.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" className="btn btn-wa btn-sm">💬 +91 79855 43842</a>
            <a href={`mailto:${BRAND_EMAIL}`} className="btn btn-outline btn-sm" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)', color: '#fff' }}>✉️ Email us</a>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '.78rem', color: '#fff', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 14 }}>Explore</h4>
          {[['Live Map','/map'],['Discover','/discover'],['All Services','/services'],['Book Now','/book']].map(([l,to]) => (
            <Link key={l} to={to} style={{ display: 'block', fontSize: '.83rem', color: 'rgba(255,255,255,.55)', padding: '5px 0' }}>{l}</Link>
          ))}
        </div>

        <div>
          <h4 style={{ fontSize: '.78rem', color: '#fff', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 14 }}>Categories</h4>
          {[['Yoga & Wellness','yoga'],['Adventure','adventure'],['Spiritual','spiritual'],['Cultural','cultural'],['Travel & Stay','travel']].map(([l,id]) => (
            <Link key={l} to={`/services/${id}`} style={{ display: 'block', fontSize: '.83rem', color: 'rgba(255,255,255,.55)', padding: '5px 0' }}>{l}</Link>
          ))}
        </div>

        <div>
          <h4 style={{ fontSize: '.78rem', color: '#fff', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 14 }}>For partners</h4>
          <Link to="/cafe-login" style={{ display: 'block', fontSize: '.83rem', color: 'rgba(255,255,255,.55)', padding: '5px 0' }}>🏪 Cafe owner login</Link>
          <a href={`mailto:${BRAND_EMAIL}?subject=Partner%20with%20Experience%20Rishikesh`} style={{ display: 'block', fontSize: '.83rem', color: 'rgba(255,255,255,.55)', padding: '5px 0' }}>🤝 Partner with us</a>
          <Link to="/admin" style={{ display: 'block', fontSize: '.83rem', color: 'rgba(255,255,255,.55)', padding: '5px 0' }}>⚙️ Admin panel</Link>
        </div>
      </div>

      <div className="wrap" style={{ marginTop: 36, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: '.72rem', color: 'rgba(255,255,255,.4)' }}>
        <span>© 2026 Experience Rishikesh · Tapovan, Rishikesh</span>
        <span>Made with ❤️ in the Himalayan foothills</span>
      </div>
    </footer>
  );
}
