/* assets/map.js — rendu robuste des cartes Burkina Faso (GeoJSON externe)
   Compatible avec pages/*.html et GitHub Pages.
   Requis: D3 chargé avant ce fichier. */
(function () {
  const GEOJSON_URL = '../assets/bfa_admin1.geojson';
  let geoPromise = null;

  function norm(v) {
    return String(v || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '');
  }

  const NAME_TO_ID = {
    bankui: 'bankui', boucledumouhoun: 'bankui',
    kadiogo: 'kadiogo', centre: 'kadiogo',
    goulmou: 'goulmou', centreest: 'goulmou', est: 'goulmou',
    koulse: 'koulse', centrenord: 'koulse',
    nakambe: 'nakambe', centresud: 'nakambe',
    liptako: 'liptako', sahel: 'liptako',
    yaadga: 'yaadga', nord: 'yaadga'
  };



  // Corrige l'orientation des anneaux GeoJSON pour D3.
  // Sans cela, certains polygones sont interprétés comme le complément du globe
  // et s'affichent comme un grand rectangle rempli.
  function ringArea(ring) {
    let a = 0;
    for (let i = 0, n = ring.length - 1; i < n; i++) {
      a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
    }
    return a / 2;
  }

  function closeRing(ring) {
    if (!ring.length) return ring;
    const a = ring[0], b = ring[ring.length - 1];
    if (a[0] !== b[0] || a[1] !== b[1]) ring.push([a[0], a[1]]);
    return ring;
  }

  function rewindPolygon(poly) {
    poly.forEach((ring, idx) => {
      closeRing(ring);
      const a = ringArea(ring);
      // D3 geoPath attend l'anneau extérieur dans le sens horaire.
      // Les trous doivent être dans le sens inverse.
      if ((idx === 0 && a > 0) || (idx > 0 && a < 0)) ring.reverse();
    });
  }

  function rewindGeoJSON(geo) {
    (geo.features || []).forEach(f => {
      const g = f.geometry;
      if (!g) return;
      if (g.type === 'Polygon') rewindPolygon(g.coordinates);
      if (g.type === 'MultiPolygon') g.coordinates.forEach(rewindPolygon);
    });
    return geo;
  }

  function surveyId(props) {
    if (!props) return null;
    const candidates = [props.survey_id, props.adm1_name, props.adm1_name1, props.adm1_name_old];
    for (const c of candidates) {
      const key = norm(c);
      if (NAME_TO_ID[key]) return NAME_TO_ID[key];
    }
    return null;
  }

  function loadGeo() {
    if (!geoPromise) {
      geoPromise = d3.json(GEOJSON_URL).then(geo => {
        if (!geo || geo.type !== 'FeatureCollection' || !Array.isArray(geo.features)) {
          throw new Error('GeoJSON invalide: FeatureCollection attendue.');
        }
        rewindGeoJSON(geo);
        geo.features.forEach(f => {
          f.properties = f.properties || {};
          f.properties.survey_id = surveyId(f.properties);
        });
        return geo;
      });
    }
    return geoPromise;
  }

  function drawMap(cfg, geo) {
    const svg = d3.select('#' + cfg.svgId);
    if (svg.empty()) return;
    svg.selectAll('*').remove();

    const W = cfg.width || 580, H = cfg.height || 500;
    const tooltip = document.getElementById(cfg.tooltipId);
    const cont = svg.node().parentElement;
    const dataByRegion = cfg.dataByRegion || {};
    const metric = cfg.colorMetric || 'al';
    const range = cfg.colorRange || [0, 100];
    const labelFormat = cfg.labelFormat || (v => v);
    const color = cfg.colorScale || d3.scaleSequential(range, d3.interpolate('#E3EDF6', '#002E6E'));

    const proj = d3.geoMercator().fitExtent([[12,12],[W-12,H-12]], geo);
    const path = d3.geoPath().projection(proj);
    const g = svg.append('g');

    g.selectAll('.map-region')
      .data(geo.features)
      .enter().append('path')
      .attr('class', d => 'map-region' + (dataByRegion[d.properties.survey_id] ? '' : ' not-surveyed'))
      .attr('d', path)
      .attr('fill', d => {
        const r = dataByRegion[d.properties.survey_id];
        return r ? color(+r[metric]) : (OCHA.sl6 || '#e5e7eb');
      })
      .on('mousemove', function(ev, d) {
        const rgn = dataByRegion[d.properties.survey_id];
        if (!tooltip || !rgn) return;
        const box = cont.getBoundingClientRect();
        let tx = ev.clientX - box.left + 16;
        if (tx + 240 > box.width) tx = ev.clientX - box.left - 240;
        tooltip.style.display = 'block';
        tooltip.style.left = tx + 'px';
        tooltip.style.top = (ev.clientY - box.top - 14) + 'px';
        tooltip.innerHTML = `<div class="map-tooltip-title">${rgn.label || rgn.name || d.properties.adm1_name}</div>` +
          Object.entries(rgn.metrics || {}).map(([k,v]) =>
            `<div class="map-tooltip-row"><span>${k}</span><span class="map-tooltip-val">${v}</span></div>`
          ).join('');
      })
      .on('mouseleave', () => { if (tooltip) tooltip.style.display = 'none'; })
      .on('click', function(ev, d) {
        const rgn = dataByRegion[d.properties.survey_id];
        if (!rgn || !cfg.detailId) return;
        const detail = document.getElementById(cfg.detailId);
        if (!detail) return;
        detail.style.display = 'block';
        const title = document.getElementById('mdTitle');
        if (title) title.textContent = rgn.label || rgn.name || d.properties.adm1_name;
        Object.entries(rgn.detail || {}).forEach(([id, val]) => {
          const el = document.getElementById(id);
          if (el) el.textContent = val;
        });
      });

    g.selectAll('.map-lbl')
      .data(geo.features.filter(d => dataByRegion[d.properties.survey_id]))
      .enter().append('text')
      .attr('class','map-label-text')
      .attr('transform', d => `translate(${path.centroid(d)})`)
      .attr('text-anchor','middle')
      .attr('dominant-baseline','middle')
      .attr('font-size','11')
      .attr('font-weight','700')
      .attr('pointer-events','none')
      .attr('fill', d => (+dataByRegion[d.properties.survey_id][metric] > (range[0]+range[1])/2 ? '#fff' : (OCHA.bl1 || '#002E6E')))
      .text(d => labelFormat(dataByRegion[d.properties.survey_id][metric]));

    svg.append('text').attr('x', W-18).attr('y', 26).attr('text-anchor','middle').attr('font-size','15').attr('fill', OCHA.sl4 || '#777').text('N');
    svg.append('text').attr('x', W-18).attr('y', 14).attr('text-anchor','middle').attr('font-size','14').attr('fill', OCHA.sl4 || '#777').text('↑');
  }

  window.renderOchaMap = function(cfg) {
    loadGeo().then(geo => drawMap(cfg, geo)).catch(err => {
      console.error('Erreur carte:', err);
      const el = document.getElementById(cfg.svgId);
      if (el) el.insertAdjacentHTML('afterend', `<div class="insight alert">Carte non chargée : ${err.message}</div>`);
    });
  };
})();
