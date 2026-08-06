# ANALYSE-GENRE — révision complète

Ce paquet contient la réécriture des fichiers transmis :

- `index.html`
- `pages/odf.html`
- `js/app.js`
- `js/odf/odf-app.js`
- `css/styles.css`
- `css/odf-map.css`
- `.github/workflows/pages.yml`

## Fichiers à conserver ou ajouter

Les fichiers suivants n’étaient pas inclus dans la dernière série transmise et doivent être placés aux mêmes emplacements :

```text
data/portal-data.js
data/geodata/bfa_admin1.json
data/odf/odf-organizations.json
assets/logos/ocha-logo.png
assets/images/cover-photo.png
assets/images/partners-financiers-techniques.png
assets/images/partners-collecte.png
```

## Déploiement

1. Copier le contenu à la racine du nouveau dépôt.
2. Ajouter les données et images listées ci-dessus.
3. Dans GitHub : `Settings → Pages → Source : GitHub Actions`.
4. Envoyer les fichiers sur la branche `main`.
5. Attendre la fin du workflow `Deploy GitHub Pages`.

La page d’accueil et la page cartographique utilisent désormais des vues par onglets afin d’éviter un long défilement vertical.
