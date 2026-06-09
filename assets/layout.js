const SITE_ROOT = new URL("../", document.currentScript.src);

const SITE_LABELS = {
  home: "Contexte de l’étude",
  genre: "Analyse Genre",
  organisations: "Analyse Organisationnelle"
};

const MENUS = {
  genre: [
    ["overview", "Vue d’ensemble", "analysis", "pages/genre/index.html"],
    ["femmes-hommes", "Femmes & Hommes", "gender", "pages/genre/femmes-hommes.html"],
    ["filles-garcons", "Filles & Garçons", "children", "pages/genre/filles-garcons.html"],
    ["moyens-subsistance", "Moyens de subsistance", "livelihood", "pages/genre/moyens-subsistance.html"],
    ["protection-vbg", "Protection & VBG", "protection", "pages/genre/protection-vbg.html"]
  ],

  organisations: [
    ["overview", "Vue d’ensemble", "analysis", "pages/organisations/index.html"],
    ["odf", "ODF 89", "odf", "pages/organisations/odf.html"],
    ["coordination", "Coordination", "coordination", "pages/organisations/coordination.html"],
    ["clusters", "Clusters", "clusters", "pages/organisations/clusters.html"],
    ["redevabilite-genre", "Redevabilité genre", "assessment", "pages/organisations/redevabilite-genre.html"]
  ]
};

function siteUrl(path) {
  return new URL(path, SITE_ROOT).href;
}

function getCurrentSection() {
  return document.body.dataset.section || "home";
}

function getCurrentPage() {
  return document.body.dataset.page || "overview";
}

function activeClass(key) {
  return getCurrentPage() === key ? " active" : "";
}

function menuItem([key, label, icon, href]) {
  return `
    <a href="${siteUrl(href)}" class="nav-item${activeClass(key)}">
      <span class="nav-icon" data-ocha-icon="${icon}" data-ocha-color="white"></span>
      <span class="nav-label">${label}</span>
    </a>
  `;
}

function renderSidebar() {
  const el = document.querySelector("[data-site-sidebar]");
  if (!el) return;

  const section = getCurrentSection();
  const menu = MENUS[section] || [];

  el.innerHTML = `
    <div class="sidebar-logo">
      <img src="${siteUrl("assets/ocha-logo.png")}" alt="OCHA" onerror="this.hidden=true;this.nextElementSibling.hidden=false">
      <div class="brand-fallback" hidden>OCHA</div>
      <div>
        <div class="sidebar-logo-title">${SITE_LABELS[section] || "Analyse Conjointe Genre"}</div>
        <div class="sidebar-logo-sub">Burkina Faso · 2025</div>
      </div>
    </div>

    <div class="sidebar-badge">
      <strong>Analyse conjointe genre</strong><br>
      Données · Coordination · Redevabilité
    </div>

    <nav class="nav-section">
      <div class="nav-section-label">${SITE_LABELS[section] || "Navigation"}</div>
      ${menu.map(menuItem).join("")}
    </nav>

    <nav class="nav-section">
      <div class="nav-section-label">Portail</div>

      <a href="${siteUrl("index.html")}" class="nav-item">
        <span class="nav-icon" data-ocha-icon="home" data-ocha-color="white"></span>
        <span class="nav-label">Contexte</span>
      </a>

      <a href="${siteUrl("pages/genre/index.html")}" class="nav-item">
        <span class="nav-icon" data-ocha-icon="gender" data-ocha-color="white"></span>
        <span class="nav-label">Analyse Genre</span>
      </a>

      <a href="${siteUrl("pages/organisations/index.html")}" class="nav-item">
        <span class="nav-icon" data-ocha-icon="coordination" data-ocha-color="white"></span>
        <span class="nav-label">Analyse Organisationnelle</span>
      </a>
    </nav>

    <div class="sidebar-footer">
      © 2025 OCHA Burkina Faso<br>
      <a href="https://www.unocha.org/burkina-faso" target="_blank" rel="noopener">unocha.org/burkina-faso</a>
    </div>
  `;
}

function renderTopbar() {
  const el = document.querySelector("[data-site-topbar]");
  if (!el) return;

  const section = getCurrentSection();

  el.innerHTML = `
    <div class="topbar-breadcrumb">
      OCHA Burkina Faso <span class="sep">›</span>
      <span class="current">${SITE_LABELS[section] || "Contexte"}</span>
    </div>

    <nav class="topbar-nav" aria-label="Navigation principale">
      <a href="${siteUrl("index.html")}" class="${section === "home" ? "active" : ""}">
        <span class="top-nav-icon" data-ocha-icon="analysis"></span>
        Contexte
      </a>

      <a href="${siteUrl("pages/genre/index.html")}" class="${section === "genre" ? "active" : ""}">
        <span class="top-nav-icon" data-ocha-icon="gender"></span>
        Analyse Genre
      </a>

      <a href="${siteUrl("pages/organisations/index.html")}" class="${section === "organisations" ? "active" : ""}">
        <span class="top-nav-icon" data-ocha-icon="coordination"></span>
        Organisationnelle
      </a>
    </nav>
  `;
}

function renderFooter() {
  const el = document.querySelector("[data-site-footer]");
  if (!el) return;

  el.innerHTML = `
    <span>© 2025 OCHA Burkina Faso · Analyse Conjointe Genre</span>
    <span>Genre · Organisations · Coordination</span>
    <a href="https://www.unocha.org/burkina-faso" target="_blank" rel="noopener">unocha.org</a>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar();
  renderTopbar();
  renderFooter();

  if (typeof renderOchaIcons === "function") {
    renderOchaIcons();
  }
});
