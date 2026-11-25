import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CATEGORY_COLORS, CATEGORIES } from '../data/i18n.js';
import { ICONS } from './icons.js';
import { escapeHtml, getRegionCenter } from './helpers.js';

let mainLeafletMap = null;
let mainTileLayer = null;

export function renderGoogleMapIframe(dest, heightPx = 440, satellite = false) {
  const fallback = dest ? getRegionCenter(dest.region) : [5.22, 96.05];
  const lat = (dest && Number(dest.lat)) || fallback[0];
  const lng = (dest && Number(dest.lng)) || fallback[1];
  const zoom = dest ? (satellite ? 14 : 13) : 8;
  const mapType = satellite ? '&t=k' : '';
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}${mapType}&hl=id&output=embed`;
  return `<iframe title="Google Maps ${escapeHtml(dest ? dest.name : 'Aceh')}" src="${src}" style="border:0;width:100%;height:100%;min-height:${heightPx}px;display:block;border-radius:12px;" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
}

export function updateMapInfoPanelHtml(dest, { t, catLabel, destDesc }) {
  if (!dest) return `<p>${t('empty_title')}</p>`;
  const coords = dest.lat && dest.lng ? `${Number(dest.lat).toFixed(4)}, ${Number(dest.lng).toFixed(4)}` : 'Aceh';
  return `
    <div class="map-info-img-wrap">
      <img src="${escapeHtml(dest.imageUrl)}" alt="${escapeHtml(dest.name)}" onerror="__ranumImgFallback(this, '${escapeHtml(dest.name)}')" />
    </div>
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
      <span class="badge badge-forest">${escapeHtml(catLabel(dest.category))}</span>
      <span class="badge badge-sand">${ICONS.pin} ${escapeHtml(dest.region)}</span>
    </div>
    <h3 style="font-size:1.45rem;">${escapeHtml(dest.name)}</h3>
    <p style="font-size:0.9rem;color:var(--muted);">${escapeHtml(destDesc(dest))}</p>
    <p style="font-size:0.82rem;color:var(--muted);"><strong>${t('address_label')}:</strong> ${escapeHtml(dest.address)}<br/><span style="color:var(--sage);">GPS: ${escapeHtml(coords)}</span></p>
    <div style="display:flex;flex-direction:column;gap:8px;margin-top:auto;">
      <button type="button" class="btn btn-primary" data-action="open-dest" data-id="${escapeHtml(dest.id)}">${t('detail_btn')} ${ICONS.arrowRight}</button>
      <a href="${escapeHtml(dest.mapsUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">${t('open_maps')} ${ICONS.external}</a>
    </div>
  `;
}

export function renderAcehMapSection(state, helpers) {
  const { t, catLabel } = helpers;
  const list = state.data.destinations;
  let activeDest = list.find((d) => d.id === state.selectedMapDestId) || list[0];
  if (activeDest) state.selectedMapDestId = activeDest.id;

  const isGoogle = state.mapLayer === 'google';
  const isSat = state.googleMapType === 'satellite';
  const initialMapHtml = isGoogle ? renderGoogleMapIframe(activeDest, 320, isSat) : '';

  return `
    <div class="map-layout">
      <div class="map-canvas-wrap">
        <div class="map-toolbar">
          <span class="badge badge-forest">Aceh, Indonesia · ${list.length} Lokasi Asli</span>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            ${
              isGoogle
                ? `<select class="select" id="googleMapTypeSelect" aria-label="Tipe Google Maps" style="width:auto;min-height:32px;padding:4px 12px;font-size:0.78rem;border-radius:999px;">
                    <option value="roadmap" ${!isSat ? 'selected' : ''}>Tampilan: Peta Jalan</option>
                    <option value="satellite" ${isSat ? 'selected' : ''}>Tampilan: Satelit</option>
                  </select>`
                : ''
            }
            <div class="map-style-toggle" role="group" aria-label="Map Mode">
              <button type="button" class="map-style-btn ${state.mapLayer === 'leaflet' ? 'active' : ''}" data-action="switch-map-layer" data-layer="leaflet">Peta Pin</button>
              <button type="button" class="map-style-btn ${state.mapLayer === 'google' ? 'active' : ''}" data-action="switch-map-layer" data-layer="google">Google Maps</button>
            </div>
          </div>
        </div>

        <div id="acehLeafletMap" class="leaflet-map-box" data-lenis-prevent role="region" aria-label="Real Interactive Map of Aceh">${initialMapHtml}</div>

        <div class="map-quick-pills" id="mapQuickPills">
          ${list
            .map(
              (d) => `
            <button type="button" class="btn btn-outline btn-sm" style="padding:5px 11px;font-size:0.78rem;${activeDest && d.id === activeDest.id ? 'border-color:var(--forest);background:var(--sand);color:var(--forest);font-weight:600;' : ''}" data-action="focus-map-dest" data-id="${escapeHtml(d.id)}">
              ${escapeHtml(d.name)}
            </button>
          `
            )
            .join('')}
        </div>

        <div class="map-legend">
          ${CATEGORIES.map(
            (c) => `
            <span class="legend-item">
              <span class="legend-dot" style="background:${CATEGORY_COLORS[c]}"></span>
              ${escapeHtml(catLabel(c))}
            </span>
          `
          ).join('')}
        </div>
        <p style="font-size:0.76rem;color:var(--muted);">* ${t('map_disclaimer')}</p>
      </div>

      <div class="map-info-panel" id="mapInfoPanel">
        ${updateMapInfoPanelHtml(activeDest, helpers)}
      </div>
    </div>
  `;
}

export function initMaps(state, helpers) {
  if (mainLeafletMap) {
    try { mainLeafletMap.remove(); } catch (_) {}
    mainLeafletMap = null;
    mainTileLayer = null;
  }

  const activeDest = state.data.destinations.find((d) => d.id === state.selectedMapDestId) || state.data.destinations[0];
  const mainEl = document.getElementById('acehLeafletMap');

  if (mainEl) {
    if (state.mapLayer === 'google') {
      mainEl.innerHTML = renderGoogleMapIframe(activeDest, 320, state.googleMapType === 'satellite');
    } else {
      mainEl.innerHTML = '';
      mainLeafletMap = L.map(mainEl, {
        center: [5.22, 96.05],
        zoom: 8,
        scrollWheelZoom: true
      });

      const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      });

      const esriSatLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: '© Esri World Imagery', maxZoom: 18 }
      );

      const esriStreetLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        { attribution: '© Esri World Street Map', maxZoom: 18 }
      );

      mainTileLayer = osmLayer.addTo(mainLeafletMap);

      L.control
        .layers(
          {
            'Peta Jalan (OSM)': osmLayer,
            'Satelit (Esri)': esriSatLayer,
            'Peta Detail (Esri)': esriStreetLayer
          },
          null,
          { position: 'topright', collapsed: window.innerWidth <= 768 }
        )
        .addTo(mainLeafletMap);

      const markers = [];
      state.data.destinations.forEach((d) => {
        const fb = getRegionCenter(d.region);
        const lat = Number(d.lat) || fb[0];
        const lng = Number(d.lng) || fb[1];
        const color = CATEGORY_COLORS[d.category] || '#2F4739';

        const marker = L.circleMarker([lat, lng], {
          radius: d.id === state.selectedMapDestId ? 10 : 8,
          fillColor: color,
          color: '#FFFFFF',
          weight: 2.5,
          opacity: 1,
          fillOpacity: 0.95
        }).addTo(mainLeafletMap);

        marker.bindPopup(`
          <div style="min-width:170px;">
            <strong style="font-size:0.95rem;color:#272E29;">${escapeHtml(d.name)}</strong><br/>
            <span style="font-size:0.78rem;color:#656E67;">${escapeHtml(d.region)} · ${escapeHtml(helpers.catLabel(d.category))}</span>
          </div>
        `);

        marker.on('click', () => {
          state.selectedMapDestId = d.id;
          const panel = document.getElementById('mapInfoPanel');
          if (panel) panel.innerHTML = updateMapInfoPanelHtml(d, helpers);
          mainLeafletMap.flyTo([lat, lng], 12, { duration: 0.85 });
        });

        markers.push(marker);
      });

      setTimeout(() => {
        if (!mainLeafletMap) return;
        mainLeafletMap.invalidateSize(true);
        if (markers.length) {
          mainLeafletMap.fitBounds(L.featureGroup(markers).getBounds().pad(0.14), { animate: false });
        }
      }, 150);
    }
  }

  const detailEl = document.getElementById('detailLeafletMap');
  if (detailEl) {
    const d = state.data.destinations.find((x) => x.id === state.detailId);
    if (d) {
      detailEl.innerHTML = renderGoogleMapIframe(d, 240, false);
    }
  }
}

export function flyToDestinationOnMap(dest) {
  if (mainLeafletMap && dest) {
    const fb = getRegionCenter(dest.region);
    mainLeafletMap.flyTo([Number(dest.lat) || fb[0], Number(dest.lng) || fb[1]], 13, { duration: 0.85 });
  }
}
