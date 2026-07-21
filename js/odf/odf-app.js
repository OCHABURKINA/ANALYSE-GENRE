'use strict';

/**
 * ANALYSE-GENRE — Cartographie des ODF
 * Fichier : js/odf/odf-app.js
 *
 * Dépendances :
 * - Leaflet 1.9.4 chargé dans odf.html
 * - data/geodata/bfa_admin1.json
 * - data/odf/odf-organizations.json
 */

const CONFIG = Object.freeze({
  boundariesUrl: '../data/geodata/bfa_admin1.json',
  organizationsUrl: '../data/odf/odf-organizations.json',

  center: [12.35, -1.55],
  zoom: 6,
  minZoom: 5,
  maxZoom: 18,

  regionFields: [
    'ADM1_FR',
    'adm1NamNew',
    'ADM1_NAME',
    'NAME_1',
    'shapeName',
    'name'
  ],

  oldRegionFields: [
    'adm1NamOld',
    'ADM1_OLD',
    'OLD_NAME'
  ]
});

const state = {
  map: null,
  boundaries: null,
  boundaryLayer: null,
  markerLayer: null,
  legendControl: null,
  infoControl: null,

  organizations: [],
  filteredOrganizations: [],

  selectedRegion: '',
  filters: {
    mode: 'points',
    region: '',
    sector: '',
    funded: '',
    partner: ''
  },

  regionCounts: new Map()
};

const byId = (id) => document.getElementById(id);

const ui = {
  map: byId('odf-map'),
  form: byId('odf-filter-form'),
  mapMode: byId('map-mode'),
  region: byId('filter-region'),
  sector: byId('filter-sector'),
  funded: byId('filter-funded'),
  partner: byId('filter-partner'),
  reset: byId('reset-filters'),

  status: byId('map-status'),
  activeLabel: byId('active-map-label'),

  kpis: byId('odf-kpis'),
  tableBody: byId('odf-table-body'),
  tableSummary: byId('table-summary'),

  coverage: byId('coverage-analysis'),
  funding: byId('funding-analysis'),
  capacity: byId('capacity-analysis'),
  sectors: byId('sector-analysis')
};

/* ==========================================================================
   Utilitaires
   ========================================================================== */

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .replace(/[-_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function firstDefined(object, keys, fallback = '') {
  for (const key of keys) {
    const value = object?.[key];

    if (
      value !== undefined &&
      value !== null &&
      !(typeof value === 'string' && value.trim() === '')
    ) {
      return value;
    }
  }

  return fallback;
}

function toBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;

  return [
    'true',
    'oui',
    'yes',
    '1',
    'vrai',
    'y'
  ].includes(normalizeText(value));
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (value === undefined || value === null || value === '') {
    return [];
  }

  return String(value)
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toCoordinate(value) {
  if (value === undefined || value === null || value === '') return null;

  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
}

function formatNumber(value) {
  return new Intl.NumberFormat('fr-FR').format(Number(value) || 0);
}

function formatPercent(part, total) {
  return total > 0 ? `${Math.round((part / total) * 100)} %` : '0 %';
}

function setStatus(message, type = 'info') {
  if (!ui.status) return;

  ui.status.textContent = message;
  ui.status.dataset.status = type;
}

function requireElements() {
  const required = {
    'odf-map': ui.map,
    'odf-filter-form': ui.form,
    'map-mode': ui.mapMode,
    'filter-region': ui.region,
    'filter-sector': ui.sector,
    'filter-funded': ui.funded,
    'filter-partner': ui.partner,
    'reset-filters': ui.reset,
    'odf-kpis': ui.kpis,
    'odf-table-body': ui.tableBody
  };

  const missing = Object.entries(required)
    .filter(([, element]) => !element)
    .map(([id]) => `#${id}`);

  if (missing.length) {
    throw new Error(
      `Éléments HTML manquants : ${missing.join(', ')}.`
    );
  }
}

/* ==========================================================================
   Harmonisation des régions
   ========================================================================== */

/**
 * Les données ODF emploient « Kuilsé », tandis que le GeoJSON emploie
 * « Koulsé ». Cette table harmonise cette variante ainsi que les anciennes
 * dénominations encore susceptibles d'apparaître dans certaines bases.
 *
 * Les anciennes régions Est, Sahel et Boucle du Mouhoun ont été subdivisées.
 * Elles ne sont donc pas converties automatiquement vers une seule nouvelle
 * région, afin d'éviter une affectation géographique erronée.
 */
const REGION_ALIASES = new Map([
  ['kuilse', 'koulse'],
  ['koulse', 'koulse'],

  ['centre', 'kadiogo'],
  ['centre nord', 'koulse'],
  ['centre est', 'nakambe'],
  ['centre ouest', 'nando'],
  ['centre sud', 'nazinon'],
  ['hauts bassins', 'guiriko'],
  ['nord', 'yaadga'],
  ['plateau central', 'oubri'],
  ['sud ouest', 'djôrô'],
  ['cascades', 'tannounyan']
]);

function regionKey(value) {
  const normalized = normalizeText(value);
  return REGION_ALIASES.get(normalized) || normalized;
}

function sameRegion(regionA, regionB) {
  return regionKey(regionA) === regionKey(regionB);
}

/* ==========================================================================
   Chargement des données
   ========================================================================== */

async function fetchJson(url) {
  const cacheBuster = url.includes('?') ? '&' : '?';
  const response = await fetch(
    `${url}${cacheBuster}v=${Date.now()}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    throw new Error(`${url} — erreur HTTP ${response.status}`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error(`${url} ne contient pas un JSON valide.`);
  }
}

function getFeatureRegion(feature) {
  const properties = feature?.properties || {};

  return String(
    firstDefined(properties, CONFIG.regionFields, '')
  ).trim();
}

function getFeatureOldRegion(feature) {
  const properties = feature?.properties || {};

  return String(
    firstDefined(properties, CONFIG.oldRegionFields, '')
  ).trim();
}

function validateBoundaries(data) {
  if (
    data?.type !== 'FeatureCollection' ||
    !Array.isArray(data.features) ||
    data.features.length === 0
  ) {
    throw new Error(
      'bfa_admin1.json doit être un GeoJSON FeatureCollection non vide.'
    );
  }

  const featuresWithoutName = data.features.filter(
    (feature) => !getFeatureRegion(feature)
  );

  if (featuresWithoutName.length) {
    console.warn(
      `${featuresWithoutName.length} entité(s) du GeoJSON ne possèdent pas de nom de région reconnu.`
    );
  }
}

function normalizeOrganization(raw, index) {
  const geometryCoordinates =
    raw?.geometry?.type === 'Point' &&
    Array.isArray(raw.geometry.coordinates)
      ? raw.geometry.coordinates
      : [];

  const properties = raw?.properties
    ? { ...raw.properties }
    : raw;

  const regions = toArray(
    firstDefined(properties, ['regions', 'zones_intervention'], [])
  );

  const principalRegion = String(
    firstDefined(
      properties,
      [
        'region',
        'région',
        'Region',
        'REGION',
        'admin1',
        'adm1',
        'ADM1_FR'
      ],
      regions[0] || ''
    )
  ).trim();

  return {
    id: String(
      firstDefined(
        properties,
        ['id', 'ID', 'code', 'organisation_id'],
        `ODF-${String(index + 1).padStart(3, '0')}`
      )
    ).trim(),

    name: String(
      firstDefined(
        properties,
        [
          'organisation',
          'organization',
          'name',
          'nom',
          'nom_organisation',
          'acronyme'
        ],
        `Organisation ${index + 1}`
      )
    ).trim(),

    region: principalRegion,
    regions: regions.length ? regions : (principalRegion ? [principalRegion] : []),

    commune: String(
      firstDefined(
        properties,
        [
          'commune',
          'Commune',
          'ville',
          'localite',
          'localité'
        ],
        ''
      )
    ).trim(),

    address: String(
      firstDefined(
        properties,
        ['adresse_generale', 'adresse', 'address'],
        ''
      )
    ).trim(),

    sectors: toArray(
      firstDefined(
        properties,
        [
          'secteurs',
          'sectors',
          'sector',
          'secteur',
          'domaines_intervention',
          'domaines'
        ],
        []
      )
    ),

    funded: toBoolean(
      firstDefined(
        properties,
        [
          'financement_recent',
          'financement',
          'funded',
          'recent_funding'
        ],
        false
      )
    ),

    partner: toBoolean(
      firstDefined(
        properties,
        [
          'partenariat_humanitaire',
          'partenaire',
          'partner',
          'intervient_reponse_humanitaire',
          'participation_coordination'
        ],
        false
      )
    ),

    humanitarianResponse: toBoolean(
      firstDefined(
        properties,
        ['intervient_reponse_humanitaire'],
        false
      )
    ),

    coordination: toBoolean(
      firstDefined(
        properties,
        ['participation_coordination'],
        false
      )
    ),

    capacity: String(
      firstDefined(
        properties,
        [
          'capacite',
          'capacité',
          'capacity',
          'niveau_capacite'
        ],
        'Non renseigné'
      )
    ).trim(),

    latitude: toCoordinate(
      firstDefined(
        properties,
        ['latitude', 'lat', 'Latitude'],
        geometryCoordinates[1]
      )
    ),

    longitude: toCoordinate(
      firstDefined(
        properties,
        ['longitude', 'lon', 'lng', 'Longitude'],
        geometryCoordinates[0]
      )
    ),

    geolocationMethod: String(
      firstDefined(
        properties,
        ['geolocalisation', 'geolocation_method'],
        ''
      )
    ).trim()
  };
}

function validateOrganizations(rows) {
  if (!Array.isArray(rows)) {
    throw new Error(
      'odf-organizations.json doit contenir un tableau JSON.'
    );
  }

  if (rows.length === 0) {
    throw new Error(
      'odf-organizations.json est vide.'
    );
  }

  const normalized = rows.map(normalizeOrganization);

  const namedOrganizations = normalized.filter(
    (organization) => organization.name
  );

  if (namedOrganizations.length === 0) {
    throw new Error(
      'Aucun nom d’organisation valide n’a été trouvé dans le fichier JSON.'
    );
  }

  return normalized;
}

async function loadData() {
  setStatus('Chargement des limites administratives…');

  const [boundaries, organizationData] = await Promise.all([
    fetchJson(CONFIG.boundariesUrl),
    fetchJson(CONFIG.organizationsUrl)
  ]);

  validateBoundaries(boundaries);

  const organizationRows = Array.isArray(organizationData)
    ? organizationData
    : (
        organizationData?.organizations ||
        organizationData?.organisations ||
        organizationData?.features ||
        []
      );

  state.boundaries = boundaries;
  state.organizations = validateOrganizations(organizationRows);
  state.filteredOrganizations = [...state.organizations];

  console.info(
    `[ODF] ${state.organizations.length} organisations chargées.`
  );
}

/* ==========================================================================
   Carte Leaflet
   ========================================================================== */

function initMap() {
  if (typeof L === 'undefined') {
    throw new Error(
      'Leaflet n’est pas chargé. Vérifiez les balises Leaflet dans odf.html.'
    );
  }

  state.map = L.map(ui.map, {
    center: CONFIG.center,
    zoom: CONFIG.zoom,
    minZoom: CONFIG.minZoom,
    maxZoom: CONFIG.maxZoom,
    preferCanvas: true,
    zoomControl: true
  });

  const lightLayer = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    {
      maxZoom: 20,
      subdomains: 'abcd',
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }
  ).addTo(state.map);

  const osmLayer = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }
  );

  L.control.layers(
    {
      'Fond clair': lightLayer,
      'OpenStreetMap': osmLayer
    },
    {},
    {
      position: 'topright',
      collapsed: true
    }
  ).addTo(state.map);

  L.control.scale({
    metric: true,
    imperial: false,
    position: 'bottomleft'
  }).addTo(state.map);

  addInfoControl();

  window.setTimeout(() => {
    state.map.invalidateSize();
  }, 250);
}

function addInfoControl() {
  const control = L.control({ position: 'topleft' });

  control.onAdd = () => {
    control._div = L.DomUtil.create(
      'div',
      'map-info-control'
    );

    control._div.innerHTML =
      '<strong>Burkina Faso</strong>' +
      '<span>Survolez une région</span>';

    return control._div;
  };

  control.addTo(state.map);
  state.infoControl = control;
}

function updateInfoControl(region = '', count = 0) {
  const container = state.infoControl?._div;
  if (!container) return;

  container.innerHTML = region
    ? (
        `<strong>${escapeHtml(region)}</strong>` +
        `<span>${formatNumber(count)} ODF</span>`
      )
    : (
        '<strong>Burkina Faso</strong>' +
        '<span>Survolez une région</span>'
      );
}

function hasValidCoordinates(organization) {
  return (
    Number.isFinite(organization.latitude) &&
    Number.isFinite(organization.longitude) &&
    organization.latitude >= 8 &&
    organization.latitude <= 16 &&
    organization.longitude >= -7 &&
    organization.longitude <= 3
  );
}

/* ==========================================================================
   Calculs territoriaux
   ========================================================================== */

function buildRegionCounts() {
  const counts = new Map();

  for (const feature of state.boundaries.features) {
    const region = getFeatureRegion(feature);
    if (region) counts.set(region, 0);
  }

  for (const organization of state.filteredOrganizations) {
    const matchedBoundaryRegion = [...counts.keys()].find(
      (boundaryRegion) => sameRegion(boundaryRegion, organization.region)
    );

    if (matchedBoundaryRegion) {
      counts.set(
        matchedBoundaryRegion,
        (counts.get(matchedBoundaryRegion) || 0) + 1
      );
    } else if (organization.region) {
      console.warn(
        `[ODF] Région non appariée au GeoJSON : "${organization.region}".`
      );
    }
  }

  state.regionCounts = counts;
}

function getRegionCount(regionName) {
  for (const [region, count] of state.regionCounts.entries()) {
    if (sameRegion(region, regionName)) return count;
  }

  return 0;
}

function getChoroplethColor(count) {
  if (count > 20) return '#0b4f79';
  if (count > 10) return '#1683d8';
  if (count > 5) return '#58a9d8';
  if (count > 2) return '#9fd1ed';
  if (count > 0) return '#d8ecf8';
  return '#e8edf1';
}

function getBoundaryStyle(feature) {
  const region = getFeatureRegion(feature);
  const selected = (
    state.selectedRegion &&
    sameRegion(region, state.selectedRegion)
  );

  return {
    color: selected ? '#0b304a' : '#61717f',
    weight: selected ? 3 : 1.2,
    opacity: 1,
    fillColor:
      state.filters.mode === 'choropleth'
        ? getChoroplethColor(getRegionCount(region))
        : '#e6f2f9',
    fillOpacity:
      selected
        ? 0.9
        : (state.filters.mode === 'choropleth' ? 0.82 : 0.4)
  };
}

/* ==========================================================================
   Rendu des limites
   ========================================================================== */

function renderBoundaries({ fit = true } = {}) {
  if (state.boundaryLayer) {
    state.map.removeLayer(state.boundaryLayer);
  }

  state.boundaryLayer = L.geoJSON(
    state.boundaries,
    {
      style: getBoundaryStyle,

      onEachFeature(feature, layer) {
        const region = getFeatureRegion(feature);
        const formerRegion = getFeatureOldRegion(feature);
        const count = getRegionCount(region);

        const oldRegionLine = formerRegion
          ? (
              `<br><span>Ancienne région : ` +
              `${escapeHtml(formerRegion)}</span>`
            )
          : '';

        layer.bindTooltip(
          `<strong>${escapeHtml(region || 'Région sans nom')}</strong>` +
          oldRegionLine +
          `<br>${formatNumber(count)} ODF`,
          { sticky: true }
        );

        layer.bindPopup(
          `<div class="region-popup">` +
            `<h3>${escapeHtml(region || 'Région sans nom')}</h3>` +
            (
              formerRegion
                ? `<p>Ancienne dénomination : ${escapeHtml(formerRegion)}</p>`
                : ''
            ) +
            `<div class="popup-stat">` +
              `<span>ODF recensées</span>` +
              `<strong>${formatNumber(count)}</strong>` +
            `</div>` +
            `<button ` +
              `type="button" ` +
              `class="popup-filter-button" ` +
              `data-region="${escapeHtml(region)}">` +
              `Filtrer cette région` +
            `</button>` +
          `</div>`
        );

        layer.on({
          mouseover(event) {
            event.target.setStyle({
              weight: 3,
              color: '#0b304a',
              fillOpacity: 0.95
            });

            event.target.bringToFront();
            updateInfoControl(region, count);
          },

          mouseout(event) {
            state.boundaryLayer.resetStyle(event.target);
            updateInfoControl();
          },

          click(event) {
            selectRegion(region, event.target);
          }
        });
      }
    }
  ).addTo(state.map);

  const bounds = state.boundaryLayer.getBounds();

  if (fit && bounds.isValid()) {
    state.map.fitBounds(bounds, {
      padding: [18, 18]
    });
  }
}

function selectRegion(regionName, layer = null) {
  const option = [...ui.region.options].find(
    (candidate) => sameRegion(candidate.value, regionName)
  );

  if (!option) return;

  ui.region.value = option.value;
  state.selectedRegion = option.value;

  applyFilters({ fit: false });

  if (layer?.getBounds) {
    state.map.fitBounds(
      layer.getBounds(),
      {
        padding: [30, 30],
        maxZoom: 9
      }
    );
  }
}

/* ==========================================================================
   Rendu des marqueurs
   ========================================================================== */

function createOrganizationPopup(organization) {
  const location = organization.commune || organization.address || 'Non renseignée';

  return (
    `<div class="organization-popup">` +
      `<p class="popup-eyebrow">Organisation dirigée par des femmes</p>` +
      `<h3>${escapeHtml(organization.name)}</h3>` +
      `<dl>` +
        `<div>` +
          `<dt>Région</dt>` +
          `<dd>${escapeHtml(organization.region || 'Non renseignée')}</dd>` +
        `</div>` +
        `<div>` +
          `<dt>Localisation</dt>` +
          `<dd>${escapeHtml(location)}</dd>` +
        `</div>` +
        `<div>` +
          `<dt>Secteurs</dt>` +
          `<dd>${escapeHtml(organization.sectors.join(', ') || 'Non renseigné')}</dd>` +
        `</div>` +
        `<div>` +
          `<dt>Financement</dt>` +
          `<dd>${organization.funded ? 'Oui' : 'Non'}</dd>` +
        `</div>` +
        `<div>` +
          `<dt>Réponse humanitaire</dt>` +
          `<dd>${organization.humanitarianResponse ? 'Oui' : 'Non'}</dd>` +
        `</div>` +
        `<div>` +
          `<dt>Coordination</dt>` +
          `<dd>${organization.coordination ? 'Oui' : 'Non'}</dd>` +
        `</div>` +
      `</dl>` +
    `</div>`
  );
}

function renderMarkers() {
  if (state.markerLayer) {
    state.map.removeLayer(state.markerLayer);
  }

  state.markerLayer = L.layerGroup();

  if (state.filters.mode !== 'points') return;

  const coordinateGroups = new Map();

  for (const organization of state.filteredOrganizations) {
    if (!hasValidCoordinates(organization)) continue;

    const coordinateKey =
      `${organization.latitude.toFixed(5)}|` +
      `${organization.longitude.toFixed(5)}`;

    const offsetIndex = coordinateGroups.get(coordinateKey) || 0;
    coordinateGroups.set(coordinateKey, offsetIndex + 1);

    /*
     * Les coordonnées du dataset sont des centroïdes régionaux approximatifs.
     * Un léger décalage circulaire évite la superposition complète des ODF
     * appartenant à une même région.
     */
    const angle = offsetIndex * 2.399963229728653;
    const radius = Math.min(0.18, 0.018 * Math.sqrt(offsetIndex));
    const latitude =
      organization.latitude + Math.sin(angle) * radius;
    const longitude =
      organization.longitude + Math.cos(angle) * radius;

    const marker = L.circleMarker(
      [latitude, longitude],
      {
        radius: 6,
        color: '#ffffff',
        weight: 2,
        fillColor: '#5a2a84',
        fillOpacity: 0.95
      }
    );

    marker.bindTooltip(
      escapeHtml(organization.name),
      {
        direction: 'top',
        opacity: 0.95
      }
    );

    marker.bindPopup(
      createOrganizationPopup(organization),
      {
        maxWidth: 360
      }
    );

    marker.addTo(state.markerLayer);
  }

  state.markerLayer.addTo(state.map);
}

/* ==========================================================================
   Légende
   ========================================================================== */

function renderLegend() {
  if (state.legendControl) {
    state.map.removeControl(state.legendControl);
  }

  const legend = L.control({ position: 'bottomright' });

  legend.onAdd = () => {
    const container = L.DomUtil.create(
      'div',
      'map-legend'
    );

    if (state.filters.mode === 'points') {
      container.innerHTML =
        '<h4>Légende</h4>' +
        '<div class="legend-row">' +
          '<span class="legend-point"></span>' +
          '<span>ODF géolocalisée approximativement</span>' +
        '</div>' +
        '<div class="legend-row">' +
          '<span class="legend-area"></span>' +
          '<span>Limite régionale</span>' +
        '</div>';
    } else {
      const classes = [
        ['0', '#e8edf1'],
        ['1–2', '#d8ecf8'],
        ['3–5', '#9fd1ed'],
        ['6–10', '#58a9d8'],
        ['11–20', '#1683d8'],
        ['21+', '#0b4f79']
      ];

      container.innerHTML =
        '<h4>Nombre d’ODF</h4>' +
        classes.map(
          ([label, color]) =>
            `<div class="legend-row">` +
              `<span class="legend-swatch" ` +
                `style="background:${color}"></span>` +
              `<span>${label}</span>` +
            `</div>`
        ).join('');
    }

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    return container;
  };

  legend.addTo(state.map);
  state.legendControl = legend;
}

/* ==========================================================================
   Filtres
   ========================================================================== */

function populateSelect(select, values, defaultLabel) {
  const currentValue = select.value;

  select.innerHTML =
    `<option value="">${escapeHtml(defaultLabel)}</option>` +
    values.map(
      (value) =>
        `<option value="${escapeHtml(value)}">` +
          `${escapeHtml(value)}` +
        `</option>`
    ).join('');

  if ([...select.options].some((option) => option.value === currentValue)) {
    select.value = currentValue;
  }
}

function populateFilters() {
  const boundaryRegions = state.boundaries.features
    .map(getFeatureRegion)
    .filter(Boolean);

  const organizationRegions = state.organizations
    .map((organization) => organization.region)
    .filter(Boolean);

  populateSelect(
    ui.region,
    uniqueSorted([...boundaryRegions, ...organizationRegions]),
    'Toutes les régions'
  );

  populateSelect(
    ui.sector,
    uniqueSorted(
      state.organizations.flatMap(
        (organization) => organization.sectors
      )
    ),
    'Tous les secteurs'
  );
}

function readFilters() {
  state.filters = {
    mode: ui.mapMode.value || 'points',
    region: ui.region.value,
    sector: ui.sector.value,
    funded: ui.funded.value,
    partner: ui.partner.value
  };

  state.selectedRegion = state.filters.region;
}

function organizationMatchesRegion(organization, selectedRegion) {
  if (!selectedRegion) return true;

  return organization.regions.some(
    (region) => sameRegion(region, selectedRegion)
  );
}

function filterOrganizations() {
  state.filteredOrganizations = state.organizations.filter(
    (organization) => {
      const matchesRegion = organizationMatchesRegion(
        organization,
        state.filters.region
      );

      const matchesSector =
        !state.filters.sector ||
        organization.sectors.some(
          (sector) =>
            normalizeText(sector) ===
            normalizeText(state.filters.sector)
        );

      const matchesFunding =
        state.filters.funded === '' ||
        organization.funded ===
          (state.filters.funded === 'true');

      const matchesPartnership =
        state.filters.partner === '' ||
        organization.partner ===
          (state.filters.partner === 'true');

      return (
        matchesRegion &&
        matchesSector &&
        matchesFunding &&
        matchesPartnership
      );
    }
  );
}

/* ==========================================================================
   KPI
   ========================================================================== */

function renderKpis() {
  const total = state.filteredOrganizations.length;

  const geolocated = state.filteredOrganizations.filter(
    hasValidCoordinates
  ).length;

  const funded = state.filteredOrganizations.filter(
    (organization) => organization.funded
  ).length;

  const partners = state.filteredOrganizations.filter(
    (organization) => organization.partner
  ).length;

  const regions = uniqueSorted(
    state.filteredOrganizations
      .flatMap((organization) => organization.regions)
      .map(regionKey)
  ).length;

  const cards = [
    {
      label: 'ODF correspondant aux filtres',
      value: total,
      detail: `${formatNumber(geolocated)} géolocalisée(s)`
    },
    {
      label: 'Régions couvertes',
      value: regions,
      detail: 'Présence territoriale'
    },
    {
      label: 'ODF récemment financées',
      value: funded,
      detail: formatPercent(funded, total)
    },
    {
      label: 'Partenaires humanitaires',
      value: partners,
      detail: formatPercent(partners, total)
    }
  ];

  ui.kpis.innerHTML = cards.map(
    (card) =>
      `<article class="kpi-card">` +
        `<span class="kpi-label">${escapeHtml(card.label)}</span>` +
        `<strong class="kpi-value">${formatNumber(card.value)}</strong>` +
        `<span class="kpi-detail">${escapeHtml(card.detail)}</span>` +
      `</article>`
  ).join('');
}

/* ==========================================================================
   Analyses
   ========================================================================== */

function renderList(element, items) {
  if (!element) return;

  element.innerHTML = items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');
}

function renderAnalyses() {
  const counts = [...state.regionCounts.entries()]
    .sort((a, b) => b[1] - a[1]);

  const coveredRegions = counts.filter(([, count]) => count > 0);
  const blankRegions = counts.filter(([, count]) => count === 0);

  const leadingRegion = coveredRegions[0];

  renderList(
    ui.coverage,
    [
      leadingRegion
        ? (
            `${leadingRegion[0]} présente le plus grand nombre ` +
            `d’ODF (${formatNumber(leadingRegion[1])}).`
          )
        : 'Aucune ODF ne correspond aux filtres.',
      `${formatNumber(coveredRegions.length)} région(s) couverte(s).`,
      `${formatNumber(blankRegions.length)} région(s) sans ODF visible.`
    ]
  );

  const funded = state.filteredOrganizations.filter(
    (organization) => organization.funded
  ).length;

  const humanitarianResponse = state.filteredOrganizations.filter(
    (organization) => organization.humanitarianResponse
  ).length;

  const coordination = state.filteredOrganizations.filter(
    (organization) => organization.coordination
  ).length;

  renderList(
    ui.funding,
    [
      `${formatNumber(funded)} ODF ont déclaré un financement récent.`,
      `${formatNumber(humanitarianResponse)} ODF interviennent dans la réponse humanitaire.`,
      `${formatNumber(coordination)} ODF participent à un mécanisme de coordination.`
    ]
  );

  const capacityCounts = new Map();

  for (const organization of state.filteredOrganizations) {
    const capacity = organization.capacity || 'Non renseigné';

    capacityCounts.set(
      capacity,
      (capacityCounts.get(capacity) || 0) + 1
    );
  }

  const capacityItems = [...capacityCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(
      ([capacity, count]) =>
        `${capacity} : ${formatNumber(count)} organisation(s).`
    );

  renderList(
    ui.capacity,
    capacityItems.length
      ? capacityItems
      : ['Aucune donnée de capacité disponible.']
  );

  const sectorCounts = new Map();

  for (const organization of state.filteredOrganizations) {
    for (const sector of organization.sectors) {
      sectorCounts.set(
        sector,
        (sectorCounts.get(sector) || 0) + 1
      );
    }
  }

  const sectorItems = [...sectorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(
      ([sector, count]) =>
        `${sector} : ${formatNumber(count)} organisation(s).`
    );

  renderList(
    ui.sectors,
    sectorItems.length
      ? sectorItems
      : ['Aucun secteur renseigné.']
  );
}

/* ==========================================================================
   Répertoire
   ========================================================================== */

function renderTable() {
  const rows = [...state.filteredOrganizations]
    .sort(
      (a, b) =>
        a.name.localeCompare(
          b.name,
          'fr',
          { sensitivity: 'base' }
        )
    );

  if (!rows.length) {
    ui.tableBody.innerHTML =
      '<tr>' +
        '<td colspan="6" class="table-empty">' +
          'Aucune organisation ne correspond aux filtres.' +
        '</td>' +
      '</tr>';
  } else {
    ui.tableBody.innerHTML = rows.map(
      (organization) => {
        const location =
          organization.commune ||
          organization.address ||
          'Non renseignée';

        return (
          '<tr>' +
            `<td><strong>${escapeHtml(organization.name)}</strong></td>` +
            `<td>${escapeHtml(organization.region || 'Non renseignée')}</td>` +
            `<td>${escapeHtml(location)}</td>` +
            `<td>${escapeHtml(organization.sectors.join(', ') || 'Non renseigné')}</td>` +
            '<td>' +
              `<span class="status-badge ` +
                `${organization.funded ? 'status-yes' : 'status-no'}">` +
                `${organization.funded ? 'Oui' : 'Non'}` +
              '</span>' +
            '</td>' +
            '<td>' +
              `<span class="status-badge ` +
                `${organization.partner ? 'status-yes' : 'status-no'}">` +
                `${organization.partner ? 'Oui' : 'Non'}` +
              '</span>' +
            '</td>' +
          '</tr>'
        );
      }
    ).join('');
  }

  if (ui.tableSummary) {
    ui.tableSummary.textContent =
      `${formatNumber(rows.length)} organisation(s) affichée(s).`;
  }
}

/* ==========================================================================
   Mise à jour générale
   ========================================================================== */

function refresh({ fit = true } = {}) {
  buildRegionCounts();
  renderBoundaries({ fit });
  renderMarkers();
  renderLegend();
  renderKpis();
  renderAnalyses();
  renderTable();

  if (ui.activeLabel) {
    ui.activeLabel.textContent =
      ui.mapMode.options[
        ui.mapMode.selectedIndex
      ]?.textContent.trim() ||
      'Cartographie des ODF';
  }

  const geolocated = state.filteredOrganizations.filter(
    hasValidCoordinates
  ).length;

  if (state.filters.mode === 'points') {
    setStatus(
      `${formatNumber(geolocated)} ODF affichée(s) sur la carte.`,
      'success'
    );
  } else {
    setStatus(
      `${formatNumber(state.filteredOrganizations.length)} ODF agrégée(s) par région.`,
      'success'
    );
  }

  state.map.invalidateSize();
}

function applyFilters({ fit = true } = {}) {
  readFilters();
  filterOrganizations();
  refresh({ fit });
}

function resetFilters() {
  ui.mapMode.value = 'points';
  ui.region.value = '';
  ui.sector.value = '';
  ui.funded.value = '';
  ui.partner.value = '';

  state.selectedRegion = '';

  applyFilters();
}

/* ==========================================================================
   Événements
   ========================================================================== */

function bindEvents() {
  ui.form.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilters();
  });

  ui.reset.addEventListener('click', resetFilters);

  [
    ui.mapMode,
    ui.region,
    ui.sector,
    ui.funded,
    ui.partner
  ].forEach((element) => {
    element.addEventListener('change', () => {
      applyFilters();
    });
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest(
      '.popup-filter-button'
    );

    if (!button) return;

    const targetRegion = button.dataset.region || '';

    const option = [...ui.region.options].find(
      (candidate) => sameRegion(
        candidate.value,
        targetRegion
      )
    );

    if (option) {
      ui.region.value = option.value;
      applyFilters({ fit: false });
    }

    state.map.closePopup();
  });

  window.addEventListener('resize', () => {
    state.map?.invalidateSize();
  });
}

/* ==========================================================================
   Démarrage
   ========================================================================== */

async function start() {
  try {
    requireElements();
    initMap();
    await loadData();

    populateFilters();
    bindEvents();

    readFilters();
    filterOrganizations();
    refresh();

    setStatus(
      `${formatNumber(state.organizations.length)} ODF chargée(s).`,
      'success'
    );
  } catch (error) {
    console.error('[ODF]', error);

    setStatus(error.message, 'error');

    if (ui.kpis) {
      ui.kpis.innerHTML =
        '<article class="kpi-card">' +
          '<span class="kpi-label">Erreur de chargement</span>' +
          '<strong class="kpi-value">—</strong>' +
          `<span class="kpi-detail">${escapeHtml(error.message)}</span>` +
        '</article>';
    }

    if (ui.map) {
      ui.map.innerHTML =
        '<div class="map-error">' +
          '<strong>La carte ne peut pas être affichée.</strong>' +
          `<p>${escapeHtml(error.message)}</p>` +
        '</div>';
    }

    if (ui.tableBody) {
      ui.tableBody.innerHTML =
        '<tr>' +
          '<td colspan="6" class="table-empty">' +
            `${escapeHtml(error.message)}` +
          '</td>' +
        '</tr>';
    }
  }
}

document.addEventListener('DOMContentLoaded', start);
