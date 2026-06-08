/* ================================================================
   OCHA Humanitarian Icons — GitHub direct integration
   Source officielle: https://github.com/UN-OCHA/humanitarian-icons
   Utilise les chemins exacts: SVG/UN-blue, SVG/white, SVG/black
   ================================================================ */
(function(){
  const BASE = 'https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons/main/SVG';
  const MAP = {
    'analysis':'Analysis','assessment':'Assessment','affected-population':'Affected-population','people':'Affected-population','population':'Affected-population',
    'gender':'Gender','children':'Children','education':'Education','coordination':'Coordination','group':'Group','organization':'Coordination',
    'protection':'Protection','gender-based-violence':'Gender-based-violence','health':'Health','water-sanitation-and-hygiene':'Water-sanitation-and-hygiene',
    'wash':'Water-sanitation-and-hygiene','shelter':'Shelter','livelihood':'Livelihood','agriculture':'Agriculture','food-security':'Food-security',
    'nutrition':'Nutrition','cash-transfer':'Cash-transfer','map':'Map','calendar':'Calendar','alert':'Alert','information-management':'Information-management',
    'time':'Clock','check':'Check','internally-displaced':'Internally-displaced-people','camp':'Camp-coordination-and-camp-management',
    'download':'Download','report':'Report','leadership':'Leadership','partnership':'Partnership'
  };
  const EMOJI = {'🏠':'analysis','👥':'affected-population','🎓':'education','🏢':'coordination','📊':'analysis','⚖️':'gender','⏱️':'time','💼':'livelihood','🗺️':'map','🏥':'health','📚':'education','💍':'gender-based-violence','🏕️':'internally-displaced','🛡️':'protection','💧':'water-sanitation-and-hygiene','🌾':'agriculture','🏘️':'shelter','⚠️':'alert','📉':'analysis','🏫':'education','✅':'check','📍':'map','📅':'calendar','💰':'cash-transfer','⚡':'alert','🤝':'coordination','🍲':'food-security','ℹ️':'information-management','📌':'information-management'};
  function variant(v){ v=String(v||'UN-blue').toLowerCase(); if(v.includes('white')) return 'white'; if(v.includes('black')) return 'black'; return 'UN-blue'; }
  function fileName(key){ return MAP[String(key||'analysis').toLowerCase()] || MAP.analysis; }
  function iconUrl(key, color){ return BASE + '/' + variant(color) + '/' + encodeURIComponent(fileName(key)) + '.svg'; }
  function img(key, color, cls){ const im=document.createElement('img'); im.className=cls||'ocha-icon'; im.alt=''; im.loading='lazy'; im.src=iconUrl(key,color); im.onerror=function(){ this.onerror=null; this.src=iconUrl('analysis',color); }; return im; }
  function renderDataIcon(el){ const key=el.getAttribute('data-ocha-icon'); if(!key || el.dataset.ochaProcessed==='1') return; const color=el.getAttribute('data-ocha-color') || (el.closest('.sidebar,.topbar,.page-header') ? 'white' : 'UN-blue'); const cls=el.classList.contains('kpi-icon')?'ocha-icon-lg':'ocha-icon'; el.textContent=''; el.appendChild(img(key,color,cls)); el.dataset.ochaProcessed='1'; }
  function renderEmoji(el){ if(el.dataset.ochaProcessed==='1') return; const raw=(el.textContent||'').trim(); const e=Object.keys(EMOJI).find(x=>raw===x || raw.startsWith(x+' ')); if(!e) return; const label=raw.replace(e,'').trim(); const color=(el.closest('.sidebar,.topbar,.page-header')?'white':'UN-blue'); const cls=el.classList.contains('kpi-icon')?'ocha-icon-lg':'ocha-icon'; el.textContent=''; el.appendChild(img(EMOJI[e],color,cls)); if(label) el.appendChild(document.createTextNode(' '+label)); el.dataset.ochaProcessed='1'; }
  function run(){ document.querySelectorAll('[data-ocha-icon]').forEach(renderDataIcon); document.querySelectorAll('.nav-icon,.kpi-icon,.insight-icon,.header-chip').forEach(renderEmoji); }
  window.OCHAIconUrl = iconUrl;
  window.OCHAIconHTML = function(key,color='UN-blue',cls='ocha-icon'){ return `<img class="${cls}" src="${iconUrl(key,color)}" alt="" loading="lazy">`; };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
})();
