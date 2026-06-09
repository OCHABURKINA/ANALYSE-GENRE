/* ============================================================
   Analyse Conjointe Genre Burkina Faso
   Charts.js
   ============================================================ */

const OCHA = {

  /* -------------------------------
     Palette Organisations (Bleu)
  -------------------------------- */

  blueDark: "#002E6E",
  blue1: "#004987",
  blue2: "#0074B7",
  blue3: "#009EDB",
  blue4: "#64BDEA",
  blue5: "#C5DFEF",
  blue6: "#E3EDF6",

  /* -------------------------------
     Palette Genre (Violet)
  -------------------------------- */

  purpleDark: "#3E125B",
  purple1: "#5B2C86",
  purple2: "#763F98",
  purple3: "#A05FB4",
  purple4: "#BD8CBF",
  purple5: "#D5B4D6",
  purple6: "#E4D7E8",

  /* -------------------------------
     Couleurs génériques
  -------------------------------- */

  white: "#FFFFFF",
  black: "#000000",

  female: "#763F98",
  male: "#0074B7",

  girl: "#A05FB4",
  boy: "#64BDEA"
};

/* ============================================================
   Style global ChartJS
   ============================================================ */

Chart.defaults.font.family =
"Source Sans Pro, Segoe UI, Arial";

Chart.defaults.font.size = 12;

Chart.defaults.color = "#2C3E50";

Chart.defaults.plugins.legend.labels.boxWidth = 16;

Chart.defaults.plugins.legend.labels.usePointStyle = true;

/* ============================================================
   Grilles
   ============================================================ */

function chartGrid() {

  return {
    color: "rgba(0,0,0,.08)",
    drawBorder: false
  };

}

function tickStyle(size=12){

  return {
    color:"#475569",
    font:{
      size:size,
      weight:"600"
    }
  };

}

/* ============================================================
   Tooltip élégant
   ============================================================ */

function tooltipStyle(){

  return {

    backgroundColor:"#FFFFFF",

    titleColor:"#002E6E",

    bodyColor:"#000000",

    borderColor:"#C5DFEF",

    borderWidth:1,

    cornerRadius:10,

    padding:12,

    displayColors:true

  };

}

/* ============================================================
   Plugin labels automatiques
   ============================================================ */

const valueLabelsPlugin = {

  id: 'valueLabelsPlugin',

  afterDatasetsDraw(chart){

    const ctx = chart.ctx;

    chart.data.datasets.forEach((dataset,i)=>{

      const meta =
      chart.getDatasetMeta(i);

      meta.data.forEach((bar,index)=>{

        let value =
        dataset.data[index];

        ctx.save();

        ctx.fillStyle =
        "#002E6E";

        ctx.font =
        "bold 11px Source Sans Pro";

        ctx.textAlign =
        "center";

        ctx.fillText(

          value+"%",

          bar.x,

          bar.y-8

        );

        ctx.restore();

      });

    });

  }

};

Chart.register(
valueLabelsPlugin
);

/* ============================================================
   Barres H/F
   ============================================================ */

function createGenderBarChart(
canvasId,
labels,
women,
men
){

  return new Chart(

    document.getElementById(canvasId),

    {

      type:"bar",

      data:{

        labels,

        datasets:[

          {
            label:"Femmes",
            data:women,
            backgroundColor:
            OCHA.purple2,
            borderRadius:6
          },

          {
            label:"Hommes",
            data:men,
            backgroundColor:
            OCHA.blue2,
            borderRadius:6
          }

        ]

      },

      options:{

        responsive:true,

        maintainAspectRatio:false,

        plugins:{

          tooltip:
          tooltipStyle(),

          legend:{
            position:"top"
          }

        },

        scales:{

          x:{
            grid:{
              display:false
            },
            ticks:tickStyle()
          },

          y:{
            max:100,
            ticks:{
              callback:v=>v+"%",
              ...tickStyle()
            },
            grid:chartGrid()
          }

        }

      }

    }

  );

}

/* ============================================================
   Barres horizontales longues
   ============================================================ */

function createHorizontalBarChart(
canvasId,
labels,
values,
color
){

  return new Chart(

    document.getElementById(canvasId),

    {

      type:"bar",

      data:{

        labels,

        datasets:[{

          data:values,

          backgroundColor:
          color,

          borderRadius:8,

          barThickness:18

        }]

      },

      options:{

        indexAxis:'y',

        responsive:true,

        maintainAspectRatio:false,

        plugins:{

          legend:{
            display:false
          },

          tooltip:
          tooltipStyle()

        },

        scales:{

          x:{
            beginAtZero:true,
            max:100,
            ticks:{
              callback:v=>v+"%",
              ...tickStyle()
            },
            grid:chartGrid()
          },

          y:{
            grid:{
              display:false
            },
            ticks:tickStyle()
          }

        }

      }

    }

  );

}

/* ============================================================
   Radar
   ============================================================ */

function createRadarChart(
canvasId,
labels,
values,
color
){

  return new Chart(

    document.getElementById(canvasId),

    {

      type:"radar",

      data:{

        labels,

        datasets:[{

          data:values,

          backgroundColor:
          color+"33",

          borderColor:
          color,

          pointBackgroundColor:
          color,

          pointRadius:4

        }]

      },

      options:{

        responsive:true,

        maintainAspectRatio:false,

        plugins:{

          legend:{
            display:false
          },

          tooltip:
          tooltipStyle()

        }

      }

    }

  );

}

/* ============================================================
   Donut
   ============================================================ */

function createDonutChart(
canvasId,
labels,
values,
colors
){

  return new Chart(

    document.getElementById(canvasId),

    {

      type:"doughnut",

      data:{

        labels,

        datasets:[{

          data:values,

          backgroundColor:
          colors,

          borderWidth:0

        }]

      },

      options:{

        cutout:"65%",

        responsive:true,

        maintainAspectRatio:false,

        plugins:{

          tooltip:
          tooltipStyle(),

          legend:{
            position:"bottom"
          }

        }

      }

    }

  );

}
