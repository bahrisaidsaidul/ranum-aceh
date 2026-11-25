import { REGIONS, CATEGORIES, REGION_IMAGES } from '../data/i18n.js';
import { ICONS } from '../utils/icons.js';
import { escapeHtml, formatIDR, getRegionCenter, makeFallbackSvg, showToast } from '../utils/helpers.js';
import { stopLenis, startLenis } from '../utils/animations.js';
import { renderHalalBadge } from './cards.js';

export function openModal(title, bodyHtml) {
  const backdrop = document.getElementById('modalBackdrop');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  backdrop.classList.add('open');
  backdrop.setAttribute('aria-hidden', 'false');
  stopLenis();
}

export function closeModal() {
  const backdrop = document.getElementById('modalBackdrop');
  backdrop.classList.remove('open');
  backdrop.setAttribute('aria-hidden', 'true');
  startLenis();
}

export function openAddToItineraryModal(destId, state, dataService, { t }) {
  const dest = state.data.destinations.find((d) => d.id === destId);
  if (!dest) return;
  let trips = dataService.getUserItineraries();
  if (!trips.length) {
    dataService.createItinerary({ tripName: 'Perjalanan Aceh Saya', duration: 3, travelers: 2 });
    trips = dataService.getUserItineraries();
  }

  const activeTrip = dataService.getActiveItinerary();
  const tripOpts = trips
    .map((tr) => `<option value="${escapeHtml(tr.id)}" ${tr.id === activeTrip.id ? 'selected' : ''}>${escapeHtml(tr.tripName)} (${tr.duration}d)</option>`)
    .join('');

  let dayOpts = '';
  for (let i = 1; i <= (activeTrip.duration || 3); i++) {
    dayOpts += `<option value="${i}">${t('day_label')}${i}</option>`;
  }

  openModal(
    t('add_itinerary'),
    `<form id="quickAddItinForm" style="display:flex;flex-direction:column;gap:14px;">
      <p style="font-size:0.92rem;color:var(--muted);"><strong>${escapeHtml(dest.name)}</strong> — ${escapeHtml(dest.region)}</p>
      <div class="field-group"><label for="qaTrip">${t('saved_trips')}</label><select class="select" id="qaTrip">${tripOpts}</select></div>
      <div class="field-group"><label for="qaDay">${t('day_label')}</label><select class="select" id="qaDay">${dayOpts}</select></div>
      <div class="field-group"><label for="qaNote">${t('activity_note')}</label><input class="input" id="qaNote" value="Kunjungan & eksplorasi ${escapeHtml(dest.name)}" required /></div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px;">
        <button type="button" class="btn btn-outline" id="qaCancel">${t('cancel_btn')}</button>
        <button type="submit" class="btn btn-primary">${t('add_itinerary')}</button>
      </div>
    </form>`
  );

  document.getElementById('qaTrip').addEventListener('change', (e) => {
    const chosen = trips.find((tr) => tr.id === e.target.value);
    if (!chosen) return;
    let opts = '';
    for (let i = 1; i <= chosen.duration; i++) opts += `<option value="${i}">${t('day_label')}${i}</option>`;
    document.getElementById('qaDay').innerHTML = opts;
  });

  document.getElementById('qaCancel').addEventListener('click', closeModal);
  document.getElementById('quickAddItinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const tripId = document.getElementById('qaTrip').value;
    const day = Number(document.getElementById('qaDay').value) || 1;
    const note = document.getElementById('qaNote').value.trim() || dest.name;
    const trip = state.data.itineraries.find((tr) => tr.id === tripId);
    if (trip) {
      trip.activities.push({ day, destinationId: dest.id, activity: note });
      dataService.recalcItineraryBudget(trip);
      state.data.preferences.activeItineraryId = trip.id;
      dataService.save();
      closeModal();
      showToast('Ditambahkan ke itinerary Anda!');
    }
  });
}

export function openInquiryModal(item, itemType, dataService, { t }, onSaved) {
  openModal(
    `${t('send_inquiry')} — ${item.name}`,
    `<form id="inquiryForm" style="display:flex;flex-direction:column;gap:14px;">
      <p style="font-size:0.9rem;color:var(--muted);">Permintaan ini akan tersimpan di riwayat akun Anda dan langsung masuk ke Portal Mitra <strong>${escapeHtml(item.name)}</strong>.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="field-group"><label>Tanggal Kunjungan / Check-in</label><input class="input" type="date" name="date" value="${new Date().toISOString().slice(0, 10)}" required /></div>
        <div class="field-group"><label>Jumlah Tamu / Porsi</label><input class="input" type="number" min="1" max="50" name="guests" value="2" required /></div>
      </div>
      <div class="field-group"><label>Catatan / Pertanyaan</label><textarea class="textarea" name="note" placeholder="Contoh: Mohon info ketersediaan kamar / pemesanan rombongan..." required></textarea></div>
      <div style="display:flex;justify-content:flex-end;gap:10px;">
        <button type="button" class="btn btn-outline" id="inqCancel">${t('cancel_btn')}</button>
        <button type="submit" class="btn btn-primary">${t('send_inquiry')}</button>
      </div>
    </form>`
  );

  document.getElementById('inqCancel').addEventListener('click', closeModal);
  document.getElementById('inquiryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    dataService.createInquiry({
      itemId: item.id,
      itemType,
      itemName: item.name,
      ownerId: item.ownerId,
      date: fd.get('date'),
      guests: fd.get('guests'),
      note: fd.get('note')
    });
    closeModal();
    showToast('Inquiry terkirim ke Mitra & tersimpan di riwayat Anda!');
    if (onSaved) onSaved();
  });
}

export function openCulinaryDetailModal(id, state, dataService, helpers) {
  const { t } = helpers;
  const c = state.data.culinary.find((x) => x.id === id);
  if (!c) return;
  const waMsg = encodeURIComponent(`Halo, saya tertarik dengan ${c.name} (${c.region}) di RANUM Aceh.`);

  openModal(
    c.name,
    `<div style="display:flex;flex-direction:column;gap:14px;">
      <img src="${escapeHtml(c.imageUrl)}" alt="${escapeHtml(c.name)}" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;" onerror="__ranumImgFallback(this, '${escapeHtml(c.name)}')" />
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <span class="badge badge-sand">${ICONS.pin} ${escapeHtml(c.region)}</span>
        <span class="badge badge-forest">${escapeHtml(c.category)}</span>
        ${renderHalalBadge(c.halalStatus, t)}
      </div>
      <p>${escapeHtml(c.description || '')}</p>
      <div style="padding:14px;background:var(--sand-light);border-radius:12px;font-size:0.9rem;">
        <div><strong>${t('est_cost')}:</strong> ${formatIDR(c.price)}</div>
        <div style="margin-top:6px;"><strong>${t('verif_source')}:</strong> ${escapeHtml(c.verificationSource || t('no_verif_source'))}</div>
      </div>
      <div class="notice-box">${t('halal_disclaimer')}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button type="button" class="btn btn-primary" style="flex:1;" id="btnCulInquiry">${t('send_inquiry')}</button>
        <a href="https://wa.me/${escapeHtml(c.contact)}?text=${waMsg}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">${ICONS.whatsapp} ${t('contact_wa')}</a>
      </div>
    </div>`
  );

  document.getElementById('btnCulInquiry')?.addEventListener('click', () => {
    openInquiryModal(c, 'culinary', dataService, helpers);
  });
}

export function openStayDetailModal(id, state, dataService, helpers) {
  const { t } = helpers;
  const s = state.data.accommodations.find((x) => x.id === id);
  if (!s) return;
  const waMsg = encodeURIComponent(`Halo, saya ingin menanyakan reservasi di ${s.name} (${s.region}) melalui RANUM Aceh.`);

  openModal(
    s.name,
    `<div style="display:flex;flex-direction:column;gap:14px;">
      <img src="${escapeHtml(s.imageUrl)}" alt="${escapeHtml(s.name)}" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;" onerror="__ranumImgFallback(this, '${escapeHtml(s.name)}')" />
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <span class="badge badge-sand">${ICONS.pin} ${escapeHtml(s.region)}</span>
        <strong style="font-size:1.2rem;color:var(--forest);">${formatIDR(s.pricePerNight)} <span style="font-size:0.82rem;font-weight:400;color:var(--muted);">${t('per_night')}</span></strong>
      </div>
      <p>${escapeHtml(s.description || '')}</p>
      <div>
        <strong style="display:block;margin-bottom:8px;color:var(--forest);">${t('muslim_facilities')}</strong>
        <div class="tag-list">${(s.muslimFriendlyFacilities || []).map((f) => `<span class="tag-chip">${ICONS.check} ${escapeHtml(f)}</span>`).join('')}</div>
      </div>
      <div>
        <strong style="display:block;margin-bottom:8px;">${t('general_facilities')}</strong>
        <div class="tag-list">${(s.facilities || []).map((f) => `<span class="tag-chip">${escapeHtml(f)}</span>`).join('')}</div>
      </div>
      <div class="notice-box">${t('stay_disclaimer')}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button type="button" class="btn btn-primary" style="flex:1;" id="btnStayInquiry">${t('send_inquiry')}</button>
        <a href="https://wa.me/${escapeHtml(s.contact)}?text=${waMsg}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">${ICONS.whatsapp} ${t('contact_wa')}</a>
      </div>
    </div>`
  );

  document.getElementById('btnStayInquiry')?.addEventListener('click', () => {
    openInquiryModal(s, 'accommodation', dataService, helpers);
  });
}

export function openPackageDetailModal(id, state, { t, catLabel }) {
  const p = state.data.packages.find((x) => x.id === id);
  if (!p) return;
  const dests = (p.destinations || []).map((did) => state.data.destinations.find((d) => d.id === did)).filter(Boolean);

  openModal(
    p.name,
    `<div style="display:flex;flex-direction:column;gap:14px;">
      <img src="${escapeHtml(p.imageUrl || makeFallbackSvg(p.name))}" alt="${escapeHtml(p.name)}" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;" onerror="__ranumImgFallback(this, '${escapeHtml(p.name)}')" />
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <span class="badge badge-forest">${p.duration} Hari</span>
        ${(p.interests || []).map((i) => `<span class="badge badge-sand">${catLabel(i)}</span>`).join('')}
      </div>
      <p>${escapeHtml(p.description)}</p>
      <div>
        <strong style="display:block;margin-bottom:8px;">Destinasi dalam Paket:</strong>
        <ul style="padding-left:18px;color:var(--muted);display:flex;flex-direction:column;gap:4px;">
          ${dests.map((d) => `<li><strong>${escapeHtml(d.name)}</strong> (${escapeHtml(d.region)})</li>`).join('')}
        </ul>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid var(--border);">
        <div>
          <div style="font-size:0.8rem;color:var(--muted);">${t('est_cost')}</div>
          <strong style="font-size:1.3rem;color:var(--forest);">${formatIDR(p.estimatedCost)}</strong>
        </div>
        <button type="button" class="btn btn-primary" data-action="use-package" data-id="${escapeHtml(p.id)}">${t('use_package')}</button>
      </div>
    </div>`
  );
}

export function openCrudFormModal({ collection, itemId = null, ownerId = null, isPartner = false, state, dataService, helpers, onSaved }) {
  const { t, catLabel } = helpers;
  const existing = itemId ? state.data[collection].find((x) => x.id === itemId) : null;
  const isEdit = Boolean(existing);
  let formFields = '';

  if (collection === 'destinations') {
    const d = existing || { name: '', region: 'Banda Aceh', category: 'nature', estimatedCost: 20000, address: '', description: '', imageUrl: '', mapsUrl: 'https://maps.google.com/', facilities: ['Parkir', 'Toilet'], prayerFacilities: ['Mushola'], featured: false };
    formFields = `
      <div class="field-group"><label>Nama Destinasi *</label><input class="input" name="name" value="${escapeHtml(d.name)}" required /></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="field-group"><label>Wilayah *</label><select class="select" name="region">${REGIONS.map((r) => `<option value="${r}" ${d.region === r ? 'selected' : ''}>${r}</option>`).join('')}</select></div>
        <div class="field-group"><label>Kategori *</label><select class="select" name="category">${CATEGORIES.map((c) => `<option value="${c}" ${d.category === c ? 'selected' : ''}>${catLabel(c)}</option>`).join('')}</select></div>
      </div>
      <div class="field-group"><label>Estimasi Biaya (IDR)</label><input class="input" type="number" min="0" name="estimatedCost" value="${d.estimatedCost || 0}" required /></div>
      <div class="field-group"><label>Alamat *</label><input class="input" name="address" value="${escapeHtml(d.address)}" required /></div>
      <div class="field-group"><label>Deskripsi *</label><textarea class="textarea" name="description" required>${escapeHtml(d.description)}</textarea></div>
      <div class="field-group"><label>URL Gambar</label><input class="input" name="imageUrl" value="${escapeHtml(d.imageUrl || '')}" placeholder="https://..." /></div>
      <div class="field-group"><label>Google Maps URL</label><input class="input" name="mapsUrl" value="${escapeHtml(d.mapsUrl || 'https://maps.google.com/')}" /></div>
      <div class="field-group"><label>Fasilitas Umum (pisahkan koma)</label><input class="input" name="facilities" value="${escapeHtml((d.facilities || []).join(', '))}" /></div>
      <div class="field-group"><label>Fasilitas Ibadah (pisahkan koma)</label><input class="input" name="prayerFacilities" value="${escapeHtml((d.prayerFacilities || []).join(', '))}" /></div>
      <label style="display:flex;align-items:center;gap:8px;font-size:0.9rem;"><input type="checkbox" name="featured" ${d.featured ? 'checked' : ''} /> Tampilkan di Featured Home</label>
    `;
  } else if (collection === 'culinary') {
    const c = existing || { name: '', category: 'traditional', region: 'Banda Aceh', price: 25000, halalStatus: isPartner ? 'pending_verification' : 'not_verified', verificationSource: '', contact: '6281200001099', description: '', imageUrl: '' };
    formFields = `
      <div class="field-group"><label>Nama Kuliner / UMKM *</label><input class="input" name="name" value="${escapeHtml(c.name)}" required /></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="field-group"><label>Wilayah *</label><select class="select" name="region">${REGIONS.map((r) => `<option value="${r}" ${c.region === r ? 'selected' : ''}>${r}</option>`).join('')}</select></div>
        <div class="field-group"><label>Kategori</label><input class="input" name="category" value="${escapeHtml(c.category)}" required /></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="field-group"><label>Harga Estimasi (IDR) *</label><input class="input" type="number" min="0" name="price" value="${c.price || 0}" required /></div>
        ${
          isPartner
            ? `<div class="field-group"><label>Status Halal</label><input class="input" value="${c.halalStatus === 'certified' ? 'Certified' : 'Pending / Menunggu Admin'}" disabled /></div>`
            : `<div class="field-group"><label>Status Halal *</label>
                <select class="select" name="halalStatus">
                  <option value="certified" ${c.halalStatus === 'certified' ? 'selected' : ''}>Certified</option>
                  <option value="pending_verification" ${c.halalStatus === 'pending_verification' ? 'selected' : ''}>Pending Verification</option>
                  <option value="not_verified" ${c.halalStatus === 'not_verified' ? 'selected' : ''}>Not Verified</option>
                </select>
              </div>`
        }
      </div>
      <div class="field-group"><label>Nomor / Referensi Sertifikat Halal</label><input class="input" name="verificationSource" value="${escapeHtml(c.verificationSource || '')}" placeholder="Contoh: BPJPH / MPU Aceh No. ID111..." /></div>
      <div class="field-group"><label>WhatsApp (format 628...)</label><input class="input" name="contact" value="${escapeHtml(c.contact || '6281200001099')}" required /></div>
      <div class="field-group"><label>Deskripsi</label><textarea class="textarea" name="description">${escapeHtml(c.description || '')}</textarea></div>
      <div class="field-group"><label>URL Gambar</label><input class="input" name="imageUrl" value="${escapeHtml(c.imageUrl || '')}" placeholder="https://..." /></div>
    `;
  } else if (collection === 'accommodations') {
    const s = existing || { name: '', region: 'Banda Aceh', pricePerNight: 350000, description: '', facilities: ['Wi-Fi', 'AC'], muslimFriendlyFacilities: ['Arah Kiblat', 'Perlengkapan Salat'], contact: '6281200002099', imageUrl: '' };
    formFields = `
      <div class="field-group"><label>Nama Penginapan *</label><input class="input" name="name" value="${escapeHtml(s.name)}" required /></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="field-group"><label>Wilayah *</label><select class="select" name="region">${REGIONS.map((r) => `<option value="${r}" ${s.region === r ? 'selected' : ''}>${r}</option>`).join('')}</select></div>
        <div class="field-group"><label>Harga / Malam (IDR) *</label><input class="input" type="number" min="0" name="pricePerNight" value="${s.pricePerNight || 0}" required /></div>
      </div>
      <div class="field-group"><label>Fasilitas Umum (pisahkan koma)</label><input class="input" name="facilities" value="${escapeHtml((s.facilities || []).join(', '))}" /></div>
      <div class="field-group"><label>Fasilitas Ramah Muslim (pisahkan koma)</label><input class="input" name="muslimFriendlyFacilities" value="${escapeHtml((s.muslimFriendlyFacilities || []).join(', '))}" /></div>
      <div class="field-group"><label>WhatsApp (format 628...)</label><input class="input" name="contact" value="${escapeHtml(s.contact || '6281200002099')}" required /></div>
      <div class="field-group"><label>Deskripsi</label><textarea class="textarea" name="description">${escapeHtml(s.description || '')}</textarea></div>
      <div class="field-group"><label>URL Gambar</label><input class="input" name="imageUrl" value="${escapeHtml(s.imageUrl || '')}" placeholder="https://..." /></div>
    `;
  } else if (collection === 'packages') {
    const p = existing || { name: '', duration: 2, estimatedCost: 850000, description: '', interests: ['nature'], destinations: [state.data.destinations[0]?.id].filter(Boolean), imageUrl: '' };
    formFields = `
      <div class="field-group"><label>Nama Paket *</label><input class="input" name="name" value="${escapeHtml(p.name)}" required /></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="field-group"><label>Durasi (1–5 Hari) *</label><input class="input" type="number" min="1" max="5" name="duration" value="${p.duration || 2}" required /></div>
        <div class="field-group"><label>Estimasi Biaya (IDR) *</label><input class="input" type="number" min="0" name="estimatedCost" value="${p.estimatedCost || 0}" required /></div>
      </div>
      <div class="field-group"><label>Minat / Kategori</label>
        <div style="display:flex;flex-wrap:wrap;gap:10px;padding:8px 0;">
          ${CATEGORIES.map((c) => `<label style="display:inline-flex;align-items:center;gap:5px;font-size:0.86rem;"><input type="checkbox" name="interests" value="${c}" ${(p.interests || []).includes(c) ? 'checked' : ''} /> ${catLabel(c)}</label>`).join('')}
        </div>
      </div>
      <div class="field-group"><label>Destinasi Termasuk</label>
        <div style="max-height:140px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:6px;">
          ${state.data.destinations.map((d) => `<label style="display:flex;align-items:center;gap:8px;font-size:0.86rem;"><input type="checkbox" name="destinations" value="${escapeHtml(d.id)}" ${(p.destinations || []).includes(d.id) ? 'checked' : ''} /> ${escapeHtml(d.name)} (${escapeHtml(d.region)})</label>`).join('')}
        </div>
      </div>
      <div class="field-group"><label>Deskripsi *</label><textarea class="textarea" name="description" required>${escapeHtml(p.description || '')}</textarea></div>
      <div class="field-group"><label>URL Gambar</label><input class="input" name="imageUrl" value="${escapeHtml(p.imageUrl || '')}" placeholder="https://..." /></div>
    `;
  }

  openModal(
    `${isEdit ? t('edit_btn') : t('add_new')} — ${collection}`,
    `<form id="crudModalForm" style="display:flex;flex-direction:column;gap:14px;">
      ${formFields}
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:8px;">
        <button type="button" class="btn btn-outline" id="crudFormCancel">${t('cancel_btn')}</button>
        <button type="submit" class="btn btn-primary">${t('save_btn')}</button>
      </div>
    </form>`
  );

  document.getElementById('crudFormCancel').addEventListener('click', closeModal);
  document.getElementById('crudModalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = (fd.get('name') || '').trim();
    if (!name) return showToast('Nama wajib diisi!', 'error');

    const splitCsv = (val) => String(val || '').split(',').map((s) => s.trim()).filter(Boolean);
    let payload = {};

    if (collection === 'destinations') {
      payload = {
        name,
        region: fd.get('region'),
        category: fd.get('category'),
        estimatedCost: Math.max(0, Number(fd.get('estimatedCost')) || 0),
        address: (fd.get('address') || '').trim(),
        description: (fd.get('description') || '').trim(),
        imageUrl: (fd.get('imageUrl') || '').trim() || REGION_IMAGES[fd.get('region')] || '',
        mapsUrl: (fd.get('mapsUrl') || '').trim() || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' Aceh')}`,
        facilities: splitCsv(fd.get('facilities')),
        prayerFacilities: splitCsv(fd.get('prayerFacilities')),
        featured: fd.get('featured') === 'on',
        lat: existing ? existing.lat : getRegionCenter(fd.get('region'))[0],
        lng: existing ? existing.lng : getRegionCenter(fd.get('region'))[1]
      };
    } else if (collection === 'culinary') {
      const source = (fd.get('verificationSource') || '').trim();
      payload = {
        ownerId: existing ? existing.ownerId : ownerId,
        name,
        region: fd.get('region'),
        category: (fd.get('category') || 'traditional').trim(),
        price: Math.max(0, Number(fd.get('price')) || 0),
        halalStatus: isPartner
          ? (existing ? existing.halalStatus : (source ? 'pending_verification' : 'not_verified'))
          : fd.get('halalStatus'),
        verificationSource: source || null,
        contact: (fd.get('contact') || '6281200001099').replace(/[^0-9]/g, ''),
        description: (fd.get('description') || '').trim(),
        imageUrl: (fd.get('imageUrl') || '').trim()
      };
    } else if (collection === 'accommodations') {
      payload = {
        ownerId: existing ? existing.ownerId : ownerId,
        name,
        region: fd.get('region'),
        pricePerNight: Math.max(0, Number(fd.get('pricePerNight')) || 0),
        facilities: splitCsv(fd.get('facilities')),
        muslimFriendlyFacilities: splitCsv(fd.get('muslimFriendlyFacilities')),
        contact: (fd.get('contact') || '6281200002099').replace(/[^0-9]/g, ''),
        description: (fd.get('description') || '').trim(),
        imageUrl: (fd.get('imageUrl') || '').trim()
      };
    } else if (collection === 'packages') {
      payload = {
        name,
        duration: Math.min(5, Math.max(1, Number(fd.get('duration')) || 1)),
        estimatedCost: Math.max(0, Number(fd.get('estimatedCost')) || 0),
        interests: fd.getAll('interests'),
        destinations: fd.getAll('destinations'),
        description: (fd.get('description') || '').trim(),
        imageUrl: (fd.get('imageUrl') || '').trim()
      };
    }

    if (isEdit) {
      dataService.update(collection, itemId, payload);
      showToast('Data berhasil diperbarui!');
    } else {
      dataService.create(collection, payload);
      showToast('Data baru berhasil ditambahkan!');
    }

    closeModal();
    if (onSaved) onSaved();
  });
}

export function openGoogleAccountPickerModal(onSelectAccount) {
  const sampleAccounts = [
    {
      googleId: 'g-1001',
      name: 'Nadia Putri',
      email: 'nadia.putri@gmail.com',
      picture: 'https://ui-avatars.com/api/?name=Nadia+Putri&background=2F4739&color=F8F7F2&size=128',
      defaultRole: 'traveler'
    },
    {
      googleId: 'g-1002',
      name: 'Kedai Kopi Gayo Seulawah',
      email: 'gayo.seulawah@gmail.com',
      picture: 'https://ui-avatars.com/api/?name=Kopi+Gayo&background=7D5317&color=F8F7F2&size=128',
      defaultRole: 'partner'
    }
  ];

  openModal(
    'Pilih Akun Google — RANUM',
    `<div style="display:flex;flex-direction:column;gap:14px;">
      <p style="font-size:0.88rem;color:var(--muted);">Pilih akun Google di bawah ini atau masukkan alamat Gmail Anda untuk masuk ke ekosistem RANUM.</p>
      <div class="field-group">
        <label for="gpRoleSelect">Masuk sebagai Peran (untuk akun baru)</label>
        <select class="select" id="gpRoleSelect">
          <option value="traveler">Wisatawan (Traveler)</option>
          <option value="partner">Mitra UMKM / Penginapan</option>
        </select>
      </div>

      <div style="display:flex;flex-direction:column;gap:10px;">
        ${sampleAccounts
          .map(
            (acc, idx) => `
          <button type="button" class="demo-role-card gp-sample-btn" data-idx="${idx}" style="width:100%;text-align:left;">
            <div style="display:flex;align-items:center;gap:12px;">
              <span class="user-avatar" style="width:38px;height:38px;"><img src="${escapeHtml(acc.picture)}" alt="${escapeHtml(acc.name)}" /></span>
              <div>
                <div style="font-weight:600;">${escapeHtml(acc.name)}</div>
                <div style="font-size:0.8rem;color:var(--muted);">${escapeHtml(acc.email)}</div>
              </div>
            </div>
            <span class="badge badge-forest">Pilih</span>
          </button>
        `
          )
          .join('')}
      </div>

      <div class="auth-divider">atau gunakan email Google lain</div>

      <form id="gpCustomForm" style="display:flex;flex-direction:column;gap:10px;">
        <input class="input" name="name" placeholder="Nama lengkap Anda" required />
        <input class="input" name="email" type="email" placeholder="namaanda@gmail.com" required />
        <button type="submit" class="btn btn-primary">Lanjutkan dengan Akun Ini</button>
      </form>
    </div>`
  );

  const roleEl = document.getElementById('gpRoleSelect');
  document.querySelectorAll('.gp-sample-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const acc = sampleAccounts[Number(btn.dataset.idx)];
      closeModal();
      onSelectAccount({ ...acc, role: roleEl.value || acc.defaultRole });
    });
  });

  document.getElementById('gpCustomForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    closeModal();
    onSelectAccount({
      googleId: 'g-custom-' + Date.now(),
      name,
      email,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2F4739&color=F8F7F2&size=128`,
      role: roleEl.value
    });
  });
}
