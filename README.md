# Version améliorée — Analyse Genre OCHA Burkina Faso

## Contenu
Cette version applique :
- palette 100 % UN Blue (#002E6E, #004987, #0074B7, #009EDB, #64BDEA, #C5DFEF, #E3EDF6) ;
- blanc et noir uniquement en appui ;
- icônes OCHA Humanitarian Icons chargées directement depuis le dépôt GitHub officiel UN-OCHA/humanitarian-icons ;
- compatibilité avec les scripts existants, y compris les anciens noms de variables de couleur ;
- cartes D3 corrigées et interactives ;
- filtres et exports CSV/PPTX sur la page Comparaison.

## Déploiement GitHub
Copier/remplacer ces fichiers dans le dépôt `OCHABURKINA/ANALYSE-GENRE` :

- `index.html`
- `pages/hommes-femmes.html`
- `pages/filles-garcons.html`
- `pages/odf.html`
- `pages/comparaison.html`
- `assets/style.css`
- `assets/charts.js`
- `assets/map.js`
- `assets/expert-visualization.css`
- `assets/ocha-icons.js`
- `assets/burkina-data.js`

Conserver dans votre dépôt le fichier existant :
- `assets/ocha-logo.png`

## Après upload
Faire un rafraîchissement forcé du navigateur : `Ctrl + F5`.

## Note technique sur les icônes
Les icônes sont appelées via :
`https://raw.githubusercontent.com/UN-OCHA/humanitarian-icons/main/SVG/...`

Cette méthode répond à la demande d'utiliser directement les icônes du GitHub OCHA. Pour une version hors-ligne ou à très forte disponibilité, il suffira de copier les mêmes SVG dans `assets/icons/`.
