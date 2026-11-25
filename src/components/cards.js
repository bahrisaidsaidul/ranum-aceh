import { ICONS } from '../utils/icons.js';
import { escapeHtml, formatIDR, makeFallbackSvg } from '../utils/helpers.js';

export function renderHalalBadge(status, t) {
  if (status === 'certified') {
    return `<span class="badge badge-certified">${ICONS.check} ${t('halal_certified')}</span>`;
  }
  if (status === 'pending_verification') {
    return `<span class="badge badge-pending">${t('halal_pending')}</span>`;
  }
  return `<span class="badge badge-unverified">${t('halal_not_verified')}</span>`;
}

export function renderDestinationCard(d, dataService, { t, catLabel, destDesc }) {
  const fav = dataService.isFavorite(d.id);
  const avg = dataService.getAverageRating(d.id);

  return `
    <article class="card" data-motion-card>
      <div class="card-media">
        <img src="${escapeHtml(d.imageUrl)}" alt="${escapeHtml(d.name)}" loading="lazy" onerror="__ranumImgFallback(this, '${escapeHtml(d.name)}')" />
        <div class="card-top-badges">
          <span class="pill-glass">${escapeHtml(catLabel(d.category))}</span>
          <button type="button" class="fav-btn ${fav ? 'active' : ''}" data-action="toggle-fav" data-id="${escapeHtml(d.id)}" aria-label="${fav ? t('saved_favorite') : t('add_favorite')}">
            ${fav ? ICONS.heartFilled : ICONS.heart}
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span class="card-meta-loc">${ICONS.pin} ${escapeHtml(d.region)}</span>
          ${avg ? `<span class="card-rating">${ICONS.star} ${avg}</span>` : ''}
        </div>
        <h3 class="card-title">${escapeHtml(d.name)}</h3>
        <p class="card-desc">${escapeHtml(destDesc(d))}</p>
        <div class="card-footer">
          <div class="price-tag">
            <span>${t('est_cost')}</span>
            <strong>${d.estimatedCost > 0 ? formatIDR(d.estimatedCost) : 'Gratis / Donasi'}</strong>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" data-action="open-dest" data-id="${escapeHtml(d.id)}">
            ${t('detail_btn')} ${ICONS.arrowRight}
          </button>
        </div>
      </div>
    </article>
  `;
}

export function renderCulinaryCard(c, { t }) {
  const waMsg = encodeURIComponent(`Halo, saya tertarik dengan ${c.name} (${c.region}) di RANUM Aceh.`);
  return `
    <article class="card" data-motion-card>
      <div class="card-media">
        <img src="${escapeHtml(c.imageUrl)}" alt="${escapeHtml(c.name)}" loading="lazy" onerror="__ranumImgFallback(this, '${escapeHtml(c.name)}')" />
        <div class="card-top-badges">
          <span class="pill-glass">${escapeHtml(c.category)}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-meta"><span class="card-meta-loc">${ICONS.pin} ${escapeHtml(c.region)}</span></div>
        <h3 class="card-title">${escapeHtml(c.name)}</h3>
        <div>${renderHalalBadge(c.halalStatus, t)}</div>
        <p class="card-desc">${escapeHtml(c.description || '')}</p>
        <div class="card-footer">
          <div class="price-tag">
            <span>${t('est_cost')}</span>
            <strong>${formatIDR(c.price)}</strong>
          </div>
          <div style="display:flex;gap:6px;">
            <button type="button" class="btn btn-outline btn-sm" data-action="open-culinary" data-id="${escapeHtml(c.id)}">${t('detail_btn')}</button>
            <a href="https://wa.me/${escapeHtml(c.contact)}?text=${waMsg}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" aria-label="WhatsApp ${escapeHtml(c.name)}">${ICONS.whatsapp}</a>
          </div>
        </div>
      </div>
    </article>
  `;
}

export function renderStayCard(s, { t }) {
  const waMsg = encodeURIComponent(`Halo, saya ingin menanyakan ketersediaan kamar di ${s.name} (${s.region}) melalui RANUM Aceh.`);
  return `
    <article class="card" data-motion-card>
      <div class="card-media">
        <img src="${escapeHtml(s.imageUrl)}" alt="${escapeHtml(s.name)}" loading="lazy" onerror="__ranumImgFallback(this, '${escapeHtml(s.name)}')" />
        <div class="card-top-badges">
          <span class="pill-glass">${ICONS.mosque} Muslim-Friendly</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-meta"><span class="card-meta-loc">${ICONS.pin} ${escapeHtml(s.region)}</span></div>
        <h3 class="card-title">${escapeHtml(s.name)}</h3>
        <p class="card-desc">${escapeHtml(s.description || '')}</p>
        <div class="tag-list" style="margin-top:4px;">
          ${(s.muslimFriendlyFacilities || []).slice(0, 2).map((f) => `<span class="badge badge-forest">${escapeHtml(f)}</span>`).join('')}
        </div>
        <div class="card-footer">
          <div class="price-tag">
            <strong>${formatIDR(s.pricePerNight)}</strong>
            <span>${t('per_night')}</span>
          </div>
          <div style="display:flex;gap:6px;">
            <button type="button" class="btn btn-outline btn-sm" data-action="open-stay" data-id="${escapeHtml(s.id)}">${t('detail_btn')}</button>
            <a href="https://wa.me/${escapeHtml(s.contact)}?text=${waMsg}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" aria-label="WhatsApp ${escapeHtml(s.name)}">${ICONS.whatsapp}</a>
          </div>
        </div>
      </div>
    </article>
  `;
}

export function renderPackageCard(p, state, { t, catLabel }) {
  const destNames = (p.destinations || [])
    .map((id) => state.data.destinations.find((d) => d.id === id))
    .filter(Boolean)
    .map((d) => d.name);

  return `
    <article class="card" data-motion-card>
      <div class="card-media">
        <img src="${escapeHtml(p.imageUrl || makeFallbackSvg(p.name))}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="__ranumImgFallback(this, '${escapeHtml(p.name)}')" />
        <div class="card-top-badges">
          <span class="pill-glass">${ICONS.calendar} ${p.duration} ${state.data.preferences.language === 'en' ? 'Days' : 'Hari'}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="tag-list">
          ${(p.interests || []).map((i) => `<span class="badge badge-sand">${escapeHtml(catLabel(i))}</span>`).join('')}
        </div>
        <h3 class="card-title">${escapeHtml(p.name)}</h3>
        <p class="card-desc">${escapeHtml(p.description)}</p>
        <p style="font-size:0.8rem;color:var(--sage);"><strong>${destNames.length} Destinasi:</strong> ${escapeHtml(destNames.slice(0, 3).join(', '))}${destNames.length > 3 ? '...' : ''}</p>
        <div class="card-footer">
          <div class="price-tag">
            <span>${t('est_cost')}</span>
            <strong>${formatIDR(p.estimatedCost)}</strong>
          </div>
          <div style="display:flex;gap:6px;">
            <button type="button" class="btn btn-outline btn-sm" data-action="open-package" data-id="${escapeHtml(p.id)}">${t('detail_btn')}</button>
            <button type="button" class="btn btn-primary btn-sm" data-action="use-package" data-id="${escapeHtml(p.id)}">${t('use_package')}</button>
          </div>
        </div>
      </div>
    </article>
  `;
}
