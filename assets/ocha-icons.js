/* ================================================================
   OCHA Humanitarian Icons — intégration directe depuis GitHub
   Les URLs correspondent au dépôt officiel UN-OCHA/humanitarian-icons.
   ================================================================ */
(function(){
  const BASE = 'https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons/main/SVG/';
  const iconMap = {
    '🏠':'Analysis','👥':'Affected-population','🎓':'Education','🏢':'NGO-office','📊':'Chart','⚖️':'Gender','⏱️':'Time','💼':'Livelihood','🗺️':'Map','🏥':'Health','📚':'Education','💍':'Protection','🏕️':'Internally-displaced','🛡️':'Protection','💧':'Water-sanitation-and-hygiene','🌾':'Agriculture','🏘️':'Shelter','⚠️':'Warning-error','📉':'Trending','✅':'Validate-account','📍':'Location','📅':'Calendar','💰':'Cash-transfer','⚡':'Response','🤝':'Partnership','🍲':'Food-security','ℹ️':'Information-management','📌':'Information-management'
  };
  function url(name, variant){ return `${BASE}${variant}/${name}.svg`; }
  function img(name, variant, cls){ const i=document.createElement('img'); i.src=url(name,variant); i.alt=''; i.loading='lazy'; i.className=cls||'ocha-icon'; return i; }
  function inferVariant(el){ return (el.closest('.nav-item.active') || el.closest('.page-header') || el.closest('.chip-or')) ? 'white' : 'UN-blue'; }
  function replaceEmojiElement(el){
    const key = (el.textContent||'').trim();
    const name = iconMap[key];
    if(!name || el.querySelector('img')) return;
    el.textContent='';
    el.appendChild(img(name, inferVariant(el), el.classList.contains('kpi-icon')?'ocha-icon-lg':'ocha-icon'));
  }
  function replaceTextIcons(){
    document.querySelectorAll('.nav-icon,.kpi-icon,.insight-icon').forEach(replaceEmojiElement);
    document.querySelectorAll('.header-chip').forEach(el=>{
      const txt=el.textContent.trim();
      const emoji=Object.keys(iconMap).find(e=>txt.startsWith(e));
      if(!emoji || el.querySelector('img')) return;
      el.textContent=txt.replace(emoji,'').trim();
      el.prepend(img(iconMap[emoji], 'white', 'ocha-icon'));
    });
  }
  window.OCHAIcon = function(name, variant='UN-blue', cls='ocha-icon'){ return `<img class="${cls}" src="${url(name,variant)}" alt="" loading="lazy">`; };
  document.addEventListener('DOMContentLoaded', replaceTextIcons);
})();
