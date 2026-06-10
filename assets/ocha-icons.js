const OCHA_ICON_BASE =
  "https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons/main/SVG";

const OCHA_ICON_MAP = {
  home: "Analysis",
  analysis: "Analysis",
  assessment: "Assessment",
  data: "Data",
  report: "Report",
  map: "Map",
  download: "Download",

  people: "Affected-population",
  population: "Affected-population",
  gender: "Gender",
  sex: "Sex",
  children: "Children",
  women: "Gender",
  men: "Gender",
  girls: "Children",
  boys: "Children",

  protection: "Protection",
  gbv: "Gender-based-violence",
  vbg: "Gender-based-violence",
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
  odf: "Group",
  group: "Group",
  organisation: "Group",
  organisations: "Group",
  coordination: "Coordination",
  cluster: "Multi-cluster-sector",
  leadership: "Leadership",
  partnership: "Partnership",
  community: "Community-engagement",
  feedback: "Feedback",
  information: "Information",
  warning: "Warning-Error"
};

function normalizeIconKey(key) {
  return String(key || "analysis")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/_/g, "");
}

function normalizeColor(color) {
  const c = String(color || "UN-blue").trim().toLowerCase();
  if (c === "white" || c === "blanc") return "white";
  if (c === "black" || c === "noir") return "black";
  return "UN-blue";
}

function getOchaIconName(key) {
  return OCHA_ICON_MAP[normalizeIconKey(key)] || "Analysis";
}

function getOchaIconUrl(key, color = "UN-blue") {
  return `${OCHA_ICON_BASE}/${normalizeColor(color)}/${encodeURIComponent(
    getOchaIconName(key) + ".svg"
  )}`;
}

function renderOchaIcons() {
  document.querySelectorAll("[data-ocha-icon]").forEach((el) => {
    const icon = el.getAttribute("data-ocha-icon") || "analysis";
    const color = el.getAttribute("data-ocha-color") || "UN-blue";
    const fallback = getOchaIconUrl("analysis", color);

    el.innerHTML = `
      <img
        src="${getOchaIconUrl(icon, color)}"
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
