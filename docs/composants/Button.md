Bouton d'action, en quatre variantes : `primary`, `secondary`, `ghost`, `danger`.

- **Primary** (`zn-btn-primary`) : fond `accent`, texte `on-accent`, survol `accent-hover`. Une seule fois par vue, pour l'action pour laquelle la vue existe.
- **Secondary** (`zn-btn-secondary`) : fond `surface`, contour `border-strong`, survol `surface-muted`. Actions courantes à côté du primaire.
- **Ghost** (`zn-btn-ghost`) : sans fond, texte `text-muted`. Annuler, actions de ligne, boutons icône.
- **Danger** (`zn-btn-danger`) : fond `danger`, texte `on-danger`. Seulement pour l'action destructrice elle-même, dans une confirmation.

Tailles : `control-md` (32 px) par défaut, `zn-btn-sm` à `control-sm` (28 px) dans une barre d'outils ou une ligne. `zn-btn-icon` pour un bouton carré avec une icône seule : il exige un `aria-label`.

Forme : `radius-sm`. Libellé verbe d'abord, casse de phrase (« Nouveau projet »). Icône Lucide de 16 px à gauche du libellé, écart `space-2`. Focus : anneau `focus-ring` 2 px décalé de 2 px. Avec l'accent jaune, le texte du bouton principal est une encre foncée (`on-accent`), jamais du blanc. Désactivé : opacité 0,5.

**React** : `<Button variant="primary" size="sm" icon aria-label="…">`, `asChild` pour donner le style à un lien de routeur ; `buttonClass({ variant, size })` renvoie les classes seules.
