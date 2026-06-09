/* Shared chart utilities - OCHA Blue + Purple */
const OCHA = {
  dark:'#002E6E', bl1:'#002E6E', bl2:'#004987', bl3:'#0074B7', bl4:'#009EDB', bl5:'#64BDEA', bl6:'#C5DFEF', bl7:'#E3EDF6',
  pr1:'#3E125B', pr2:'#5B2C86', pr3:'#763F98', pr4:'#A05FB4', pr5:'#BD8CBF', pr6:'#D5B4D6', pr7:'#E4D7E8',
  black:'#000000', white:'#FFFFFF', sl2:'#1F2937', sl3:'#475569', sl4:'#64748B', sl6:'#E2E8F0', sl7:'#F8FAFC',
  female:'#763F98', male:'#0074B7', girls:'#A05FB4', boys:'#004987', org:'#0074B7'
};
const BLUE_RAMP=[OCHA.bl7,OCHA.bl6,OCHA.bl5,OCHA.bl4,OCHA.bl3,OCHA.bl2,OCHA.bl1];
const PURPLE_RAMP=[OCHA.pr7,OCHA.pr6,OCHA.pr5,OCHA.pr4,OCHA.pr3,OCHA.pr2,OCHA.pr1];
const MIX_14=[OCHA.bl1,OCHA.bl2,OCHA.bl3,OCHA.bl4,OCHA.bl5,OCHA.bl6,OCHA.pr2,OCHA.pr3,OCHA.pr4,OCHA.pr5,OCHA.pr6,OCHA.bl2,OCHA.bl3,OCHA.pr3];
function chartGrid(){return {color:'rgba(0,46,110,.10)',drawBorder:false};}
function tickStyle(size=11){return {color:OCHA.sl3,font:{family:'Source Sans 3, Segoe UI, Arial, sans-serif',size:size,weight:'600'}};}
function tooltipStyle(){return {backgroundColor:'#FFFFFF',titleColor:OCHA.bl1,bodyColor:OCHA.sl2,borderColor:'rgba(0,46,110,.18)',borderWidth:1,padding:10,displayColors:true};}
const valueLabelsPlugin={id:'valueLabels',afterDatasetsDraw(chart,args,opts){if(!opts||opts.display===false)return;const{ctx}=chart;ctx.save();ctx.font=`700 ${opts.fontSize||11}px Source Sans 3, Segoe UI, Arial`;ctx.fillStyle=opts.color||OCHA.bl1;ctx.textAlign='center';ctx.textBaseline='bottom';chart.data.datasets.forEach((ds,i)=>{const meta=chart.getDatasetMeta(i);if(meta.hidden)return;meta.data.forEach((el,j)=>{const val=ds.data[j];if(val==null)return;let p=el.tooltipPosition();const suffix=opts.suffix||'';ctx.fillText(`${val}${suffix}`,p.x,p.y-4);});});ctx.restore();}};
if(window.Chart){Chart.register(valueLabelsPlugin);Chart.defaults.font.family='Source Sans 3, Segoe UI, Arial, sans-serif';Chart.defaults.color=OCHA.sl2;}
function baseBarOptions({horizontal=false, percent=false, stacked=false, max=null, legend=true, labels=true}={}){
  return {indexAxis:horizontal?'y':'x',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:legend,labels:{boxWidth:10,font:{size:12,weight:'700'}}},tooltip:{...tooltipStyle()},valueLabels:{display:labels,suffix:percent?'%':'',fontSize:10}},scales:{x:{stacked,grid:horizontal?chartGrid():{display:false},ticks:{...tickStyle(),callback:percent&&!horizontal? v=>v+'%':undefined},max:horizontal?max:null},y:{stacked,max:horizontal?null:max,grid:horizontal?{display:false}:chartGrid(),ticks:{...tickStyle(),callback:percent&&horizontal? v=>v+'%':undefined}}}};
}
