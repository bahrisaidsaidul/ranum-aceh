import { CATEGORIES, REGIONS, REGION_IMAGES } from '../data/i18n.js';
import { ICONS } from '../utils/icons.js';
import { escapeHtml } from '../utils/helpers.js';
import { renderDestinationCard, renderCulinaryCard, renderStayCard, renderPackageCard } from '../components/cards.js';
import { renderAcehMapSection } from '../utils/mapManager.js';

export function renderHomePage(state, dataService, helpers) {
  const { t, catLabel } = helpers;
  const featured = state.data.destinations.filter((d) => d.featured).slice(0, 6);
  const culHighlights = state.data.culinary.slice(0, 3);
  const stayHighlights = state.data.accommodations.slice(0, 3);
  const pkgHighlights = state.data.packages.slice(0, 3);

  const catIcons = {
    nature: ICONS.nature,
    marine: ICONS.marine,
    religious: ICONS.mosque,
    historical: ICONS.historical,
    cultural: ICONS.cultural,
    culinary: ICONS.culinary
  };

  return `
    <!-- Hero with GSAP Parallax & Glassmorphism -->
    <section class="hero">
      <div class="container">
        <div class="hero-card">
          <img class="hero-bg" data-hero-parallax src="./images/danau-laut-tawar.jpg" alt="Danau Laut Tawar, Aceh" onerror="__ranumImgFallback(this, 'Aceh Nature')" />
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <div class="hero-main">
              <div class="hero-pill">${ICONS.acehMotif} <span>${t('hero_pill')}</span></div>
              <h1 class="hero-title" data-split-words data-hero-heading>${t('hero_title')}</h1>
              <p class="hero-desc">${t('hero_desc')}</p>
              <form class="hero-search" id="heroSearchForm">
                <span style="padding-left:12px;color:var(--sage);display:flex;">${ICONS.search}</span>
                <input type="text" id="heroSearchInput" placeholder="${t('hero_search_ph')}" aria-label="${t('hero_search_ph')}" />
                <button type="submit" class="btn btn-primary">${t('hero_search_btn')}</button>
              </form>
            </div>

            <div class="hero-glass-stats">
              <div class="hero-stat-pill"><strong>${state.data.destinations.length}+</strong><span>${t('stat_dest')}</span></div>
              <div class="hero-stat-pill"><strong>5</strong><span>${t('stat_regions')}</span></div>
              <div class="hero-stat-pill"><strong>4 Role</strong><span>Multi-User</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Destinations -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <div class="section-eyebrow">${ICONS.acehMotif} ${t('sec_featured_eyebrow')}</div>
            <h2 class="section-title" data-split-words>${t('sec_featured_title')}</h2>
            <p class="section-subtitle">${t('sec_featured_sub')}</p>
          </div>
          <button type="button" class="btn btn-outline" data-route="explore">${t('view_all')} ${ICONS.arrowRight}</button>
        </div>
        <div class="grid grid-3">
          ${featured.map((d) => renderDestinationCard(d, dataService, helpers)).join('')}
        </div>
      </div>
    </section>

    <!-- Explore by Category -->
    <section class="section section-sand">
      <div class="container">
        <div class="section-header">
          <div>
            <div class="section-eyebrow">${t('sec_cat_eyebrow')}</div>
            <h2 class="section-title" data-split-words>${t('sec_cat_title')}</h2>
          </div>
        </div>
        <div class="grid grid-6">
          ${CATEGORIES.map((c) => {
            const count = state.data.destinations.filter((d) => d.category === c).length;
            return `
              <button type="button" class="cat-card" data-motion-card data-action="filter-category" data-category="${c}">
                <div class="cat-icon">${catIcons[c]}</div>
                <h3>${escapeHtml(catLabel(c))}</h3>
                <span>${count} ${t('items_unit')}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    </section>

    <!-- Popular Regions (Modern Bento Grid) -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <div class="section-eyebrow">${t('sec_region_eyebrow')}</div>
            <h2 class="section-title" data-split-words>${t('sec_region_title')}</h2>
          </div>
        </div>
        <div class="bento-regions">
          ${REGIONS.map((reg) => {
            const cnt = state.data.destinations.filter((d) => d.region === reg).length;
            return `
              <div class="region-card" data-motion-card data-action="filter-region" data-region="${escapeHtml(reg)}" role="button" tabindex="0">
                <img src="${REGION_IMAGES[reg]}" alt="${escapeHtml(reg)}" loading="lazy" onerror="__ranumImgFallback(this, '${escapeHtml(reg)}')" />
                <div class="region-card-overlay">
                  <h3>${escapeHtml(reg)}</h3>
                  <span>${cnt} ${t('stat_dest')}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>

    <!-- Real Interactive Map -->
    <section class="section section-sand">
      <div class="container">
        <div class="section-header">
          <div>
            <div class="section-eyebrow">${t('sec_map_eyebrow')}</div>
            <h2 class="section-title" data-split-words>${t('sec_map_title')}</h2>
            <p class="section-subtitle">${t('sec_map_sub')}</p>
          </div>
        </div>
        ${renderAcehMapSection(state, helpers)}
      </div>
    </section>

    <!-- Culinary Highlights -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <div class="section-eyebrow">${t('sec_culinary_eyebrow')}</div>
            <h2 class="section-title" data-split-words>${t('sec_culinary_title')}</h2>
          </div>
          <button type="button" class="btn btn-outline" data-route="culinary">${t('view_all')} ${ICONS.arrowRight}</button>
        </div>
        <div class="grid grid-3">
          ${culHighlights.map((c) => renderCulinaryCard(c, helpers)).join('')}
        </div>
      </div>
    </section>

    <!-- Muslim-Friendly Stays -->
    <section class="section section-sand">
      <div class="container">
        <div class="section-header">
          <div>
            <div class="section-eyebrow">${t('sec_stay_eyebrow')}</div>
            <h2 class="section-title" data-split-words>${t('sec_stay_title')}</h2>
          </div>
          <button type="button" class="btn btn-outline" data-route="stay">${t('view_all')} ${ICONS.arrowRight}</button>
        </div>
        <div class="grid grid-3">
          ${stayHighlights.map((s) => renderStayCard(s, helpers)).join('')}
        </div>
      </div>
    </section>

    <!-- Multi-Role Ecosystem Showcase -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <div class="section-eyebrow">${ICONS.acehMotif} ${t('sec_roles_eyebrow')}</div>
            <h2 class="section-title" data-split-words>${t('sec_roles_title')}</h2>
            <p class="section-subtitle">${t('sec_roles_sub')}</p>
          </div>
          <button type="button" class="btn btn-primary" data-route="auth">${t('nav_login')} ${ICONS.arrowRight}</button>
        </div>
        <div class="grid grid-4">
          <div class="role-ecosystem-card" data-motion-card>
            <span class="role-pill role-guest" style="align-self:flex-start;">Tamu / Guest</span>
            <h3 style="font-size:1.25rem;">Eksplorasi Bebas</h3>
            <p style="font-size:0.88rem;color:var(--muted);">Jelajahi destinasi, peta interaktif, kuliner halal, penginapan, dan kalkulator anggaran tanpa perlu login.</p>
          </div>
          <div class="role-ecosystem-card" data-motion-card>
            <span class="role-pill role-traveler" style="align-self:flex-start;">Wisatawan</span>
            <h3 style="font-size:1.25rem;">Perjalanan Personal</h3>
            <p style="font-size:0.88rem;color:var(--muted);">Simpan favorit & itinerary per akun, tulis ulasan rating destinasi, dan pantau status inquiry reservasi.</p>
            <button type="button" class="btn btn-outline btn-sm" style="margin-top:auto;" data-action="demo-login" data-role="traveler">Coba Wisatawan</button>
          </div>
          <div class="role-ecosystem-card" data-motion-card>
            <span class="role-pill role-partner" style="align-self:flex-start;">Mitra UMKM</span>
            <h3 style="font-size:1.25rem;">Portal Bisnis Lokal</h3>
            <p style="font-size:0.88rem;color:var(--muted);">Kelola listing kuliner & penginapan milik sendiri, ajukan verifikasi halal, dan balas inquiry wisatawan.</p>
            <button type="button" class="btn btn-outline btn-sm" style="margin-top:auto;" data-action="demo-login" data-role="partner">Coba Mitra UMKM</button>
          </div>
          <div class="role-ecosystem-card" data-motion-card>
            <span class="role-pill role-admin" style="align-self:flex-start;">Administrator</span>
            <h3 style="font-size:1.25rem;">Command Center</h3>
            <p style="font-size:0.88rem;color:var(--muted);">Kendali penuh CRUD seluruh konten, persetujuan antrean verifikasi halal, dan manajemen peran pengguna.</p>
            <button type="button" class="btn btn-outline btn-sm" style="margin-top:auto;" data-action="demo-login" data-role="admin">Coba Admin</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Travel Packages -->
    <section class="section section-sand">
      <div class="container">
        <div class="section-header">
          <div>
            <div class="section-eyebrow">${t('sec_pkg_eyebrow')}</div>
            <h2 class="section-title" data-split-words>${t('sec_pkg_title')}</h2>
          </div>
          <button type="button" class="btn btn-outline" data-action="open-planner-tab" data-tab="packages">${t('view_all')} ${ICONS.arrowRight}</button>
        </div>
        <div class="grid grid-3">
          ${pkgHighlights.map((p) => renderPackageCard(p, state, helpers)).join('')}
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="section-sm" style="padding-bottom:84px;">
      <div class="container">
        <div class="cta-banner">
          <div style="max-width:580px;">
            <div class="section-eyebrow" style="color:var(--moss);">${ICONS.acehMotif} RANUM PLANNER</div>
            <h2 style="font-size:clamp(1.8rem,3.2vw,2.6rem);color:var(--white);margin-bottom:12px;" data-split-words>${t('cta_title')}</h2>
            <p style="color:rgba(248,247,242,0.85);">${t('cta_desc')}</p>
          </div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <button type="button" class="btn btn-secondary" data-action="open-planner-tab" data-tab="itinerary">${t('cta_btn_plan')}</button>
            <button type="button" class="btn btn-outline" style="color:var(--white);border-color:rgba(255,255,255,0.4);" data-action="open-planner-tab" data-tab="packages">${t('cta_btn_pkg')}</button>
          </div>
        </div>
      </div>
    </section>
  `;
}
