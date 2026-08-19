import { useState, useEffect, useMemo } from 'react';
import { SERVICES as SEED } from '../data/services';
import { api } from './apiBase';

let _cached = null;
let _promise = null;

async function fetchServices() {
  if (_cached) return _cached;
  if (_promise) return _promise;
  _promise = (async () => {
    try {
      const res = await fetch(api('/api/services'));
      if (res.ok) {
        const { services } = await res.json();
        if (services && Object.keys(services).length) {
          _cached = services;
          return services;
        }
      }
    } catch { /* backend not up — that's fine */ }
    _cached = SEED;
    return SEED;
  })();
  return _promise;
}

// Same shape as importing SERVICES directly, so page code stays close to the old form.
export function useServices() {
  const [services, setServices] = useState(_cached || SEED);
  useEffect(() => {
    let alive = true;
    fetchServices().then(s => { if (alive) setServices(s); });
    return () => { alive = false; };
  }, []);
  return services;
}

export function useAllExperiences() {
  const services = useServices();
  return useMemo(() => {
    const out = [];
    for (const [catId, cat] of Object.entries(services || {})) {
      (cat.items || []).forEach((item, idx) => {
        out.push({
          ...item,
          slug: (item.name || '').toLowerCase().replace(/&/g, 'and').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'),
          idx, catId,
          catTitle: cat.title, catIcon: cat.icon, catColor: cat.color,
        });
      });
    }
    return out;
  }, [services]);
}
