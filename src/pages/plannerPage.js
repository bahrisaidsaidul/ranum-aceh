import { CATEGORIES } from '../data/i18n.js';
import { ICONS } from '../utils/icons.js';
import { escapeHtml, formatIDR } from '../utils/helpers.js';
import { renderPackageCard } from '../components/cards.js';

export function renderPlannerPage(state, dataService, helpers) {
  const { t } = helpers;
  return `
    <section class="section">
      <div class="container">
        <div class="section-header" style="margin-bottom:24px;">
          <div>
            <div class="section-eyebrow">${ICONS.acehMotif} ${t('nav_planner')}</div>
            <h1 class="section-title" data-split-words>${t('planner_title')}</h1>
            <p class="section-subtitle">${t('planner_sub')}</p>
          </div>
        </div>

        <div class="sub-tabs" role="tablist">
          <button type="button" class="sub-tab ${state.plannerTab === 'itinerary' ? 'active' : ''}" data-action="switch-planner-tab" data-tab="itinerary">${t('tab_itinerary')}</button>
          <button type="button" class="sub-tab ${state.plannerTab === 'budget' ? 'active' : ''}" data-action="switch-planner-tab" data-tab="budget">${t('tab_budget')}</button>
          <button type="button" class="sub-tab ${state.plannerTab === 'packages' ? 'active' : ''}" data-action="switch-planner-tab" data-tab="packages">${t('tab_packages')}</button>
        </div>

        ${state.plannerTab === 'itinerary' ? renderItineraryTab(state, dataService, helpers) : ''}
        ${state.plannerTab === 'budget' ? renderBudgetTab(state, helpers) : ''}
        ${state.plannerTab === 'packages' ? renderPackagesTab(state, helpers) : ''}
      </div>
    </section>
  `;
}

function renderItineraryTab(state, dataService, { t }) {
  const userTrips = dataService.getUserItineraries();
  const trip = dataService.getActiveItinerary();
  const destOpts = state.data.destinations
    .map((d) => `<option value="${escapeHtml(d.id)}">${escapeHtml(d.name)} (${escapeHtml(d.region)})</option>`)
    .join('');

  let daysHtml = '';
  if (trip) {
    dataService.recalcItineraryBudget(trip);
    for (let day = 1; day <= trip.duration; day++) {
      const acts = trip.activities
        .map((a, idx) => ({ ...a, _idx: idx }))
        .filter((a) => Number(a.day) === day);

      daysHtml += `
        <div class="day-card">
          <div class="day-header">
            <h3 style="font-size:1.3rem;">${t('day_label')}${day}</h3>
            <span class="badge badge-sand">${acts.length} aktivitas</span>
          </div>
          ${
            acts.length
              ? acts
                  .map((a, pos) => {
                    const dest = state.data.destinations.find((d) => d.id === a.destinationId);
                    return `
                    <div class="activity-item">
                      <div>
                        <div style="font-weight:600;color:var(--charcoal);">${dest ? escapeHtml(dest.name) : 'Destinasi'}</div>
                        <div style="font-size:0.85rem;color:var(--muted);">${escapeHtml(a.activity)}</div>
                        ${dest ? `<div style="font-size:0.78rem;color:var(--sage);">${escapeHtml(dest.region)} · Est. ${formatIDR(dest.estimatedCost)}</div>` : ''}
                      </div>
                      <div class="activity-controls">
                        <button type="button" class="btn btn-outline btn-sm" data-action="move-act" data-day="${day}" data-idx="${a._idx}" data-dir="-1" ${pos === 0 ? 'disabled style="opacity:0.4;"' : ''}>↑</button>
                        <button type="button" class="btn btn-outline btn-sm" data-action="move-act" data-day="${day}" data-idx="${a._idx}" data-dir="1" ${pos === acts.length - 1 ? 'disabled style="opacity:0.4;"' : ''}>↓</button>
                        <button type="button" class="btn btn-danger btn-sm" data-action="del-act" data-idx="${a._idx}">${ICONS.trash}</button>
                      </div>
                    </div>
                  `;
                  })
                  .join('')
              : `<p style="font-size:0.88rem;color:var(--muted);margin-bottom:14px;">${t('no_activities')}</p>`
          }
          <form class="add-act-form" data-day="${day}" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
            <select class="select" name="destId" style="flex:1.2;min-width:180px;">${destOpts}</select>
            <input class="input" name="note" style="flex:1.4;min-width:180px;" placeholder="${t('activity_note')}..." />
            <button type="submit" class="btn btn-secondary btn-sm">${ICONS.plus} ${t('add_activity')}</button>
          </form>
        </div>
      `;
    }
  }

  return `
    <div class="planner-layout">
      <aside style="display:flex;flex-direction:column;gap:18px;">
        <div class="info-box">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h3 style="font-size:1.2rem;">${t('saved_trips')}</h3>
            <button type="button" class="btn btn-primary btn-sm" id="createNewTripBtn">${ICONS.plus} ${t('new_trip')}</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${
              userTrips.length
                ? userTrips
                    .map(
                      (tr) => `
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-radius:10px;border:1px solid ${trip && tr.id === trip.id ? 'var(--forest)' : 'var(--border)'};background:${trip && tr.id === trip.id ? 'var(--sand-light)' : 'var(--ivory)'};">
                    <button type="button" style="text-align:left;flex:1;" data-action="select-trip" data-id="${escapeHtml(tr.id)}">
                      <div style="font-weight:600;font-size:0.9rem;">${escapeHtml(tr.tripName)}</div>
                      <div style="font-size:0.78rem;color:var(--muted);">${tr.duration} hari · ${tr.travelers} org</div>
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" data-action="delete-trip" data-id="${escapeHtml(tr.id)}">${ICONS.trash}</button>
                  </div>
                `
                    )
                    .join('')
                : `<p style="font-size:0.86rem;color:var(--muted);">Belum ada itinerary. Klik "Perjalanan Baru" untuk memulai.</p>`
            }
          </div>
        </div>

        ${
          trip
            ? `<form class="info-box" id="tripMetaForm">
                <h3 style="font-size:1.2rem;">Pengaturan Perjalanan</h3>
                <div class="field-group"><label for="tripNameInput">${t('trip_name')}</label><input class="input" id="tripNameInput" value="${escapeHtml(trip.tripName)}" required /></div>
                <div class="field-group"><label for="tripDateInput">${t('start_date')}</label><input class="input" id="tripDateInput" type="date" value="${escapeHtml(trip.startDate || '')}" /></div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                  <div class="field-group">
                    <label for="tripDurInput">${t('duration_days')}</label>
                    <select class="select" id="tripDurInput">${[1, 2, 3, 4, 5].map((n) => `<option value="${n}" ${trip.duration === n ? 'selected' : ''}>${n}</option>`).join('')}</select>
                  </div>
                  <div class="field-group">
                    <label for="tripTravInput">${t('travelers_count')}</label>
                    <input class="input" id="tripTravInput" type="number" min="1" max="50" value="${trip.travelers}" />
                  </div>
                </div>
                <div style="padding:12px;background:var(--sand-light);border-radius:10px;">
                  <div style="font-size:0.78rem;color:var(--muted);">${t('total_budget')}</div>
                  <div style="font-family:var(--font-serif);font-size:1.45rem;color:var(--forest);">${formatIDR(trip.totalBudget)}</div>
                </div>
                <button type="submit" class="btn btn-primary">${t('save_trip')}</button>
                <button type="button" class="btn btn-outline" id="syncToBudgetBtn">${t('open_budget')}</button>
              </form>`
            : ''
        }
      </aside>

      <div>
        ${
          daysHtml ||
          `<div class="empty-state">
            <h3>Mulai Susun Itinerary Aceh Anda</h3>
            <p>Klik tombol "Perjalanan Baru" di sebelah kiri atau pilih salah satu Paket Wisata rekomendasi.</p>
            <button type="button" class="btn btn-primary" data-action="switch-planner-tab" data-tab="packages">Lihat Paket Wisata</button>
          </div>`
        }
      </div>
    </div>
  `;
}

function renderBudgetTab(state, { t }) {
  const b = state.budgetInputs;
  const travelers = Math.max(1, Number(b.travelers) || 1);
  const total = (Number(b.transportation) || 0) + (Number(b.accommodation) || 0) + (Number(b.entranceFees) || 0) + (Number(b.food) || 0) + (Number(b.additional) || 0);
  const perPerson = Math.round(total / travelers);

  const parts = [
    { label: t('cost_transport'), val: Number(b.transportation) || 0, color: '#B8C4AA' },
    { label: t('cost_accommodation'), val: Number(b.accommodation) || 0, color: '#E9E3D5' },
    { label: t('cost_entrance'), val: Number(b.entranceFees) || 0, color: '#7E9177' },
    { label: t('cost_food'), val: Number(b.food) || 0, color: '#D4B98C' },
    { label: t('cost_additional'), val: Number(b.additional) || 0, color: '#9EB5AE' }
  ];

  return `
    <div class="detail-grid">
      <div class="info-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <h2 style="font-size:1.55rem;">${t('budget_title')}</h2>
          <button type="button" class="btn btn-secondary btn-sm" id="pullItineraryBudgetBtn">${t('budget_sync')}</button>
        </div>
        <div class="grid grid-2" style="gap:14px;">
          <div class="field-group"><label for="bTravelers">${t('travelers_count')}</label><input class="input budget-input" id="bTravelers" data-field="travelers" type="number" min="1" value="${travelers}" /></div>
          <div class="field-group"><label for="bTransport">${t('cost_transport')}</label><input class="input budget-input" id="bTransport" data-field="transportation" type="number" min="0" step="10000" value="${b.transportation}" /></div>
          <div class="field-group"><label for="bAccom">${t('cost_accommodation')}</label><input class="input budget-input" id="bAccom" data-field="accommodation" type="number" min="0" step="10000" value="${b.accommodation}" /></div>
          <div class="field-group"><label for="bEntrance">${t('cost_entrance')}</label><input class="input budget-input" id="bEntrance" data-field="entranceFees" type="number" min="0" step="5000" value="${b.entranceFees}" /></div>
          <div class="field-group"><label for="bFood">${t('cost_food')}</label><input class="input budget-input" id="bFood" data-field="food" type="number" min="0" step="10000" value="${b.food}" /></div>
          <div class="field-group"><label for="bAdd">${t('cost_additional')}</label><input class="input budget-input" id="bAdd" data-field="additional" type="number" min="0" step="10000" value="${b.additional}" /></div>
        </div>
        <div class="notice-box">* ${t('est_note')}</div>
      </div>

      <div class="budget-summary-card">
        <div>
          <div style="font-size:0.82rem;opacity:0.8;text-transform:uppercase;letter-spacing:0.08em;">${t('total_budget')}</div>
          <div class="budget-total">${formatIDR(total)}</div>
        </div>
        <div style="padding:14px;border-radius:12px;background:rgba(255,255,255,0.1);">
          <div style="font-size:0.82rem;opacity:0.82;">${t('per_person')} (${travelers} org)</div>
          <div style="font-family:var(--font-serif);font-size:1.5rem;">${formatIDR(perPerson)}</div>
        </div>
        <div>
          <div style="font-size:0.84rem;margin-bottom:8px;font-weight:600;">${t('budget_breakdown')}</div>
          <div class="budget-bar">
            ${parts.map((pt) => `<div style="width:${total > 0 ? (pt.val / total) * 100 : 0}%;background:${pt.color};" title="${escapeHtml(pt.label)}: ${formatIDR(pt.val)}"></div>`).join('')}
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:14px;font-size:0.86rem;">
            ${parts
              .map(
                (pt) => `
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="display:inline-flex;align-items:center;gap:8px;">
                  <span style="width:9px;height:9px;border-radius:50%;background:${pt.color};display:inline-block;"></span>
                  ${escapeHtml(pt.label)}
                </span>
                <strong>${formatIDR(pt.val)}</strong>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderPackagesTab(state, helpers) {
  const { t, catLabel } = helpers;
  const pf = state.pkgFilter;

  const scored = state.data.packages.map((pkg) => {
    const matchDur = pkg.duration <= (Number(pf.duration) || 5);
    const matchInt = !pf.interest || (pkg.interests || []).includes(pf.interest);
    const matchBud = pkg.estimatedCost <= (Number(pf.maxBudget) || 10000000);
    let score = (matchDur ? 3 : 0) + (matchInt ? 4 : 0) + (matchBud ? 3 : 0);
    return { pkg, exact: matchDur && matchInt && matchBud, score };
  });

  const exactMatches = scored.filter((s) => s.exact).sort((a, b) => b.score - a.score);
  const displayList = exactMatches.length ? exactMatches : scored.sort((a, b) => b.score - a.score).slice(0, 3);

  return `
    <div class="filter-bar">
      <div class="field-group">
        <label for="pkgInterest">${t('pkg_filter_interest')}</label>
        <select class="select" id="pkgInterest">
          <option value="">${t('all_categories')}</option>
          ${CATEGORIES.map((c) => `<option value="${c}" ${pf.interest === c ? 'selected' : ''}>${escapeHtml(catLabel(c))}</option>`).join('')}
        </select>
      </div>
      <div class="field-group">
        <label for="pkgDuration">${t('pkg_filter_duration')}</label>
        <select class="select" id="pkgDuration">
          ${[1, 2, 3, 4, 5].map((n) => `<option value="${n}" ${Number(pf.duration) === n ? 'selected' : ''}>≤ ${n} ${state.data.preferences.language === 'en' ? 'Days' : 'Hari'}</option>`).join('')}
        </select>
      </div>
      <div class="field-group">
        <label for="pkgBudget">${t('pkg_filter_budget')}</label>
        <input class="input" id="pkgBudget" type="number" min="200000" step="100000" value="${pf.maxBudget}" />
      </div>
      <div class="field-group">
        <label for="pkgTravelers">${t('pkg_filter_travelers')}</label>
        <input class="input" id="pkgTravelers" type="number" min="1" max="30" value="${pf.travelers}" />
      </div>
    </div>

    ${!exactMatches.length ? `<div class="notice-box" style="margin-bottom:22px;">${t('no_exact_pkg')}</div>` : ''}

    <div class="grid grid-3">
      ${displayList.map((item) => renderPackageCard(item.pkg, state, helpers)).join('')}
    </div>
  `;
}
