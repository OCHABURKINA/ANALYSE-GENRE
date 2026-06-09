const SURVEYED_REGION_MAP = {
  BF62: {
    survey_id: "bankui",
    label: "Boucle du Mouhoun (Bankui)"
  },
  BF63: {
    survey_id: "goulmou",
    label: "Est (Goulmou)"
  },
  BF13: {
    survey_id: "kadiogo",
    label: "Centre (Kadiogo)"
  },
  BF49: {
    survey_id: "koulse",
    label: "Centre-Nord (Koulsé)"
  },
  BF64: {
    survey_id: "liptako",
    label: "Sahel (Liptako)"
  },
  BF48: {
    survey_id: "nakambe",
    label: "Centre-Sud (Nakambé)"
  },
  BF54: {
    survey_id: "yaadga",
    label: "Nord (Yaadga)"
  }
};

function enrichBurkinaGeoJson(geojson) {
  return {
    ...geojson,
    features: geojson.features.map((feature) => {
      const pcode = feature.properties?.adm1_pcode;
      const match = SURVEYED_REGION_MAP[pcode];

      return {
        ...feature,
        properties: {
          ...feature.properties,
          survey_id: match?.survey_id || "",
          label: match?.label || feature.properties?.adm1_name || "",
          surveyed: Boolean(match)
        }
      };
    })
  };
}

function geoBounds(features) {
  const points = [];

  features.forEach((feature) => {
    const walk = (coords) => {
      if (typeof coords[0] === "number") {
        points.push(coords);
      } else {
        coords.forEach(walk);
      }
    };

    walk(feature.geometry.coordinates);
  });

  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  };
}

function createProjector(bounds, width, height, padding = 18) {
  const scale = Math.min(
    (width - padding * 2) / (bounds.maxX - bounds.minX),
    (height - padding * 2) / (bounds.maxY - bounds.minY)
  );

  const offsetX = (width - (bounds.maxX - bounds.minX) * scale) / 2;
  const offsetY = (height - (bounds.maxY - bounds.minY) * scale) / 2;

  return ([lon, lat]) => [
    offsetX + (lon - bounds.minX) * scale,
    height - (offsetY + (lat - bounds.minY) * scale)
  ];
}

function polygonPath(coords, project) {
  return coords
    .map((ring) => {
      return ring
        .map((point, index) => {
          const [x, y] = project(point);
          return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(" ") + " Z";
    })
    .join(" ");
}

function featurePath(feature, project) {
  if (feature.geometry.type === "Polygon") {
    return polygonPath(feature.geometry.coordinates, project);
  }

  if (feature.geometry.type === "MultiPolygon") {
    return feature.geometry.coordinates
      .map((poly) => polygonPath(poly, project))
      .join(" ");
  }

  return "";
}

function getSurveyRegionData(feature) {
  const id = feature.properties?.survey_id;

  if (!id || !window.DASHBOARD_DATA) {
    return null;
  }

  return DASHBOARD_DATA.regions.find((region) => region.id === id) || null;
}

function renderBurkinaMap(containerId, options = {}) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.warn(`[map] Conteneur introuvable: ${containerId}`);
    return null;
  }

  if (!window.BURKINA_GEOJSON) {
    console.warn("[map] BURKINA_GEOJSON est introuvable. Vérifiez assets/burkina-data.js");
    return null;
  }

  const geojson = enrichBurkinaGeoJson(window.BURKINA_GEOJSON);
  const width = options.width || 860;
  const height = options.height || 620;
  const bounds = geoBounds(geojson.features);
  const project = createProjector(bounds, width, height);

  container.innerHTML = "";

  const tooltip = document.createElement("div");
  tooltip.className = "map-tooltip";
  container.appendChild(tooltip);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute(
    "aria-label",
    options.ariaLabel || "Carte des régions couvertes par l’analyse genre au Burkina Faso"
  );
  svg.classList.add("burkina-map");

  geojson.features.forEach((feature) => {
    const data = getSurveyRegionData(feature);
    const surveyed = feature.properties.surveyed;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttribute("d", featurePath(feature, project));
    path.classList.add("map-region");

    if (!surveyed) {
      path.classList.add("not-surveyed");
    }

    path.dataset.region = feature.properties.label;
    path.tabIndex = 0;

    path.addEventListener("mouseenter", (event) => {
      showMapTooltip(event, tooltip, feature, data);
    });

    path.addEventListener("mousemove", (event) => {
      moveMapTooltip(event, tooltip);
    });

    path.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });

    path.addEventListener("focus", (event) => {
      showMapTooltip(event, tooltip, feature, data, true);
    });

    path.addEventListener("blur", () => {
      tooltip.style.display = "none";
    });

    svg.appendChild(path);
  });

  container.appendChild(svg);

  return svg;
}

function showMapTooltip(event, tooltip, feature, data, fromKeyboard = false) {
  const label = feature.properties.label || feature.properties.adm1_name || "Région";

  tooltip.innerHTML = data
    ? `
      <div class="map-tooltip-title">${label}</div>
      <div class="map-tooltip-row"><span>Enquêtés</span><b>${data.total}</b></div>
      <div class="map-tooltip-row"><span>Adultes</span><b>${data.adults}</b></div>
      <div class="map-tooltip-row"><span>Adolescents</span><b>${data.adolescents}</b></div>
    `
    : `
      <div class="map-tooltip-title">${label}</div>
      <div class="map-tooltip-row"><span>Statut</span><b>Non couverte</b></div>
    `;

  tooltip.style.display = "block";

  if (fromKeyboard) {
    positionTooltipFromElement(event.currentTarget, tooltip);
  } else {
    moveMapTooltip(event, tooltip);
  }
}

function moveMapTooltip(event, tooltip) {
  const box = event.currentTarget.closest(".map-wrapper")?.getBoundingClientRect();

  if (!box) return;

  tooltip.style.left = `${event.clientX - box.left + 14}px`;
  tooltip.style.top = `${event.clientY - box.top + 14}px`;
}

function positionTooltipFromElement(element, tooltip) {
  const wrapper = element.closest(".map-wrapper");
  const wrapperBox = wrapper?.getBoundingClientRect();
  const elementBox = element.getBoundingClientRect();

  if (!wrapperBox) return;

  tooltip.style.left = `${elementBox.left - wrapperBox.left + 20}px`;
  tooltip.style.top = `${elementBox.top - wrapperBox.top + 20}px`;
}

window.renderBurkinaMap = renderBurkinaMap;
window.enrichBurkinaGeoJson = enrichBurkinaGeoJson;
