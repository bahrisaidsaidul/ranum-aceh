import { StorageService } from './storage.js';

export const ROLES = {
  GUEST: 'guest',
  TRAVELER: 'traveler',
  PARTNER: 'partner',
  ADMIN: 'admin'
};

export function createAuthService(state) {
  return {
    getCurrentUser() {
      const uid = state.data.preferences.currentUserId;
      if (!uid) return null;
      return state.data.users.find((u) => u.id === uid) || null;
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

    login(email, password) {
      const cleanEmail = String(email || '').trim().toLowerCase();
      const user = state.data.users.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.password === password
      );
      if (!user) {
        return { ok: false, error: 'Email atau kata sandi tidak sesuai.' };
      }
      state.data.preferences.currentUserId = user.id;
      StorageService.save(state.data);
      return { ok: true, user };
    },

    loginDemo(role) {
      const user = state.data.users.find((u) => u.role === role);
      if (!user) return { ok: false, error: 'Akun demo tidak ditemukan.' };
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
      const safeRole = role === ROLES.PARTNER ? ROLES.PARTNER : ROLES.TRAVELER;
      const newUser = {
        id: 'user-' + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        password,
        role: safeRole,
        region: region || 'Banda Aceh',
        businessName: safeRole === ROLES.PARTNER ? (businessName || name).trim() : undefined,
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
      } else {
        isNew = true;
        const safeRole = role === ROLES.PARTNER ? ROLES.PARTNER : ROLES.TRAVELER;
        user = {
          id: 'user-g-' + Date.now(),
          googleId: googleId || 'gid-' + Date.now(),
          provider: 'google',
          name: (name || cleanEmail.split('@')[0]).trim(),
          email: cleanEmail,
          password: null,
          avatarUrl: picture || null,
          role: safeRole,
          region: 'Banda Aceh',
          businessName: safeRole === ROLES.PARTNER ? (name || 'Mitra UMKM Aceh').trim() : undefined,
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
