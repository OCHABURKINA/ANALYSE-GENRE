/* Minimal safe D3 map renderer, compatible with existing burkina-data.js if present */
function renderOchaMap(opts){
  const svg=d3.select('#'+opts.svgId); if(svg.empty() || !window.BURKINA_GEOJSON) return;
  const width=580,height=500, data=opts.dataByRegion||{};
  svg.selectAll('*').remove();
  const g=svg.append('g');
  const projection=d3.geoMercator().fitSize([width-20,height-20], BURKINA_GEOJSON);
  const path=d3.geoPath(projection);
  const range=opts.colorRange||[0,100];
  const color=opts.colorScale || d3.scaleSequential(range, d3.interpolate('#E3EDF6','#002E6E'));
  const keyOf=f=> (f.properties.survey_id || f.properties.id || f.properties.adm1_name || '').toString().toLowerCase();
  const tip=opts.tooltipId?d3.select('#'+opts.tooltipId):null;
  g.selectAll('path').data(BURKINA_GEOJSON.features).enter().append('path')
    .attr('d',path).attr('fill',f=>{const r=data[keyOf(f)];return r?color(r[opts.colorMetric]||0):'#E3EDF6';})
    .attr('stroke','#fff').attr('stroke-width',1.2).style('cursor','pointer')
    .on('mousemove',(event,f)=>{if(!tip||tip.empty())return;const r=data[keyOf(f)];if(!r)return;let rows=Object.entries(r.metrics||{}).map(([k,v])=>`<div class="map-tooltip-row"><span>${k}</span><b>${v}</b></div>`).join('');tip.style('display','block').style('left',(event.offsetX+14)+'px').style('top',(event.offsetY+14)+'px').html(`<div class="map-tooltip-title">${r.label||r.name||keyOf(f)}</div>${rows}`);})
    .on('mouseleave',()=>{if(tip&&!tip.empty())tip.style('display','none');})
    .on('click',(event,f)=>{const r=data[keyOf(f)];if(!r||!r.detail)return;Object.entries(r.detail).forEach(([id,val])=>{const el=document.getElementById(id);if(el)el.textContent=val;});const title=document.getElementById('mdTitle');if(title)title.textContent=r.label||r.name||keyOf(f);});
}
