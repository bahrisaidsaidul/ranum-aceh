import { StorageService } from './storage.js';

export function createDataService(state, authService) {
  function getActorId() {
    const user = authService.getCurrentUser();
    return user ? user.id : 'guest-local';
  }

  return {
    save() {
      return StorageService.save(state.data);
    },

    // Generic CRUD
    create(collection, payload) {
      const prefix = collection.slice(0, 4);
      const item = { id: `${prefix}-${Date.now()}`, ...payload };
      state.data[collection].unshift(item);
      this.save();
      return item;
    },

    update(collection, id, updatedFields) {
      const list = state.data[collection];
      if (!Array.isArray(list)) return false;
      const idx = list.findIndex((item) => item.id === id);
      if (idx === -1) return false;
      list[idx] = { ...list[idx], ...updatedFields };
      this.save();
      return true;
    },

    remove(collection, id) {
      const list = state.data[collection];
      if (!Array.isArray(list)) return false;
      state.data[collection] = list.filter((item) => item.id !== id);
      this.save();
      return true;
    },

    // Favorites (scoped per user / guest)
    getUserFavorites() {
      const uid = getActorId();
      return state.data.favorites.filter((f) => (f.userId || 'guest-local') === uid);
    },

    isFavorite(itemId) {
      return this.getUserFavorites().some((f) => f.itemId === itemId);
    },

    toggleFavorite(itemId) {
      const uid = getActorId();
      const exists = this.isFavorite(itemId);
      if (exists) {
        state.data.favorites = state.data.favorites.filter(
          (f) => !((f.userId || 'guest-local') === uid && f.itemId === itemId)
        );
      } else {
        state.data.favorites.push({
          id: 'fav-' + Date.now(),
          userId: uid,
          itemId,
          itemType: 'destination',
          dateAdded: new Date().toISOString().slice(0, 10)
        });
      }
      this.save();
      return !exists;
    },

    clearUserFavorites() {
      const uid = getActorId();
      state.data.favorites = state.data.favorites.filter((f) => (f.userId || 'guest-local') !== uid);
      this.save();
    },

    // Itineraries (scoped per user)
    getUserItineraries() {
      const uid = getActorId();
      return state.data.itineraries.filter((tr) => (tr.userId || 'guest-local') === uid);
    },

    getActiveItinerary() {
      const list = this.getUserItineraries();
      if (!list.length) return null;
      return list.find((tr) => tr.id === state.data.preferences.activeItineraryId) || list[0];
    },

    recalcItineraryBudget(trip) {
      if (!trip) return 0;
      const travelers = Math.max(1, Number(trip.travelers) || 1);
      const days = Math.min(5, Math.max(1, Number(trip.duration) || 1));
      const entranceSum =
        (trip.activities || []).reduce((acc, act) => {
          const d = state.data.destinations.find((x) => x.id === act.destinationId);
          return acc + (d ? Number(d.estimatedCost) || 0 : 0);
        }, 0) * travelers;
      const estStay = Math.max(0, days - 1) * 400000;
      const estFood = days * travelers * 120000;
      const estTransport = days * 250000;
      trip.totalBudget = entranceSum + estStay + estFood + estTransport;
      return trip.totalBudget;
    },

    createItinerary(overrides = {}) {
      const uid = getActorId();
      const currentCount = this.getUserItineraries().length;
      const newTrip = {
        id: 'trip-' + Date.now(),
        userId: uid,
        tripName: `Perjalanan Aceh #${currentCount + 1}`,
        startDate: new Date().toISOString().slice(0, 10),
        duration: 3,
        travelers: 2,
        activities: [],
        totalBudget: 0,
        ...overrides
      };
      this.recalcItineraryBudget(newTrip);
      state.data.itineraries.unshift(newTrip);
      state.data.preferences.activeItineraryId = newTrip.id;
      this.save();
      return newTrip;
    },

    // Reviews & Ratings
    getDestinationReviews(destId) {
      return state.data.reviews.filter((r) => r.destinationId === destId);
    },

    getAverageRating(destId) {
      const list = this.getDestinationReviews(destId);
      if (!list.length) return null;
      const sum = list.reduce((acc, r) => acc + Number(r.rating || 5), 0);
      return (sum / list.length).toFixed(1);
    },

    addReview({ destinationId, rating, comment }) {
      const user = authService.getCurrentUser();
      if (!user) return { ok: false, error: 'Login diperlukan untuk menulis ulasan.' };
      const rev = {
        id: 'rev-' + Date.now(),
        destinationId,
        userId: user.id,
        userName: user.name,
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        comment: comment.trim(),
        createdAt: new Date().toISOString().slice(0, 10)
      };
      state.data.reviews.unshift(rev);
      this.save();
      return { ok: true, review: rev };
    },

    // Inquiries (Traveler -> Partner)
    createInquiry({ itemId, itemType, itemName, ownerId, date, guests, note }) {
      const user = authService.getCurrentUser();
      const inq = {
        id: 'inq-' + Date.now(),
        userId: user ? user.id : 'guest-local',
        userName: user ? user.name : 'Tamu RANUM',
        userEmail: user ? user.email : 'guest@ranum.id',
        ownerId: ownerId || 'user-partner-1',
        itemId,
        itemType,
        itemName,
        date: date || new Date().toISOString().slice(0, 10),
        guests: Math.max(1, Number(guests) || 1),
        note: (note || '').trim(),
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10)
      };
      state.data.inquiries.unshift(inq);
      this.save();
      return inq;
    },

    getUserInquiries() {
      const uid = getActorId();
      return state.data.inquiries.filter((i) => i.userId === uid);
    },

    getPartnerInquiries(partnerId) {
      return state.data.inquiries.filter((i) => i.ownerId === partnerId);
    },

    updateInquiryStatus(id, status) {
      return this.update('inquiries', id, { status });
    },

    // Partner Halal Verification Submission & Admin Review
    submitHalalVerification(culinaryId, docRef) {
      return this.update('culinary', culinaryId, {
        halalStatus: 'pending_verification',
        verificationSource: docRef || 'Pengajuan sertifikat halal oleh Mitra'
      });
    },

    reviewHalalVerification(culinaryId, decision, note) {
      if (decision === 'approve') {
        return this.update('culinary', culinaryId, {
          halalStatus: 'certified',
          verificationSource: note || 'Disetujui Admin (Terverifikasi BPJPH/MPU Aceh)'
        });
      }
      return this.update('culinary', culinaryId, {
        halalStatus: 'not_verified',
        verificationSource: note || 'Ditolak / butuh dokumen tambahan'
      });
    }
  };
}
