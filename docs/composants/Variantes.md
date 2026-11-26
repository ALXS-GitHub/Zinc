Les deux variantes de style, utilisables dans une app à côté du style par défaut Panneau.

Une app (ou une seule zone d'une app) change de variante avec un attribut, sans toucher aux composants ni au thème de couleur :

```html
<html data-variant="net">      <!-- toute l'app -->
<section data-variant="tempere"> <!-- une zone seulement -->
```

| | Panneau (défaut) | Net | Tempéré |
| --- | --- | --- | --- |
| Coquille | nav sur `bg`, contenu dans un panneau surélevé | nav sur `surface` avec filet, contenu sur `bg` | idem Net |
| Coins ctrl / carte / grand conteneur | 6 / 8 / 12 | 6 / 8 / 10 | 8 / 12 / 14 |
| Nav active | petite carte `surface` | fond `accent-soft` | fond `accent-soft` |
| Tabs | segmentés | rectangles collés | segmentés |
| Cartes | `surface-subtle`, sans ombre | `surface`, sans ombre | `surface`, `shadow-sm` |
| Police | Hanken Grotesk | Hanken Grotesk | Plus Jakarta Sans, titres en Outfit |

Une variante ne change que la couche Style. Les règles de couleur, de contenu et d'accessibilité du guide s'appliquent à l'identique. Dans le dépôt, les tokens redéfinis par une variante (`radius-*`, polices) sont dans `tokens.json` › `variants` (générés dans `tokens.css`) ; les règles de coquille, nav, tabs et cartes dans `src/styles/variants.css`. Tempéré passe aussi `radius-xs` à 6 px.
