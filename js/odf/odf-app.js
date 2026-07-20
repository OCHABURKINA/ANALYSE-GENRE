const BASE = "..";
const URLS = {
  odfs: `${BASE}/data/odf/odf-organizations.json`,
  admin1: `${BASE}/data/geodata/bfa_admin1.geojson`
};

const state = { odfs: [], filtered: [], boundaries: null, markerLayer: null, boundaryLayer: null };
const map = L.map("odf-map", { zoomControl: true, scrollWheelZoom: false }).setView([12.3, -1.6], 6);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "&copy; OpenStreetMap contributors" }).addTo(map);

const $ = id => document.getElementById(id);
const safe = value => String(value ?? "Non renseigné").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const boolLabel = value => value === true ? "Oui" : value === false ? "Non" : "Non renseigné";

async function loadJson(url, optional = false) {
  const response = await fetch(url);
  if (!response.ok) {
    if (optional) return null;
    throw new Error(`${url} (${response.status})`);
  }
  return response.json();
}

function isRealRecord(d) { return d && d.odf_id !== "ODF-EXEMPLE-001"; }

function populateFilters() {
  const regions = [...new Set(state.odfs.map(d => d.region_name).filter(Boolean))].sort();
  const sectors = [...new Set(state.odfs.flatMap(d => Array.isArray(d.sectors) ? d.sectors : []).filter(Boolean))].sort();
  $("filter-region").innerHTML += regions.map(x => `<option value="${safe(x)}">${safe(x)}</option>`).join("");
  $("filter-sector").innerHTML += sectors.map(x => `<option value="${safe(x)}">${safe(x)}</option>`).join("");
}

function filterData() {
  const region = $("filter-region").value;
  const sector = $("filter-sector").value;
  const funded = $("filter-funded").value;
  const partner = $("filter-partner").value;
  state.filtered = state.odfs.filter(d =>
    (!region || d.region_name === region) &&
    (!sector || (d.sectors || []).includes(sector)) &&
    (!funded || String(d.received_funding_last_12_months) === funded) &&
    (!partner || String(d.humanitarian_partner) === partner)
  );
  render();
}

function renderKpis() {
  const data = state.filtered;
  const funded = data.filter(d => d.received_funding_last_12_months === true).length;
  const partners = data.filter(d => d.humanitarian_partner === true).length;
  const regions = new Set(data.map(d => d.region_name).filter(Boolean)).size;
  const cards = [[data.length,"ODF affichées"],[regions,"Régions couvertes"],[data.length ? `${Math.round(funded/data.length*100)} %` : "—","ODF financées récemment"],[data.length ? `${Math.round(partners/data.length*100)} %` : "—","Partenaires humanitaires"]];
  $("odf-kpis").innerHTML = cards.map(([v,l]) => `<article class="metric"><strong>${safe(v)}</strong><span>${safe(l)}</span></article>`).join("");
}

function clearLayers() {
  if (state.markerLayer) map.removeLayer(state.markerLayer);
  if (state.boundaryLayer) map.removeLayer(state.boundaryLayer);
}

function renderPoints() {
  clearLayers();
  state.markerLayer = L.layerGroup();
  let count = 0;
  state.filtered.forEach(d => {
    if (!Number.isFinite(d.latitude) || !Number.isFinite(d.longitude)) return;
    const marker = L.circleMarker([d.latitude,d.longitude], { radius:7, weight:1, color:"#252D80", fillColor:"#4856E8", fillOpacity:.82 });
    marker.bindPopup(`<h3>${safe(d.name)}</h3><p><strong>Région :</strong> ${safe(d.region_name)}</p><p><strong>Commune :</strong> ${safe(d.commune_name)}</p><p><strong>Secteurs :</strong> ${safe((d.sectors||[]).join(", ") || "Non renseignés")}</p><p><strong>Financement récent :</strong> ${boolLabel(d.received_funding_last_12_months)}</p>`);
    marker.addTo(state.markerLayer); count += 1;
  });
  state.markerLayer.addTo(map);
  $("map-status").textContent = count ? `${count} ODF géolocalisée(s) affichée(s).` : "Aucune ODF avec coordonnées valides pour les filtres actifs.";
}

function getRegionName(feature) {
  const p = feature.properties || {};
  return p.ADM1_FR || p.ADM1_NAME || p.ADM1_EN || p.REGION || p.name || "Non renseigné";
}

function renderChoropleth() {
  clearLayers();
  if (!state.boundaries) { $("map-status").textContent = "Le fichier data/geodata/bfa_admin1.geojson est absent. Copiez les limites administratives Version 6 dans ce dossier."; return; }
  const counts = state.filtered.reduce((acc,d) => { if (d.region_name) acc[d.region_name]=(acc[d.region_name]||0)+1; return acc; },{});
  const values = Object.values(counts); const max = Math.max(1,...values);
  state.boundaryLayer = L.geoJSON(state.boundaries, {
    style: f => { const n=counts[getRegionName(f)]||0; const opacity=.12 + .72*(n/max); return { color:"#fff", weight:1.2, fillColor:"#3545bd", fillOpacity:opacity }; },
    onEachFeature: (f,l) => { const name=getRegionName(f), n=counts[name]||0; l.bindPopup(`<strong>${safe(name)}</strong><br>${n} ODF`); }
  }).addTo(map);
  try { map.fitBounds(state.boundaryLayer.getBounds(), { padding:[20,20] }); } catch (_) {}
  $("map-status").textContent = "Nombre d’ODF par région. Vérifiez l’alignement exact des noms ou utilisez les codes administratifs pour la jointure.";
}

function renderTable() {
  $("odf-table-body").innerHTML = state.filtered.map(d => `<tr><td>${safe(d.name)}</td><td>${safe(d.region_name)}</td><td>${safe(d.commune_name)}</td><td>${safe((d.sectors||[]).join(", ") || "—")}</td><td>${boolLabel(d.received_funding_last_12_months)}</td><td>${boolLabel(d.humanitarian_partner)}</td></tr>`).join("") || `<tr><td colspan="6">Aucune donnée à afficher.</td></tr>`;
}

function renderAnalysis() {
  const d=state.filtered, regions=new Set(d.map(x=>x.region_name).filter(Boolean)).size;
  const funded=d.filter(x=>x.received_funding_last_12_months===true).length;
  const partners=d.filter(x=>x.humanitarian_partner===true).length;
  const scores=d.map(x=>Number(x.capacity_score)).filter(Number.isFinite);
  const avg=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):null;
  const sectors=[...new Set(d.flatMap(x=>x.sectors||[]))];
  $("coverage-analysis").innerHTML=`<li>${d.length} organisation(s) dans ${regions} région(s) selon les filtres.</li><li>Les zones sans organisation ne peuvent être qualifiées de « zones blanches » qu’après vérification de l’exhaustivité du répertoire.</li>`;
  $("funding-analysis").innerHTML=`<li>${funded} ODF déclarent un financement récent.</li><li>${partners} ODF déclarent un partenariat humanitaire.</li><li>Comparer présence, besoins et financement par territoire pour identifier les écarts de localisation.</li>`;
  $("capacity-analysis").innerHTML=`<li>${avg===null?"Score moyen non calculable":`Score moyen de capacité : ${avg}/100`}.</li><li>Documenter gouvernance, gestion financière, suivi-évaluation, sauvegarde et capacité de rapportage.</li>`;
  $("sector-analysis").innerHTML=`<li>${sectors.length} secteur(s) distinct(s) renseigné(s).</li><li>${safe(sectors.slice(0,8).join(", ") || "Aucun secteur renseigné")}</li>`;
}

function render() { renderKpis(); renderTable(); renderAnalysis(); $("map-mode").value === "choropleth" ? renderChoropleth() : renderPoints(); }

async function init() {
  try {
    const [odfs,boundaries] = await Promise.all([loadJson(URLS.odfs), loadJson(URLS.admin1,true)]);
    state.odfs=(Array.isArray(odfs)?odfs:[]).filter(isRealRecord); state.filtered=[...state.odfs]; state.boundaries=boundaries;
    populateFilters(); render();
    if (!state.odfs.length) $("map-status").textContent="Le modèle de données est installé, mais aucune donnée ODF réelle n’a encore été chargée dans data/odf/odf-organizations.json.";
  } catch (error) { console.error(error); $("map-status").textContent=`Erreur de chargement : ${error.message}`; }
}

["map-mode","filter-region","filter-sector","filter-funded","filter-partner"].forEach(id => $(id).addEventListener("change",filterData));
$("reset-filters").addEventListener("click",()=>{["filter-region","filter-sector","filter-funded","filter-partner"].forEach(id=>$(id).value="");$("map-mode").value="points";filterData();});
init();
