# Portail analytique — Analyse conjointe genre

Portail statique déployable directement sur GitHub Pages.

## Déploiement rapide

1. Remplacer le contenu de votre dépôt `ANALYSE-GENRE` par les fichiers de ce dossier.
2. Exécuter :

```bash
git add .
git commit -m "Reconstruction complète du portail Analyse Genre"
git push origin main
```

3. Dans GitHub : **Settings > Pages > Source > GitHub Actions**.
4. Le workflow `.github/workflows/pages.yml` publiera automatiquement le site.

## Test local

```bash
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

## Structure

- `index.html` : structure éditoriale complète.
- `css/styles.css` : identité visuelle, responsive design et palettes thématiques.
- `js/app.js` : génération dynamique des chapitres, KPI et graphiques Plotly.
- `data/portal-data.js` : chiffres, narratifs, analyses et recommandations.
- `assets/images/` : photo de couverture et logos des partenaires.
- `assets/docs/` : rapport narratif téléchargeable.

## Mise à jour des données

Modifier uniquement `data/portal-data.js`. Les cartes KPI, graphiques, narratifs et recommandations sont régénérés automatiquement.

## Crédit

Portail analytique développé avec l’appui de l’Unité de Gestion de l’Information (IMU) — OCHA Burkina Faso.
