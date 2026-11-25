import { StorageService } from './storage.js';

export const ROLES = {
  GUEST: 'guest',
  TRAVELER: 'traveler',
  PARTNER: 'partner',
  ADMIN: 'admin'
};

const PRIMARY_OWNER_EMAIL = 'bahrisaidsaidul@gmail.com';

export function getEnvAdminEmails() {
  const raw = import.meta.env.VITE_ADMIN_EMAILS || '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function createAuthService(state) {
  function getAllAdminEmails() {
    const dynamic = Array.isArray(state.data.adminEmails) ? state.data.adminEmails : [];
    return Array.from(
      new Set([PRIMARY_OWNER_EMAIL, ...getEnvAdminEmails(), ...dynamic].map((e) => String(e).trim().toLowerCase()).filter(Boolean))
    );
  }

  function isWhitelistedAdminEmail(email) {
    const clean = String(email || '').trim().toLowerCase();
    if (!clean) return false;
    return getAllAdminEmails().includes(clean);
  }

  return {
    getAllAdminEmails,
    isWhitelistedAdminEmail,
    isPrimaryOwner(email) {
      return String(email || '').trim().toLowerCase() === PRIMARY_OWNER_EMAIL;
    },

    getCurrentUser() {
      const uid = state.data.preferences.currentUserId;
      if (!uid) return null;
      const user = state.data.users.find((u) => u.id === uid) || null;
      if (user && isWhitelistedAdminEmail(user.email) && user.role !== ROLES.ADMIN) {
        user.role = ROLES.ADMIN;
        StorageService.save(state.data);
      }
      return user;
    },

    getRole() {
      const user = this.getCurrentUser();
      return user ? user.role : ROLES.GUEST;
    },

    isAuthenticated() {
      return Boolean(this.getCurrentUser());
    },

    hasRole(...allowedRoles) {
      return allowedRoles.includes(this.getRole());
    },

    addAdminAccount({ name, email, password }) {
      const cleanEmail = String(email || '').trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        return { ok: false, error: 'Masukkan alamat email yang valid.' };
      }
      if (!Array.isArray(state.data.adminEmails)) state.data.adminEmails = [];
      if (!state.data.adminEmails.includes(cleanEmail)) {
        state.data.adminEmails.push(cleanEmail);
      }

      let existing = state.data.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        existing.role = ROLES.ADMIN;
        if (name && name.trim()) existing.name = name.trim();
        if (password && password.length >= 6) existing.password = password;
      } else {
        state.data.users.unshift({
          id: 'user-adm-' + Date.now(),
          name: (name || cleanEmail.split('@')[0]).trim(),
          email: cleanEmail,
          password: password && password.length >= 6 ? password : null,
          role: ROLES.ADMIN,
          region: 'Banda Aceh',
          joinedAt: new Date().toISOString().slice(0, 10)
        });
      }
      StorageService.save(state.data);
      return { ok: true };
    },

    removeAdminEmail(email) {
      const cleanEmail = String(email || '').trim().toLowerCase();
      if (cleanEmail === PRIMARY_OWNER_EMAIL) {
        return { ok: false, error: 'Owner Admin utama tidak dapat dihapus.' };
      }
      if (Array.isArray(state.data.adminEmails)) {
        state.data.adminEmails = state.data.adminEmails.filter((e) => e !== cleanEmail);
      }
      const user = state.data.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (user) {
        user.role = ROLES.TRAVELER;
      }
      StorageService.save(state.data);
      return { ok: true };
    },

    login(email, password) {
      const cleanEmail = String(email || '').trim().toLowerCase();
      const user = state.data.users.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.password && u.password === password
      );
      if (!user) {
        return { ok: false, error: 'Email atau kata sandi tidak sesuai.' };
      }
      if (isWhitelistedAdminEmail(user.email)) {
        user.role = ROLES.ADMIN;
      }
      state.data.preferences.currentUserId = user.id;
      StorageService.save(state.data);
      return { ok: true, user };
    },

    register({ name, email, password, role, region, businessName }) {
      const cleanEmail = String(email || '').trim().toLowerCase();
      if (!name || !cleanEmail || !password || password.length < 6) {
        return { ok: false, error: 'Nama, email, dan kata sandi minimal 6 karakter wajib diisi.' };
      }
      const exists = state.data.users.some((u) => u.email.toLowerCase() === cleanEmail);
      if (exists) {
        return { ok: false, error: 'Email sudah terdaftar. Silakan masuk.' };
      }
      const resolvedRole = isWhitelistedAdminEmail(cleanEmail)
        ? ROLES.ADMIN
        : role === ROLES.PARTNER
          ? ROLES.PARTNER
          : ROLES.TRAVELER;

      const newUser = {
        id: 'user-' + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        password,
        role: resolvedRole,
        region: region || 'Banda Aceh',
        businessName: resolvedRole === ROLES.PARTNER ? (businessName || name).trim() : undefined,
        joinedAt: new Date().toISOString().slice(0, 10)
      };
      state.data.users.push(newUser);
      state.data.preferences.currentUserId = newUser.id;
      StorageService.save(state.data);
      return { ok: true, user: newUser };
    },

    loginWithGoogle({ googleId, name, email, picture, role }) {
      const cleanEmail = String(email || '').trim().toLowerCase();
      if (!cleanEmail) {
        return { ok: false, error: 'Email akun Google tidak valid.' };
      }
      let user = state.data.users.find((u) => u.email.toLowerCase() === cleanEmail);
      let isNew = false;

      if (user) {
        user.provider = 'google';
        if (googleId) user.googleId = googleId;
        if (picture) user.avatarUrl = picture;
        if (isWhitelistedAdminEmail(cleanEmail)) {
          user.role = ROLES.ADMIN;
        }
      } else {
        isNew = true;
        const resolvedRole = isWhitelistedAdminEmail(cleanEmail)
          ? ROLES.ADMIN
          : role === ROLES.PARTNER
            ? ROLES.PARTNER
            : ROLES.TRAVELER;
        user = {
          id: 'user-g-' + Date.now(),
          googleId: googleId || 'gid-' + Date.now(),
          provider: 'google',
          name: (name || cleanEmail.split('@')[0]).trim(),
          email: cleanEmail,
          password: null,
          avatarUrl: picture || null,
          role: resolvedRole,
          region: 'Banda Aceh',
          businessName: resolvedRole === ROLES.PARTNER ? (name || 'Mitra UMKM Aceh').trim() : undefined,
          joinedAt: new Date().toISOString().slice(0, 10)
        };
        state.data.users.push(user);
      }

      state.data.preferences.currentUserId = user.id;
      StorageService.save(state.data);
      return { ok: true, user, isNew };
    },

    logout() {
      state.data.preferences.currentUserId = null;
      StorageService.save(state.data);
    }
  };
}
