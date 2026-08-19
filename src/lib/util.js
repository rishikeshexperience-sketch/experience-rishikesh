import { SERVICES } from '../data/services';

export const WA_NUMBER = '917985543842';
export const BRAND_EMAIL = 'rishikeshexperience@gmail.com';

export const slugify = (s) =>
  s.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

let _cache = null;
export function getAllExperiences() {
  if (_cache) return _cache;
  const out = [];
  for (const [catId, cat] of Object.entries(SERVICES)) {
    cat.items.forEach((item, idx) => {
      out.push({
        ...item,
        slug: slugify(item.name),
        idx,
        catId,
        catTitle: cat.title,
        catIcon: cat.icon,
        catColor: cat.color,
      });
    });
  }
  _cache = out;
  return out;
}

export function findExperience(catId, slug) {
  return getAllExperiences().find((e) => e.catId === catId && e.slug === slug);
}

export function bookOnWhatsApp(serviceName, extra = '') {
  const msg = `🏔️ *Experience Rishikesh — Booking Request*\n\n📌 ${serviceName}\n${extra}\n\n👤 Name:\n📱 WhatsApp:\n📅 Date:\n👥 Group size:\n💬 Notes:`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

export const priceRange = (item) =>
  item.priceTo && item.priceTo !== item.price ? `${item.price}–${item.priceTo}` : item.price;
