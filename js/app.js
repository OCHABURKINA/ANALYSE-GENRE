'use strict';

const DATA = window.PORTAL_DATA;
const fmt = (value) => new Intl.NumberFormat('fr-FR').format(Number(value) || 0);
const esc = (value) => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');

function assertData(){
  if(!DATA || !DATA.meta || !Array.isArray(DATA.chapters)) throw new Error('Le fichier data/portal-data.js est absent ou invalide.');
}

function setupMenu(){
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('#main-nav');
  if(!toggle||!nav) return;
  toggle.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));});
  nav.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');});
}

function setupPanels(){
  const panels=[...document.querySelectorAll('[data-panel]')];
  const triggers=[...document.querySelectorAll('[data-panel-target]')];
  const activate=(id,hash=true)=>{
    const target=panels.find(p=>p.id===id)||panels[0];
    panels.forEach(p=>{const active=p===target;p.hidden=!active;p.classList.toggle('is-active',active);});
    triggers.forEach(t=>{const active=t.dataset.panelTarget===target.id;t.classList.toggle('is-active',active);t.setAttribute('aria-current',active?'page':'false');});
    if(hash) history.replaceState(null,'',`#${target.id}`);
    window.scrollTo({top:0,behavior:'smooth'});
    setTimeout(()=>window.dispatchEvent(new Event('resize')),100);
  };
  document.addEventListener('click',e=>{const t=e.target.closest('[data-panel-target]');if(!t)return;e.preventDefault();activate(t.dataset.panelTarget);});
  window.addEventListener('hashchange',()=>activate(location.hash.slice(1),false));
  activate(location.hash.slice(1)||'accueil',false);
}

function renderHeadline(){
  const rows=[[DATA.meta.respondents,'personnes enquêtées'],[DATA.meta.regions,'régions couvertes'],[DATA.meta.adolescents,'adolescent·e·s'],[DATA.meta.adults,'adultes'],[DATA.meta.odf,'ODF/ODDF consultées'],[DATA.meta.humanitarianActors,'acteurs humanitaires']];
  document.querySelector('#headline-stats').innerHTML=rows.map(([v,l])=>`<article class="stat"><strong>${fmt(v)}</strong><span>${esc(l)}</span></article>`).join('');
}

function renderMethod(){
  document.querySelector('#method-grid').innerHTML=DATA.methodology.pillars.map((x,i)=>`<article><span class="eyebrow dark">${String(i+1).padStart(2,'0')}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></article>`).join('');
  const rows=[[DATA.meta.respondents,'Personnes enquêtées'],[DATA.meta.pdi,'PDI'],[DATA.meta.hosts,'Communautés hôtes'],[DATA.meta.interviews,'Entretiens'],[DATA.meta.focusGroups,'Groupes de discussion'],[DATA.meta.odf,'ODF/ODDF']];
  document.querySelector('#sample-grid').innerHTML=rows.map(([v,l])=>`<article><strong>${fmt(v)}</strong><span>${esc(l)}</span></article>`).join('');
}

function layout(title,c){return{title:{text:title,font:{size:17,color:'#15212c'}},margin:{l:55,r:20,t:60,b:75},paper_bgcolor:'#fff',plot_bgcolor:'#fff',font:{family:'Inter, Arial',color:'#46515b'},xaxis:{tickangle:-18,gridcolor:'#eef2f5',automargin:true},yaxis:{gridcolor:'#e7edf1',zeroline:false,automargin:true},legend:{orientation:'h',y:-.28},colorway:[c.color,c.accent]};}
function traces(ch,c){if(ch.type==='grouped')return ch.series.map((s,i)=>({type:'bar',name:s.name,x:ch.labels,y:s.values,text:s.values.map(v=>`${v}${ch.suffix||''}`),textposition:'outside',marker:{color:i===0?c.color:c.accent}}));return[{type:'bar',x:ch.labels,y:ch.values,text:ch.values.map(v=>`${v}${ch.suffix||''}`),textposition:'outside',marker:{color:c.accent}}];}
function renderPlots(){if(!window.Plotly)return;DATA.chapters.forEach(c=>c.charts.forEach((ch,i)=>{const el=document.getElementById(`plot-${c.id}-${i}`);if(!el||el.offsetParent===null)return;const l=layout(ch.title,c);if(ch.type==='grouped')l.barmode='group';Plotly.react(el,traces(ch,c),l,{responsive:true,displaylogo:false,modeBarButtonsToRemove:['lasso2d','select2d']});}));}

function renderChapters(){
  const nav=document.querySelector('#chapter-nav');
  const out=document.querySelector('#chapter-sections');
  nav.innerHTML=DATA.chapters.map((c,i)=>`<button class="chapter-tab${i===0?' is-active':''}" type="button" data-chapter-target="${esc(c.id)}" style="--chapter-tab-color:${esc(c.color)}">${esc(c.number)}. ${esc(c.title.split(':')[0])}</button>`).join('');
  out.innerHTML=DATA.chapters.map((c,i)=>`<section class="chapter${i===0?' is-active':''}" id="${esc(c.id)}" data-chapter-panel ${i===0?'':'hidden'} style="--chapter-color:${esc(c.color)};--chapter-accent:${esc(c.accent)}"><div class="chapter-header"><div><p class="eyebrow">Résultat clé ${esc(c.number)}</p><h2>${esc(c.title)}</h2><p class="chapter-summary">${esc(c.summary)}</p></div><div class="chapter-number">${esc(c.number)}</div></div><div class="kpi-grid">${c.kpis.map(k=>`<article class="kpi-card"><strong>${esc(k.value)}</strong><span>${esc(k.label)}</span></article>`).join('')}</div><div class="analysis-grid"><div>${c.charts.map((ch,j)=>`<article class="chart-card"><div class="plot" id="plot-${esc(c.id)}-${j}"></div></article>`).join('')}</div><div><article class="insight-card"><h3>Lecture analytique</h3><ul>${c.insights.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article><article class="action-card"><h3>Priorités opérationnelles</h3><ul>${c.actions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article></div></div></section>`).join('');
  nav.addEventListener('click',e=>{const b=e.target.closest('[data-chapter-target]');if(!b)return;document.querySelectorAll('[data-chapter-panel]').forEach(p=>{const active=p.id===b.dataset.chapterTarget;p.hidden=!active;p.classList.toggle('is-active',active);});nav.querySelectorAll('button').forEach(x=>x.classList.toggle('is-active',x===b));renderPlots();});
}

function backToTop(){const b=document.querySelector('.back-to-top');window.addEventListener('scroll',()=>b.classList.toggle('is-visible',scrollY>500),{passive:true});b.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));}

addEventListener('DOMContentLoaded',()=>{try{assertData();setupMenu();setupPanels();renderHeadline();renderMethod();renderChapters();renderPlots();backToTop();addEventListener('resize',renderPlots);}catch(error){console.error(error);document.querySelector('#main-content').innerHTML=`<section class="fatal-error"><h1>Le portail ne peut pas être chargé</h1><p>${esc(error.message)}</p></section>`;}});
