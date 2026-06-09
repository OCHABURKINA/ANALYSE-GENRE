/*
  Remplacez le tableau "features" ci-dessous par le vrai GeoJSON ADM1 du Burkina Faso.

  Chaque feature doit contenir au minimum :
  - properties.adm1_pcode
  - properties.adm1_name
  - geometry.type
  - geometry.coordinates
*/

const BURKINA_GEOJSON = {
  type: "FeatureCollection",
  features: []
};

window.BURKINA_GEOJSON = BURKINA_GEOJSON;
