/* ============================================================
   OCHA Humanitarian Icons — GitHub officiel
   Source : https://github.com/UN-OCHA/humanitarian-icons
   ============================================================ */

const OCHA_ICON_BASE =
  "https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons/main/SVG";

const OCHA_ICON_MAP = {
  analysis: "Analysis",
  home: "Analysis",
  data: "Data",
  report: "Report",
  download: "Download",
  map: "Map",
  filter: "Filter",

  gender: "Gender",
  women: "Gender",
  men: "Gender",
  girls: "Children",
  boys: "Children",
  children: "Children",

  protection: "Protection",
  vbg: "Gender-based violence",
  gbv: "Gender-based violence",

  health: "Health",
  education: "Education",
  wash: "Water sanitation and hygiene",
  water: "Water sanitation and hygiene",
  food: "Food security",
  nutrition: "Nutrition",
  shelter: "Shelter",
  livelihood: "Livelihood",
  cash: "Cash transfer",

  organisation: "Group",
  organizations: "Group",
  odf: "Group",
  group: "Group",
  coordination: "Coordination",
  cluster: "Coordination",
  leadership: "Leadership",
  accountability: "Assessment",
  assessment: "Assessment",

  warning: "Alert",
  info: "Information"
};

function getOchaIconName(key) {
  return OCHA_ICON_MAP[key] || key || "Analysis";
}

function getOchaIconUrl(key, color = "UN Blue") {
  const iconName = encodeURIComponent(getOchaIconName(key) + ".svg");
  const iconColor = encodeURIComponent(color);
  return `${OCHA_ICON_BASE}/${iconColor}/${iconName}`;
}

function renderOchaIcons() {
  document.querySelectorAll("[data-ocha-icon]").forEach(el => {
    const icon = el.getAttribute("data-ocha-icon") || "analysis";
    const color = el.getAttribute("data-ocha-color") || "UN Blue";
    const label = el.getAttribute("aria-label") || "";

    const primaryUrl = getOchaIconUrl(icon, color);
    const fallbackUrl = getOchaIconUrl("analysis", color);

    el.innerHTML = `
      <img
        src="${primaryUrl}"
        alt="${label}"
        loading="lazy"
        onerror="this.onerror=null;this.src='${fallbackUrl}';"
      >
    `;
  });
}

document.addEventListener("DOMContentLoaded", renderOchaIcons);
