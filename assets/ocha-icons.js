/* ================================================================
   OCHA Humanitarian Icons — intégration robuste avec fallback
   - Remplace les emojis par des icônes SVG quand elles chargent.
   - Si une URL échoue, l'emoji original reste visible.
   ================================================================ */
(function(){
  const BASES = [
    'https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons/main/SVG/UN%20blue/',
    'https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons/main/SVG/UN%20Blue/',
    'https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons/main/SVG/blue/',
    'https://un-ocha.github.io/humanitarian-icons/SVG/UN%20blue/'
  ];

  const iconMap = {
    '🏠':['analysis','home','humanitarian-programme-cycle'],
    '👥':['affected-population','people-affected','population','people'],
    '🎓':['education','school'],
    '🏢':['ngo-office','office','coordination'],
    '📊':['analysis','assessment','information-management'],
    '⚖️':['gender','protection'],
    '⏱️':['time','calendar'],
    '💼':['livelihood','early-recovery'],
    '🗺️':['map','access'],
    '🏥':['health'],
    '📚':['education'],
    '💍':['protection','gender-based-violence'],
    '🏕️':['internally-displaced','displaced-population','camp-coordination-and-camp-management'],
    '🛡️':['protection'],
    '💧':['water-sanitation-and-hygiene','wash','water'],
    '🌾':['agriculture','food-security'],
    '🏘️':['shelter','housing'],
    '⚠️':['alert','warning-error','hazard'],
    '📉':['analysis','assessment'],
    '✅':['check','affected-population'],
    '📍':['location','map'],
    '📅':['calendar'],
    '💰':['cash-transfer','cash','funding'],
    '⚡':['response','emergency-telecommunications'],
    '🤝':['partnership','coordination'],
    '🍲':['food-security','nutrition'],
    'ℹ️':['information-management','information'],
    '📌':['information-management','information']
  };

  function candidates(names){
    const out=[];
    names.forEach(n=>{
      const variants = [n, n.replace(/-/g,'_'), n.replace(/-/g,' '), n.toLowerCase(), n.replace(/(^|[-_\s])\w/g, s=>s.toUpperCase())];
      variants.forEach(v=>BASES.forEach(b=>out.push(b + encodeURIComponent(v).replace(/%2F/g,'/') + '.svg')));
    });
    return [...new Set(out)];
  }

  function makeFallback(text, cls){
    const span=document.createElement('span');
    span.className='icon-fallback';
    span.textContent=text;
    return span;
  }

  function tryImage(urls, emoji, cls, done){
    let i=0;
    const img=document.createElement('img');
    img.className=cls || 'ocha-icon';
    img.alt='';
    img.loading='lazy';
    img.onload=()=>done(img);
    img.onerror=()=>{
      i++;
      if(i<urls.length){ img.src=urls[i]; }
      else { done(makeFallback(emoji, cls)); }
    };
    img.src=urls[i];
  }

  function inferClass(el){
    if(el.classList.contains('kpi-icon')) return 'ocha-icon-lg';
    return 'ocha-icon';
  }

  function replaceIconContainer(el){
    if(el.dataset.ochaProcessed==='1') return;
    const raw=(el.textContent||'').trim();
    const emoji=Object.keys(iconMap).find(e=>raw === e || raw.startsWith(e));
    if(!emoji) return;
    el.dataset.ochaProcessed='1';
    const label=raw.replace(emoji,'').trim();
    const cls=inferClass(el);
    tryImage(candidates(iconMap[emoji]), emoji, cls, node=>{
      el.textContent='';
      el.appendChild(node);
      if(label && el.classList.contains('header-chip')) el.appendChild(document.createTextNode(' ' + label));
    });
  }

  function run(){
    document.querySelectorAll('.nav-icon,.kpi-icon,.insight-icon,.header-chip').forEach(replaceIconContainer);
  }

  window.OCHAIcon = function(name, variant='UN-blue', cls='ocha-icon'){
    const safe = String(name||'analysis').toLowerCase();
    return `<img class="${cls}" src="https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons/main/SVG/UN%20blue/${safe}.svg" alt="" loading="lazy" onerror="this.style.display='none'">`;
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
