function regionLabels() {
  return DASHBOARD_DATA.regions.map(r => r.name.replace("Boucle du Mouhoun ", "").replace("Centre-Nord ", "").replace("Centre-Sud ", ""));
}

function regionValues(key) {
  return DASHBOARD_DATA.regions.map(r => r[key]);
}

function labelsFrom(items) {
  return items.map(item => item.label);
}

function valuesFrom(items) {
  return items.map(item => item.value);
}

function renderOverviewCharts() {
  if (!document.getElementById("respondentsChart")) return;

  createHorizontalBarChart(
    "respondentsChart",
    regionLabels(),
    regionValues("total"),
    OCHA.blue2,
    {
      label: "Personnes enquêtées",
      unit: "",
      max: 700,
      showLabels: true,
      ariaLabel: "Nombre de personnes enquêtées par région"
    }
  );
}

function renderFemmesHommesCharts() {
  if (!document.getElementById("genderChart")) return;

  createGenderBarChart(
    "genderChart",
    regionLabels(),
    regionValues("women"),
    regionValues("men"),
    {
      womenLabel: "Femmes",
      menLabel: "Hommes",
      unit: "",
      max: 300,
      showLabels: true,
      ariaLabel: "Comparaison femmes et hommes adultes par région"
    }
  );
}

function renderFillesGarconsCharts() {
  if (!document.getElementById("childrenChart")) return;

  const data = DASHBOARD_DATA.genderAnalysis.adolescentPriorities;

  createGenderBarChart(
    "childrenChart",
    labelsFrom(data),
    data.map(d => d.girls),
    data.map(d => d.boys),
    {
      womenLabel: "Filles",
      menLabel: "Garçons",
      unit: "%",
      max: 100,
      showLabels: true,
      ariaLabel: "Priorités exprimées par les filles et garçons"
    }
  );
}

function renderLivelihoodCharts() {
  if (!document.getElementById("livelihoodChart")) return;

  const data = DASHBOARD_DATA.genderAnalysis.livelihoodBarriers;

  createHorizontalBarChart(
    "livelihoodChart",
    labelsFrom(data),
    valuesFrom(data),
    OCHA.blue2,
    {
      label: "Répondants concernés",
      unit: "%",
      max: 100,
      showLabels: true,
      ariaLabel: "Contraintes liées aux moyens de subsistance"
    }
  );
}

function renderProtectionCharts() {
  if (!document.getElementById("protectionChart")) return;

  const data = DASHBOARD_DATA.genderAnalysis.protectionRisks;

  createHorizontalBarChart(
    "protectionChart",
    labelsFrom(data),
    valuesFrom(data),
    OCHA.purple2,
    {
      label: "Répondants concernés",
      unit: "%",
      max: 100,
      showLabels: true,
      ariaLabel: "Risques de protection et de VBG"
    }
  );

  if (document.getElementById("riskRadarChart")) {
    createRadarChart(
      "riskRadarChart",
      labelsFrom(data),
      valuesFrom(data),
      OCHA.purple2,
      {
        label: "Niveau de risque",
        unit: "%",
        max: 100,
        ariaLabel: "Radar des risques de protection"
      }
    );
  }
}

function renderOdfCharts() {
  if (!document.getElementById("odfDomainChart")) return;

  const data = DASHBOARD_DATA.organisationalAnalysis.odfDomains;

  createHorizontalBarChart(
    "odfDomainChart",
    labelsFrom(data),
    valuesFrom(data),
    OCHA.purple2,
    {
      label: "Nombre d’ODF",
      unit: "",
      max: 35,
      showLabels: true,
      ariaLabel: "Répartition des ODF par domaine d’intervention"
    }
  );
}

function renderCoordinationCharts() {
  if (!document.getElementById("coordinationBarriersChart")) return;

  const data = DASHBOARD_DATA.organisationalAnalysis.coordinationBarriers;

  createHorizontalBarChart(
    "coordinationBarriersChart",
    labelsFrom(data),
    valuesFrom(data),
    OCHA.blue2,
    {
      label: "Acteurs concernés",
      unit: "%",
      max: 100,
      showLabels: true,
      ariaLabel: "Barrières à la participation dans la coordination"
    }
  );
}

function renderClusterCharts() {
  if (!document.getElementById("clustersGenderChart")) return;

  const data = DASHBOARD_DATA.organisationalAnalysis.clusterGenderIntegration;

  createHorizontalBarChart(
    "clustersGenderChart",
    labelsFrom(data),
    valuesFrom(data),
    OCHA.blue2,
    {
      label: "Niveau d’intégration",
      unit: "%",
      max: 100,
      showLabels: true,
      ariaLabel: "Intégration du genre par cluster"
    }
  );
}

function renderAccountabilityCharts() {
  if (!document.getElementById("accountabilityRadarChart")) return;

  const data = DASHBOARD_DATA.organisationalAnalysis.accountability;

  createRadarChart(
    "accountabilityRadarChart",
    labelsFrom(data),
    valuesFrom(data),
    OCHA.purple2,
    {
      label: "Niveau",
      unit: "%",
      max: 100,
      ariaLabel: "Redevabilité genre"
    }
  );

  if (document.getElementById("feedbackChart")) {
    createDonutChart(
      "feedbackChart",
      labelsFrom(data),
      valuesFrom(data),
      [OCHA.purple2, OCHA.blue2, OCHA.blue3, OCHA.purple4, OCHA.blue5],
      {
        unit: "%",
        legendPosition: "bottom",
        ariaLabel: "Dimensions de redevabilité genre"
      }
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderOverviewCharts();
  renderFemmesHommesCharts();
  renderFillesGarconsCharts();
  renderLivelihoodCharts();
  renderProtectionCharts();
  renderOdfCharts();
  renderCoordinationCharts();
  renderClusterCharts();
  renderAccountabilityCharts();

  if (document.getElementById("burkinaMap")) {
    renderBurkinaMap("burkinaMap");
  }
});
