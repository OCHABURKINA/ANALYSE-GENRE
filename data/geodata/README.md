# Données géographiques

Copier ici les fichiers convertis en GeoJSON depuis :
`C:\ONEDRIVE\OneDrive - United Nations\Documents\Analyse genre Diane\geodata\bfa_admin_boundaries\Version 6`

Noms attendus par le portail :
- `bfa_admin1.geojson` : régions
- `bfa_admin2.geojson` : provinces
- `bfa_admin3.geojson` : communes

Le portail joint les données par codes administratifs lorsqu'ils sont disponibles. Vérifier les champs `ADM1_PCODE`, `ADM2_PCODE`, `ADM3_PCODE` et adapter `js/odf/odf-app.js` si la Version 6 utilise d'autres noms.
