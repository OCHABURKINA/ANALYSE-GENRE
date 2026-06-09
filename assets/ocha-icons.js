/* ============================================================
   OCHA Humanitarian Icons — GitHub officiel
   Dossiers valides : UN-blue, white, black
   ============================================================ */

const OCHA_ICON_BASE =
  "https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons/main/SVG";

const OCHA_ICON_MAP = {
  home: "Analysis",
  overview: "Analysis",
  analysis: "Analysis",
  data: "Data",
  report: "Report",
  download: "Download",
  map: "Map",
  filter: "Filter",

  people: "Affected-population",
  population: "Affected-population",
  respondents: "Affected-population",

  gender: "Gender",
  women: "Gender",
  men: "Gender",
  girls: "Children",
  boys: "Children",
  children: "Children",

  protection: "Protection",
  vbg: "Gender-based-violence",
  gbv: "Gender-based-violence",

  health: "Health",
  education: "Education",
  wash: "Water-Sanitation-and-Hygiene",
  water: "Potable-water",
  food: "Food-Security",
  nutrition: "Nutrition",
  shelter: "Shelter",
  livelihood: "Livelihood",
  cash: "Cash-transfer",

  pdi: "Internally-displaced",
  displacement: "Internally-displaced",

  organisation: "Group",
  organization: "Group",
  organisations: "Group",
  organizations: "Group",
  odf: "Group",
  group: "Group",
  coordination: "Coordination",
  cluster: "Multi-cluster-sector",
  clusters: "Multi-cluster-sector",
  leadership: "Leadership",
  accountability: "Assessment",
  assessment: "Assessment",
  localisation: "Coordination",
  localization: "Coordination",

  community: "Community-engagement",
  partnership: "Partnership",
  feedback: "Feedback",
  warning: "Warning-Error",
  alert: "Alert",
  info: "Information",
  information: "Information"
};

function normalizeIconKey(key) {
  return String(key || "analysis")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/_/g, "");
}

function normalizeOchaColor(color) {
  const c = String(color || "UN-blue").trim().toLowerCase();

  if (c === "white" || c === "blanc") return "white";
  if (c === "black" || c === "noir") return "black";

  return "UN-blue";
}

function getOchaIconName(key) {
  return OCHA_ICON_MAP[normalizeIconKey(key)] || "Analysis";
}

function getOchaIconUrl(key, color = "UN-blue") {
  const folder = normalizeOchaColor(color);
  const file = encodeURIComponent(getOchaIconName(key) + ".svg");
  return `${OCHA_ICON_BASE}/${folder}/${file}`;
}

function renderOchaIcons() {
  document.querySelectorAll("[data-ocha-icon]").forEach(el => {
    const icon = el.getAttribute("data-ocha-icon") || "analysis";
    const color = el.getAttribute("data-ocha-color") || "UN-blue";
    const alt = el.getAttribute("aria-label") || "";

    const primary = getOchaIconUrl(icon, color);
    const fallback = getOchaIconUrl("analysis", color);

    el.innerHTML = `
      <img
        src="${primary}"
        alt="${alt}"
        loading="lazy"
        onerror="this.onerror=null;this.src='${fallback}';"
      >
    `;
  });
}

document.addEventListener("DOMContentLoaded", renderOchaIcons);

window.renderOchaIcons = renderOchaIcons;
window.getOchaIconUrl = getOchaIconUrl;
