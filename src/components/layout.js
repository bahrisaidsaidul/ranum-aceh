import { ROLES } from '../services/authService.js';
import { ICONS } from '../utils/icons.js';
import { escapeHtml, getInitials } from '../utils/helpers.js';

export function renderNavigation(state, authService, dataService, { t, roleLabel }) {
  const user = authService.getCurrentUser();
  const role = authService.getRole();
  const favCount = dataService.getUserFavorites().length;

  const links = [
    { route: 'home', label: t('nav_home') },
    { route: 'explore', label: t('nav_explore') },
    { route: 'culinary', label: t('nav_culinary') },
    { route: 'stay', label: t('nav_stay') },
    { route: 'planner', label: t('nav_planner') },
    { route: 'saved', label: t('nav_saved'), badge: favCount }
  ];

  if (role === ROLES.PARTNER) {
    links.push({ route: 'partner', label: t('nav_partner') });
  }
  if (role === ROLES.ADMIN) {
    links.push({ route: 'admin', label: t('nav_admin') });
  }

  const makeItem = (l) => `
    <li>
      <a href="#${l.route}" class="nav-link ${state.route === l.route ? 'active' : ''}" data-route="${l.route}">
        <span>${escapeHtml(l.label)}</span>
        ${l.badge ? `<span class="nav-badge">${l.badge}</span>` : ''}
      </a>
    </li>
  `;

  document.getElementById('desktopNav').innerHTML = links.map(makeItem).join('');

  const renderAvatar = (u) =>
    u.avatarUrl
      ? `<span class="user-avatar"><img src="${escapeHtml(u.avatarUrl)}" alt="${escapeHtml(u.name)}" referrerpolicy="no-referrer" /></span>`
      : `<span class="user-avatar">${escapeHtml(getInitials(u.name))}</span>`;

  // Desktop Auth Area
  const authArea = document.getElementById('navAuthArea');
  if (user) {
    const portalRoute = role === ROLES.ADMIN ? 'admin' : role === ROLES.PARTNER ? 'partner' : 'saved';
    authArea.innerHTML = `
      <button type="button" class="user-chip" data-route="${portalRoute}" title="${escapeHtml(user.email)}">
        ${renderAvatar(user)}
        <span>${escapeHtml(user.name.split(' ')[0])}</span>
        <span class="role-pill role-${role}">${escapeHtml(roleLabel(role))}</span>
      </button>
      <button type="button" class="btn btn-outline btn-sm" data-action="logout" aria-label="${t('nav_logout')}">
        ${ICONS.logout}
      </button>
    `;
  } else {
    authArea.innerHTML = `
      <span class="role-pill role-guest">${escapeHtml(roleLabel(ROLES.GUEST))}</span>
      <button type="button" class="btn btn-primary btn-sm" data-route="auth">${t('nav_login')}</button>
    `;
  }

  // Mobile Drawer User Card + Links
  const mobileUserCard = document.getElementById('mobileUserCard');
  if (user) {
    mobileUserCard.innerHTML = `
      <div class="info-box" style="padding:14px 16px;gap:10px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
          <div style="display:flex;align-items:center;gap:10px;">
            ${renderAvatar(user)}
            <div>
              <div style="font-weight:600;font-size:0.95rem;">${escapeHtml(user.name)}</div>
              <div style="font-size:0.78rem;color:var(--muted);">${escapeHtml(user.email)}</div>
            </div>
          </div>
          <span class="role-pill role-${role}">${escapeHtml(roleLabel(role))}</span>
        </div>
        <button type="button" class="btn btn-outline btn-sm" data-action="logout">${ICONS.logout} ${t('nav_logout')}</button>
      </div>
    `;
  } else {
    mobileUserCard.innerHTML = `
      <div class="info-box" style="padding:14px 16px;gap:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:0.86rem;color:var(--muted);">Status: <strong>${escapeHtml(roleLabel(ROLES.GUEST))}</strong></span>
          <button type="button" class="btn btn-primary btn-sm" data-route="auth">${t('nav_login')}</button>
        </div>
      </div>
    `;
  }

  document.getElementById('mobileNav').innerHTML = links.map(makeItem).join('');

  // Language buttons
  const lang = state.data.preferences.language || 'id';
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

export function renderFooter({ t }) {
  document.getElementById('siteFooter').innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="brand-logo" style="color:var(--white);margin-bottom:14px;">
            <span class="brand-mark" style="background:var(--sage);color:var(--forest-dark);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3C7 7 5 11.5 5 15a7 7 0 0 0 14 0c0-3.5-2-8-7-12Z"/></svg>
            </span>
            <span>RANUM</span>
          </div>
          <p style="font-size:0.9rem;max-width:340px;margin-bottom:12px;">${t('footer_tagline')}</p>
          <p style="font-size:0.8rem;opacity:0.72;">${t('footer_disclaimer')}</p>
        </div>
        <div>
          <div class="footer-title">Eksplorasi</div>
          <ul class="footer-links">
            <li><a href="#explore" data-route="explore">${t('nav_explore')}</a></li>
            <li><a href="#culinary" data-route="culinary">${t('nav_culinary')}</a></li>
            <li><a href="#stay" data-route="stay">${t('nav_stay')}</a></li>
            <li><a href="#saved" data-route="saved">${t('nav_saved')}</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-title">Perencanaan</div>
          <ul class="footer-links">
            <li><button type="button" data-action="open-planner-tab" data-tab="itinerary">${t('tab_itinerary')}</button></li>
            <li><button type="button" data-action="open-planner-tab" data-tab="budget">${t('tab_budget')}</button></li>
            <li><button type="button" data-action="open-planner-tab" data-tab="packages">${t('tab_packages')}</button></li>
          </ul>
        </div>
        <div>
          <div class="footer-title">Akun &amp; Mitra</div>
          <ul class="footer-links">
            <li><a href="#auth" data-route="auth">${t('nav_login')}</a></li>
            <li><a href="#partner" data-route="partner">${t('nav_partner')}</a></li>
            <li><a href="#saved" data-route="saved">${t('nav_saved')}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} RANUM — Aceh Nature &amp; Halal Journey (v2.0 Production-Ready)</span>
        <span>Vite · Vanilla JS · GSAP · Motion · Lenis</span>
      </div>
    </div>
  `;
}
