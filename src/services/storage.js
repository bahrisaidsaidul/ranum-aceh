import { getSeedData } from '../data/seedData.js';

const STORAGE_KEY = 'ranum_aceh_prod_v2';

function migrateSeedImages(items, seedItems) {
  if (!Array.isArray(items)) return { items: seedItems, changed: true };
  let changed = false;
  const migrated = items.map((item) => {
    const seedMatch = seedItems.find((s) => s.id === item.id);
    if (!seedMatch) return item;
    let next = item;
    const isOldRemote = typeof item.imageUrl === 'string' && (item.imageUrl.includes('commons.wikimedia.org') || item.imageUrl.includes('images.unsplash.com'));
    if (isOldRemote && typeof seedMatch.imageUrl === 'string' && seedMatch.imageUrl.startsWith('./images/')) {
      next = { ...next, imageUrl: seedMatch.imageUrl };
      changed = true;
    }
    if (
      Array.isArray(item.gallery) &&
      Array.isArray(seedMatch.gallery) &&
      seedMatch.gallery.some((u) => u.startsWith('./images/')) &&
      item.gallery.some((u) => String(u).includes('commons.wikimedia.org') || String(u).includes('images.unsplash.com'))
    ) {
      next = { ...next, gallery: seedMatch.gallery };
      changed = true;
    }
    return next;
  });
  return { items: migrated, changed };
}

export const StorageService = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const seed = getSeedData();
      if (!raw) {
        this.save(seed);
        return seed;
      }
      const parsed = JSON.parse(raw);
      const destMig = migrateSeedImages(parsed.destinations, seed.destinations);
      const culMig = migrateSeedImages(parsed.culinary, seed.culinary);
      const pkgMig = migrateSeedImages(parsed.packages, seed.packages);

      const demoUserIds = ['user-traveler-1', 'user-partner-1', 'user-admin-1'];
      const cleanedUsers = Array.isArray(parsed.users)
        ? parsed.users.filter((u) => !demoUserIds.includes(u.id))
        : [];
      const removedDemos = Array.isArray(parsed.users) && cleanedUsers.length !== parsed.users.length;
      const currentUid = demoUserIds.includes(parsed.preferences?.currentUserId)
        ? null
        : parsed.preferences?.currentUserId || null;

      const mergedAdmins = Array.from(
        new Set([
          ...seed.adminEmails,
          ...(Array.isArray(parsed.adminEmails) ? parsed.adminEmails : [])
        ].map((e) => String(e).trim().toLowerCase()).filter(Boolean))
      );

      const data = {
        adminEmails: mergedAdmins,
        users: cleanedUsers,
        destinations: destMig.items,
        culinary: culMig.items,
        accommodations: Array.isArray(parsed.accommodations) ? parsed.accommodations : seed.accommodations,
        packages: pkgMig.items,
        itineraries: Array.isArray(parsed.itineraries) ? parsed.itineraries : seed.itineraries,
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites : seed.favorites,
        reviews: Array.isArray(parsed.reviews) ? parsed.reviews : seed.reviews,
        inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : seed.inquiries,
        preferences: parsed.preferences ? { ...seed.preferences, ...parsed.preferences, currentUserId: currentUid } : seed.preferences
      };
      if (destMig.changed || culMig.changed || pkgMig.changed || removedDemos) {
        this.save(data);
      }
      return data;
    } catch (err) {
      console.warn('Storage load fallback:', err);
      return getSeedData();
    }
  },

  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (err) {
      console.warn('Storage save error:', err);
      return false;
    }
  },

  reset(keepLanguage = 'id') {
    const seed = getSeedData();
    seed.preferences.language = keepLanguage;
    this.save(seed);
    return seed;
  }
};
