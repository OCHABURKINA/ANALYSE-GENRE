/* ================================================================
   OCHA Burkina Faso — paramètres graphiques globaux
   Version institutionnelle : rampe UN Blue uniquement + blanc + noir
   ================================================================ */
const OCHA = {
  bl1:'#002E6E', bl2:'#004987', bl3:'#0074B7', bl4:'#009EDB', bl5:'#64BDEA', bl6:'#C5DFEF', bl7:'#E3EDF6',
  sl1:'#000000', sl2:'#1F2937', sl3:'#475569', sl4:'#64748B', sl5:'#94A3B8', sl6:'#E3EDF6', sl7:'#F8FAFC',
  white:'#FFFFFF', black:'#000000',
  female:'#009EDB', male:'#004987', girls:'#64BDEA', boys:'#0074B7', neutral:'#C5DFEF',
  // Compatibilité avec les anciens scripts : les anciens alias pointent désormais vers la rampe UN Blue.
  or1:'#002E6E', or2:'#004987', or3:'#0074B7', or4:'#009EDB', or5:'#64BDEA', or6:'#C5DFEF', or7:'#E3EDF6'
};

const BLUE_RAMP = ['#002E6E','#004987','#0074B7','#009EDB','#64BDEA','#C5DFEF','#E3EDF6'];
const BLUE_RAMP_REVERSE = ['#E3EDF6','#C5DFEF','#64BDEA','#009EDB','#0074B7','#004987','#002E6E'];
const MIX_14 = ['#002E6E','#004987','#0074B7','#009EDB','#64BDEA','#C5DFEF','#E3EDF6','#004987','#0074B7','#009EDB','#64BDEA','#C5DFEF','#002E6E','#0074B7'];

function tickStyle(size=11){ return {color:OCHA.sl3,font:{size}}; }
function chartGrid(){ return {color:'rgba(0,46,110,.10)',drawBorder:false}; }
function tooltipStyle(){
  return {
    backgroundColor:'#FFFFFF', titleColor:OCHA.bl1, bodyColor:OCHA.black,
    borderColor:OCHA.bl6, borderWidth:1, padding:10, displayColors:true,
    titleFont:{size:12,weight:'700'}, bodyFont:{size:11}
  };
}
function ochaChartDefaults(){
  if(!window.Chart) return;
  Chart.defaults.color = OCHA.sl2;
  Chart.defaults.font.family = "Inter, 'Segoe UI', Arial, sans-serif";
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.boxWidth = 10;
}
ochaChartDefaults();
