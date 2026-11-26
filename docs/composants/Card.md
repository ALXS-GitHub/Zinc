Carte d'objet (projet, ticket, script) dans une liste ou une grille, avec chips de statut et tags.

- **Carte** (`zn-card`) : posée dans le panneau, fond `surface-subtle`, contour `border`, `radius-md`, padding `space-4`, **aucune ombre**. Cliquable (`is-clickable`) : au survol, fond `surface` et contour `border-strong` ; la carte ne se soulève pas.
- Contenu : titre `title`, méta en `font-mono` `text-muted` (chemin, référence), description `text-muted`, pied avec tags et actions ghost `control-sm`.
- **Chip de statut** (`zn-chip` + `zn-chip-open|progress|done|blocked`) : **exception assumée**, pilule `radius-full` avec point `info`, `warning`, `success` ou `danger`. Le mot porte le sens ; le point le confirme.
- **Tag** (`zn-tag`) : `radius-xs`, fond `surface-muted`, texte `text-muted`, sans point. Il classe, il ne signale rien.

Le consommateur fournit le titre, la méta, le statut et les tags. Une carte n'a jamais de bordure gauche colorée.

**React** : `<Card interactive>` avec `CardHeader`, `CardTitle`, `CardMeta`, `CardDescription`, `CardFooter`, `Spacer` ; `<Chip status="progress">En cours</Chip>` ; `<Tag>web</Tag>`.
