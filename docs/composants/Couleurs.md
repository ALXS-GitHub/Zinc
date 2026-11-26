Planche du moteur de thème : trois graines (accent, neutre, mode) produisent tous les tokens `color`, contrastes vérifiés en direct.

- **Accent** : un préréglage (jaune par défaut, teal, bleu, violet, vert, rose, graphite) ou une couleur libre. L'aplat `accent` garde la couleur choisie ; `accent-text` en est la version foncée (clair) ou éclaircie (sombre) juste assez pour rester lisible comme texte sur les quatre plans (`bg`, `surface`, `surface-subtle`, `surface-muted`, ≥ 4,5:1) ; `on-accent` bascule entre blanc et encre foncée selon le meilleur contraste ; `focus-ring` prend l'aplat s'il atteint 3:1, sinon `accent-text`.
- **Neutre** : pur (gris sans teinte), ardoise (froid, par défaut), chaud, ou teinté par l'accent.
- **Mode** : clair ou sombre.

Chaque pastille affiche sa valeur et son pire contraste sur les fonds où le token est utilisé ; une paire sous le seuil passe en rouge. L'aperçu à droite applique le thème à de vrais composants. « Voir le CSS du thème » donne le bloc de variables.

La planche exécute le moteur du dépôt (`src/theme`, embarqué tel quel) : ce qu'elle montre est exactement ce que calcule `@zinc/ui/theme`. Dans une app, `useZincTheme()` + `<ThemeSettings />` (ou `initTheme` / `setTheme` sans React) appliquent le résultat sur `:root` et l'enregistrent localement ; aucun composant ne change.
