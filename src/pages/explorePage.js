import { REGIONS, CATEGORIES } from '../data/i18n.js';
import { ICONS } from '../utils/icons.js';
import { escapeHtml } from '../utils/helpers.js';
import { renderDestinationCard } from '../components/cards.js';

export function renderExplorePage(state, dataService, helpers) {
  const { t, catLabel, destDesc } = helpers;
  const f = state.exploreFilter;

  let list = state.data.destinations.filter((d) => {
    const q = f.search.trim().toLowerCase();
    const matchQ = !q || d.name.toLowerCase().includes(q) || d.region.toLowerCase().includes(q) || destDesc(d).toLowerCase().includes(q);
    const matchR = !f.region || d.region === f.region;
    const matchC = !f.category || d.category === f.category;
    return matchQ && matchR && matchC;
  });

  list = [...list].sort((a, b) => {
    if (f.sort === 'name_asc') return a.name.localeCompare(b.name);
    if (f.sort === 'name_desc') return b.name.localeCompare(a.name);
    if (f.sort === 'cost_asc') return (a.estimatedCost || 0) - (b.estimatedCost || 0);
    if (f.sort === 'cost_desc') return (b.estimatedCost || 0) - (a.estimatedCost || 0);
    return 0;
  });

  return `
    <section class="section">
      <div class="container">
        <div class="section-header" style="margin-bottom:28px;">
          <div>
            <div class="section-eyebrow">${ICONS.acehMotif} ${t('nav_explore')}</div>
            <h1 class="section-title" data-split-words>${t('explore_title')}</h1>
            <p class="section-subtitle">${t('explore_sub')}</p>
          </div>
        </div>

        <div class="filter-bar">
          <div class="field-group" style="flex:1.6;">
            <label for="expSearch">${t('search_label')}</label>
            <input class="input" id="expSearch" type="search" value="${escapeHtml(f.search)}" placeholder="${t('search_dest_ph')}" />
          </div>
          <div class="field-group">
            <label for="expRegion">${t('region_label')}</label>
            <select class="select" id="expRegion">
              <option value="">${t('all_regions')}</option>
              ${REGIONS.map((r) => `<option value="${escapeHtml(r)}" ${f.region === r ? 'selected' : ''}>${escapeHtml(r)}</option>`).join('')}
            </select>
          </div>
          <div class="field-group">
            <label for="expCategory">${t('category_label')}</label>
            <select class="select" id="expCategory">
              <option value="">${t('all_categories')}</option>
              ${CATEGORIES.map((c) => `<option value="${c}" ${f.category === c ? 'selected' : ''}>${escapeHtml(catLabel(c))}</option>`).join('')}
            </select>
          </div>
          <div class="field-group">
            <label for="expSort">${t('sort_label')}</label>
            <select class="select" id="expSort">
              <option value="name_asc" ${f.sort === 'name_asc' ? 'selected' : ''}>${t('sort_name_asc')}</option>
              <option value="name_desc" ${f.sort === 'name_desc' ? 'selected' : ''}>${t('sort_name_desc')}</option>
              <option value="cost_asc" ${f.sort === 'cost_asc' ? 'selected' : ''}>${t('sort_cost_asc')}</option>
              <option value="cost_desc" ${f.sort === 'cost_desc' ? 'selected' : ''}>${t('sort_cost_desc')}</option>
            </select>
          </div>
          <div style="align-self:flex-end;">
            <button type="button" class="btn btn-outline" id="expResetBtn">${t('reset_filter')}</button>
          </div>
        </div>

        <div class="result-bar">
          <span>${t('showing_results')} <strong>${list.length}</strong> ${t('of_items')} ${state.data.destinations.length} ${t('items_unit')}</span>
          <span style="font-size:0.8rem;">* ${t('est_note')}</span>
        </div>

        ${
          list.length
            ? `<div class="grid grid-3">${list.map((d) => renderDestinationCard(d, dataService, helpers)).join('')}</div>`
            : `<div class="empty-state">
                <h3>${t('empty_title')}</h3>
                <p>${t('empty_desc')}</p>
                <button type="button" class="btn btn-primary" id="expResetEmpty">${t('reset_filter')}</button>
              </div>`
        }
      </div>
    </section>
  `;
}
