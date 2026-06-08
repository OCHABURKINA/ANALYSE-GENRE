/* ================================================================
   OCHA Charts — Shared JS config
   OCHA Official Palette
   ================================================================ */
const OCHA = {
  /* UN Blue */
  bl1:'#002E6E', bl2:'#004987', bl3:'#0074B7', bl4:'#009EDB',
  bl5:'#64BDEA', bl6:'#C5DFEF', bl7:'#E3EDF6',
  /* Orange */
  or1:'#70200C', or2:'#90371C', or3:'#C15025', or4:'#F58220',
  or5:'#F9A870', or6:'#FEDCBD', or7:'#FFEAD5',
  /* Slate */
  sl1:'#1B1B1A', sl2:'#493F38', sl3:'#6E6259', sl4:'#AEA29A',
  sl5:'#C5BFBA', sl6:'#DDDAD7', sl7:'#EDEAE6',
  /* Semantic shortcuts */
  female: '#F58220',  // Orange-4 primary
  male:   '#0074B7',  // Blue-3
  grid:   '#EDEAE6',
};

/* Chart.js defaults */
Chart.defaults.font.family = "'Source Sans 3', 'Source Sans Pro', Arial, sans-serif";
Chart.defaults.font.size = 13;
Chart.defaults.color = '#6E6259';
Chart.defaults.borderColor = '#EDEAE6';

/* Shared options factories */
function chartGrid() {
  return { color: OCHA.sl7, drawBorder: false };
}
function tickStyle(size=11) {
  return { font:{ size }, color: OCHA.sl3 };
}
function tooltipStyle() {
  return {
    backgroundColor: OCHA.bl1,
    titleColor: OCHA.bl5,
    bodyColor: '#fff',
    borderColor: OCHA.or4,
    borderWidth: 1,
    padding: 10,
    cornerRadius: 6,
    titleFont: { weight:'700', size:12 },
    bodyFont: { size: 12 },
  };
}

/* 7-stop blue palette for regional charts */
const BLUE_7 = [OCHA.bl1, OCHA.bl2, OCHA.bl3, OCHA.bl4, OCHA.bl5, OCHA.bl6, OCHA.bl7];
/* Orange 7 stops */
const OR_7   = [OCHA.or1, OCHA.or2, OCHA.or3, OCHA.or4, OCHA.or5, OCHA.or6, OCHA.or7];
/* Mixed Blue+Orange for sectors */
const MIX_14 = [
  OCHA.bl1, OCHA.bl2, OCHA.or1, OCHA.bl3, OCHA.or2, OCHA.bl4,
  OCHA.or3, OCHA.bl5, OCHA.or4, OCHA.bl6, OCHA.or5, OCHA.bl7, OCHA.or6, OCHA.sl3
];
