# ANALYSE-GENRE — mise à jour analyses et documents

Cette mise à jour ajoute :

- des graphiques complémentaires dans chacun des sept résultats ;
- des comparaisons femmes-hommes ;
- des comparaisons filles-garçons ;
- des comparaisons PDI-communautés hôtes ;
- des lectures analytiques transversales ;
- une page `pages/documents.html` ;
- le résumé exécutif et le plan opérationnel téléchargeables.

## Fichiers nouveaux

```text
data/extended-analysis.js
data/documents.json
pages/documents.html
js/documents.js
css/documents.css
assets/documents/resume-analyse-conjointe-genre-burkina-faso-2026.pdf
assets/documents/plan-operationnel-analyse-conjointe-genre-2026-2028.pdf
```

## Fichiers modifiés

```text
index.html
js/app.js
css/styles.css
```

## Données existantes à conserver

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

1. Copier tous les fichiers de cette archive dans le dépôt existant.
2. Accepter le remplacement de `index.html`, `js/app.js` et `css/styles.css`.
3. Conserver vos fichiers de données existants aux emplacements indiqués.
4. Envoyer les changements sur la branche `main`.
5. Attendre la fin du workflow GitHub Pages.
6. Recharger la page avec `Ctrl + F5`.
