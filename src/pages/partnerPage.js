import { ROLES } from '../services/authService.js';
import { ICONS } from '../utils/icons.js';
import { escapeHtml, formatIDR } from '../utils/helpers.js';
import { renderHalalBadge } from '../components/cards.js';

export function renderPartnerPage(state, authService, dataService, helpers) {
  const { t } = helpers;
  const user = authService.getCurrentUser();
  const role = authService.getRole();

  if (!user || (role !== ROLES.PARTNER && role !== ROLES.ADMIN)) {
    return `
      <section class="section">
        <div class="container">
          <div class="empty-state">
            <span class="role-pill role-partner">Akses Khusus Mitra UMKM</span>
            <h3>Masuk sebagai Mitra untuk Membuka Portal Ini</h3>
            <p>Portal Mitra memungkinkan pemilik kuliner UMKM dan penginapan ramah Muslim mengelola listing, mengajukan verifikasi halal, serta menanggapi inquiry wisatawan.</p>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
              <button type="button" class="btn btn-primary" data-route="auth">Masuk / Daftar Mitra</button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  const myCulinary = state.data.culinary.filter((c) => c.ownerId === user.id || role === ROLES.ADMIN);
  const myStays = state.data.accommodations.filter((s) => s.ownerId === user.id || role === ROLES.ADMIN);
  const myInquiries = role === ROLES.ADMIN ? state.data.inquiries : dataService.getPartnerInquiries(user.id);
  const certifiedCount = myCulinary.filter((c) => c.halalStatus === 'certified').length;
  const pendingInqCount = myInquiries.filter((i) => i.status === 'pending').length;

  const tab = state.partnerTab || 'overview';

  return `
    <section class="section">
      <div class="container">
        <div class="section-header" style="margin-bottom:20px;">
          <div>
            <div class="section-eyebrow">${ICONS.store} PORTAL MITRA</div>
            <h1 class="section-title" data-split-words>${t('partner_title')}</h1>
            <p class="section-subtitle">${t('partner_sub')}</p>
          </div>
        </div>

        <div class="portal-banner">
          <div>
            <span class="role-pill role-partner">Mitra Aktif</span>
            <strong style="margin-left:8px;">${escapeHtml(user.businessName || user.name)}</strong>
            <span style="font-size:0.84rem;color:var(--muted);margin-left:8px;">(${escapeHtml(user.region || 'Aceh')})</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="btn btn-primary btn-sm" data-action="partner-create" data-col="culinary">${ICONS.plus} Tambah Kuliner</button>
            <button type="button" class="btn btn-secondary btn-sm" data-action="partner-create" data-col="accommodations">${ICONS.plus} Tambah Penginapan</button>
          </div>
        </div>

        <div class="sub-tabs">
          <button type="button" class="sub-tab ${tab === 'overview' ? 'active' : ''}" data-action="switch-partner-tab" data-tab="overview">Ringkasan</button>
          <button type="button" class="sub-tab ${tab === 'culinary' ? 'active' : ''}" data-action="switch-partner-tab" data-tab="culinary">Kuliner Saya (${myCulinary.length})</button>
          <button type="button" class="sub-tab ${tab === 'accommodations' ? 'active' : ''}" data-action="switch-partner-tab" data-tab="accommodations">Penginapan Saya (${myStays.length})</button>
          <button type="button" class="sub-tab ${tab === 'inquiries' ? 'active' : ''}" data-action="switch-partner-tab" data-tab="inquiries">Inquiry Masuk (${myInquiries.length})</button>
        </div>

        ${
          tab === 'overview'
            ? `<div class="grid grid-4">
                <div class="info-box" data-motion-card>
                  <span style="font-size:0.84rem;color:var(--muted);">Listing Kuliner</span>
                  <div style="font-family:var(--font-serif);font-size:2.3rem;color:var(--forest);">${myCulinary.length}</div>
                  <span style="font-size:0.8rem;color:var(--sage);">${certifiedCount} tersertifikasi halal</span>
                </div>
                <div class="info-box" data-motion-card>
                  <span style="font-size:0.84rem;color:var(--muted);">Listing Penginapan</span>
                  <div style="font-family:var(--font-serif);font-size:2.3rem;color:var(--forest);">${myStays.length}</div>
                  <span style="font-size:0.8rem;color:var(--sage);">Ramah Muslim</span>
                </div>
                <div class="info-box" data-motion-card>
                  <span style="font-size:0.84rem;color:var(--muted);">Inquiry Menunggu</span>
                  <div style="font-family:var(--font-serif);font-size:2.3rem;color:#835B14;">${pendingInqCount}</div>
                  <span style="font-size:0.8rem;color:var(--muted);">Perlu konfirmasi</span>
                </div>
                <div class="info-box" data-motion-card>
                  <span style="font-size:0.84rem;color:var(--muted);">Total Inquiry</span>
                  <div style="font-family:var(--font-serif);font-size:2.3rem;color:var(--forest);">${myInquiries.length}</div>
                  <span style="font-size:0.8rem;color:var(--sage);">Dari wisatawan RANUM</span>
                </div>
              </div>`
            : ''
        }

        ${
          tab === 'culinary'
            ? `<div class="table-wrap">
                <table class="data-table">
                  <thead><tr><th>Nama Kuliner</th><th>Wilayah</th><th>Harga</th><th>Status Halal</th><th>Aksi</th></tr></thead>
                  <tbody>
                    ${
                      myCulinary.length
                        ? myCulinary
                            .map(
                              (c) => `
                          <tr>
                            <td><strong>${escapeHtml(c.name)}</strong><div style="font-size:0.78rem;color:var(--muted);">${escapeHtml(c.verificationSource || 'Belum ada nomor sertifikat')}</div></td>
                            <td>${escapeHtml(c.region)}</td>
                            <td>${formatIDR(c.price)}</td>
                            <td>${renderHalalBadge(c.halalStatus, t)}</td>
                            <td style="white-space:nowrap;">
                              ${c.halalStatus !== 'certified' ? `<button type="button" class="btn btn-secondary btn-sm" data-action="partner-submit-halal" data-id="${escapeHtml(c.id)}">Ajukan Halal</button>` : ''}
                              <button type="button" class="btn btn-outline btn-sm" data-action="partner-edit" data-col="culinary" data-id="${escapeHtml(c.id)}">${t('edit_btn')}</button>
                              <button type="button" class="btn btn-danger btn-sm" data-action="partner-delete" data-col="culinary" data-id="${escapeHtml(c.id)}">${t('delete_btn')}</button>
                            </td>
                          </tr>
                        `
                            )
                            .join('')
                        : `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--muted);">Belum ada listing kuliner.</td></tr>`
                    }
                  </tbody>
                </table>
              </div>`
            : ''
        }

        ${
          tab === 'accommodations'
            ? `<div class="table-wrap">
                <table class="data-table">
                  <thead><tr><th>Nama Penginapan</th><th>Wilayah</th><th>Harga / Malam</th><th>Fasilitas Muslim</th><th>Aksi</th></tr></thead>
                  <tbody>
                    ${
                      myStays.length
                        ? myStays
                            .map(
                              (s) => `
                          <tr>
                            <td><strong>${escapeHtml(s.name)}</strong></td>
                            <td>${escapeHtml(s.region)}</td>
                            <td>${formatIDR(s.pricePerNight)}</td>
                            <td>${(s.muslimFriendlyFacilities || []).length} fasilitas</td>
                            <td style="white-space:nowrap;">
                              <button type="button" class="btn btn-outline btn-sm" data-action="partner-edit" data-col="accommodations" data-id="${escapeHtml(s.id)}">${t('edit_btn')}</button>
                              <button type="button" class="btn btn-danger btn-sm" data-action="partner-delete" data-col="accommodations" data-id="${escapeHtml(s.id)}">${t('delete_btn')}</button>
                            </td>
                          </tr>
                        `
                            )
                            .join('')
                        : `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--muted);">Belum ada listing penginapan.</td></tr>`
                    }
                  </tbody>
                </table>
              </div>`
            : ''
        }

        ${
          tab === 'inquiries'
            ? `<div class="table-wrap">
                <table class="data-table">
                  <thead><tr><th>Wisatawan</th><th>Layanan</th><th>Tanggal &amp; Tamu</th><th>Catatan</th><th>Status / Aksi</th></tr></thead>
                  <tbody>
                    ${
                      myInquiries.length
                        ? myInquiries
                            .map(
                              (i) => `
                          <tr>
                            <td><strong>${escapeHtml(i.userName)}</strong><div style="font-size:0.78rem;color:var(--muted);">${escapeHtml(i.userEmail)}</div></td>
                            <td>${escapeHtml(i.itemName)}</td>
                            <td>${escapeHtml(i.date)} · ${i.guests} org</td>
                            <td>${escapeHtml(i.note)}</td>
                            <td style="white-space:nowrap;">
                              ${
                                i.status === 'pending'
                                  ? `<button type="button" class="btn btn-primary btn-sm" data-action="partner-inquiry-status" data-id="${escapeHtml(i.id)}" data-status="confirmed">Konfirmasi</button>
                                     <button type="button" class="btn btn-danger btn-sm" data-action="partner-inquiry-status" data-id="${escapeHtml(i.id)}" data-status="declined">Tolak</button>`
                                  : `<span class="badge ${i.status === 'confirmed' ? 'badge-certified' : 'badge-danger'}">${escapeHtml(i.status)}</span>`
                              }
                            </td>
                          </tr>
                        `
                            )
                            .join('')
                        : `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--muted);">Belum ada inquiry masuk.</td></tr>`
                    }
                  </tbody>
                </table>
              </div>`
            : ''
        }
      </div>
    </section>
  `;
}
