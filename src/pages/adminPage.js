import { REGIONS } from '../data/i18n.js';
import { ROLES } from '../services/authService.js';
import { ICONS } from '../utils/icons.js';
import { escapeHtml, formatIDR } from '../utils/helpers.js';
import { renderHalalBadge } from '../components/cards.js';

export function renderAdminPage(state, authService, helpers) {
  const { t, catLabel } = helpers;
  const role = authService.getRole();

  if (role !== ROLES.ADMIN) {
    return `
      <section class="section">
        <div class="container">
          <div class="empty-state">
            <span class="role-pill role-admin">Role Guard · Admin Only</span>
            <h3>Akses Terbatas untuk Administrator</h3>
            <p>Halaman Admin Command Center hanya dapat diakses oleh email Administrator yang terdaftar pada sistem (<code>VITE_ADMIN_EMAILS</code>).</p>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
              <button type="button" class="btn btn-primary" data-route="auth">Masuk dengan Akun Admin</button>
              <button type="button" class="btn btn-outline" data-route="home">Kembali ke Beranda</button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  const pendingHalal = state.data.culinary.filter((c) => c.halalStatus === 'pending_verification');

  const tabs = [
    { id: 'overview', label: t('admin_overview') },
    { id: 'verifications', label: `${t('admin_verifications')} (${pendingHalal.length})` },
    { id: 'destinations', label: `${t('admin_dest')} (${state.data.destinations.length})` },
    { id: 'culinary', label: `${t('admin_culinary')} (${state.data.culinary.length})` },
    { id: 'accommodations', label: `${t('admin_stay')} (${state.data.accommodations.length})` },
    { id: 'packages', label: `${t('admin_pkg')} (${state.data.packages.length})` },
    { id: 'users', label: `${t('admin_users')} (${state.data.users.length})` }
  ];

  return `
    <section class="section">
      <div class="container">
        <div class="section-header" style="margin-bottom:20px;">
          <div>
            <div class="section-eyebrow">${ICONS.shield} ADMIN COMMAND CENTER</div>
            <h1 class="section-title" data-split-words>${t('admin_title')}</h1>
          </div>
        </div>

        <div class="portal-banner">
          <span>${t('admin_banner')}</span>
          <button type="button" class="btn btn-danger btn-sm" id="adminResetDemoBtn">${t('reset_demo')}</button>
        </div>

        <div class="sub-tabs">
          ${tabs
            .map(
              (tb) => `
            <button type="button" class="sub-tab ${state.adminTab === tb.id ? 'active' : ''}" data-action="switch-admin-tab" data-tab="${tb.id}">${escapeHtml(tb.label)}</button>
          `
            )
            .join('')}
        </div>

        ${state.adminTab === 'overview' ? renderAdminOverview(state, pendingHalal.length, t) : ''}
        ${state.adminTab === 'verifications' ? renderHalalQueue(pendingHalal, t) : ''}
        ${state.adminTab === 'users' ? renderUsersTable(state, authService) : ''}
        ${['destinations', 'culinary', 'accommodations', 'packages'].includes(state.adminTab) ? renderAdminTable(state, state.adminTab, { t, catLabel }) : ''}
      </div>
    </section>
  `;
}

function renderAdminOverview(state, pendingHalalCount, t) {
  const stats = [
    { label: t('admin_dest'), val: state.data.destinations.length, tab: 'destinations' },
    { label: t('admin_culinary'), val: state.data.culinary.length, tab: 'culinary' },
    { label: t('admin_verifications'), val: pendingHalalCount, tab: 'verifications' },
    { label: t('admin_users'), val: state.data.users.length, tab: 'users' }
  ];

  const regCounts = REGIONS.map((r) => ({
    region: r,
    count: state.data.destinations.filter((d) => d.region === r).length
  }));
  const maxCount = Math.max(1, ...regCounts.map((r) => r.count));

  return `
    <div class="grid grid-4" style="margin-bottom:28px;">
      ${stats
        .map(
          (st) => `
        <div class="info-box" data-motion-card style="cursor:pointer;" data-action="switch-admin-tab" data-tab="${st.tab}">
          <span style="font-size:0.84rem;color:var(--muted);">${escapeHtml(st.label)}</span>
          <div style="font-family:var(--font-serif);font-size:2.4rem;color:var(--forest);">${st.val}</div>
          <span style="font-size:0.8rem;color:var(--sage);">Kelola →</span>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="info-box">
      <h3 style="font-size:1.3rem;">Distribusi Destinasi per Wilayah</h3>
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${regCounts
          .map(
            (rc) => `
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.88rem;margin-bottom:4px;">
              <span>${escapeHtml(rc.region)}</span>
              <strong>${rc.count} destinasi</strong>
            </div>
            <div style="height:10px;background:var(--sand);border-radius:999px;overflow:hidden;">
              <div style="height:100%;width:${(rc.count / maxCount) * 100}%;background:var(--forest);border-radius:999px;"></div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderHalalQueue(pendingList, t) {
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Kuliner / UMKM</th><th>Wilayah</th><th>Referensi Dokumen</th><th>Status</th><th>Keputusan Admin</th></tr></thead>
        <tbody>
          ${
            pendingList.length
              ? pendingList
                  .map(
                    (c) => `
                <tr>
                  <td><strong>${escapeHtml(c.name)}</strong></td>
                  <td>${escapeHtml(c.region)}</td>
                  <td>${escapeHtml(c.verificationSource || '-')}</td>
                  <td>${renderHalalBadge(c.halalStatus, t)}</td>
                  <td style="white-space:nowrap;">
                    <button type="button" class="btn btn-primary btn-sm" data-action="admin-halal-review" data-id="${escapeHtml(c.id)}" data-decision="approve">Setujui (Certified)</button>
                    <button type="button" class="btn btn-danger btn-sm" data-action="admin-halal-review" data-id="${escapeHtml(c.id)}" data-decision="reject">Tolak</button>
                  </td>
                </tr>
              `
                  )
                  .join('')
              : `<tr><td colspan="5" style="text-align:center;padding:36px;color:var(--muted);">Tidak ada antrean verifikasi halal yang menunggu.</td></tr>`
          }
        </tbody>
      </table>
    </div>
  `;
}

function renderUsersTable(state, authService) {
  const adminEmails = authService.getAllAdminEmails();

  return `
    <div class="grid grid-2" style="margin-bottom:24px;">
      <form class="info-box" id="addAdminForm">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <h3 style="font-size:1.3rem;">${ICONS.plus} Tambah Admin Baru</h3>
          <span class="role-pill role-admin">Admin</span>
        </div>
        <p style="font-size:0.86rem;color:var(--muted);">Tambahkan email rekan Anda agar otomatis mendapat akses Admin saat login via <strong>Google</strong> (atau isi kata sandi opsional untuk login email).</p>
        <div class="field-group">
          <label for="newAdminName">Nama Admin</label>
          <input class="input" id="newAdminName" name="name" placeholder="Contoh: Cut Dewi" required />
        </div>
        <div class="field-group">
          <label for="newAdminEmail">Email Google / Login *</label>
          <input class="input" id="newAdminEmail" name="email" type="email" placeholder="rekan.admin@gmail.com" required />
        </div>
        <div class="field-group">
          <label for="newAdminPass">Kata Sandi (Opsional, min. 6 karakter)</label>
          <input class="input" id="newAdminPass" name="password" type="password" minlength="6" placeholder="Kosongkan jika hanya login Google" />
        </div>
        <button type="submit" class="btn btn-primary">Tambahkan sebagai Admin</button>
      </form>

      <div class="info-box">
        <h3 style="font-size:1.3rem;">Daftar Email Admin Aktif (${adminEmails.length})</h3>
        <p style="font-size:0.86rem;color:var(--muted);">Setiap email di bawah ini memiliki akses penuh ke Admin Command Center.</p>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${adminEmails
            .map((em) => {
              const isOwner = authService.isPrimaryOwner(em);
              return `
              <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;background:var(--ivory);border:1px solid var(--border);border-radius:12px;">
                <div style="min-width:0;overflow:hidden;text-overflow:ellipsis;">
                  <strong style="font-size:0.9rem;">${escapeHtml(em)}</strong>
                  ${isOwner ? `<div><span class="badge badge-forest" style="margin-top:4px;">Owner Utama</span></div>` : ''}
                </div>
                ${
                  isOwner
                    ? ''
                    : `<button type="button" class="btn btn-danger btn-sm" data-action="admin-remove-email" data-email="${escapeHtml(em)}">Cabut</button>`
                }
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Nama</th><th>Email</th><th>Wilayah</th><th>Bergabung</th><th>Peran (Role)</th></tr></thead>
        <tbody>
          ${
            state.data.users.length
              ? state.data.users
                  .map(
                    (u) => `
                <tr>
                  <td><strong>${escapeHtml(u.name)}</strong></td>
                  <td>${escapeHtml(u.email)}</td>
                  <td>${escapeHtml(u.region || '-')}</td>
                  <td>${escapeHtml(u.joinedAt || '-')}</td>
                  <td>
                    <select class="select admin-user-role-select" data-user-id="${escapeHtml(u.id)}" style="padding:6px 10px;width:auto;" ${authService.isPrimaryOwner(u.email) ? 'disabled' : ''}>
                      <option value="${ROLES.TRAVELER}" ${u.role === ROLES.TRAVELER ? 'selected' : ''}>Wisatawan</option>
                      <option value="${ROLES.PARTNER}" ${u.role === ROLES.PARTNER ? 'selected' : ''}>Mitra UMKM</option>
                      <option value="${ROLES.ADMIN}" ${u.role === ROLES.ADMIN ? 'selected' : ''}>Admin</option>
                    </select>
                  </td>
                </tr>
              `
                  )
                  .join('')
              : `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--muted);">Belum ada pengguna terdaftar selain akun yang sedang login.</td></tr>`
          }
        </tbody>
      </table>
    </div>
  `;
}

function renderAdminTable(state, collection, { t, catLabel }) {
  const list = state.data[collection] || [];
  let headers = '';
  let rows = '';

  if (collection === 'destinations') {
    headers = '<th>Nama</th><th>Wilayah</th><th>Kategori</th><th>Estimasi Biaya</th><th>Aksi</th>';
    rows = list
      .map(
        (d) => `
      <tr>
        <td><strong>${escapeHtml(d.name)}</strong></td>
        <td>${escapeHtml(d.region)}</td>
        <td><span class="badge badge-sand">${escapeHtml(catLabel(d.category))}</span></td>
        <td>${formatIDR(d.estimatedCost)}</td>
        <td style="white-space:nowrap;">
          <button type="button" class="btn btn-outline btn-sm" data-action="admin-edit" data-col="destinations" data-id="${escapeHtml(d.id)}">${t('edit_btn')}</button>
          <button type="button" class="btn btn-danger btn-sm" data-action="admin-delete" data-col="destinations" data-id="${escapeHtml(d.id)}">${t('delete_btn')}</button>
        </td>
      </tr>
    `
      )
      .join('');
  } else if (collection === 'culinary') {
    headers = '<th>Nama Kuliner / UMKM</th><th>Wilayah</th><th>Harga</th><th>Status Halal</th><th>Aksi</th>';
    rows = list
      .map(
        (c) => `
      <tr>
        <td><strong>${escapeHtml(c.name)}</strong></td>
        <td>${escapeHtml(c.region)}</td>
        <td>${formatIDR(c.price)}</td>
        <td>${renderHalalBadge(c.halalStatus, t)}</td>
        <td style="white-space:nowrap;">
          <button type="button" class="btn btn-outline btn-sm" data-action="admin-edit" data-col="culinary" data-id="${escapeHtml(c.id)}">${t('edit_btn')}</button>
          <button type="button" class="btn btn-danger btn-sm" data-action="admin-delete" data-col="culinary" data-id="${escapeHtml(c.id)}">${t('delete_btn')}</button>
        </td>
      </tr>
    `
      )
      .join('');
  } else if (collection === 'accommodations') {
    headers = '<th>Nama Penginapan</th><th>Wilayah</th><th>Harga / Malam</th><th>Fasilitas Muslim</th><th>Aksi</th>';
    rows = list
      .map(
        (s) => `
      <tr>
        <td><strong>${escapeHtml(s.name)}</strong></td>
        <td>${escapeHtml(s.region)}</td>
        <td>${formatIDR(s.pricePerNight)}</td>
        <td>${(s.muslimFriendlyFacilities || []).length} item</td>
        <td style="white-space:nowrap;">
          <button type="button" class="btn btn-outline btn-sm" data-action="admin-edit" data-col="accommodations" data-id="${escapeHtml(s.id)}">${t('edit_btn')}</button>
          <button type="button" class="btn btn-danger btn-sm" data-action="admin-delete" data-col="accommodations" data-id="${escapeHtml(s.id)}">${t('delete_btn')}</button>
        </td>
      </tr>
    `
      )
      .join('');
  } else if (collection === 'packages') {
    headers = '<th>Nama Paket</th><th>Durasi</th><th>Destinasi</th><th>Estimasi Biaya</th><th>Aksi</th>';
    rows = list
      .map(
        (p) => `
      <tr>
        <td><strong>${escapeHtml(p.name)}</strong></td>
        <td>${p.duration} hari</td>
        <td>${(p.destinations || []).length} lokasi</td>
        <td>${formatIDR(p.estimatedCost)}</td>
        <td style="white-space:nowrap;">
          <button type="button" class="btn btn-outline btn-sm" data-action="admin-edit" data-col="packages" data-id="${escapeHtml(p.id)}">${t('edit_btn')}</button>
          <button type="button" class="btn btn-danger btn-sm" data-action="admin-delete" data-col="packages" data-id="${escapeHtml(p.id)}">${t('delete_btn')}</button>
        </td>
      </tr>
    `
      )
      .join('');
  }

  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
      <span style="font-size:0.9rem;color:var(--muted);">Total: <strong>${list.length}</strong> ${t('items_unit')}</span>
      <button type="button" class="btn btn-primary btn-sm" data-action="admin-create" data-col="${collection}">${ICONS.plus} ${t('add_new')}</button>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows || `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--muted);">${t('empty_title')}</td></tr>`}</tbody>
      </table>
    </div>
  `;
}
