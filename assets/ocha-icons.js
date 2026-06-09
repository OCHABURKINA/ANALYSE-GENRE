/* ============================================================
   OCHA Humanitarian Icons
   Intégration directe depuis le dépôt officiel OCHA
   Source : https://github.com/UN-OCHA/humanitarian-icons
   ============================================================ */

const OCHA_ICON_BASE =
  "https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons/main/SVG";

/* 
   Couleurs disponibles dans le dépôt OCHA :
   - UN Blue
   - Black
   - White
*/

const OCHA_ICON_MAP = {
  /* Général */
  home: "Analysis",
  overview: "Analysis",
  analysis: "Analysis",
  data: "Data",
  report: "Report",
  download: "Download",
  map: "Map",
  filter: "Filter",
  information: "Information",
  info: "Information",
  warning: "Alert",
  alert: "Alert",

  /* Analyse genre */
  gender: "Gender",
  women: "Gender",
  men: "Gender",
  girls: "Children",
  boys: "Children",
  children: "Children",
  adolescents: "Children",
  youth: "Children",

  /* Protection */
  protection: "Protection",
  gbv: "Gender-based violence",
  vbg: "Gender-based violence",
  peas: "Protection",
  safety: "Protection",

  /* Secteurs */
  health: "Health",
  education: "Education",
  wash: "Water sanitation and hygiene",
  water: "Water sanitation and hygiene",
  hygiene: "Water sanitation and hygiene",
  food: "Food security",
  foodSecurity: "Food security",
  nutrition: "Nutrition",
  shelter: "Shelter",
  livelihood: "Livelihood",
  livelihoods: "Livelihood",
  cash: "Cash transfer",
  finance: "Cash transfer",

  /* Déplacement */
  pdi: "Internally displaced",
  displacement: "Internally displaced",
  displaced: "Internally displaced",
  host: "Affected population",
  population: "Affected population",
  people: "Affected population",
  respondents: "Affected population",

  /* Organisations / coordination */
  organisation: "Group",
  organisations: "Group",
  organization: "Group",
  organizations: "Group",
  odf: "Group",
  group: "Group",
  coordination: "Coordination",
  cluster: "Coordination",
  clusters: "Coordination",
  leadership: "Leadership",
  accountability: "Assessment",
  assessment: "Assessment",
  localisation: "Coordination",
  localization: "Coordination",

  /* Thèmes transversaux */
  decision: "Leadership",
  participation: "Community engagement",
  community: "Community engagement",
  feedback: "Feedback",
  complaint: "Feedback"
};

/* ============================================================
   Normalisation
   ============================================================ */

function normalizeIconKey(key) {
  if (!key) return "analysis";

  return String(key)
    .trim()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/_/g, "")
    .toLowerCase();
}

function normalizeColor(color) {
  if (!color) return "UN Blue";

  const c = String(color).trim().toLowerCase();

  if (c === "white" || c === "blanc") return "White";
  if (c === "black" || c === "noir") return "Black";
  if (c === "unblue" || c === "un blue" || c === "blue" || c === "bleu") return "UN Blue";

  return color;
}

function getOchaIconName(key) {
  const normalized = normalizeIconKey(key);
  return OCHA_ICON_MAP[normalized] || key || "Analysis";
}

function getOchaIconUrl(key, color = "UN Blue") {
  const iconName = encodeURIComponent(getOchaIconName(key) + ".svg");
  const iconColor = encodeURIComponent(normalizeColor(color));

  return `${OCHA_ICON_BASE}/${iconColor}/${iconName}`;
}

/* ============================================================
   Rendu HTML
   ============================================================ */

function createOchaIconHTML(iconKey, color = "UN Blue", label = "") {
  const primaryUrl = getOchaIconUrl(iconKey, color);
  const fallbackUrl = getOchaIconUrl("analysis", color);

  return `
    <img
      src="${primaryUrl}"
      alt="${label}"
      loading="lazy"
      onerror="this.onerror=null;this.src='${fallbackUrl}';"
    >
  `;
}

function renderOchaIcons() {
  document.querySelectorAll("[data-ocha-icon]").forEach(el => {
    const iconKey = el.getAttribute("data-ocha-icon") || "analysis";
    const color = el.getAttribute("data-ocha-color") || "UN Blue";
    const label = el.getAttribute("aria-label") || "";

    el.innerHTML = createOchaIconHTML(iconKey, color, label);
  });
}

/* ============================================================
   Utilitaire public pour insertion dynamique JS
   ============================================================ */

function ochaIcon(iconKey, color = "UN Blue", label = "") {
  return `
    <span class="ocha-icon" data-ocha-icon="${iconKey}" data-ocha-color="${color}" aria-label="${label}">
      ${createOchaIconHTML(iconKey, color, label)}
    </span>
  `;
}

/* ============================================================
   Initialisation
   ============================================================ */

document.addEventListener("DOMContentLoaded", renderOchaIcons);

window.ochaIcon = ochaIcon;
window.renderOchaIcons = renderOchaIcons;
window.getOchaIconUrl = getOchaIconUrl;
