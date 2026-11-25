import { REGIONS } from '../data/i18n.js';
import { ICONS } from '../utils/icons.js';
import { escapeHtml } from '../utils/helpers.js';
import { renderStayCard } from '../components/cards.js';

export function renderStayPage(state, helpers) {
  const { t } = helpers;
  const f = state.stayFilter;

  let list = state.data.accommodations.filter((s) => {
    const q = f.search.trim().toLowerCase();
    const matchQ = !q || s.name.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q);
    const matchR = !f.region || s.region === f.region;
    return matchQ && matchR;
  });

  list = [...list].sort((a, b) =>
    f.sort === 'price_desc' ? b.pricePerNight - a.pricePerNight : a.pricePerNight - b.pricePerNight
  );

  return `
    <section class="section">
      <div class="container">
        <div class="section-header" style="margin-bottom:24px;">
          <div>
            <div class="section-eyebrow">${ICONS.acehMotif} ${t('nav_stay')}</div>
            <h1 class="section-title" data-split-words>${t('stay_title')}</h1>
            <p class="section-subtitle">${t('stay_sub')}</p>
          </div>
        </div>

        <div class="notice-box" style="margin-bottom:24px;">${t('stay_disclaimer')}</div>

        <div class="filter-bar">
          <div class="field-group" style="flex:1.5;">
            <label for="staySearch">${t('search_label')}</label>
            <input class="input" id="staySearch" type="search" value="${escapeHtml(f.search)}" placeholder="${t('search_dest_ph')}" />
          </div>
          <div class="field-group">
            <label for="stayRegion">${t('region_label')}</label>
            <select class="select" id="stayRegion">
              <option value="">${t('all_regions')}</option>
              ${REGIONS.map((r) => `<option value="${escapeHtml(r)}" ${f.region === r ? 'selected' : ''}>${escapeHtml(r)}</option>`).join('')}
            </select>
          </div>
          <div class="field-group">
            <label for="staySort">${t('sort_label')}</label>
            <select class="select" id="staySort">
              <option value="price_asc" ${f.sort === 'price_asc' ? 'selected' : ''}>${t('sort_cost_asc')}</option>
              <option value="price_desc" ${f.sort === 'price_desc' ? 'selected' : ''}>${t('sort_cost_desc')}</option>
            </select>
          </div>
          <div style="align-self:flex-end;">
            <button type="button" class="btn btn-outline" id="stayResetBtn">${t('reset_filter')}</button>
          </div>
        </div>

        <div class="result-bar">
          <span>${t('showing_results')} <strong>${list.length}</strong> ${t('of_items')} ${state.data.accommodations.length} ${t('items_unit')}</span>
        </div>

        ${
          list.length
            ? `<div class="grid grid-3">${list.map((s) => renderStayCard(s, helpers)).join('')}</div>`
            : `<div class="empty-state">
                <h3>${t('empty_title')}</h3>
                <p>${t('empty_desc')}</p>
                <button type="button" class="btn btn-primary" id="stayResetEmpty">${t('reset_filter')}</button>
              </div>`
        }
      </div>
    </section>
  `;
}
