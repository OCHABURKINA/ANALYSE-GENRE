const D = window.PORTAL_DATA;
const fmt = n => new Intl.NumberFormat('fr-FR').format(n);

document.querySelector('.menu-toggle').addEventListener('click',()=>document.querySelector('#main-nav').classList.toggle('open'));
document.querySelectorAll('#main-nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('#main-nav').classList.remove('open')));

const headline = [
  [fmt(D.meta.respondents),'personnes enquêtées'],[D.meta.regions,'régions couvertes'],[fmt(D.meta.adolescents),'adolescent·e·s'],[fmt(D.meta.adults),'adultes'],[D.meta.odf,'ODF consultées'],[D.meta.humanitarianActors,'acteurs humanitaires']
];
document.querySelector('#headline-stats').innerHTML=headline.map(([v,l])=>`<div class="stat"><strong>${v}</strong><span>${l}</span></div>`).join('');

document.querySelector('#method-grid').innerHTML=D.methodology.pillars.map((x,i)=>`<article><span class="eyebrow dark">0${i+1}</span><h3>${x.title}</h3><p>${x.text}</p></article>`).join('');
const samples=[[D.meta.respondents,'Personnes enquêtées'],[D.meta.pdi,'PDI'],[D.meta.hosts,'Communautés hôtes'],[D.meta.interviews,'Entretiens'],[D.meta.focusGroups,'Focus groups'],[D.meta.odf,'ODF']];
document.querySelector('#sample-grid').innerHTML=samples.map(([v,l])=>`<article><strong>${fmt(v)}</strong><span>${l}</span></article>`).join('');

document.querySelector('#chapter-nav').innerHTML=D.chapters.map(c=>`<a href="#${c.id}" style="background:${c.color}">${c.number}. ${c.title.split(':')[0]}</a>`).join('');

document.querySelector('#chapter-sections').innerHTML=D.chapters.map(c=>`
<section class="chapter" id="${c.id}" style="--chapter-color:${c.color};--chapter-accent:${c.accent}">
  <div class="chapter-header"><div><p class="eyebrow">Résultat clé ${c.number}</p><h2>${c.title}</h2><p class="chapter-summary">${c.summary}</p></div><div class="chapter-number">${c.number}</div></div>
  <div class="kpi-grid">${c.kpis.map(k=>`<article class="kpi-card"><strong>${k.value}</strong><span>${k.label}</span></article>`).join('')}</div>
  <div class="analysis-grid">
    <div>${c.charts.map((ch,i)=>`<article class="chart-card"><div class="plot" id="plot-${c.id}-${i}"></div></article>`).join('')}</div>
    <div><article class="insight-card"><h3>Lecture analytique</h3><ul>${c.insights.map(x=>`<li>${x}</li>`).join('')}</ul></article><article class="action-card" style="margin-top:20px"><h3>Priorités opérationnelles</h3><ul>${c.actions.map(x=>`<li>${x}</li>`).join('')}</ul></article></div>
  </div>
</section>`).join('');

const baseLayout=(title,color)=>({title:{text:title,font:{size:17,color:'#15212c'}},margin:{l:55,r:20,t:60,b:75},paper_bgcolor:'#fff',plot_bgcolor:'#fff',font:{family:'Inter, Arial',color:'#46515b'},xaxis:{tickangle:-18,gridcolor:'#eef2f5'},yaxis:{gridcolor:'#e7edf1',zeroline:false},showlegend:true,legend:{orientation:'h',y:-.28},colorway:[color]});
D.chapters.forEach(c=>c.charts.forEach((ch,i)=>{
  const el=`plot-${c.id}-${i}`; let traces=[];
  if(ch.type==='bar') traces=[{type:'bar',x:ch.labels,y:ch.values,marker:{color:c.accent},text:ch.values.map(v=>`${v}${ch.suffix||''}`),textposition:'outside',hovertemplate:'%{x}: %{y}'+(ch.suffix||'')+'<extra></extra>'}];
  if(ch.type==='grouped') traces=ch.series.map((s,idx)=>({type:'bar',name:s.name,x:ch.labels,y:s.values,text:s.values.map(v=>`${v}${ch.suffix||''}`),textposition:'outside',hovertemplate:'%{x}: %{y}'+(ch.suffix||'')+'<extra></extra>',marker:{color:idx===0?c.color:c.accent}}));
  const layout=baseLayout(ch.title,c.color); if(ch.type==='grouped') layout.barmode='group';
  Plotly.newPlot(el,traces,layout,{responsive:true,displaylogo:false,modeBarButtonsToRemove:['lasso2d','select2d']});
}));
