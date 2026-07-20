'use strict';

const CONFIG = {
  boundariesUrl: '../data/geodata/bfa_admin1.json',
  organizationUrls: [
    '../data/odf/odf-organizations.json',
    '../data/odf/organizations.json',
    '../data/odf.json'
  ],
  center: [12.35, -1.55],
  zoom: 6,
  regionField: 'ADM1_FR',
  oldRegionField: 'adm1NamOld'
};

const state = {
  map: null,
  boundaries: null,
  boundaryLayer: null,
  markerLayer: null,
  legend: null,
  organizations: [],
  filtered: [],
  selectedRegion: '',
  filters: { mode: 'points', region: '', sector: '', funded: '', partner: '' }
};

const $ = (id) => document.getElementById(id);
const ui = {
  map: $('odf-map'), mapMode: $('map-mode'), region: $('filter-region'), sector: $('filter-sector'),
  funded: $('filter-funded'), partner: $('filter-partner'), apply: $('apply-filters'), reset: $('reset-filters'),
  status: $('map-status'), activeLabel: $('active-map-label'), kpis: $('odf-kpis'), tableBody: $('odf-table-body'),
  tableSummary: $('table-summary'), coverage: $('coverage-analysis'), funding: $('funding-analysis'),
  capacity: $('capacity-analysis'), sectors: $('sector-analysis')
};

function normalize(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '').replace(/[-_/]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}
function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
function bool(value) { return ['true', 'oui', 'yes', '1', 'vrai'].includes(normalize(value)); }
function array(value) {
  if (Array.isArray(value)) return value.map(String).map(v => v.trim()).filter(Boolean);
  return value ? String(value).split(/[,;|]/).map(v => v.trim()).filter(Boolean) : [];
}
function first(obj, keys, fallback = '') {
  for (const key of keys) if (obj?.[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
  return fallback;
}
function unique(values) { return [...new Set(values.filter(Boolean))].sort((a,b) => a.localeCompare(b, 'fr')); }
function number(value) { return new Intl.NumberFormat('fr-FR').format(Number(value) || 0); }
function setStatus(message, type = 'info') { if (ui.status) { ui.status.textContent = message; ui.status.dataset.status = type; } }

const aliases = new Map([
  ['boucle du mouhoun','bankui'], ['est','goulmou'], ['sahel','liptako'], ['centre','kadiogo'],
  ['centre nord','koulse'], ['centre est','nakambe'], ['nord','yaadga']
]);
function regionKey(value) { const n = normalize(value); return aliases.get(n) || n; }
function sameRegion(a,b) { return regionKey(a) === regionKey(b); }

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${url} : HTTP ${response.status}`);
  return response.json();
}

function initMap() {
  if (!ui.map || typeof L === 'undefined') throw new Error('Leaflet ou le conteneur #odf-map est indisponible.');
  state.map = L.map('odf-map', { center: CONFIG.center, zoom: CONFIG.zoom, minZoom: 5, maxZoom: 18, preferCanvas: true });
  const light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 20, subdomains: 'abcd', attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(state.map);
  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' });
  L.control.layers({ 'Fond clair': light, 'OpenStreetMap': osm }, {}, { position: 'topright' }).addTo(state.map);
  L.control.scale({ metric: true, imperial: false }).addTo(state.map);
  setTimeout(() => state.map.invalidateSize(), 250);
  addInfoControl();
}

function addInfoControl() {
  const control = L.control({ position: 'topleft' });
  control.onAdd = () => {
    control._div = L.DomUtil.create('div', 'map-info-control');
    control._div.innerHTML = '<strong>Burkina Faso</strong><span>Survolez une région</span>';
    return control._div;
  };
  control.addTo(state.map);
  state.infoControl = control;
}
function updateInfo(region, count) {
  if (!state.infoControl?._div) return;
  state.infoControl._div.innerHTML = region
    ? `<strong>${escapeHtml(region)}</strong><span>${number(count)} ODF</span>`
    : '<strong>Burkina Faso</strong><span>Survolez une région</span>';
}

function normalizeOrganization(raw, index) {
  const coordinates = raw?.geometry?.type === 'Point' ? raw.geometry.coordinates : [];
  const props = raw?.properties ? { ...raw.properties } : raw;
  return {
    id: first(props, ['id','ID','code'], `odf-${index+1}`),
    name: String(first(props, ['organisation','organization','name','nom','acronyme'], `Organisation ${index+1}`)).trim(),
    region: String(first(props, ['region','région','Region','REGION','admin1','adm1','ADM1_FR'])).trim(),
    commune: String(first(props, ['commune','Commune','ville','localite','localité'])).trim(),
    sectors: array(first(props, ['secteurs','sectors','sector','secteur','domaines_intervention'], [])),
    funded: bool(first(props, ['financement','funded','financement_recent','recent_funding'], false)),
    partner: bool(first(props, ['partenaire','partner','partenariat_humanitaire'], false)),
    capacity: String(first(props, ['capacite','capacité','capacity','niveau_capacite'], 'Non renseigné')),
    latitude: Number(first(props, ['latitude','lat','Latitude'], coordinates[1])),
    longitude: Number(first(props, ['longitude','lon','lng','Longitude'], coordinates[0]))
  };
}
function hasCoordinates(o) { return Number.isFinite(o.latitude) && Number.isFinite(o.longitude) && Math.abs(o.latitude) <= 90 && Math.abs(o.longitude) <= 180; }

async function loadData() {
  setStatus('Chargement des limites administratives…');
  state.boundaries = await fetchJson(CONFIG.boundariesUrl);
  if (state.boundaries?.type !== 'FeatureCollection' || !Array.isArray(state.boundaries.features)) {
    throw new Error('bfa_admin1.json n’est pas un GeoJSON FeatureCollection valide.');
  }
  let orgData = null;
  for (const url of CONFIG.organizationUrls) {
    try { orgData = await fetchJson(url); break; } catch (error) { console.warn(error.message); }
  }
  if (orgData) {
    const rows = Array.isArray(orgData) ? orgData : orgData.organizations || orgData.organisations || orgData.features || [];
    state.organizations = rows.map(normalizeOrganization);
  } else {
    state.organizations = [];
    setStatus('Carte chargée. Fichier des ODF non trouvé : ajoutez data/odf/odf-organizations.json.', 'warning');
  }
  state.filtered = [...state.organizations];
}

function geoRegion(feature) { return String(feature?.properties?.[CONFIG.regionField] || feature?.properties?.[CONFIG.oldRegionField] || '').trim(); }
function oldRegion(feature) { return String(feature?.properties?.[CONFIG.oldRegionField] || '').trim(); }
function getCounts() {
  const counts = new Map(state.boundaries.features.map(f => [geoRegion(f), 0]));
  for (const org of state.filtered) {
    const region = [...counts.keys()].find(r => sameRegion(r, org.region)) || org.region;
    counts.set(region, (counts.get(region) || 0) + 1);
  }
  return counts;
}
function regionCount(name) {
  for (const [region, count] of getCounts()) if (sameRegion(region, name)) return count;
  return 0;
}
function color(count) {
  return count > 20 ? '#0b4f79' : count > 10 ? '#1683d8' : count > 5 ? '#58a9d8' : count > 2 ? '#9fd1ed' : count > 0 ? '#d8ecf8' : '#e8edf1';
}
function styleFeature(feature) {
  const name = geoRegion(feature), selected = state.selectedRegion && sameRegion(name, state.selectedRegion);
  return {
    color: selected ? '#0b304a' : '#61717f', weight: selected ? 3 : 1.2, opacity: 1,
    fillColor: state.filters.mode === 'choropleth' ? color(regionCount(name)) : '#e6f2f9',
    fillOpacity: selected ? .9 : state.filters.mode === 'choropleth' ? .82 : .4
  };
}

function renderBoundaries({ fit = true } = {}) {
  if (state.boundaryLayer) state.map.removeLayer(state.boundaryLayer);
  state.boundaryLayer = L.geoJSON(state.boundaries, {
    style: styleFeature,
    onEachFeature(feature, layer) {
      const name = geoRegion(feature), old = oldRegion(feature), count = regionCount(name);
      layer.bindTooltip(`<strong>${escapeHtml(name)}</strong>${old ? `<br><span>Ancienne région : ${escapeHtml(old)}</span>` : ''}<br>${number(count)} ODF`, { sticky: true });
      layer.bindPopup(`<div class="region-popup"><h3>${escapeHtml(name)}</h3>${old ? `<p>Ancienne dénomination : ${escapeHtml(old)}</p>` : ''}<div class="popup-stat"><span>ODF recensées</span><strong>${number(count)}</strong></div><button class="popup-filter-button" data-region="${escapeHtml(name)}">Filtrer cette région</button></div>`);
      layer.on({
        mouseover(e) { e.target.setStyle({ weight: 3, color: '#0b304a', fillOpacity: .95 }); e.target.bringToFront(); updateInfo(name, count); },
        mouseout(e) { state.boundaryLayer.resetStyle(e.target); updateInfo(); },
        click(e) { selectRegion(name, e.target); }
      });
    }
  }).addTo(state.map);
  const bounds = state.boundaryLayer.getBounds();
  if (fit && bounds.isValid()) state.map.fitBounds(bounds, { padding: [18,18] });
}

function selectRegion(name, layer) {
  state.selectedRegion = name;
  const option = [...ui.region.options].find(o => sameRegion(o.value, name));
  if (option) ui.region.value = option.value;
  readFilters(); filterData(); refresh({ fit: false });
  if (layer?.getBounds) state.map.fitBounds(layer.getBounds(), { padding: [30,30], maxZoom: 9 });
}

function renderMarkers() {
  if (state.markerLayer) state.map.removeLayer(state.markerLayer);
  state.markerLayer = L.layerGroup();
  if (state.filters.mode !== 'points') return;
  for (const org of state.filtered.filter(hasCoordinates)) {
    const marker = L.circleMarker([org.latitude, org.longitude], {
      radius: 6, color: '#fff', weight: 2, fillColor: '#5a2a84', fillOpacity: .95
    });
    marker.bindTooltip(escapeHtml(org.name), { direction: 'top' });
    marker.bindPopup(`<div class="organization-popup"><p class="popup-eyebrow">Organisation dirigée par des femmes</p><h3>${escapeHtml(org.name)}</h3><dl><div><dt>Région</dt><dd>${escapeHtml(org.region || 'Non renseignée')}</dd></div><div><dt>Commune</dt><dd>${escapeHtml(org.commune || 'Non renseignée')}</dd></div><div><dt>Secteurs</dt><dd>${escapeHtml(org.sectors.join(', ') || 'Non renseigné')}</dd></div><div><dt>Financement</dt><dd>${org.funded ? 'Oui' : 'Non'}</dd></div><div><dt>Partenaire</dt><dd>${org.partner ? 'Oui' : 'Non'}</dd></div></dl></div>`);
    marker.addTo(state.markerLayer);
  }
  state.markerLayer.addTo(state.map);
}

function renderLegend() {
  if (state.legend) state.map.removeControl(state.legend);
  state.legend = L.control({ position: 'bottomright' });
  state.legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'map-legend');
    if (state.filters.mode === 'points') {
      div.innerHTML = '<h4>Légende</h4><div class="legend-row"><span class="legend-point"></span><span>ODF géolocalisée</span></div><div class="legend-row"><span class="legend-area"></span><span>Région</span></div>';
    } else {
      const rows = [['0','#e8edf1'],['1–2','#d8ecf8'],['3–5','#9fd1ed'],['6–10','#58a9d8'],['11–20','#1683d8'],['21+','#0b4f79']];
      div.innerHTML = `<h4>Nombre d’ODF</h4>${rows.map(([l,c]) => `<div class="legend-row"><span class="legend-swatch" style="background:${c}"></span><span>${l}</span></div>`).join('')}`;
    }
    L.DomEvent.disableClickPropagation(div); return div;
  };
  state.legend.addTo(state.map);
}

function populateSelect(select, values, label) {
  select.innerHTML = `<option value="">${label}</option>` + values.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
}
function populateFilters() {
  populateSelect(ui.region, unique([...state.boundaries.features.map(geoRegion), ...state.organizations.map(o => o.region)]), 'Toutes les régions');
  populateSelect(ui.sector, unique(state.organizations.flatMap(o => o.sectors)), 'Tous les secteurs');
}
function readFilters() {
  state.filters = { mode: ui.mapMode.value, region: ui.region.value, sector: ui.sector.value, funded: ui.funded.value, partner: ui.partner.value };
  state.selectedRegion = state.filters.region;
}
function filterData() {
  state.filtered = state.organizations.filter(o =>
    (!state.filters.region || sameRegion(o.region, state.filters.region)) &&
    (!state.filters.sector || o.sectors.some(s => normalize(s) === normalize(state.filters.sector))) &&
    (state.filters.funded === '' || o.funded === (state.filters.funded === 'true')) &&
    (state.filters.partner === '' || o.partner === (state.filters.partner === 'true'))
  );
}

function renderKpis() {
  const total = state.filtered.length, funded = state.filtered.filter(o => o.funded).length,
    partners = state.filtered.filter(o => o.partner).length, geolocated = state.filtered.filter(hasCoordinates).length,
    regions = unique(state.filtered.map(o => o.region)).length;
  const cards = [
    ['ODF correspondant aux filtres', total, `${geolocated} géolocalisée(s)`], ['Régions couvertes', regions, 'Présence territoriale'],
    ['ODF récemment financées', funded, total ? `${Math.round(funded/total*100)} %` : '0 %'],
    ['Partenaires humanitaires', partners, total ? `${Math.round(partners/total*100)} %` : '0 %']
  ];
  ui.kpis.innerHTML = cards.map(([l,v,d]) => `<article class="kpi-card"><span class="kpi-label">${l}</span><strong class="kpi-value">${number(v)}</strong><span class="kpi-detail">${d}</span></article>`).join('');
}
function list(el, items) { el.innerHTML = items.map(v => `<li>${escapeHtml(v)}</li>`).join(''); }
function renderAnalyses() {
  const counts = [...getCounts()].sort((a,b) => b[1]-a[1]), covered = counts.filter(x => x[1] > 0), blank = counts.filter(x => x[1] === 0);
  list(ui.coverage, [covered[0] ? `${covered[0][0]} présente le plus grand nombre d’ODF (${number(covered[0][1])}).` : 'Aucune ODF ne correspond aux filtres.', `${covered.length} région(s) couverte(s).`, `${blank.length} région(s) sans ODF visible.`]);
  const funded = state.filtered.filter(o => o.funded).length, partners = state.filtered.filter(o => o.partner).length;
  list(ui.funding, [`${funded} ODF avec financement récent.`, `${partners} ODF partenaires humanitaires.`, `${state.filtered.filter(o => o.funded && o.partner).length} cumulent les deux statuts.`]);
  const capacities = new Map(); state.filtered.forEach(o => capacities.set(o.capacity, (capacities.get(o.capacity)||0)+1));
  list(ui.capacity, [...capacities].sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v]) => `${k} : ${v} organisation(s).`).concat(capacities.size ? [] : ['Aucune donnée de capacité disponible.']));
  const sectors = new Map(); state.filtered.forEach(o => o.sectors.forEach(s => sectors.set(s,(sectors.get(s)||0)+1)));
  list(ui.sectors, [...sectors].sort((a,b)=>b[1]-a[1]).slice(0,4).map(([k,v]) => `${k} : ${v} organisation(s).`).concat(sectors.size ? [] : ['Aucun secteur renseigné.']));
}
function renderTable() {
  const rows = [...state.filtered].sort((a,b)=>a.name.localeCompare(b.name,'fr'));
  ui.tableBody.innerHTML = rows.length ? rows.map(o => `<tr><td><strong>${escapeHtml(o.name)}</strong></td><td>${escapeHtml(o.region||'Non renseignée')}</td><td>${escapeHtml(o.commune||'Non renseignée')}</td><td>${escapeHtml(o.sectors.join(', ')||'Non renseigné')}</td><td><span class="status-badge ${o.funded?'status-yes':'status-no'}">${o.funded?'Oui':'Non'}</span></td><td><span class="status-badge ${o.partner?'status-yes':'status-no'}">${o.partner?'Oui':'Non'}</span></td></tr>`).join('') : '<tr><td colspan="6" class="table-empty">Aucune organisation ne correspond aux filtres.</td></tr>';
  ui.tableSummary.textContent = `${number(rows.length)} organisation(s) affichée(s).`;
}
function refresh({ fit = true } = {}) {
  renderBoundaries({ fit }); renderMarkers(); renderLegend(); renderKpis(); renderAnalyses(); renderTable();
  ui.activeLabel.textContent = ui.mapMode.options[ui.mapMode.selectedIndex]?.textContent.trim() || 'Cartographie des ODF';
  const points = state.filtered.filter(hasCoordinates).length;
  setStatus(state.filters.mode === 'points' ? `${number(points)} point(s) géolocalisé(s).` : `${number(state.filtered.length)} ODF agrégée(s) par région.`, 'success');
  state.map.invalidateSize();
}
function applyFilters() { readFilters(); filterData(); refresh(); }
function resetFilters() { ui.mapMode.value='points'; ui.region.value=''; ui.sector.value=''; ui.funded.value=''; ui.partner.value=''; state.selectedRegion=''; applyFilters(); }
function bindEvents() {
  ui.apply.addEventListener('click', applyFilters); ui.reset.addEventListener('click', resetFilters);
  [ui.mapMode, ui.region, ui.sector, ui.funded, ui.partner].forEach(el => el.addEventListener('change', applyFilters));
  document.addEventListener('click', e => {
    const button = e.target.closest('.popup-filter-button'); if (!button) return;
    const option = [...ui.region.options].find(o => sameRegion(o.value, button.dataset.region));
    if (option) ui.region.value = option.value; applyFilters(); state.map.closePopup();
  });
  window.addEventListener('resize', () => state.map.invalidateSize());
}

async function start() {
  try { initMap(); await loadData(); populateFilters(); bindEvents(); readFilters(); filterData(); refresh(); }
  catch (error) {
    console.error(error); setStatus(error.message, 'error');
    if (ui.map) ui.map.innerHTML = `<div class="map-error"><strong>La carte ne peut pas être affichée.</strong><p>${escapeHtml(error.message)}</p></div>`;
  }
}
document.addEventListener('DOMContentLoaded', start);
