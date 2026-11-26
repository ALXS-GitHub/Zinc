Champs de saisie : champ texte, select et barre de recherche.

- **Champ** (`zn-field` + `zn-input`) : libellé `label` au-dessus, contrôle à `control-md`, `radius-sm`, contour `border-control` (≥ 3:1), fond `surface`. Aide en `caption` `text-muted` sous le champ ; erreur en `caption` `danger`, avec `zn-input is-invalid`. Focus : contour et anneau intérieur `focus-ring`.
- **Select** (Radix) : déclencheur au gabarit d’un champ (`zn-input zn-select-trigger`), chevron Lucide en `text-muted` ; la liste prend le gabarit d’un menu (`surface`, `radius-md`, `shadow-pop`), l’option choisie est cochée en `accent-text`.
- **Recherche** (`zn-search`) : **exception assumée**, pilule `radius-full` à `control-lg` (36 px), icône loupe à gauche, raccourci `zn-kbd` à droite, avec la même marge (`space-3`) que l’icône à gauche. Une seule recherche principale par vue, en haut du contenu.

Le consommateur fournit le libellé, le placeholder (« Rechercher un projet… ») et le message d'erreur. La saisie reste en `sans`, même pour un chemin : `mono` est réservé à l'affichage du code.

**React** : `<Field label="Nom" help="…" error="…"><Input /></Field>` relie libellé, aide et erreur (`aria-describedby`, `aria-invalid`) ; même chose avec `<Select><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>…</SelectContent></Select>`. `<Search placeholder="Rechercher un projet…" hotkey="k" />` place le focus avec Ctrl K (⌘ K sur macOS).
