import { REGIONS } from '../data/i18n.js';
import { ROLES } from '../services/authService.js';
import { isGoogleOAuthConfigured } from '../services/googleAuthService.js';
import { ICONS } from '../utils/icons.js';
import { escapeHtml } from '../utils/helpers.js';

const GOOGLE_LOGO_SVG = `<svg width="19" height="19" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

export function renderAuthPage(state, authService, { t }) {
  const mode = state.authTab || 'login';
  const currentUser = authService.getCurrentUser();
  const googleLive = isGoogleOAuthConfigured();

  return `
    <section class="section">
      <div class="container">
        <div class="section-header" style="margin-bottom:28px;">
          <div>
            <div class="section-eyebrow">${ICONS.acehMotif} AKUN RANUM</div>
            <h1 class="section-title" data-split-words>${t('auth_title')}</h1>
            <p class="section-subtitle">Masuk dengan akun Google atau daftar menggunakan email untuk menyimpan rencana perjalanan, ulasan, dan layanan UMKM Anda.</p>
          </div>
        </div>

        ${
          currentUser
            ? `<div class="portal-banner">
                <div>
                  <strong>Sedang masuk sebagai ${escapeHtml(currentUser.name)}</strong> (${escapeHtml(currentUser.email)})
                  <span class="role-pill role-${currentUser.role}" style="margin-left:8px;">${escapeHtml(currentUser.role)}</span>
                  ${currentUser.provider === 'google' ? `<span class="badge badge-forest" style="margin-left:6px;">Google Account</span>` : ''}
                </div>
                <button type="button" class="btn btn-outline btn-sm" data-action="logout">${ICONS.logout} ${t('nav_logout')}</button>
              </div>`
            : ''
        }

        <div class="auth-grid">
          <!-- Left: Google Login + Email Login / Register Form -->
          <div class="info-box">
            <div class="sub-tabs" style="margin-bottom:8px;">
              <button type="button" class="sub-tab ${mode === 'login' ? 'active' : ''}" data-action="switch-auth-tab" data-tab="login">Masuk</button>
              <button type="button" class="sub-tab ${mode === 'register' ? 'active' : ''}" data-action="switch-auth-tab" data-tab="register">Daftar Akun Baru</button>
            </div>

            <!-- Google OAuth Section -->
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${
                googleLive
                  ? `<div id="googleSignInMount" style="display:flex;justify-content:center;align-items:center;min-height:46px;"></div>`
                  : `<button type="button" class="btn-google" data-action="google-login-picker">
                      ${GOOGLE_LOGO_SVG}
                      <span>Lanjutkan dengan Google</span>
                    </button>`
              }
            </div>

            <div class="auth-divider">atau dengan email</div>

            ${
              mode === 'login'
                ? `<form id="loginForm" style="display:flex;flex-direction:column;gap:14px;">
                    <div class="field-group">
                      <label for="loginEmail">Email</label>
                      <input class="input" id="loginEmail" name="email" type="email" placeholder="nama@email.com" required />
                    </div>
                    <div class="field-group">
                      <label for="loginPass">Kata Sandi</label>
                      <input class="input" id="loginPass" name="password" type="password" placeholder="••••••••" required />
                    </div>
                    <button type="submit" class="btn btn-primary">Masuk Sekarang</button>
                  </form>`
                : `<form id="registerForm" style="display:flex;flex-direction:column;gap:14px;">
                    <div class="field-group">
                      <label for="regRole">Daftar Sebagai</label>
                      <select class="select" id="regRole" name="role">
                        <option value="${ROLES.TRAVELER}">Wisatawan (Traveler)</option>
                        <option value="${ROLES.PARTNER}">Mitra UMKM / Penginapan</option>
                      </select>
                    </div>
                    <div class="field-group">
                      <label for="regName">Nama Lengkap / Nama Usaha</label>
                      <input class="input" id="regName" name="name" placeholder="Contoh: Cut Nabila / Warung Kopi Gayo" required />
                    </div>
                    <div class="field-group">
                      <label for="regRegion">Wilayah Aceh</label>
                      <select class="select" id="regRegion" name="region">
                        ${REGIONS.map((r) => `<option value="${escapeHtml(r)}">${escapeHtml(r)}</option>`).join('')}
                      </select>
                    </div>
                    <div class="field-group">
                      <label for="regEmail">Email</label>
                      <input class="input" id="regEmail" name="email" type="email" placeholder="nama@email.com" required />
                    </div>
                    <div class="field-group">
                      <label for="regPass">Kata Sandi (min. 6 karakter)</label>
                      <input class="input" id="regPass" name="password" type="password" minlength="6" placeholder="Minimal 6 karakter" required />
                    </div>
                    <button type="submit" class="btn btn-primary">Buat Akun</button>
                  </form>`
            }
          </div>

          <!-- Right: Clean Role Benefits Card (No Demo Accounts) -->
          <div class="info-box" style="background:linear-gradient(155deg, var(--sand-light) 0%, var(--white) 100%);">
            <span class="badge badge-forest" style="align-self:flex-start;">Ekosistem RANUM Aceh</span>
            <h2 style="font-size:1.5rem;">Satu Akun untuk Perjalanan &amp; Mitra Lokal</h2>
            <p style="font-size:0.9rem;color:var(--muted);">Bergabung dengan RANUM untuk pengalaman wisata alam dan halal Aceh yang lebih personal dan terpercaya.</p>

            <div class="demo-role-card" style="flex-direction:column;align-items:flex-start;gap:6px;">
              <span class="role-pill role-traveler">Wisatawan</span>
              <div style="font-weight:600;">Rencana Perjalanan Personal</div>
              <div style="font-size:0.84rem;color:var(--muted);">Simpan destinasi favorit, susun itinerary 1–5 hari, tulis ulasan &amp; rating, serta pantau riwayat inquiry Anda.</div>
            </div>

            <div class="demo-role-card" style="flex-direction:column;align-items:flex-start;gap:6px;">
              <span class="role-pill role-partner">Mitra UMKM &amp; Penginapan</span>
              <div style="font-weight:600;">Portal Bisnis Ramah Muslim</div>
              <div style="font-size:0.84rem;color:var(--muted);">Daftarkan kuliner lokal atau penginapan Anda, ajukan verifikasi sertifikasi halal, dan kelola inquiry wisatawan.</div>
            </div>

            <div class="notice-box" style="margin-top:4px;">
              <strong>Pengelola / Administrator:</strong> Akses Admin diaktifkan secara otomatis melalui <em>Email Whitelist</em> resmi tanpa menampilkan akun demo di publik.
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
