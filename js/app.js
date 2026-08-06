'use strict';

const DATA = window.PORTAL_DATA;
const EXTENDED = window.EXTENDED_ANALYSIS || {};
const numberFormatter = new Intl.NumberFormat('fr-FR');

function fmt(value) {
  return numberFormatter.format(Number(value) || 0);
}

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function assertData() {
  if (!DATA || !DATA.meta || !Array.isArray(DATA.chapters)) {
    throw new Error('Le fichier data/portal-data.js est absent ou invalide.');
  }
}

function setupMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) close();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) close();
  });
}

function setupPanels() {
  const panels = [...document.querySelectorAll('[data-panel]')];
  const triggers = [...document.querySelectorAll('[data-panel-target]')];

  const activate = (id, updateHash = true) => {
    const target = panels.find((panel) => panel.id === id) || panels[0];
    if (!target) return;

    panels.forEach((panel) => {
      const active = panel === target;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });

    triggers.forEach((trigger) => {
      const active = trigger.dataset.panelTarget === target.id;
      trigger.classList.toggle('is-active', active);
      trigger.setAttribute('aria-current', active ? 'page' : 'false');
    });

    if (updateHash) history.replaceState(null, '', `#${target.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      renderPlots();
    }, 120);
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-panel-target]');
    if (!trigger) return;
    event.preventDefault();
    activate(trigger.dataset.panelTarget);
  });

  window.addEventListener('hashchange', () => {
    activate(window.location.hash.slice(1), false);
  });

  activate(window.location.hash.slice(1) || 'accueil', false);
}

function renderHeadline() {
  const rows = [
    [DATA.meta.respondents, 'personnes enquêtées'],
    [DATA.meta.regions, 'régions couvertes'],
    [DATA.meta.adolescents, 'adolescent·e·s'],
    [DATA.meta.adults, 'adultes'],
    [DATA.meta.odf, 'ODF/ODDF consultées'],
    [DATA.meta.humanitarianActors, 'acteurs humanitaires']
  ];

  document.querySelector('#headline-stats').innerHTML = rows.map(([value, label]) => `
    <article class="stat">
      <strong>${fmt(value)}</strong>
      <span>${esc(label)}</span>
    </article>
  `).join('');
}

function renderMethod() {
  document.querySelector('#method-grid').innerHTML = DATA.methodology.pillars.map((item, index) => `
    <article>
      <span class="eyebrow dark">${String(index + 1).padStart(2, '0')}</span>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.text)}</p>
    </article>
  `).join('');

  const rows = [
    [DATA.meta.respondents, 'Personnes enquêtées'],
    [DATA.meta.pdi, 'PDI'],
    [DATA.meta.hosts, 'Communautés hôtes'],
    [DATA.meta.interviews, 'Entretiens'],
    [DATA.meta.focusGroups, 'Groupes de discussion'],
    [DATA.meta.odf, 'ODF/ODDF']
  ];

  document.querySelector('#sample-grid').innerHTML = rows.map(([value, label]) => `
    <article>
      <strong>${fmt(value)}</strong>
      <span>${esc(label)}</span>
    </article>
  `).join('');
}

function getExtended(chapter) {
  return EXTENDED[String(chapter.number)] || EXTENDED[chapter.id] || null;
}

function renderExtendedSection(chapter) {
  const extended = getExtended(chapter);
  if (!extended || !Array.isArray(extended.charts) || extended.charts.length === 0) return '';

  return `
    <section class="extended-analysis" aria-labelledby="extended-title-${esc(chapter.id)}">
      <div class="extended-heading">
        <div>
          <p class="eyebrow dark">Analyse approfondie</p>
          <h3 id="extended-title-${esc(chapter.id)}">Désagrégations et comparaisons complémentaires</h3>
        </div>
        <p>
          Comparaisons selon le sexe, l’âge, le statut de déplacement et le type de population,
          lorsque les données du rapport le permettent.
        </p>
      </div>

      <div class="extended-chart-grid">
        ${extended.charts.map((chart, index) => `
          <article class="chart-card extended-chart-card">
            <div class="plot extended-plot" id="extended-plot-${esc(chapter.id)}-${index}"></div>
            ${chart.note ? `<p class="chart-note"><strong>Lecture :</strong> ${esc(chart.note)}</p>` : ''}
          </article>
        `).join('')}
      </div>

      <article class="extended-insight-card">
        <h3>Analyse transversale</h3>
        <ul>
          ${(extended.analysis || []).map((item) => `<li>${esc(item)}</li>`).join('')}
        </ul>
        <p class="chart-source">Source : Résumé exécutif de l’Analyse conjointe genre, janvier 2026.</p>
      </article>
    </section>
  `;
}

function layout(title, chapter) {
  return {
    title: {
      text: title,
      font: { size: 17, color: '#15212c' }
    },
    margin: { l: 58, r: 24, t: 64, b: 88 },
    paper_bgcolor: '#ffffff',
    plot_bgcolor: '#ffffff',
    font: { family: 'Inter, Arial', color: '#46515b' },
    xaxis: {
      tickangle: -18,
      gridcolor: '#eef2f5',
      automargin: true
    },
    yaxis: {
      gridcolor: '#e7edf1',
      zeroline: false,
      automargin: true,
      rangemode: 'tozero'
    },
    legend: {
      orientation: 'h',
      y: -0.3,
      x: 0
    },
    colorway: [chapter.color, chapter.accent, '#147A45', '#C65A1A']
  };
}

function traces(chart, chapter) {
  if (chart.type === 'grouped') {
    return chart.series.map((series, index) => ({
      type: 'bar',
      name: series.name,
      x: chart.labels,
      y: series.values,
      text: series.values.map((value) => `${value}${chart.suffix || ''}`),
      textposition: 'outside',
      cliponaxis: false,
      hovertemplate: `%{x}<br>${esc(series.name)} : %{y}${chart.suffix || ''}<extra></extra>`,
      marker: {
        color: [chapter.color, chapter.accent, '#147A45', '#C65A1A'][index % 4]
      }
    }));
  }

  return [{
    type: 'bar',
    x: chart.labels,
    y: chart.values,
    text: chart.values.map((value) => `${value}${chart.suffix || ''}`),
    textposition: 'outside',
    cliponaxis: false,
    hovertemplate: `%{x}<br>%{y}${chart.suffix || ''}<extra></extra>`,
    marker: { color: chapter.accent }
  }];
}

function renderOnePlot(element, chart, chapter) {
  const chartLayout = layout(chart.title, chapter);
  if (chart.type === 'grouped') chartLayout.barmode = 'group';

  Plotly.react(
    element,
    traces(chart, chapter),
    chartLayout,
    {
      responsive: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d']
    }
  );
}

function renderPlots() {
  if (!window.Plotly) return;

  DATA.chapters.forEach((chapter) => {
    chapter.charts.forEach((chart, index) => {
      const element = document.getElementById(`plot-${chapter.id}-${index}`);
      if (!element || element.offsetParent === null) return;
      renderOnePlot(element, chart, chapter);
    });

    const extended = getExtended(chapter);
    if (!extended) return;

    extended.charts.forEach((chart, index) => {
      const element = document.getElementById(`extended-plot-${chapter.id}-${index}`);
      if (!element || element.offsetParent === null) return;
      renderOnePlot(element, chart, chapter);
    });
  });
}

function renderChapters() {
  const nav = document.querySelector('#chapter-nav');
  const output = document.querySelector('#chapter-sections');

  nav.innerHTML = DATA.chapters.map((chapter, index) => `
    <button
      class="chapter-tab${index === 0 ? ' is-active' : ''}"
      type="button"
      data-chapter-target="${esc(chapter.id)}"
      style="--chapter-tab-color:${esc(chapter.color)}"
    >
      ${esc(chapter.number)}. ${esc(chapter.title.split(':')[0])}
    </button>
  `).join('');

  output.innerHTML = DATA.chapters.map((chapter, index) => `
    <section
      class="chapter${index === 0 ? ' is-active' : ''}"
      id="${esc(chapter.id)}"
      data-chapter-panel
      ${index === 0 ? '' : 'hidden'}
      style="--chapter-color:${esc(chapter.color)};--chapter-accent:${esc(chapter.accent)}"
    >
      <div class="chapter-header">
        <div>
          <p class="eyebrow">Résultat clé ${esc(chapter.number)}</p>
          <h2>${esc(chapter.title)}</h2>
          <p class="chapter-summary">${esc(chapter.summary)}</p>
        </div>
        <div class="chapter-number" aria-hidden="true">${esc(chapter.number)}</div>
      </div>

      <div class="kpi-grid">
        ${chapter.kpis.map((kpi) => `
          <article class="kpi-card">
            <strong>${esc(kpi.value)}</strong>
            <span>${esc(kpi.label)}</span>
          </article>
        `).join('')}
      </div>

      <div class="analysis-grid">
        <div>
          ${chapter.charts.map((chart, chartIndex) => `
            <article class="chart-card">
              <div class="plot" id="plot-${esc(chapter.id)}-${chartIndex}"></div>
            </article>
          `).join('')}
        </div>

        <div>
          <article class="insight-card">
            <h3>Lecture analytique</h3>
            <ul>${chapter.insights.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
          </article>

          <article class="action-card">
            <h3>Priorités opérationnelles</h3>
            <ul>${chapter.actions.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
          </article>
        </div>
      </div>

      ${renderExtendedSection(chapter)}
    </section>
  `).join('');

  nav.addEventListener('click', (event) => {
    const button = event.target.closest('[data-chapter-target]');
    if (!button) return;

    document.querySelectorAll('[data-chapter-panel]').forEach((panel) => {
      const active = panel.id === button.dataset.chapterTarget;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });

    nav.querySelectorAll('button').forEach((item) => {
      item.classList.toggle('is-active', item === button);
    });

    renderPlots();
  });
}

function backToTop() {
  const button = document.querySelector('.back-to-top');
  if (!button) return;

  window.addEventListener('scroll', () => {
    button.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    assertData();
    setupMenu();
    setupPanels();
    renderHeadline();
    renderMethod();
    renderChapters();
    renderPlots();
    backToTop();
    window.addEventListener('resize', renderPlots);
  } catch (error) {
    console.error(error);
    document.querySelector('#main-content').innerHTML = `
      <section class="fatal-error">
        <h1>Le portail ne peut pas être chargé</h1>
        <p>${esc(error.message)}</p>
      </section>
    `;
  }
});
