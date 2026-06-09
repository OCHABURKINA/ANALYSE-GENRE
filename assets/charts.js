const OCHA = {
  blueDark: "#002E6E",
  blue1: "#004987",
  blue2: "#0074B7",
  blue3: "#009EDB",
  blue4: "#64BDEA",
  blue5: "#C5DFEF",
  blue6: "#E3EDF6",

  purpleDark: "#3E125B",
  purple1: "#5B2C86",
  purple2: "#763F98",
  purple3: "#A05FB4",
  purple4: "#BD8CBF",
  purple5: "#D5B4D6",
  purple6: "#E4D7E8",

  white: "#FFFFFF",
  black: "#000000",

  female: "#763F98",
  male: "#0074B7",
  girl: "#A05FB4",
  boy: "#64BDEA"
};

if (window.Chart) {
  Chart.defaults.font.family = '"Source Sans 3", "Segoe UI", Arial, sans-serif';
  Chart.defaults.font.size = 12;
  Chart.defaults.color = "#334155";
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.boxWidth = 12;
}

function getCanvas(canvasId, ariaLabel) {
  const canvas = document.getElementById(canvasId);

  if (!canvas) {
    console.warn(`[charts] Canvas introuvable: ${canvasId}`);
    return null;
  }

  canvas.setAttribute("role", "img");

  if (ariaLabel) {
    canvas.setAttribute("aria-label", ariaLabel);
  }

  return canvas;
}

function tickStyle(size = 12) {
  return {
    color: "#475569",
    font: {
      size,
      weight: "700"
    }
  };
}

function chartGrid() {
  return {
    color: "rgba(0, 46, 110, .08)",
    drawBorder: false
  };
}

function tooltipStyle(unit = "") {
  return {
    backgroundColor: "#FFFFFF",
    titleColor: "#002E6E",
    bodyColor: "#0F172A",
    borderColor: "#C5DFEF",
    borderWidth: 1,
    cornerRadius: 12,
    padding: 12,
    displayColors: true,
    callbacks: {
      label(ctx) {
        const label = ctx.dataset.label || ctx.label || "";
        const raw = ctx.parsed?.y ?? ctx.parsed?.x ?? ctx.parsed ?? "";
        return `${label ? `${label}: ` : ""}${raw}${unit}`;
      }
    }
  };
}

const valueLabelsPlugin = {
  id: "valueLabelsPlugin",

  afterDatasetsDraw(chart, args, opts) {
    if (!opts?.enabled) return;

    const ctx = chart.ctx;
    const unit = opts.unit || "";

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);

      meta.data.forEach((element, index) => {
        const value = dataset.data[index];
        const pos = element.tooltipPosition();

        ctx.save();
        ctx.fillStyle = opts.color || "#002E6E";
        ctx.font = '800 11px "Source Sans 3", Arial, sans-serif';
        ctx.textAlign = "center";
        ctx.fillText(`${value}${unit}`, pos.x, pos.y - 8);
        ctx.restore();
      });
    });
  }
};

if (window.Chart) {
  Chart.register(valueLabelsPlugin);
}

function basePlugins(options = {}) {
  return {
    tooltip: tooltipStyle(options.unit || "%"),
    legend: {
      display: options.legend !== false,
      position: options.legendPosition || "top"
    },
    valueLabelsPlugin: {
      enabled: Boolean(options.showLabels),
      unit: options.unit || "%",
      color: options.labelColor || OCHA.blueDark
    }
  };
}

function createGenderBarChart(canvasId, labels, women, men, options = {}) {
  if (!window.Chart) return null;

  const canvas = getCanvas(canvasId, options.ariaLabel);
  if (!canvas) return null;

  return new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: options.womenLabel || "Femmes",
          data: women,
          backgroundColor: OCHA.purple2,
          borderRadius: 8
        },
        {
          label: options.menLabel || "Hommes",
          data: men,
          backgroundColor: OCHA.blue2,
          borderRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: basePlugins(options),
      scales: {
        x: {
          grid: { display: false },
          ticks: tickStyle()
        },
        y: {
          beginAtZero: true,
          max: options.max || 100,
          ticks: {
            callback: (v) => `${v}${options.unit || "%"}`,
            ...tickStyle()
          },
          grid: chartGrid()
        }
      }
    }
  });
}

function createHorizontalBarChart(canvasId, labels, values, color = OCHA.blue2, options = {}) {
  if (!window.Chart) return null;

  const canvas = getCanvas(canvasId, options.ariaLabel);
  if (!canvas) return null;

  return new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: options.label || "",
          data: values,
          backgroundColor: color,
          borderRadius: 9,
          barThickness: options.barThickness || 18
        }
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...basePlugins(options),
        legend: {
          display: Boolean(options.label)
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: options.max || 100,
          ticks: {
            callback: (v) => `${v}${options.unit || "%"}`,
            ...tickStyle()
          },
          grid: chartGrid()
        },
        y: {
          grid: { display: false },
          ticks: tickStyle()
        }
      }
    }
  });
}

function createDonutChart(canvasId, labels, values, colors, options = {}) {
  if (!window.Chart) return null;

  const canvas = getCanvas(canvasId, options.ariaLabel);
  if (!canvas) return null;

  return new Chart(canvas, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderWidth: 0
        }
      ]
    },
    options: {
      cutout: options.cutout || "66%",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: tooltipStyle(options.unit || ""),
        legend: {
          display: options.legend !== false,
          position: options.legendPosition || "bottom"
        }
      }
    }
  });
}

function createRadarChart(canvasId, labels, values, color = OCHA.blue2, options = {}) {
  if (!window.Chart) return null;

  const canvas = getCanvas(canvasId, options.ariaLabel);
  if (!canvas) return null;

  return new Chart(canvas, {
    type: "radar",
    data: {
      labels,
      datasets: [
        {
          label: options.label || "",
          data: values,
          backgroundColor: `${color}33`,
          borderColor: color,
          pointBackgroundColor: color,
          pointRadius: 4,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: tooltipStyle(options.unit || "%"),
        legend: {
          display: Boolean(options.label),
          position: "top"
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: options.max || 100,
          grid: {
            color: "rgba(0,46,110,.10)"
          },
          angleLines: {
            color: "rgba(0,46,110,.12)"
          },
          pointLabels: tickStyle(11),
          ticks: {
            backdropColor: "transparent",
            callback: (v) => `${v}${options.unit || "%"}`
          }
        }
      }
    }
  });
}

window.OCHA = OCHA;
window.createGenderBarChart = createGenderBarChart;
window.createHorizontalBarChart = createHorizontalBarChart;
window.createDonutChart = createDonutChart;
window.createRadarChart = createRadarChart;
