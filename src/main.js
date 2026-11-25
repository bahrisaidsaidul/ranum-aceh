import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/views.css';

import { StorageService } from './services/storage.js';
import { createAuthService, ROLES } from './services/authService.js';
import { createDataService } from './services/dataService.js';
import { mountOfficialGoogleButton } from './services/googleAuthService.js';
import { createTranslator, registerGlobalImageFallback, showToast } from './utils/helpers.js';
import { refreshAllAnimations, scrollToTop, stopLenis, startLenis, animateMobileDrawerOpen } from './utils/animations.js';
import { initMaps, updateMapInfoPanelHtml, flyToDestinationOnMap } from './utils/mapManager.js';
import { renderNavigation, renderFooter } from './components/layout.js';
import {
  closeModal,
  openAddToItineraryModal,
  openCulinaryDetailModal,
  openStayDetailModal,
  openPackageDetailModal,
  openCrudFormModal,
  openGoogleAccountPickerModal
} from './components/modals.js';

import { renderHomePage } from './pages/homePage.js';
import { renderExplorePage } from './pages/explorePage.js';
import { renderDetailPage } from './pages/detailPage.js';
import { renderCulinaryPage } from './pages/culinaryPage.js';
import { renderStayPage } from './pages/stayPage.js';
import { renderPlannerPage } from './pages/plannerPage.js';
import { renderSavedPage } from './pages/savedPage.js';
import { renderAuthPage } from './pages/authPage.js';
import { renderPartnerPage } from './pages/partnerPage.js';
import { renderAdminPage } from './pages/adminPage.js';

registerGlobalImageFallback();

const state = {
  data: StorageService.load(),
  route: 'home',
  detailId: null,
  plannerTab: 'itinerary',
  authTab: 'login',
  partnerTab: 'overview',
  adminTab: 'overview',
  exploreFilter: { search: '', region: '', category: '', sort: 'name_asc' },
  culinaryFilter: { search: '', region: '', status: '' },
  stayFilter: { search: '', region: '', sort: 'price_asc' },
  pkgFilter: { interest: '', duration: 5, maxBudget: 5000000, travelers: 2 },
  selectedMapDestId: 'dest-001',
  mapLayer: 'leaflet',
  googleMapType: 'roadmap',
  budgetInputs: {
    travelers: 2,
    transportation: 600000,
    accommodation: 900000,
    entranceFees: 150000,
    food: 500000,
    additional: 250000
  }
};

const authService = createAuthService(state);
const dataService = createDataService(state, authService);
const helpers = createTranslator(state);

function closeMobileDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const btn = document.getElementById('mobileMenuBtn');
  if (!drawer?.classList.contains('open')) return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  btn?.classList.remove('is-open');
  btn?.setAttribute('aria-expanded', 'false');
  startLenis();
}

function syncHashFromState() {
  let hash = '#' + state.route;
  if (state.route === 'detail' && state.detailId) hash = `#detail/${state.detailId}`;
  if (state.route === 'planner' && state.plannerTab !== 'itinerary') hash = `#planner/${state.plannerTab}`;
  if (window.location.hash !== hash) {
    window.history.pushState(null, '', hash);
  }
}

function parseHashToState() {
  const raw = (window.location.hash || '#home').replace(/^#/, '');
  const [route, param] = raw.split('/');
  const validRoutes = ['home', 'explore', 'detail', 'culinary', 'stay', 'planner', 'saved', 'auth', 'partner', 'admin'];
  state.route = validRoutes.includes(route) ? route : 'home';
  if (state.route === 'detail') {
    state.detailId = param || state.data.destinations[0]?.id;
  } else if (state.route === 'planner' && ['itinerary', 'budget', 'packages'].includes(param)) {
    state.plannerTab = param;
  }
}

function navigate(route, detailId = null, pushHash = true) {
  state.route = route;
  state.detailId = detailId;
  closeMobileDrawer();
  if (pushHash) syncHashFromState();
  renderNavigation(state, authService, dataService, helpers);
  renderFooter(helpers);
  renderCurrentView(true);
}

function renderPreservingFocus(inputEl) {
  const id = inputEl.id;
  const pos = inputEl.selectionStart;
  renderCurrentView(false);
  const next = document.getElementById(id);
  if (next) {
    next.focus();
    if (typeof pos === 'number' && next.setSelectionRange) {
      try { next.setSelectionRange(pos, pos); } catch (_) {}
    }
  }
}

function renderCurrentView(shouldScrollTop = true) {
  const app = document.getElementById('app');
  let html = '';
  switch (state.route) {
    case 'explore': html = renderExplorePage(state, dataService, helpers); break;
    case 'detail': html = renderDetailPage(state, authService, dataService, helpers); break;
    case 'culinary': html = renderCulinaryPage(state, helpers); break;
    case 'stay': html = renderStayPage(state, helpers); break;
    case 'planner': html = renderPlannerPage(state, dataService, helpers); break;
    case 'saved': html = renderSavedPage(state, authService, dataService, helpers); break;
    case 'auth': html = renderAuthPage(state, authService, helpers); break;
    case 'partner': html = renderPartnerPage(state, authService, dataService, helpers); break;
    case 'admin': html = renderAdminPage(state, authService, helpers); break;
    default: html = renderHomePage(state, dataService, helpers); break;
  }
  app.innerHTML = html;
  bindPageSpecificEvents();
  if (shouldScrollTop) scrollToTop();
  refreshAllAnimations();
  requestAnimationFrame(() => initMaps(state, helpers));
}

function syncBudgetFromActiveTrip() {
  const trip = dataService.getActiveItinerary();
  if (!trip) return;
  const travelers = Math.max(1, Number(trip.travelers) || 1);
  const days = Math.min(5, Math.max(1, Number(trip.duration) || 1));
  const entrance =
    (trip.activities || []).reduce((acc, a) => {
      const d = state.data.destinations.find((x) => x.id === a.destinationId);
      return acc + (d ? Number(d.estimatedCost) || 0 : 0);
    }, 0) * travelers;
  state.budgetInputs = {
    travelers,
    transportation: days * 250000,
    accommodation: Math.max(0, days - 1) * 400000,
    entranceFees: entrance,
    food: days * travelers * 120000,
    additional: 200000
  };
}

function applyPackageToPlanner(pkgId) {
  const pkg = state.data.packages.find((p) => p.id === pkgId);
  if (!pkg) return;
  const duration = Math.min(5, Math.max(1, Number(pkg.duration) || 2));
  const activities = (pkg.destinations || []).map((destId, idx) => {
    const d = state.data.destinations.find((x) => x.id === destId);
    return {
      day: (idx % duration) + 1,
      destinationId: destId,
      activity: d ? `Eksplorasi ${d.name}` : 'Kunjungan destinasi'
    };
  });

  dataService.createItinerary({
    tripName: pkg.name,
    duration,
    travelers: state.pkgFilter.travelers || 2,
    activities,
    totalBudget: pkg.estimatedCost
  });
  closeModal();
  state.plannerTab = 'itinerary';
  navigate('planner');
  showToast(`Paket "${pkg.name}" diterapkan ke Travel Planner!`);
}

function handleResetDemo() {
  if (!confirm('Reset seluruh data demo ke pengaturan awal?')) return;
  state.data = StorageService.reset(state.data.preferences.language || 'id');
  renderNavigation(state, authService, dataService, helpers);
  renderFooter(helpers);
  renderCurrentView(false);
  showToast('Data demo berhasil direset!');
}

function bindPageSpecificEvents() {
  // Home search
  const heroForm = document.getElementById('heroSearchForm');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      state.exploreFilter.search = document.getElementById('heroSearchInput').value.trim();
      navigate('explore');
    });
  }

  // Google Maps Roadmap / Satellite selector
  document.getElementById('googleMapTypeSelect')?.addEventListener('change', (e) => {
    state.googleMapType = e.target.value;
    initMaps(state, helpers);
  });

  // Explore filters
  const expSearch = document.getElementById('expSearch');
  if (expSearch) {
    expSearch.addEventListener('input', (e) => { state.exploreFilter.search = e.target.value; renderPreservingFocus(e.target); });
    document.getElementById('expRegion').addEventListener('change', (e) => { state.exploreFilter.region = e.target.value; renderCurrentView(false); });
    document.getElementById('expCategory').addEventListener('change', (e) => { state.exploreFilter.category = e.target.value; renderCurrentView(false); });
    document.getElementById('expSort').addEventListener('change', (e) => { state.exploreFilter.sort = e.target.value; renderCurrentView(false); });
    const resetExp = () => { state.exploreFilter = { search: '', region: '', category: '', sort: 'name_asc' }; renderCurrentView(false); };
    document.getElementById('expResetBtn').addEventListener('click', resetExp);
    document.getElementById('expResetEmpty')?.addEventListener('click', resetExp);
  }

  // Culinary filters
  const culSearch = document.getElementById('culSearch');
  if (culSearch) {
    culSearch.addEventListener('input', (e) => { state.culinaryFilter.search = e.target.value; renderPreservingFocus(e.target); });
    document.getElementById('culRegion').addEventListener('change', (e) => { state.culinaryFilter.region = e.target.value; renderCurrentView(false); });
    document.getElementById('culStatus').addEventListener('change', (e) => { state.culinaryFilter.status = e.target.value; renderCurrentView(false); });
    const resetCul = () => { state.culinaryFilter = { search: '', region: '', status: '' }; renderCurrentView(false); };
    document.getElementById('culResetBtn').addEventListener('click', resetCul);
    document.getElementById('culResetEmpty')?.addEventListener('click', resetCul);
  }

  // Stay filters
  const staySearch = document.getElementById('staySearch');
  if (staySearch) {
    staySearch.addEventListener('input', (e) => { state.stayFilter.search = e.target.value; renderPreservingFocus(e.target); });
    document.getElementById('stayRegion').addEventListener('change', (e) => { state.stayFilter.region = e.target.value; renderCurrentView(false); });
    document.getElementById('staySort').addEventListener('change', (e) => { state.stayFilter.sort = e.target.value; renderCurrentView(false); });
    const resetStay = () => { state.stayFilter = { search: '', region: '', sort: 'price_asc' }; renderCurrentView(false); };
    document.getElementById('stayResetBtn').addEventListener('click', resetStay);
    document.getElementById('stayResetEmpty')?.addEventListener('click', resetStay);
  }

  // Detail Review Form
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const res = dataService.addReview({
        destinationId: reviewForm.dataset.destId,
        rating: fd.get('rating'),
        comment: fd.get('comment')
      });
      if (res.ok) {
        showToast('Terima kasih! Ulasan Anda berhasil diterbitkan.');
        renderCurrentView(false);
      } else {
        showToast(res.error, 'error');
      }
    });
  }

  // Planner — Itinerary
  document.getElementById('createNewTripBtn')?.addEventListener('click', () => {
    dataService.createItinerary();
    renderCurrentView(false);
    showToast('Itinerary baru dibuat!');
  });

  document.getElementById('tripMetaForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const trip = dataService.getActiveItinerary();
    if (!trip) return;
    trip.tripName = document.getElementById('tripNameInput').value.trim() || 'My Aceh Journey';
    trip.startDate = document.getElementById('tripDateInput').value;
    trip.duration = Math.min(5, Math.max(1, Number(document.getElementById('tripDurInput').value) || 1));
    trip.travelers = Math.max(1, Number(document.getElementById('tripTravInput').value) || 1);
    trip.activities = trip.activities.filter((a) => a.day <= trip.duration);
    dataService.recalcItineraryBudget(trip);
    dataService.save();
    renderCurrentView(false);
    showToast('Itinerary berhasil disimpan!');
  });

  document.getElementById('syncToBudgetBtn')?.addEventListener('click', () => {
    syncBudgetFromActiveTrip();
    state.plannerTab = 'budget';
    syncHashFromState();
    renderCurrentView(false);
  });

  document.querySelectorAll('.add-act-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const trip = dataService.getActiveItinerary();
      if (!trip) return;
      const day = Number(form.dataset.day) || 1;
      const fd = new FormData(form);
      const destId = fd.get('destId');
      const dest = state.data.destinations.find((d) => d.id === destId);
      const note = (fd.get('note') || '').trim() || (dest ? `Kunjungan ke ${dest.name}` : 'Aktivitas wisata');
      trip.activities.push({ day, destinationId: destId, activity: note });
      dataService.recalcItineraryBudget(trip);
      dataService.save();
      renderCurrentView(false);
      showToast('Aktivitas ditambahkan!');
    });
  });

  // Planner — Budget
  const budgetInputs = document.querySelectorAll('.budget-input');
  if (budgetInputs.length) {
    budgetInputs.forEach((inp) => {
      inp.addEventListener('input', (e) => {
        state.budgetInputs[e.target.dataset.field] = Math.max(0, Number(e.target.value) || 0);
        renderPreservingFocus(e.target);
      });
    });
    document.getElementById('pullItineraryBudgetBtn')?.addEventListener('click', () => {
      syncBudgetFromActiveTrip();
      renderCurrentView(false);
      showToast('Estimasi disinkronkan dari itinerary aktif!');
    });
  }

  // Planner — Packages
  const pkgInterest = document.getElementById('pkgInterest');
  if (pkgInterest) {
    pkgInterest.addEventListener('change', (e) => { state.pkgFilter.interest = e.target.value; renderCurrentView(false); });
    document.getElementById('pkgDuration').addEventListener('change', (e) => { state.pkgFilter.duration = Number(e.target.value) || 5; renderCurrentView(false); });
    document.getElementById('pkgBudget').addEventListener('change', (e) => { state.pkgFilter.maxBudget = Number(e.target.value) || 5000000; renderCurrentView(false); });
    document.getElementById('pkgTravelers').addEventListener('change', (e) => { state.pkgFilter.travelers = Math.max(1, Number(e.target.value) || 1); renderCurrentView(false); });
  }

  // Auth Forms & Google Identity Services Mount
  const googleMountEl = document.getElementById('googleSignInMount');
  if (googleMountEl) {
    mountOfficialGoogleButton(googleMountEl, (profile) => {
      const roleSelect = document.getElementById('regRole');
      const res = authService.loginWithGoogle({
        ...profile,
        role: roleSelect ? roleSelect.value : ROLES.TRAVELER
      });
      if (res.ok) {
        showToast(`Berhasil masuk dengan Google sebagai ${res.user.name}!`);
        const nextRoute = res.user.role === ROLES.ADMIN ? 'admin' : res.user.role === ROLES.PARTNER ? 'partner' : 'home';
        navigate(nextRoute);
      }
    });
  }

  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const res = authService.login(fd.get('email'), fd.get('password'));
    if (!res.ok) return showToast(res.error, 'error');
    showToast(`Selamat datang kembali, ${res.user.name}!`);
    const destRoute = res.user.role === ROLES.ADMIN ? 'admin' : res.user.role === ROLES.PARTNER ? 'partner' : 'home';
    navigate(destRoute);
  });

  document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const res = authService.register({
      name: fd.get('name'),
      email: fd.get('email'),
      password: fd.get('password'),
      role: fd.get('role'),
      region: fd.get('region')
    });
    if (!res.ok) return showToast(res.error, 'error');
    showToast(`Akun berhasil dibuat! Selamat datang, ${res.user.name}.`);
    navigate(res.user.role === ROLES.PARTNER ? 'partner' : 'home');
  });

  // Saved Clear
  document.getElementById('clearFavsBtn')?.addEventListener('click', () => {
    dataService.clearUserFavorites();
    renderNavigation(state, authService, dataService, helpers);
    renderCurrentView(false);
    showToast('Semua favorit telah dihapus.');
  });

  // Admin Reset, Add Admin Form & User Role Switcher
  document.getElementById('adminResetDemoBtn')?.addEventListener('click', handleResetDemo);

  document.getElementById('addAdminForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const res = authService.addAdminAccount({
      name: fd.get('name'),
      email: fd.get('email'),
      password: fd.get('password')
    });
    if (!res.ok) return showToast(res.error, 'error');
    showToast('Admin baru berhasil ditambahkan!');
    renderCurrentView(false);
  });

  document.querySelectorAll('.admin-user-role-select').forEach((sel) => {
    sel.addEventListener('change', (e) => {
      const uid = e.target.dataset.userId;
      const targetUser = state.data.users.find((u) => u.id === uid);
      dataService.update('users', uid, { role: e.target.value });
      if (targetUser && e.target.value === ROLES.ADMIN) {
        authService.addAdminAccount({ name: targetUser.name, email: targetUser.email });
      }
      showToast('Peran pengguna berhasil diperbarui.');
      renderNavigation(state, authService, dataService, helpers);
      renderCurrentView(false);
    });
  });
}

// Global Click Delegation
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-route], [data-action], [data-lang], #footerResetDemoBtn');
  if (!target) return;

  if (target.id === 'footerResetDemoBtn') return handleResetDemo();

  if (target.dataset.lang) {
    state.data.preferences.language = target.dataset.lang;
    dataService.save();
    renderNavigation(state, authService, dataService, helpers);
    renderFooter(helpers);
    renderCurrentView(false);
    showToast(target.dataset.lang === 'en' ? 'Language switched to English' : 'Bahasa diubah ke Bahasa Indonesia');
    return;
  }

  if (target.dataset.route) {
    e.preventDefault();
    navigate(target.dataset.route);
    return;
  }

  const action = target.dataset.action;
  const id = target.dataset.id;

  switch (action) {
    case 'google-login-picker': {
      openGoogleAccountPickerModal((profile) => {
        const res = authService.loginWithGoogle(profile);
        if (!res.ok) return showToast(res.error, 'error');
        showToast(`Berhasil masuk dengan Google (${res.user.name})!`);
        const nextRoute = res.user.role === ROLES.ADMIN ? 'admin' : res.user.role === ROLES.PARTNER ? 'partner' : 'home';
        navigate(nextRoute);
      });
      break;
    }
    case 'logout':
      authService.logout();
      showToast('Anda kini dalam mode Tamu (Guest).');
      navigate('home');
      break;
    case 'switch-auth-tab':
      state.authTab = target.dataset.tab;
      renderCurrentView(false);
      break;
    case 'toggle-fav': {
      e.stopPropagation();
      const added = dataService.toggleFavorite(id);
      showToast(added ? 'Disimpan ke Favorit' : 'Dihapus dari Favorit');
      renderNavigation(state, authService, dataService, helpers);
      renderCurrentView(false);
      break;
    }
    case 'open-dest':
      navigate('detail', id);
      break;
    case 'open-culinary':
      openCulinaryDetailModal(id, state, dataService, helpers);
      break;
    case 'open-stay':
      openStayDetailModal(id, state, dataService, helpers);
      break;
    case 'open-package':
      openPackageDetailModal(id, state, helpers);
      break;
    case 'use-package':
      applyPackageToPlanner(id);
      break;
    case 'quick-add-itinerary':
      openAddToItineraryModal(id, state, dataService, helpers);
      break;
    case 'filter-category':
      state.exploreFilter = { search: '', region: '', category: target.dataset.category, sort: 'name_asc' };
      navigate('explore');
      break;
    case 'filter-region':
      state.exploreFilter = { search: '', region: target.dataset.region, category: '', sort: 'name_asc' };
      navigate('explore');
      break;
    case 'switch-map-layer':
      state.mapLayer = target.dataset.layer || 'leaflet';
      renderCurrentView(false);
      break;
    case 'focus-map-dest': {
      state.selectedMapDestId = id;
      const d = state.data.destinations.find((x) => x.id === id);
      if (d) {
        const panel = document.getElementById('mapInfoPanel');
        if (panel) panel.innerHTML = updateMapInfoPanelHtml(d, helpers);
        document.querySelectorAll('#mapQuickPills [data-action="focus-map-dest"]').forEach((btn) => {
          const isAct = btn.dataset.id === id;
          btn.style.borderColor = isAct ? 'var(--forest)' : '';
          btn.style.background = isAct ? 'var(--sand)' : '';
          btn.style.color = isAct ? 'var(--forest)' : '';
          btn.style.fontWeight = isAct ? '600' : '';
        });
        if (state.mapLayer === 'google') {
          initMaps(state, helpers);
        } else {
          flyToDestinationOnMap(d);
        }
      }
      break;
    }
    case 'swap-gallery': {
      const mainImg = document.getElementById('detailMainImg');
      if (mainImg) {
        mainImg.dataset.fallbackApplied = '';
        mainImg.src = target.dataset.src;
      }
      document.querySelectorAll('.detail-thumb').forEach((b) => b.classList.remove('active'));
      target.classList.add('active');
      break;
    }
    case 'open-planner-tab':
      state.plannerTab = target.dataset.tab || 'itinerary';
      navigate('planner');
      break;
    case 'switch-planner-tab':
      state.plannerTab = target.dataset.tab;
      syncHashFromState();
      renderCurrentView(false);
      break;
    case 'select-trip':
      state.data.preferences.activeItineraryId = id;
      dataService.save();
      renderCurrentView(false);
      break;
    case 'delete-trip':
      dataService.remove('itineraries', id);
      renderCurrentView(false);
      showToast('Itinerary dihapus.');
      break;
    case 'del-act': {
      const trip = dataService.getActiveItinerary();
      if (!trip) break;
      trip.activities.splice(Number(target.dataset.idx), 1);
      dataService.recalcItineraryBudget(trip);
      dataService.save();
      renderCurrentView(false);
      break;
    }
    case 'move-act': {
      const trip = dataService.getActiveItinerary();
      if (!trip) break;
      const day = Number(target.dataset.day);
      const idx = Number(target.dataset.idx);
      const dir = Number(target.dataset.dir);
      const dayIndices = trip.activities.map((a, i) => (Number(a.day) === day ? i : -1)).filter((i) => i !== -1);
      const pos = dayIndices.indexOf(idx);
      const swapPos = pos + dir;
      if (swapPos >= 0 && swapPos < dayIndices.length) {
        const targetIdx = dayIndices[swapPos];
        [trip.activities[idx], trip.activities[targetIdx]] = [trip.activities[targetIdx], trip.activities[idx]];
        dataService.save();
        renderCurrentView(false);
      }
      break;
    }
    // Partner Actions
    case 'switch-partner-tab':
      state.partnerTab = target.dataset.tab;
      renderCurrentView(false);
      break;
    case 'partner-create': {
      const user = authService.getCurrentUser();
      openCrudFormModal({
        collection: target.dataset.col,
        ownerId: user?.id,
        isPartner: true,
        state,
        dataService,
        helpers,
        onSaved: () => renderCurrentView(false)
      });
      break;
    }
    case 'partner-edit':
      openCrudFormModal({
        collection: target.dataset.col,
        itemId: id,
        isPartner: true,
        state,
        dataService,
        helpers,
        onSaved: () => renderCurrentView(false)
      });
      break;
    case 'partner-delete':
      if (confirm('Hapus listing ini?')) {
        dataService.remove(target.dataset.col, id);
        renderCurrentView(false);
        showToast('Listing dihapus.');
      }
      break;
    case 'partner-submit-halal': {
      const ref = prompt('Masukkan nomor sertifikat atau referensi pengajuan halal (BPJPH / MPU Aceh):', 'BPJPH-ACEH-2026-NEW');
      if (ref !== null) {
        dataService.submitHalalVerification(id, ref.trim() || 'Pengajuan verifikasi halal oleh Mitra');
        renderCurrentView(false);
        showToast('Pengajuan verifikasi halal dikirim ke antrean Admin!');
      }
      break;
    }
    case 'partner-inquiry-status':
      dataService.updateInquiryStatus(id, target.dataset.status);
      renderCurrentView(false);
      showToast(`Status inquiry diperbarui menjadi ${target.dataset.status}.`);
      break;
    // Admin Actions
    case 'switch-admin-tab':
      state.adminTab = target.dataset.tab;
      renderCurrentView(false);
      break;
    case 'admin-create':
      openCrudFormModal({
        collection: target.dataset.col,
        state,
        dataService,
        helpers,
        onSaved: () => renderCurrentView(false)
      });
      break;
    case 'admin-edit':
      openCrudFormModal({
        collection: target.dataset.col,
        itemId: id,
        state,
        dataService,
        helpers,
        onSaved: () => renderCurrentView(false)
      });
      break;
    case 'admin-delete':
      if (confirm('Hapus item ini secara permanen?')) {
        dataService.remove(target.dataset.col, id);
        renderCurrentView(false);
        showToast('Item berhasil dihapus.');
      }
      break;
    case 'admin-halal-review': {
      const decision = target.dataset.decision;
      dataService.reviewHalalVerification(id, decision);
      renderCurrentView(false);
      showToast(decision === 'approve' ? 'Sertifikasi Halal disetujui (Certified)!' : 'Pengajuan dikembalikan ke Belum Diverifikasi.');
      break;
    }
    case 'admin-remove-email': {
      const em = target.dataset.email;
      if (confirm(`Cabut akses Admin dari ${em}?`)) {
        const res = authService.removeAdminEmail(em);
        if (!res.ok) return showToast(res.error, 'error');
        showToast(`Akses Admin ${em} telah dicabut.`);
        renderCurrentView(false);
      }
      break;
    }
  }
});

// Global UI Listeners
window.addEventListener('scroll', () => {
  document.getElementById('siteHeader')?.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

window.addEventListener('hashchange', () => {
  parseHashToState();
  renderNavigation(state, authService, dataService, helpers);
  renderCurrentView(true);
});

document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
  const drawer = document.getElementById('mobileDrawer');
  const btn = document.getElementById('mobileMenuBtn');
  const open = drawer.classList.toggle('open');
  drawer.setAttribute('aria-hidden', String(!open));
  btn.classList.toggle('is-open', open);
  btn.setAttribute('aria-expanded', String(open));
  if (open) {
    stopLenis();
    animateMobileDrawerOpen();
  } else {
    startLenis();
  }
});

document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
document.getElementById('modalBackdrop')?.addEventListener('click', (e) => {
  if (e.target.id === 'modalBackdrop') closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeMobileDrawer();
  }
});

// Bootstrap App
parseHashToState();
renderNavigation(state, authService, dataService, helpers);
renderFooter(helpers);
renderCurrentView(true);
