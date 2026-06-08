/* ================================================================
   OCHA Map — Shared D3 map renderer
   Uses burkina-adm1.geojson (real GADM data)
   ================================================================ */

function renderOchaMap({ svgId, tooltipId, detailId, dataByRegion, colorMetric, colorRange, labelFormat, basePath }) {
  const svg = d3.select('#' + svgId);
  const W = 580, H = 500;
  const tip = document.getElementById(tooltipId);
  const cont = svg.node().parentElement;
  const geoPath = basePath || '../assets/';

  /* colour scale */
  const vals = Object.values(dataByRegion).map(d => d[colorMetric]).filter(Boolean);
  const [vMin, vMax] = colorRange || [Math.min(...vals), Math.max(...vals)];
  const colScale = d3.scaleSequential([vMin, vMax], d3.interpolate('#E3EDF6', '#002E6E'));

  fetch(geoPath + 'burkina-adm1.geojson')
    .then(r => r.json())
    .then(geo => {
      const proj = d3.geoMercator().fitSize([W - 10, H - 10], geo).translate([W / 2, H / 2]);
      const path = d3.geoPath().projection(proj);

      const g = svg.append('g');

      /* regions */
      g.selectAll('.map-region')
        .data(geo.features)
        .enter().append('path')
        .attr('class', d => {
          const sid = d.properties.id;
          return 'map-region' + (d.properties.surveyed && dataByRegion[sid] ? '' : ' not-surveyed');
        })
        .attr('d', path)
        .attr('fill', d => {
          const sid = d.properties.id;
          if (!d.properties.surveyed || !dataByRegion[sid]) return '#DDDAD7';
          return colScale(dataByRegion[sid][colorMetric]);
        })
        .on('mousemove', function(ev, d) {
          const sid = d.properties.id;
          if (!dataByRegion[sid]) return;
          const sd = dataByRegion[sid];
          const r = cont.getBoundingClientRect();
          tip.style.display = 'block';
          tip.style.left = (ev.clientX - r.left + 16) + 'px';
          tip.style.top  = (ev.clientY - r.top  - 14) + 'px';
          tip.innerHTML = `<div class="map-tooltip-title">${sd.name}</div>` +
            Object.entries(sd.metrics || {}).map(([k,v]) =>
              `<div class="map-tooltip-row"><span>${k}</span><span class="map-tooltip-val">${v}</span></div>`
            ).join('');
        })
        .on('mouseleave', () => tip.style.display = 'none')
        .on('click', function(ev, d) {
          const sid = d.properties.id;
          if (!dataByRegion[sid]) return;
          const sd = dataByRegion[sid];
          g.selectAll('.map-region.selected').classed('selected', false);
          d3.select(this).classed('selected', true);
          if (detailId) {
            const det = document.getElementById(detailId);
            if (det) {
              det.classList.add('visible');
              const title = det.querySelector('.map-detail-title');
              if (title) title.textContent = sd.name + ' — ' + (sd.n || '') + ' répondants';
              // fill detail cells
              Object.entries(sd.detail || {}).forEach(([k,v]) => {
                const el = document.getElementById(k);
                if (el) el.textContent = v;
              });
            }
          }
        });

      /* labels on surveyed regions */
      g.selectAll('.map-lbl')
        .data(geo.features.filter(d => d.properties.surveyed && dataByRegion[d.properties.id]))
        .enter().append('text')
        .attr('class','map-label-text')
        .attr('transform', d => `translate(${path.centroid(d)})`)
        .attr('text-anchor','middle')
        .attr('dominant-baseline','middle')
        .attr('font-size','11')
        .attr('font-weight','700')
        .attr('fill', d => {
          const v = dataByRegion[d.properties.id][colorMetric];
          return v > (vMin + (vMax-vMin)*.6) ? '#E3EDF6' : '#002E6E';
        })
        .text(d => {
          const v = dataByRegion[d.properties.id][colorMetric];
          return labelFormat ? labelFormat(v) : v;
        });

      /* north arrow */
      svg.append('text').attr('x', W-20).attr('y',28).attr('text-anchor','middle').attr('font-size','16').attr('fill','#AEA29A').text('N');
      svg.append('text').attr('x', W-20).attr('y',16).attr('text-anchor','middle').attr('font-size','15').attr('fill','#AEA29A').text('↑');
    })
    .catch(e => {
      svg.append('text').attr('x',W/2).attr('y',H/2).attr('text-anchor','middle').attr('font-size','13').attr('fill','#6E6259').text('Carte non disponible');
    });
}
