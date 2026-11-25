import { ICONS } from '../utils/icons.js';
import { escapeHtml } from '../utils/helpers.js';

export function renderSavedPage(state, authService, dataService, helpers) {
  const { t, catLabel, destDesc } = helpers;
  const user = authService.getCurrentUser();
  const favDests = dataService
    .getUserFavorites()
    .map((f) => state.data.destinations.find((d) => d.id === f.itemId))
    .filter(Boolean);

  const inquiries = dataService.getUserInquiries();

  const statusBadge = (status) => {
    if (status === 'confirmed') return `<span class="badge badge-certified">Dikonfirmasi Mitra</span>`;
    if (status === 'declined') return `<span class="badge badge-danger">Ditolak</span>`;
    return `<span class="badge badge-pending">Menunggu Respons</span>`;
  };

  return `
    <section class="section">
      <div class="container">
        <div class="section-header" style="margin-bottom:24px;">
          <div>
            <div class="section-eyebrow">${ICONS.acehMotif} ${t('nav_saved')}</div>
            <h1 class="section-title" data-split-words>${t('saved_title')}</h1>
            <p class="section-subtitle">${t('saved_sub')}</p>
          </div>
          ${favDests.length ? `<button type="button" class="btn btn-danger btn-sm" id="clearFavsBtn">${ICONS.trash} ${t('clear_favs')}</button>` : ''}
        </div>

        ${
          !user
            ? `<div class="notice-box" style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
                <span>Anda sedang menggunakan mode <strong>Tamu (Guest)</strong>. Masuk sebagai Wisatawan agar favorit, itinerary, dan riwayat inquiry tersimpan khusus di akun Anda.</span>
                <button type="button" class="btn btn-primary btn-sm" data-route="auth">${t('nav_login')}</button>
              </div>`
            : ''
        }

        <h2 style="font-size:1.55rem;margin-bottom:18px;">Destinasi Favorit (${favDests.length})</h2>

        ${
          favDests.length
            ? `<div class="grid grid-3" style="margin-bottom:48px;">
                ${favDests
                  .map(
                    (d) => `
                  <article class="card" data-motion-card>
                    <div class="card-media">
                      <img src="${escapeHtml(d.imageUrl)}" alt="${escapeHtml(d.name)}" loading="lazy" onerror="__ranumImgFallback(this, '${escapeHtml(d.name)}')" />
                      <div class="card-top-badges">
                        <span class="pill-glass">${escapeHtml(catLabel(d.category))}</span>
                        <button type="button" class="fav-btn active" data-action="toggle-fav" data-id="${escapeHtml(d.id)}" aria-label="${t('remove_fav')}">${ICONS.heartFilled}</button>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="card-meta"><span class="card-meta-loc">${ICONS.pin} ${escapeHtml(d.region)}</span></div>
                      <h3 class="card-title">${escapeHtml(d.name)}</h3>
                      <p class="card-desc">${escapeHtml(destDesc(d))}</p>
                      <div class="card-footer" style="flex-wrap:wrap;">
                        <button type="button" class="btn btn-outline btn-sm" data-action="open-dest" data-id="${escapeHtml(d.id)}">${t('detail_btn')}</button>
                        <button type="button" class="btn btn-primary btn-sm" data-action="quick-add-itinerary" data-id="${escapeHtml(d.id)}">${ICONS.plus} Itinerary</button>
                      </div>
                    </div>
                  </article>
                `
                  )
                  .join('')}
              </div>`
            : `<div class="empty-state" style="margin-bottom:48px;">
                <h3>${t('saved_empty_title')}</h3>
                <p>${t('saved_empty_desc')}</p>
                <button type="button" class="btn btn-primary" data-route="explore">${t('nav_explore')} ${ICONS.arrowRight}</button>
              </div>`
        }

        <h2 style="font-size:1.55rem;margin-bottom:18px;">Riwayat Inquiry Kuliner &amp; Penginapan (${inquiries.length})</h2>
        ${
          inquiries.length
            ? `<div class="table-wrap">
                <table class="data-table">
                  <thead><tr><th>Layanan</th><th>Tipe</th><th>Tanggal</th><th>Tamu</th><th>Catatan</th><th>Status</th></tr></thead>
                  <tbody>
                    ${inquiries
                      .map(
                        (i) => `
                      <tr>
                        <td><strong>${escapeHtml(i.itemName)}</strong></td>
                        <td><span class="badge badge-sand">${escapeHtml(i.itemType)}</span></td>
                        <td>${escapeHtml(i.date)}</td>
                        <td>${i.guests} org</td>
                        <td>${escapeHtml(i.note)}</td>
                        <td>${statusBadge(i.status)}</td>
                      </tr>
                    `
                      )
                      .join('')}
                  </tbody>
                </table>
              </div>`
            : `<div class="notice-box">Belum ada riwayat inquiry. Anda dapat mengirim inquiry dari halaman Kuliner atau Penginapan.</div>`
        }
      </div>
    </section>
  `;
}
