/* ============================================================
   OCHA Humanitarian Icons — intégration directe depuis GitHub
   Source officielle : https://github.com/UN-OCHA/humanitarian-icons
   ============================================================ */

const OCHA_ICON_BASE =
  "https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons/main/SVG";

const OCHA_ICONS = {
  home: "Analysis",
  overview: "Analysis",
  analysis: "Analysis",
  comparison: "Analysis",

  people: "Affected population",
  population: "Affected population",
  respondents: "Affected population",

  gender: "Gender",
  women: "Woman",
  men: "Man",
  girls: "Children",
  boys: "Children",
  children: "Children",

  odf: "Group",
  organization: "Coordination",
  coordination: "Coordination",

  decision: "Leadership",
  work: "Livelihood",
  livelihood: "Livelihood",
  employment: "Livelihood",

  education: "Education",
  school: "Education",

  marriage: "Gender",
  protection: "Protection",
  gbv: "Gender-based violence",
  vbg: "Gender-based violence",

  displacement: "Internally displaced",
  pdi: "Internally displaced",
  shelter: "Shelter",

  health: "Health",
  wash: "Water sanitation and hygiene",
  water: "Water sanitation and hygiene",

  food: "Food security",
  nutrition: "Nutrition",
  cash: "Cash transfer",
  finance: "Cash transfer",

  map: "Map",
  report: "Report",
  download: "Download",
  data: "Data",
  filter: "Filter",
  warning: "Alert",
  info: "Information"
};

function ochaIconUrl(iconKey, color = "UN Blue") {
  const iconName = OCHA_ICONS[iconKey] || iconKey || "Analysis";
  const safeColor = encodeURIComponent(color);
  const safeName = encodeURIComponent(iconName + ".svg");
  return `${OCHA_ICON_BASE}/${safeColor}/${safeName}`;
}

function ochaIcon(iconKey, color = "UN Blue", extraClass = "") {
  return `
    <img
      class="ocha-icon ${extraClass}"
      src="${ochaIconUrl(iconKey, color)}"
      alt=""
      loading="lazy"
      onerror="this.onerror=null;this.src='${ochaIconUrl("analysis", color)}';"
    >
  `;
}

/* Remplacement automatique des éléments avec data-ocha-icon */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-ocha-icon]").forEach(el => {
    const key = el.getAttribute("data-ocha-icon");
    const color = el.getAttribute("data-ocha-color") || "UN Blue";
    const size = el.getAttribute("data-ocha-size") || "";
    el.innerHTML = ochaIcon(key, color, size);
  });
});
