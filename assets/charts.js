const OCHA = {
  blueDark: "#002E6E",
  blue: "#0074B7",
  blue2: "#009EDB",
  blueLight: "#64BDEA",
  bluePale: "#C5DFEF",
  blueBg: "#E3EDF6",

  purpleDark: "#3E125B",
  purple: "#763F98",
  purple2: "#A05FB4",
  purpleLight: "#BD8CBF",
  purplePale: "#D5B4D6",
  purpleBg: "#E4D7E8"
};

Chart.defaults.font.family = "Roboto, Arial, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = "#334155";

function chartGrid(){
  return { color:"rgba(0,0,0,.07)", drawBorder:false };
}

function tickStyle(size=11){
  return {
    color:"#475569",
    font:{size:size,weight:"700"}
  };
}

function tooltipStyle(){
  return {
    backgroundColor:"#fff",
    titleColor:"#002E6E",
    bodyColor:"#000",
    borderColor:"#C5DFEF",
    borderWidth:1,
    cornerRadius:10,
    padding:10
  };
}

const valueLabelsPlugin = {
  id:"valueLabelsPlugin",
  afterDatasetsDraw(chart){
    const ctx = chart.ctx;
    chart.data.datasets.forEach((dataset,i)=>{
      const meta = chart.getDatasetMeta(i);
      if(meta.hidden) return;
      meta.data.forEach((el,index)=>{
        const value = dataset.data[index];
        if(value === null || value === undefined) return;
        ctx.save();
        ctx.fillStyle = "#002E6E";
        ctx.font = "700 10px Roboto";
        ctx.textAlign = "center";
        if(chart.config.type === "bar" && chart.options.indexAxis === "y"){
          ctx.textAlign = "left";
          ctx.fillText(value + "%", el.x + 6, el.y + 4);
        } else if(chart.config.type === "bar"){
          ctx.fillText(value + "%", el.x, el.y - 5);
        }
        ctx.restore();
      });
    });
  }
};

Chart.register(valueLabelsPlugin);

function createGenderBarChart(canvasId, labels, women, men){
  return new Chart(document.getElementById(canvasId), {
    type:"bar",
    data:{
      labels,
      datasets:[
        {label:"Femmes",data:women,backgroundColor:OCHA.purple,borderRadius:6},
        {label:"Hommes",data:men,backgroundColor:OCHA.blue,borderRadius:6}
      ]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      plugins:{tooltip:tooltipStyle(),legend:{position:"bottom"}},
      scales:{
        x:{grid:{display:false},ticks:tickStyle(10)},
        y:{max:100,ticks:{...tickStyle(),callback:v=>v+"%"},grid:chartGrid()}
      }
    }
  });
}

function createHorizontalBarChart(canvasId, labels, values, color=OCHA.blue){
  return new Chart(document.getElementById(canvasId), {
    type:"bar",
    data:{
      labels,
      datasets:[{data:values,backgroundColor:color,borderRadius:6,barThickness:14}]
    },
    options:{
      indexAxis:"y",
      responsive:true,
      maintainAspectRatio:false,
      plugins:{tooltip:tooltipStyle(),legend:{display:false}},
      scales:{
        x:{beginAtZero:true,max:100,ticks:{...tickStyle(),callback:v=>v+"%"},grid:chartGrid()},
        y:{grid:{display:false},ticks:tickStyle(10)}
      }
    }
  });
}

function createDonutChart(canvasId, labels, values, colors){
  return new Chart(document.getElementById(canvasId), {
    type:"doughnut",
    data:{labels,datasets:[{data:values,backgroundColor:colors,borderWidth:0}]},
    options:{
      cutout:"68%",
      responsive:true,
      maintainAspectRatio:false,
      plugins:{tooltip:tooltipStyle(),legend:{position:"bottom"}}
    }
  });
}
