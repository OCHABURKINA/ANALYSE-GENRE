/* OCHA Humanitarian Icons - direct GitHub integration */
const OCHA_ICON_BASE = 'https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons/main/SVG';
const OCHA_ICON_MAP = {
  home:'Analysis', overview:'Analysis', analysis:'Analysis', data:'Data', report:'Report', download:'Download', map:'Map', filter:'Filter',
  people:'Affected population', population:'Affected population', respondents:'Affected population', gender:'Gender', women:'Gender', men:'Gender', girls:'Children', boys:'Children', children:'Children',
  protection:'Protection', vbg:'Gender-based violence', gbv:'Gender-based violence', health:'Health', education:'Education', wash:'Water sanitation and hygiene', water:'Water sanitation and hygiene', food:'Food security', nutrition:'Nutrition', shelter:'Shelter', livelihood:'Livelihood', cash:'Cash transfer',
  organisation:'Group', organization:'Group', organisations:'Group', organizations:'Group', odf:'Group', group:'Group', coordination:'Coordination', cluster:'Coordination', clusters:'Coordination', leadership:'Leadership', accountability:'Assessment', assessment:'Assessment', localisation:'Localization', local:'Localization', warning:'Alert', alert:'Alert', info:'Information'
};
function ochaIconName(key){return OCHA_ICON_MAP[key] || key || 'Analysis';}
function ochaIconUrl(key,color='UN Blue'){
  return `${OCHA_ICON_BASE}/${encodeURIComponent(color)}/${encodeURIComponent(ochaIconName(key)+'.svg')}`;
}
function renderOchaIcons(){
  document.querySelectorAll('[data-ocha-icon]').forEach(el=>{
    const icon=el.dataset.ochaIcon || 'analysis';
    const color=el.dataset.ochaColor || 'UN Blue';
    const alt=el.getAttribute('aria-label') || '';
    const fallback=ochaIconUrl('analysis', color);
    el.innerHTML=`<img src="${ochaIconUrl(icon,color)}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src='${fallback}'">`;
  });
}
document.addEventListener('DOMContentLoaded', renderOchaIcons);
