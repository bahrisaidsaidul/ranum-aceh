import { I18N } from '../data/i18n.js';

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatIDR(amount) {
  const num = Number(amount) || 0;
  return 'Rp ' + num.toLocaleString('id-ID');
}

export function makeFallbackSvg(label) {
  const safe = (label || 'Ranum Aceh').replace(/[<>&"']/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2F4739"/><stop offset="100%" stop-color="#7E9177"/></linearGradient></defs><rect width="800" height="560" fill="url(#g)"/><path d="M0 410 Q200 310 420 390 T800 360 L800 560 L0 560 Z" fill="#1E3025" opacity="0.55"/><circle cx="640" cy="130" r="46" fill="#E9E3D5" opacity="0.28"/><text x="50%" y="52%" text-anchor="middle" fill="#F8F7F2" font-family="Georgia,serif" font-size="30" opacity="0.92">${safe}</text><text x="50%" y="60%" text-anchor="middle" fill="#E9E3D5" font-family="sans-serif" font-size="14" letter-spacing="3" opacity="0.75">RANUM ACEH</text></svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

export function registerGlobalImageFallback() {
  window.__ranumImgFallback = function (img, label) {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = '1';
    img.src = makeFallbackSvg(label);
  };
}

export function getRegionCenter(region) {
  const centers = {
    'Banda Aceh': [5.553, 95.317],
    Sabang: [5.87, 95.3],
    'Aceh Besar': [5.475, 95.235],
    'Aceh Tengah': [4.614, 96.86],
    'Bener Meriah': [4.738, 96.88]
  };
  return centers[region] || [5.2, 96.05];
}

export function getInitials(name) {
  if (!name) return 'G';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'U';
}

export function createTranslator(state) {
  const t = (key) => {
    const lang = state.data.preferences.language || 'id';
    return (I18N[lang] && I18N[lang][key]) || I18N.id[key] || key;
  };
  const catLabel = (cat) => t('cat_' + cat) || cat;
  const destDesc = (d) => {
    const lang = state.data.preferences.language || 'id';
    return lang === 'en' && d.descriptionEn ? d.descriptionEn : d.description;
  };
  const roleLabel = (role) => t('role_' + (role || 'guest'));
  return { t, catLabel, destDesc, roleLabel };
}

export function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.innerHTML = `<span>${escapeHtml(message)}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'all 0.25s ease';
    setTimeout(() => el.remove(), 260);
  }, 3000);
}
