La coquille d'app du style Panneau : la navigation est posée sur le fond, le contenu dans un panneau surélevé, séparé des bords par un petit écart.

- **Coquille** (`zn-shell`) : fond `bg`, plein écran (`100dvh`). Deux colonnes : `sidebar-width` + contenu. Encadrée dans une planche ou un aperçu (`is-framed`) : contour `border-strong`, coins `radius-lg` + `shell-gap`.
- **Navigation** (`zn-sidebar`, `zn-nav`) : directement sur `bg`, sans fond propre. Item à `control-md`, `radius-md`, texte `text-muted` ; survol `surface-subtle`. Item actif (`aria-current="page"`) : une petite carte `surface` avec contour `border` et `shadow-sm`, icône en `accent-text`. Groupes titrés par `zn-eyebrow`.
- **Panneau** (`zn-panel`) : fond `surface`, contour `border`, coins `radius-lg`, `shadow-sm`, écart `shell-gap` (6 px) avec la fenêtre et la nav, padding `space-5` / `space-6`.
- Dans le panneau, les cartes sont en `surface-subtle` : elles se détachent par leur fond et leur bordure, sans ombre.

C'est le contraste entre les trois plans (`bg` → `surface` → `surface-subtle`) qui rend les zones de l'app lisibles d'un coup d'œil. Le contenu du panneau (sa disposition) reste libre : une page peut y mettre une grille de cartes, un tableau, un formulaire centré ou un liste / détail.

**React** : `Shell` (`framed`), `Sidebar`, `SidebarBrand`, `SidebarGroupLabel`, `NavItem` (`icon`, `count`, `active`, `asChild` pour le lien du routeur), `SidebarFooter`, `Panel`, `PageHeader` (`title`, `actions`). Le panneau défile seul ; la nav reste en place.
