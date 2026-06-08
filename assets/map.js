/* ================================================================
   OCHA Map — D3 renderer for Burkina Faso (bfa_admin1.geojson)
   Properties used: survey_id, label, surveyed
   ================================================================ */

function renderOchaMap({
  svgId, tooltipId, detailId,
  dataByRegion, colorMetric, colorRange,
  labelFormat, basePath,
  colorInterp         // optional: [lightColor, darkColor]
}) {
  const svg    = d3.select('#' + svgId);
  const svgEl  = svg.node();
  const W = svgEl.viewBox.baseVal.width  || 580;
  const H = svgEl.viewBox.baseVal.height || 500;
  const tip    = document.getElementById(tooltipId);
  const cont   = svgEl.parentElement;
  const geoFile = (basePath || '../assets/') + 'burkina-adm1.geojson';

  /* colour scale */
  const vals   = Object.values(dataByRegion)
                   .map(d => d[colorMetric]).filter(v => v !== undefined && v !== null);
  const vMin   = (colorRange || [])[0] ?? Math.min(...vals);
  const vMax   = (colorRange || [])[1] ?? Math.max(...vals);
  const c0     = (colorInterp || [])[0] || '#E3EDF6';   // UN Blue lightest
  const c1     = (colorInterp || [])[1] || '#002E6E';   // UN Blue darkest
  const colScale = d3.scaleSequential([vMin, vMax], d3.interpolate(c0, c1));

  fetch(geoFile)
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(geo => {
      /* projection — fit all 17 regions */
      const proj = d3.geoMercator()
        .fitExtent([[10, 10], [W - 10, H - 10]], geo);
      const path = d3.geoPath().projection(proj);

      const g = svg.append('g');

      /* ── draw regions ── */
      g.selectAll('.map-region')
        .data(geo.features)
        .enter().append('path')
        .attr('class', d => {
          const sid = d.properties.survey_id;
          const hasData = sid && dataByRegion[sid];
          return 'map-region' + (hasData ? '' : ' not-surveyed');
        })
        .attr('d', path)
        .attr('fill', d => {
          const sid = d.properties.survey_id;
          if (!sid || !dataByRegion[sid]) return '#DDDAD7';
          const v = dataByRegion[sid][colorMetric];
          return (v !== undefined && v !== null) ? colScale(v) : '#DDDAD7';
        })
        .on('mousemove', function(ev, d) {
          const sid = d.properties.survey_id;
          if (!sid || !dataByRegion[sid]) return;
          const sd  = dataByRegion[sid];
          const r   = cont.getBoundingClientRect();
          // position tooltip avoiding right edge
          let tx = ev.clientX - r.left + 16;
          let ty = ev.clientY - r.top  - 14;
          if (tx + 230 > r.width) tx = ev.clientX - r.left - 230;
          tip.style.display = 'block';
          tip.style.left    = tx + 'px';
          tip.style.top     = ty + 'px';
          const rows = Object.entries(sd.metrics || {})
            .map(([k, v]) => `<div class="map-tooltip-row"><span>${k}</span><span class="map-tooltip-val">${v}</span></div>`)
            .join('');
          tip.innerHTML = `<div class="map-tooltip-title">${sd.label || d.properties.label}</div>${rows}`;
        })
        .on('mouseleave', () => { tip.style.display = 'none'; })
        .on('click', function(ev, d) {
          const sid = d.properties.survey_id;
          if (!sid || !dataByRegion[sid]) return;
          const sd = dataByRegion[sid];
          /* highlight */
          g.selectAll('.map-region').classed('selected', false);
          d3.select(this).classed('selected', true);
          /* fill detail panel */
          if (detailId) {
            const det = document.getElementById(detailId);
            if (!det) return;
            det.classList.add('visible');
            const titleEl = det.querySelector('.map-detail-title');
            if (titleEl) titleEl.textContent = (sd.label || d.properties.label) + ' — ' + (sd.n || '') + ' répondants';
            Object.entries(sd.detail || {}).forEach(([id, val]) => {
              const el = document.getElementById(id);
              if (el) el.textContent = val;
            });
          }
        });

      /* ── labels on surveyed regions only ── */
      g.selectAll('.map-lbl')
        .data(geo.features.filter(d => d.properties.survey_id && dataByRegion[d.properties.survey_id]))
        .enter().append('text')
        .attr('class', 'map-label-text')
        .attr('transform', d => `translate(${path.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '11')
        .attr('font-weight', '700')
        .attr('pointer-events', 'none')
        .attr('fill', d => {
          const v = dataByRegion[d.properties.survey_id][colorMetric];
          return (v > vMin + (vMax - vMin) * .55) ? c0 : c1;
        })
        .text(d => {
          const v = dataByRegion[d.properties.survey_id][colorMetric];
          return labelFormat ? labelFormat(v) : String(v);
        });

      /* ── North arrow ── */
      svg.append('text').attr('x', W - 18).attr('y', 26).attr('text-anchor', 'middle')
        .attr('font-size', '15').attr('fill', '#AEA29A').attr('pointer-events','none').text('N');
      svg.append('text').attr('x', W - 18).attr('y', 14).attr('text-anchor', 'middle')
        .attr('font-size', '14').attr('fill', '#AEA29A').attr('pointer-events','none').text('↑');
    })
    .catch(err => {
      console.error('Map load error:', err);
      svg.append('text')
        .attr('x', W / 2).attr('y', H / 2)
        .attr('text-anchor', 'middle').attr('font-size', '13').attr('fill', '#6E6259')
        .text('Carte indisponible — vérifiez assets/burkina-adm1.geojson');
    });
}
