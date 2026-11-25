import { ICONS } from '../utils/icons.js';
import { escapeHtml, formatIDR } from '../utils/helpers.js';

export function renderDetailPage(state, authService, dataService, helpers) {
  const { t, catLabel, destDesc } = helpers;
  const d = state.data.destinations.find((item) => item.id === state.detailId) || state.data.destinations[0];
  if (!d) return `<section class="section"><div class="container"><p>${t('empty_title')}</p></div></section>`;

  const fav = dataService.isFavorite(d.id);
  const gallery = d.gallery && d.gallery.length ? d.gallery : [d.imageUrl];
  const reviews = dataService.getDestinationReviews(d.id);
  const avgRating = dataService.getAverageRating(d.id);
  const user = authService.getCurrentUser();

  return `
    <section class="section-sm" style="padding-bottom:80px;">
      <div class="container">
        <button type="button" class="btn btn-ghost" data-route="explore" style="margin-bottom:20px;">
          ${ICONS.arrowLeft} ${t('back_explore')}
        </button>

        <div class="detail-grid">
          <div>
            <img class="detail-main-img" id="detailMainImg" src="${escapeHtml(gallery[0])}" alt="${escapeHtml(d.name)}" onerror="__ranumImgFallback(this, '${escapeHtml(d.name)}')" />
            ${
              gallery.length > 1
                ? `<div class="detail-thumbs">
                    ${gallery
                      .map(
                        (imgUrl, idx) => `
                      <button type="button" class="detail-thumb ${idx === 0 ? 'active' : ''}" data-action="swap-gallery" data-src="${escapeHtml(imgUrl)}">
                        <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(d.name)} ${idx + 1}" onerror="__ranumImgFallback(this, '${escapeHtml(d.name)}')" />
                      </button>
                    `
                      )
                      .join('')}
                  </div>`
                : ''
            }

            <div style="margin-top:28px;">
              <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px;">
                <span class="badge badge-forest">${escapeHtml(catLabel(d.category))}</span>
                <span class="badge badge-sand">${ICONS.pin} ${escapeHtml(d.region)}</span>
                ${avgRating ? `<span class="badge badge-pending">${ICONS.star} ${avgRating} (${reviews.length})</span>` : ''}
              </div>
              <h1 class="section-title" data-split-words style="margin-bottom:14px;">${escapeHtml(d.name)}</h1>
              <p style="font-size:1.02rem;color:var(--charcoal);margin-bottom:24px;">${escapeHtml(destDesc(d))}</p>

              <div class="info-box" style="margin-bottom:20px;">
                <h3 style="font-size:1.25rem;display:flex;align-items:center;gap:8px;color:var(--forest);">${ICONS.mosque} ${t('prayer_label')}</h3>
                <div class="tag-list">
                  ${(d.prayerFacilities || []).map((pf) => `<span class="tag-chip">${ICONS.check} ${escapeHtml(pf)}</span>`).join('')}
                </div>
              </div>

              <div class="info-box" style="margin-bottom:20px;">
                <h3 style="font-size:1.25rem;">${t('facilities_label')}</h3>
                <div class="tag-list">
                  ${(d.facilities || []).map((f) => `<span class="tag-chip">${escapeHtml(f)}</span>`).join('')}
                </div>
                <div style="padding-top:12px;border-top:1px solid var(--border);font-size:0.92rem;color:var(--muted);">
                  <strong style="color:var(--charcoal);">${t('access_label')}:</strong> ${escapeHtml(d.accessInfo || '-')}
                </div>
              </div>

              <!-- Traveler Reviews Section -->
              <div class="info-box">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                  <h3 style="font-size:1.3rem;">${t('reviews_title')} (${reviews.length})</h3>
                  ${avgRating ? `<span class="card-rating" style="font-size:0.95rem;">${ICONS.star} ${avgRating} / 5.0</span>` : ''}
                </div>

                ${
                  user
                    ? `<form id="reviewForm" data-dest-id="${escapeHtml(d.id)}" style="display:flex;flex-direction:column;gap:10px;padding:14px;background:var(--sand-light);border-radius:14px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
                          <strong style="font-size:0.88rem;">${t('write_review')} (${escapeHtml(user.name)})</strong>
                          <select class="select" name="rating" style="width:auto;min-width:130px;padding:6px 10px;">
                            <option value="5">★★★★★ (5)</option>
                            <option value="4">★★★★☆ (4)</option>
                            <option value="3">★★★☆☆ (3)</option>
                            <option value="2">★★☆☆☆ (2)</option>
                            <option value="1">★☆☆☆☆ (1)</option>
                          </select>
                        </div>
                        <textarea class="textarea" name="comment" style="min-height:70px;" placeholder="Bagikan pengalaman wisata atau kenyamanan fasilitas ibadah di sini..." required></textarea>
                        <button type="submit" class="btn btn-primary btn-sm" style="align-self:flex-end;">Kirim Ulasan</button>
                      </form>`
                    : `<div class="notice-box" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
                        <span>${t('login_to_review')}</span>
                        <button type="button" class="btn btn-primary btn-sm" data-route="auth">${t('nav_login')}</button>
                      </div>`
                }

                <div style="display:flex;flex-direction:column;gap:10px;">
                  ${
                    reviews.length
                      ? reviews
                          .map(
                            (r) => `
                        <div class="review-card">
                          <div style="display:flex;justify-content:space-between;align-items:center;">
                            <strong>${escapeHtml(r.userName)}</strong>
                            <span style="font-size:0.78rem;color:var(--muted);">${escapeHtml(r.createdAt)}</span>
                          </div>
                          <div style="color:#B07D1C;font-size:0.85rem;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
                          <p style="font-size:0.9rem;color:var(--charcoal);">${escapeHtml(r.comment)}</p>
                        </div>
                      `
                          )
                          .join('')
                      : `<p style="font-size:0.88rem;color:var(--muted);">Belum ada ulasan untuk destinasi ini.</p>`
                  }
                </div>
              </div>
            </div>
          </div>

          <aside style="display:flex;flex-direction:column;gap:18px;">
            <div class="info-box">
              <div>
                <span style="font-size:0.82rem;color:var(--muted);">${t('est_cost')}</span>
                <div style="font-family:var(--font-serif);font-size:1.85rem;color:var(--forest);">
                  ${d.estimatedCost > 0 ? formatIDR(d.estimatedCost) : 'Gratis / Donasi'}
                </div>
                <p style="font-size:0.78rem;color:var(--muted);margin-top:4px;">* ${t('est_note')}</p>
              </div>
              <div style="font-size:0.9rem;color:var(--muted);padding-top:12px;border-top:1px solid var(--border);">
                <strong style="color:var(--charcoal);display:block;margin-bottom:4px;">${t('address_label')}</strong>
                ${escapeHtml(d.address)}
              </div>
              <button type="button" class="btn btn-primary" data-action="quick-add-itinerary" data-id="${escapeHtml(d.id)}">
                ${ICONS.calendar} ${t('add_itinerary')}
              </button>
              <button type="button" class="btn ${fav ? 'btn-secondary' : 'btn-outline'}" data-action="toggle-fav" data-id="${escapeHtml(d.id)}">
                ${fav ? ICONS.heartFilled : ICONS.heart} ${fav ? t('saved_favorite') : t('add_favorite')}
              </button>
              <a href="${escapeHtml(d.mapsUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                ${t('open_maps')} ${ICONS.external}
              </a>
            </div>
            <div class="info-box" style="padding:16px;">
              <span style="font-size:0.82rem;font-weight:600;color:var(--forest);">Lokasi Asli di Peta</span>
              <div id="detailLeafletMap" class="detail-leaflet-box" data-lenis-prevent></div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  `;
}
