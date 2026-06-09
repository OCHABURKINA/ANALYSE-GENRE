const OCHA_ICON_BASE = "https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons/main/SVG";

const OCHA_ICON_MAP = {
  home: "Analysis",
  overview: "Analysis",
  analysis: "Analysis",
  data: "Data",
  report: "Assessment",
  map: "Map",

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
  genderbasedviolence: "Gender-based-violence",

  health: "Health",
  education: "Education",
  wash: "Water-Sanitation-and-Hygiene",
  water: "Potable-water",
  food: "Food-Security",
  livelihood: "Livelihood",
  cash: "Cash-transfer",

  pdi: "Internally-displaced",
  displacement: "Internally-displaced",

  organisation: "Group",
  organisations: "Group",
  organization: "Group",
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
  community: "Community-engagement",
  feedback: "Community-engagement",
  aap: "Community-engagement",
  partnership: "Coordination",

  warning: "Alert",
  alert: "Alert",
  info: "About"
};

function normalizeIconKey(key) {
  return String(key || "analysis")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function normalizeOchaColor(color) {
  const value = String(color || "UN-blue").trim().toLowerCase();

  if (value === "white" || value === "blanc") return "white";
  if (value === "black" || value === "noir") return "black";

  return "UN-blue";
}

function getOchaIconName(key) {
  return OCHA_ICON_MAP[normalizeIconKey(key)] || "Analysis";
}

function getOchaIconUrl(key, color = "UN-blue") {
  const iconName = getOchaIconName(key);
  const iconColor = normalizeOchaColor(color);
  return `${OCHA_ICON_BASE}/${iconColor}/${encodeURIComponent(`${iconName}.svg`)}`;
}

function renderOchaIcons(root = document) {
  root.querySelectorAll("[data-ocha-icon]").forEach((el) => {
    const icon = el.dataset.ochaIcon || "analysis";
    const color = el.dataset.ochaColor || "UN-blue";
    const alt = el.getAttribute("aria-label") || "";

    const img = document.createElement("img");
    img.src = getOchaIconUrl(icon, color);
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";

    img.onerror = () => {
      if (img.dataset.fallbackApplied) {
        el.classList.add("ocha-icon-missing");
        img.remove();
        return;
      }

      img.dataset.fallbackApplied = "true";
      img.src = getOchaIconUrl("analysis", color);
    };

    el.replaceChildren(img);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderOchaIcons();
});

window.renderOchaIcons = renderOchaIcons;
window.getOchaIconUrl = getOchaIconUrl;
