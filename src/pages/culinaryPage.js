import { REGIONS } from '../data/i18n.js';
import { ICONS } from '../utils/icons.js';
import { escapeHtml } from '../utils/helpers.js';
import { renderCulinaryCard } from '../components/cards.js';

export function renderCulinaryPage(state, helpers) {
  const { t } = helpers;
  const f = state.culinaryFilter;

  const list = state.data.culinary.filter((c) => {
    const q = f.search.trim().toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q);
    const matchR = !f.region || c.region === f.region;
    const matchS = !f.status || c.halalStatus === f.status;
    return matchQ && matchR && matchS;
  });

  return `
    <section class="section">
      <div class="container">
        <div class="section-header" style="margin-bottom:24px;">
          <div>
            <div class="section-eyebrow">${ICONS.acehMotif} ${t('nav_culinary')}</div>
            <h1 class="section-title" data-split-words>${t('culinary_title')}</h1>
            <p class="section-subtitle">${t('culinary_sub')}</p>
          </div>
        </div>

        <div class="notice-box" style="margin-bottom:24px;">${t('halal_disclaimer')}</div>

        <div class="filter-bar">
          <div class="field-group" style="flex:1.5;">
            <label for="culSearch">${t('search_label')}</label>
            <input class="input" id="culSearch" type="search" value="${escapeHtml(f.search)}" placeholder="${t('search_dest_ph')}" />
          </div>
          <div class="field-group">
            <label for="culRegion">${t('region_label')}</label>
            <select class="select" id="culRegion">
              <option value="">${t('all_regions')}</option>
              ${REGIONS.map((r) => `<option value="${escapeHtml(r)}" ${f.region === r ? 'selected' : ''}>${escapeHtml(r)}</option>`).join('')}
            </select>
          </div>
          <div class="field-group">
            <label for="culStatus">${t('halal_filter_label')}</label>
            <select class="select" id="culStatus">
              <option value="">${t('all_status')}</option>
              <option value="certified" ${f.status === 'certified' ? 'selected' : ''}>${t('halal_certified')}</option>
              <option value="pending_verification" ${f.status === 'pending_verification' ? 'selected' : ''}>${t('halal_pending')}</option>
              <option value="not_verified" ${f.status === 'not_verified' ? 'selected' : ''}>${t('halal_not_verified')}</option>
            </select>
          </div>
          <div style="align-self:flex-end;">
            <button type="button" class="btn btn-outline" id="culResetBtn">${t('reset_filter')}</button>
          </div>
        </div>

        <div class="result-bar">
          <span>${t('showing_results')} <strong>${list.length}</strong> ${t('of_items')} ${state.data.culinary.length} ${t('items_unit')}</span>
        </div>

        ${
          list.length
            ? `<div class="grid grid-3">${list.map((c) => renderCulinaryCard(c, helpers)).join('')}</div>`
            : `<div class="empty-state">
                <h3>${t('empty_title')}</h3>
                <p>${t('empty_desc')}</p>
                <button type="button" class="btn btn-primary" id="culResetEmpty">${t('reset_filter')}</button>
              </div>`
        }
      </div>
    </section>
  `;
}
