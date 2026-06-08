/* ================================================================
   OCHA Humanitarian Icons — robust GitHub integration
   - Uses official UN-OCHA humanitarian-icons-2026-BDU SVG paths.
   - Icons are rendered as CSS masks, so the same SVG can be UN Blue,
     white, black, or any approved neutral color through CSS.
   - Includes text fallback when an icon URL fails or is blocked.
   ================================================================ */
(function(){
  const BASE = 'https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons-2026-BDU/main/svg/';

  const emojiToIcon = {
    '🏠':'Analysis',
    '👥':'People-affected',
    '🎓':'Education',
    '🏢':'NGO-office',
    '📊':'Chart',
    '⚖️':'Gender',
    '⏱️':'Time',
    '💼':'Livelihood',
    '🗺️':'Map',
    '🏥':'Health',
    '📚':'Education',
    '💍':'Protection',
    '🏕️':'Internally-displaced',
    '🛡️':'Protection',
    '💧':'Water-sanitation-and-hygiene',
    '🌾':'Agriculture',
    '🏘️':'Shelter',
    '⚠️':'Warning-error',
    '📉':'Trending',
    '✅':'Validate-account',
    '📍':'Location',
    '📅':'Calendar',
    '💰':'Cash-transfer',
    '⚡':'Response',
    '🤝':'Partnership',
    '🍲':'Food-security',
    'ℹ️':'Information-management',
    '📌':'Information-management',
    '🚰':'Potable-water',
    '🧼':'Sanitation',
    '👧':'Children',
    '👦':'Children'
  };

  const aliases = {
    home:'Analysis', overview:'Analysis', analyse:'Analysis', analysis:'Analysis',
    population:'People-affected', people:'People-affected', respondents:'People-affected',
    gender:'Gender', sex:'Sex', women:'Gender', men:'Gender',
    children:'Children', child:'Children', girls:'Children', boys:'Children',
    education:'Education', school:'School', health:'Health', protection:'Protection',
    gbv:'Gender-based-violence', vbg:'Gender-based-violence',
    pdi:'Internally-displaced', idp:'Internally-displaced', displaced:'Internally-displaced',
    wash:'Water-sanitation-and-hygiene', water:'Potable-water', sanitation:'Sanitation',
    shelter:'Shelter', cash:'Cash-transfer', food:'Food-security', livelihood:'Livelihood',
    map:'Map', chart:'Chart', data:'Data', download:'Download', report:'Report',
    coordination:'Coordination', partnership:'Partnership', financing:'Financing',
    warning:'Warning-error', info:'Information-management', time:'Time', calendar:'Calendar',
    location:'Location', ngo:'NGO-office', response:'Response', agriculture:'Agriculture'
  };

  function iconUrl(name){ return BASE + encodeURIComponent(name).replace(/%2F/g,'/') + '.svg'; }
  function shortLabel(name){ return String(name || 'Icon').split('-').map(s=>s[0]).join('').slice(0,2).toUpperCase(); }

  function makeIcon(name, className){
    const span = document.createElement('span');
    const cleanName = aliases[String(name).toLowerCase()] || name;
    span.className = className || 'ocha-symbol';
    span.setAttribute('aria-hidden','true');
    span.setAttribute('data-icon', cleanName);
    span.setAttribute('data-fallback', shortLabel(cleanName));
    span.style.setProperty('--icon-url', `url("${iconUrl(cleanName)}")`);
    return span;
  }

  function replaceEmojiElement(el){
    if(!el || el.querySelector('.ocha-symbol')) return;
    const raw = (el.textContent || '').trim();
    const iconName = emojiToIcon[raw] || aliases[raw.toLowerCase()];
    if(!iconName) return;
    const isLarge = el.classList.contains('kpi-icon');
    el.textContent = '';
    el.appendChild(makeIcon(iconName, isLarge ? 'ocha-symbol ocha-symbol-lg' : 'ocha-symbol'));
  }

  function replaceLeadingEmoji(el){
    if(!el || el.querySelector('.ocha-symbol')) return;
    const txt = (el.textContent || '').trim();
    const emoji = Object.keys(emojiToIcon).find(e => txt.startsWith(e));
    if(!emoji) return;
    el.textContent = txt.replace(emoji,'').trim();
    el.prepend(makeIcon(emojiToIcon[emoji], 'ocha-symbol'));
  }

  function renderAll(){
    document.querySelectorAll('.nav-icon,.kpi-icon,.insight-icon').forEach(replaceEmojiElement);
    document.querySelectorAll('.header-chip,.chip,.tag').forEach(replaceLeadingEmoji);
    document.querySelectorAll('[data-ocha-icon]').forEach(el=>{
      if(el.querySelector('.ocha-symbol')) return;
      el.prepend(makeIcon(el.getAttribute('data-ocha-icon'), el.getAttribute('data-ocha-icon-class') || 'ocha-symbol'));
    });
  }

  window.OCHAIcon = function(name, className='ocha-symbol'){
    const resolved = aliases[String(name).toLowerCase()] || name;
    return `<span class="${className}" aria-hidden="true" data-icon="${resolved}" data-fallback="${shortLabel(resolved)}" style="--icon-url:url('${iconUrl(resolved)}')"></span>`;
  };

  document.addEventListener('DOMContentLoaded', renderAll);
  window.addEventListener('load', renderAll);
})();
