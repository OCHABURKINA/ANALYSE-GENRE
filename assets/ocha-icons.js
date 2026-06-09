const OCHA_ICON_BASE =
  "https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons/main/SVG";

const OCHA_ICON_MAP = {
  home: "Analysis",
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
  sex: "Sex",
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
  partnership: "Partnership",

  pdi: "Internally-displaced",
  displacement: "Internally-displaced",

  odf: "Group",
  group: "Group",
  coordination: "Coordination",
  cluster: "Multi-cluster-sector",
  clusters: "Multi-cluster-sector",
  leadership: "Leadership",
  accountability: "Assessment",
  assessment: "Assessment",

  community: "Community-engagement",
  feedback: "Feedback",
  information: "Information",
  info: "Information",
  warning: "Warning-Error",
  alert: "Alert"
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
    const primary = getOchaIconUrl(icon, color);
    const fallback = getOchaIconUrl("analysis", color);

    el.innerHTML = `
      <img
        src="${primary}"
        alt=""
        loading="lazy"
        onerror="this.onerror=null;this.src='${fallback}';"
      >
    `;
  });
}

document.addEventListener("DOMContentLoaded", renderOchaIcons);

window.renderOchaIcons = renderOchaIcons;
window.getOchaIconUrl = getOchaIconUrl;
