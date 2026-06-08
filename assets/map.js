/* assets/map.js — cartes interactives OCHA Burkina Faso
   Fonctions: GeoJSON robuste, zoom/pan, filtre région, choix indicateur,
   infobulles, détails, export CSV/PNG/PowerPoint. Requis: D3. */
(function () {
  const GEOJSON_URL = '../assets/bfa_admin1.geojson';
  let geoPromise = null;
  const registry = {};

  function norm(v) {
    return String(v || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '');
  }

  const NAME_TO_ID = {
    bankui: 'bankui', boucledumouhoun: 'bankui',
    kadiogo: 'kadiogo', centre: 'kadiogo',
    goulmou: 'goulmou', centreest: 'goulmou',
    koulse: 'koulse', centrenord: 'koulse',
    nakambe: 'nakambe', centresud: 'nakambe',
    liptako: 'liptako', est: 'liptako', sahel: 'liptako',
    yaadga: 'yaadga', nord: 'yaadga'
  };

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
    const candidates = [props.survey_id, props.adm1_name, props.adm1_name1, props.adm1_name_old, props.label];
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

  function niceName(id, row, feat) {
    return (row && (row.label || row.name)) || (feat && feat.properties && (feat.properties.label || feat.properties.adm1_name)) || id;
  }
  function downloadText(filename, text, mime) {
    const blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
  }
  function toCSV(cfg) {
    const rows = Object.entries(cfg.dataByRegion || {}).map(([id, r]) => ({ id, ...r }));
    const metricKeys = Array.from(new Set(rows.flatMap(r => Object.keys(r).filter(k => typeof r[k] === 'number'))));
    const headers = ['region_id', 'region', ...metricKeys];
    const lines = [headers.join(',')];
    rows.forEach(r => {
      const vals = [r.id, r.label || r.name || r.id, ...metricKeys.map(k => r[k] ?? '')]
        .map(v => `"${String(v).replace(/"/g, '""')}"`);
      lines.push(vals.join(','));
    });
    return lines.join('\n');
  }
  function serializeSvg(svgNode) {
    const clone = svgNode.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const css = `.map-region{stroke:#fff;stroke-width:1.1}.map-region.not-surveyed{fill:#e5e7eb}.map-label-text{font-family:Arial,sans-serif}`;
    const style = document.createElement('style');
    style.textContent = css;
    clone.insertBefore(style, clone.firstChild);
    return new XMLSerializer().serializeToString(clone);
  }
  function exportPNG(state) {
    const svgNode = state.svg.node();
    const svgText = serializeSvg(svgNode);
    const img = new Image();
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1400; canvas.height = 1100;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(png => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(png);
        a.download = `${state.cfg.exportName || state.cfg.svgId}.png`;
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(a.href); URL.revokeObjectURL(url);
      });
    };
    img.src = url;
  }
  function exportPPTX(state) {
    if (!window.pptxgen) {
      alert('Export PowerPoint indisponible: ajoutez le script pptxgenjs dans la page.');
      return;
    }
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'OCHA Burkina Faso';
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };
    slide.addText(state.cfg.title || 'Carte analyse genre', { x: 0.45, y: 0.25, w: 12.4, h: 0.35, fontSize: 18, bold: true, color: '002E6E' });
    slide.addText(`Indicateur: ${state.metricLabel}`, { x: 0.45, y: 0.65, w: 12.4, h: 0.25, fontSize: 10, color: '555555' });
    const svgText = serializeSvg(state.svg.node());
    const dataUri = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
    slide.addImage({ data: dataUri, x: 0.65, y: 1.0, w: 7.2, h: 6.1 });
    const rows = Object.entries(state.cfg.dataByRegion || {}).slice(0, 12).map(([id, r]) => [r.label || r.name || id, String(r[state.metric] ?? '')]);
    slide.addTable([['Région', state.metricLabel], ...rows], {
      x: 8.15, y: 1.05, w: 4.6, h: 4.9, fontSize: 8,
      border: { type: 'solid', color: 'D9E2EC', pt: 0.5 },
      fill: 'F8FAFC', color: '111827'
    });
    slide.addText('Source: Analyse conjointe genre · OCHA Burkina Faso', { x: 0.45, y: 7.05, w: 12, h: 0.22, fontSize: 8, color: '6B7280' });
    pptx.writeFile({ fileName: `${state.cfg.exportName || state.cfg.svgId}.pptx` });
  }

  function addControls(cfg, state) {
    if (cfg.controls === false) return;
    const wrapper = state.svg.node().closest('.map-wrapper') || state.svg.node().parentElement;
    if (!wrapper || wrapper.querySelector('.map-toolbar')) return;
    const toolbar = document.createElement('div');
    toolbar.className = 'map-toolbar';

    const metrics = cfg.metrics || [{ key: cfg.colorMetric || 'al', label: cfg.metricLabel || 'Indicateur principal', range: cfg.colorRange || [0, 100] }];
    toolbar.innerHTML = `
      <label class="map-control"><span>Indicateur</span><select data-map-metric></select></label>
      <label class="map-control"><span>Région</span><select data-map-region><option value="all">Toutes les régions</option></select></label>
      <button type="button" class="map-btn" data-map-reset>Réinitialiser</button>
      <button type="button" class="map-btn" data-map-csv>CSV</button>
      <button type="button" class="map-btn" data-map-png>PNG</button>
      <button type="button" class="map-btn map-btn-primary" data-map-pptx>PPTX</button>`;
    wrapper.prepend(toolbar);

    const metricSel = toolbar.querySelector('[data-map-metric]');
    metrics.forEach(m => {
      const opt = document.createElement('option'); opt.value = m.key; opt.textContent = m.label; metricSel.appendChild(opt);
    });
    const regionSel = toolbar.querySelector('[data-map-region]');
    Object.entries(cfg.dataByRegion || {}).sort((a,b) => (a[1].label || a[1].name).localeCompare(b[1].label || b[1].name)).forEach(([id, r]) => {
      const opt = document.createElement('option'); opt.value = id; opt.textContent = r.label || r.name || id; regionSel.appendChild(opt);
    });
    metricSel.value = state.metric;
    metricSel.addEventListener('change', () => state.setMetric(metricSel.value));
    regionSel.addEventListener('change', () => state.selectRegion(regionSel.value));
    toolbar.querySelector('[data-map-reset]').addEventListener('click', () => { regionSel.value = 'all'; state.reset(); });
    toolbar.querySelector('[data-map-csv]').addEventListener('click', () => downloadText(`${cfg.exportName || cfg.svgId}.csv`, toCSV(cfg), 'text/csv;charset=utf-8'));
    toolbar.querySelector('[data-map-png]').addEventListener('click', () => exportPNG(state));
    toolbar.querySelector('[data-map-pptx]').addEventListener('click', () => exportPPTX(state));
  }

  function drawMap(cfg, geo) {
    const svg = d3.select('#' + cfg.svgId);
    if (svg.empty()) return;
    svg.selectAll('*').remove();

    const W = cfg.width || 580, H = cfg.height || 500;
    const tooltip = document.getElementById(cfg.tooltipId);
    const cont = svg.node().parentElement;
    const dataByRegion = cfg.dataByRegion || {};
    const metrics = cfg.metrics || [{ key: cfg.colorMetric || 'al', label: cfg.metricLabel || 'Indicateur', range: cfg.colorRange || [0, 100], scale: cfg.colorScale }];
    const state = { cfg, svg, metric: cfg.colorMetric || metrics[0].key, metricLabel: metrics[0].label };
    const surveyedFeatures = geo.features.filter(d => dataByRegion[d.properties.survey_id]);
    const proj = d3.geoMercator().fitExtent([[12,12],[W-12,H-12]], geo);
    const path = d3.geoPath().projection(proj);
    const root = svg.append('g').attr('class', 'map-root');
    const g = root.append('g').attr('class', 'map-layer');
    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', ev => root.attr('transform', ev.transform));
    svg.call(zoom);

    function metricDef(key) { return metrics.find(m => m.key === key) || metrics[0]; }
    function colorFor(d) {
      const r = dataByRegion[d.properties.survey_id];
      if (!r) return (OCHA.sl6 || '#e5e7eb');
      const def = metricDef(state.metric);
      const range = def.range || cfg.colorRange || [0, 100];
      const scale = def.scale || cfg.colorScale || d3.scaleSequential(range, d3.interpolate('#E3EDF6', '#002E6E'));
      return scale(+r[state.metric]);
    }
    function labelFor(d) {
      const r = dataByRegion[d.properties.survey_id];
      const def = metricDef(state.metric);
      const formatter = def.labelFormat || cfg.labelFormat || (v => v);
      return r ? formatter(r[state.metric]) : '';
    }
    function tooltipHTML(d) {
      const id = d.properties.survey_id;
      const r = dataByRegion[id];
      if (!r) return '';
      return `<div class="map-tooltip-title">${niceName(id, r, d)}</div>` +
        Object.entries(r.metrics || {}).map(([k,v]) =>
          `<div class="map-tooltip-row"><span>${k}</span><span class="map-tooltip-val">${v}</span></div>`
        ).join('');
    }
    function setDetail(d) {
      const id = d.properties.survey_id;
      const r = dataByRegion[id];
      if (!r || !cfg.detailId) return;
      const detail = document.getElementById(cfg.detailId);
      if (!detail) return;
      detail.style.display = 'block';
      const title = document.getElementById('mdTitle');
      if (title) title.textContent = niceName(id, r, d);
      Object.entries(r.detail || {}).forEach(([eid, val]) => {
        const el = document.getElementById(eid);
        if (el) el.textContent = val;
      });
    }

    const paths = g.selectAll('.map-region')
      .data(geo.features)
      .enter().append('path')
      .attr('class', d => 'map-region' + (dataByRegion[d.properties.survey_id] ? '' : ' not-surveyed'))
      .attr('data-region', d => d.properties.survey_id || '')
      .attr('d', path)
      .attr('fill', colorFor)
      .on('mousemove', function(ev, d) {
        if (!tooltip || !dataByRegion[d.properties.survey_id]) return;
        const box = cont.getBoundingClientRect();
        let tx = ev.clientX - box.left + 16;
        if (tx + 260 > box.width) tx = ev.clientX - box.left - 260;
        tooltip.style.display = 'block';
        tooltip.style.left = tx + 'px';
        tooltip.style.top = (ev.clientY - box.top - 14) + 'px';
        tooltip.innerHTML = tooltipHTML(d);
      })
      .on('mouseleave', () => { if (tooltip) tooltip.style.display = 'none'; })
      .on('click', function(ev, d) { state.selectRegion(d.properties.survey_id || 'all'); setDetail(d); });

    const labels = g.selectAll('.map-lbl')
      .data(surveyedFeatures)
      .enter().append('text')
      .attr('class','map-label-text')
      .attr('transform', d => `translate(${path.centroid(d)})`)
      .attr('text-anchor','middle')
      .attr('dominant-baseline','middle')
      .attr('font-size','11')
      .attr('font-weight','700')
      .attr('pointer-events','none')
      .attr('fill', '#fff')
      .text(labelFor);

    svg.append('text').attr('x', W-18).attr('y', 26).attr('text-anchor','middle').attr('font-size','15').attr('fill', OCHA.sl4 || '#777').text('N');
    svg.append('text').attr('x', W-18).attr('y', 14).attr('text-anchor','middle').attr('font-size','14').attr('fill', OCHA.sl4 || '#777').text('↑');

    state.setMetric = function(key) {
      state.metric = key;
      const def = metricDef(key);
      state.metricLabel = def.label || key;
      paths.transition().duration(350).attr('fill', colorFor);
      labels.text(labelFor);
      if (typeof cfg.onMetricChange === 'function') cfg.onMetricChange(key, def);
    };
    state.selectRegion = function(id) {
      if (!id || id === 'all') return state.reset();
      const f = surveyedFeatures.find(d => d.properties.survey_id === id);
      paths.classed('dimmed', d => d.properties.survey_id !== id).classed('selected', d => d.properties.survey_id === id);
      labels.classed('dimmed', d => d.properties.survey_id !== id);
      if (f) {
        const [[x0,y0],[x1,y1]] = path.bounds(f);
        const dx = x1-x0, dy = y1-y0, x = (x0+x1)/2, y = (y0+y1)/2;
        const scale = Math.max(1, Math.min(7, 0.78 / Math.max(dx/W, dy/H)));
        const transform = d3.zoomIdentity.translate(W/2 - scale*x, H/2 - scale*y).scale(scale);
        svg.transition().duration(550).call(zoom.transform, transform);
        setDetail(f);
      }
    };
    state.reset = function() {
      paths.classed('dimmed', false).classed('selected', false);
      labels.classed('dimmed', false);
      svg.transition().duration(550).call(zoom.transform, d3.zoomIdentity);
    };

    registry[cfg.svgId] = state;
    addControls(cfg, state);
    state.setMetric(state.metric);
    if (surveyedFeatures[0] && cfg.detailId) setDetail(surveyedFeatures[0]);
  }

  window.renderOchaMap = function(cfg) {
    loadGeo().then(geo => drawMap(cfg, geo)).catch(err => {
      console.error('Erreur carte:', err);
      const el = document.getElementById(cfg.svgId);
      if (el) el.insertAdjacentHTML('afterend', `<div class="insight alert">Carte non chargée : ${err.message}</div>`);
    });
  };
  window.OchaMapRegistry = registry;
})();
