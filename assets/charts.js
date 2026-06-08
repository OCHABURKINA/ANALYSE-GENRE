/* ================================================================
   OCHA Burkina Faso — Paramètres graphiques globaux
   Version raffinée : UN Blue only + typographie Source Sans 3 + labels automatiques
   ================================================================ */
const OCHA = {
  bl1:'#002E6E', bl2:'#004987', bl3:'#0074B7', bl4:'#009EDB', bl5:'#64BDEA', bl6:'#C5DFEF', bl7:'#E3EDF6',
  sl1:'#000000', sl2:'#1F2937', sl3:'#475569', sl4:'#64748B', sl5:'#94A3B8', sl6:'#E3EDF6', sl7:'#F8FAFC',
  white:'#FFFFFF', black:'#000000',
  female:'#009EDB', male:'#004987', girls:'#64BDEA', boys:'#0074B7', neutral:'#C5DFEF',
  // Compatibilité : anciens alias orange réaffectés à la rampe bleue.
  or1:'#002E6E', or2:'#004987', or3:'#0074B7', or4:'#009EDB', or5:'#64BDEA', or6:'#C5DFEF', or7:'#E3EDF6'
};

const BLUE_RAMP = ['#002E6E','#004987','#0074B7','#009EDB','#64BDEA','#C5DFEF','#E3EDF6'];
const BLUE_RAMP_REVERSE = ['#E3EDF6','#C5DFEF','#64BDEA','#009EDB','#0074B7','#004987','#002E6E'];
const MIX_14 = ['#002E6E','#004987','#0074B7','#009EDB','#64BDEA','#C5DFEF','#E3EDF6','#004987','#0074B7','#009EDB','#64BDEA','#C5DFEF','#002E6E','#0074B7'];

function tickStyle(size=11){ return {color:OCHA.sl3,font:{size,weight:'600'}}; }
function chartGrid(){ return {color:'rgba(0,116,183,.11)',drawBorder:false}; }
function tooltipStyle(){
  return {
    backgroundColor:'#FFFFFF',
    titleColor:OCHA.bl1,
    bodyColor:OCHA.black,
    borderColor:OCHA.bl6,
    borderWidth:1,
    padding:12,
    displayColors:true,
    titleFont:{size:12,weight:'800'},
    bodyFont:{size:11,weight:'600'},
    cornerRadius:10,
    boxPadding:5
  };
}

function isPercentAxis(chart){
  const scales = chart.options && chart.options.scales ? chart.options.scales : {};
  return Object.values(scales).some(s => {
    const cb = s && s.ticks && s.ticks.callback;
    return typeof cb === 'function' && cb.toString().includes('%');
  });
}
function formatNumber(v){
  if (typeof v !== 'number' || !isFinite(v)) return v;
  return Number.isInteger(v) ? String(v) : String(Math.round(v * 10) / 10);
}
function drawRoundLabel(ctx, text, x, y, opts={}){
  const padX = opts.padX || 5;
  const padY = opts.padY || 3;
  const radius = opts.radius || 6;
  ctx.save();
  ctx.font = opts.font || "700 10px 'Source Sans 3', 'Segoe UI', Arial, sans-serif";
  const w = ctx.measureText(text).width + padX * 2;
  const h = 16 + padY;
  const bx = x - w / 2;
  const by = y - h / 2;
  ctx.fillStyle = opts.bg || 'rgba(255,255,255,.92)';
  ctx.strokeStyle = opts.stroke || 'rgba(0,116,183,.18)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(bx + radius, by);
  ctx.arcTo(bx + w, by, bx + w, by + h, radius);
  ctx.arcTo(bx + w, by + h, bx, by + h, radius);
  ctx.arcTo(bx, by + h, bx, by, radius);
  ctx.arcTo(bx, by, bx + w, by, radius);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = opts.color || OCHA.bl1;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y + 1);
  ctx.restore();
}

const OchaValueLabelsPlugin = {
  id: 'ochaValueLabels',
  afterDatasetsDraw(chart, args, pluginOptions) {
    const opts = Object.assign({display:'auto'}, pluginOptions || {});
    if (opts.display === false) return;
    const type = chart.config.type;
    const ctx = chart.ctx;
    const isPercent = isPercentAxis(chart);

    if (type === 'bar') {
      const indexAxis = chart.options.indexAxis || 'x';
      const totalPoints = chart.data.datasets.reduce((s, ds) => s + (ds.data ? ds.data.length : 0), 0);
      if (opts.display === 'auto' && totalPoints > 34) return;
      chart.data.datasets.forEach((dataset, di) => {
        const meta = chart.getDatasetMeta(di);
        if (meta.hidden) return;
        meta.data.forEach((bar, i) => {
          const raw = Array.isArray(dataset.data) ? dataset.data[i] : null;
          const value = typeof raw === 'object' && raw !== null ? raw.y : raw;
          if (value === null || value === undefined || value === 0) return;
          const txt = formatNumber(value) + (isPercent ? '%' : '');
          const p = bar.tooltipPosition();
          if (indexAxis === 'y') {
            drawRoundLabel(ctx, txt, p.x + 14, p.y, {color:OCHA.bl1});
          } else {
            drawRoundLabel(ctx, txt, p.x, p.y - 12, {color:OCHA.bl1});
          }
        });
      });
    }

    if (type === 'doughnut' || type === 'pie') {
      chart.data.datasets.forEach((dataset, di) => {
        const meta = chart.getDatasetMeta(di);
        if (meta.hidden) return;
        const values = (dataset.data || []).map(Number).filter(v => isFinite(v));
        const total = values.reduce((s, v) => s + v, 0);
        meta.data.forEach((arc, i) => {
          const value = Number(dataset.data[i]);
          if (!isFinite(value) || !total || value / total < 0.05) return;
          const p = arc.tooltipPosition();
          const txt = Math.round((value / total) * 100) + '%';
          drawRoundLabel(ctx, txt, p.x, p.y, {bg:'rgba(255,255,255,.95)',color:OCHA.bl1});
        });
      });
    }
  }
};

function ochaChartDefaults(){
  if(!window.Chart) return;
  Chart.defaults.color = OCHA.sl2;
  Chart.defaults.font.family = "'Source Sans 3', 'Segoe UI', Arial, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.boxWidth = 9;
  Chart.defaults.plugins.legend.labels.boxHeight = 9;
  Chart.defaults.plugins.legend.labels.padding = 14;
  Chart.defaults.plugins.tooltip = Object.assign(Chart.defaults.plugins.tooltip || {}, tooltipStyle());
  Chart.defaults.elements.bar.borderRadius = 7;
  Chart.defaults.elements.bar.borderSkipped = false;
  Chart.defaults.elements.line.borderWidth = 2.5;
  Chart.defaults.elements.point.radius = 3;
  Chart.defaults.elements.point.hoverRadius = 5;
  Chart.defaults.datasets.bar.categoryPercentage = .72;
  Chart.defaults.datasets.bar.barPercentage = .78;
  Chart.register(OchaValueLabelsPlugin);
}
ochaChartDefaults();
