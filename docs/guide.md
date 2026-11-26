Zinc est le design système des apps perso d'Alexis. Il ne couvre que les **interfaces d'app** : pas les documents, les présentations ni les visuels. Les composants sont des composants React (`@zinc/ui`) stylés par des classes préfixées `zn-` ; les valeurs viennent toutes de `tokens.json`.

> **Source de vérité : le dépôt `zinc`.** Ce guide, les tokens, le moteur de thème, les variantes et les composants vivent dans le dépôt. L'artefact Design System en est la vitrine, générée par `/design-sync` : il est en lecture seule. Pour changer quoi que ce soit, modifier le dépôt puis relancer la synchro. Installation et usage dans une app : section « Utiliser Zinc dans une app ».

> **Style par défaut : « Panneau ».** Navigation posée sur le fond, contenu dans un panneau surélevé ; police Hanken Grotesk. Les tokens et les composants de base suivent ce style. Deux **variantes** sont disponibles, Net et Tempéré (voir « Variantes de style »).

## Principes

- **Simple, classique, moderne.** Une interface qui se fait oublier : pas de reflets, pas de verre dépoli, pas de dégradés décoratifs, pas d'emoji en guise d'icônes, pas de cartes à bordure gauche colorée.
- **L'entre-deux, partout.** Ni tout rond ni tout carré ; ni aéré ni compact. Coins de 6 px (`radius-sm`) et 8 px (`radius-md`), 12 px (`radius-lg`) pour le panneau ; contrôles de 32 px (`control-md`) ; grille de 4 px.
- **Des plans lisibles.** L'app se lit en trois plans : la coquille `bg`, le panneau `surface`, les cartes `surface-subtle`. C'est le changement de fond, plus que les ombres, qui sépare les zones.
- **Des exceptions assumées, pas du hasard.** La recherche et les chips de statut sont des pilules (`radius-full`). Il n'y en a pas d'autres.
- **Une seule couleur d'accent.** `accent` porte l'action principale et l'état actif. Tout le reste est neutre ; les couleurs d'état (`success`, `warning`, `danger`, `info`) ne servent qu'aux états.

## Les trois couches

Le système est découpé en trois couches **indépendantes**. On doit pouvoir changer l'une sans toucher aux deux autres.

| Couche | Ce qu'elle décide | Où elle vit | Qui la change |
| --- | --- | --- | --- |
| **Disposition** | Ce qu'il y a dans le panneau : grille de cartes, tableau, formulaire centré, liste / détail | planche **Dispositions** (repères) | chaque page, selon son contenu |
| **Style** | L'allure : coquille Panneau, police, tailles, coins, bordures, ombres, densité | `type`, `spacing`, `radius`, `shadow`, `size`, `layout` | le design système (un style pour toutes les apps) |
| **Couleur** | Le thème : neutres, accent, mode clair / sombre, couleurs d'état | famille `color` | **l'utilisateur**, à tout moment, dans les réglages de l'app |

- Un composant ne contient **aucune couleur en dur** : il ne lit que les noms de `color`. Un nouveau thème = de nouvelles valeurs pour ces mêmes noms, sans rien recompiler.
- Un composant ne contient **aucun coin, aucune taille en dur** : il lit `radius-*`, `space-*`, `control-*`.
- Le système n'impose **aucune disposition** de page. La coquille (nav + panneau) fait partie du style ; ce qu'on met dans le panneau est libre.

## Couleur

Un thème se construit à partir de **trois graines**, réglables dans l'app (planche **Couleurs**, composant `ThemeSettings`) : un **neutre** (pur, ardoise par défaut, chaud, teinté par l'accent), un **accent** (jaune par défaut `#f5c518` / `#facc15`, teal, bleu, violet, vert, rose, graphite, ou n'importe quelle couleur), un **mode** (clair ou sombre). Le moteur (`@zinc/ui/theme`) en dérive tous les tokens `color`, les applique sur `:root` et enregistre le réglage localement. Avec les graines par défaut, il redonne exactement les valeurs de `tokens.json`. Les couleurs d'état ne dépendent pas de l'accent.

Plans :

- Coquille de l'app, derrière la nav et autour du panneau : `bg`.
- Panneau de contenu, menus, dialogues, champs : `surface`.
- Cartes et lignes posées dans le panneau : `surface-subtle`, avec `border`.
- Survol dans le panneau, piste des tabs, tags : `surface-muted`. Terminal et code : `surface-sunken`.

Texte : `text` ; secondaire `text-muted` ; placeholders, eyebrows, compteurs `text-faint`. Tous trois tiennent ≥ 4,5:1 sur les quatre plans, dans les deux modes.

Accent :

- `accent` est un **aplat** : bouton principal (texte `on-accent`, survol `accent-hover`), interrupteur et case cochés, marque de l'app.
- Quand l'accent devient **texte ou icône** (lien, icône de l'item de nav actif), on utilise `accent-text`, sa version lisible. Un jaune clair n'est pas lisible en texte sur blanc ; `accent-text` le fonce juste assez.
- `on-accent` est calculé pour le meilleur contraste : encre foncée sur un accent clair (le jaune), blanc sur un accent foncé.
- Focus et champ actif : `focus-ring`.

Contour d'un contrôle : `border-control` (≥ 3:1 sur les quatre plans, une case pouvant être posée dans une carte). Contour d'une carte ou du panneau : `border` (décoratif). Chaque état porte un **mot ou une icône** en plus de sa couleur ; `warning` est orange pour ne pas se confondre avec l'accent jaune.

## Typographie

- Une seule famille pour l'interface, `sans` (Hanken Grotesk), et `mono` (JetBrains Mono) pour le code. `display` sert au titre de page et au nom de l'app ; c'est la même police que `sans` par défaut.
- Échelle courte : `display` (titre de page, une fois par vue), `title` (carte, dialogue), `body` (13,5 px), `label` (boutons, nav, tabs), `caption` (méta), `eyebrow` (groupes de la nav, capitales, `text-faint`), `code`.
- Pas de police fantaisie, pas de titre en couleur d'accent, pas d'italique décoratif.
- `mono` sert à **afficher** du code : chemins et références dans une carte ou un tableau (`ZORG-26`), commandes, terminal, raccourcis. Un champ de saisie reste en `sans`, même s'il contient un chemin : une police mono plus petite que le texte voisin paraît floue dans un champ.

## Coquille, formes, profondeur

- **Coquille** : la nav est posée directement sur `bg`, sans fond propre. Le contenu vit dans un **panneau** `surface`, contour `border`, `shadow-sm`, coins `radius-lg`, séparé de la fenêtre et de la nav par `shell-gap` (6 px).
- **Nav** : items à `control-md`, `radius-md`, `text-muted`. Survol `surface-subtle`. Item actif : une petite carte `surface` avec `border` et `shadow-sm`, icône en `accent-text`.
- **Coins** : boutons, champs, items de menu `radius-sm` ; cartes, items de nav, piste des tabs, menus `radius-md` ; panneau, fenêtre, dialogues `radius-lg` ; tags, kbd, cases `radius-xs`.
- **Bordures** de 1 px partout. Une carte cliquable passe à `border-strong` et à `surface` au survol, sans se soulever.
- **Ombres** : `shadow-sm` seulement pour le panneau, l'item de nav actif et l'onglet actif ; `shadow-pop` pour ce qui flotte (menu, dialogue, toast). Les cartes n'ont pas d'ombre.

## Variantes de style

Panneau est le style par défaut. Une app, ou une seule zone d'une app, peut passer à une variante avec un attribut, sans changer ni les composants ni le thème de couleur :

- `data-variant="net"` : pas de panneau surélevé (la nav a son fond `surface` et un filet, le contenu est sur `bg`), coins 6 / 8 / 10, nav active en `accent-soft`, tabs rectangulaires collés, cartes `surface` sans ombre. Pour un outil très sobre.
- `data-variant="tempere"` : même coquille que Net, coins 8 / 12 / 14, texte en Plus Jakarta Sans et titres en Outfit, cartes et bouton secondaire avec `shadow-sm`. Pour une app plus douce.

Les valeurs propres à chaque variante (coins, polices) sont dans `tokens.json` › `variants` ; les règles de coquille, nav, tabs et cartes dans `src/styles/variants.css`. Une variante ne redéfinit que des tokens de style (`radius-*`, polices) et la coquille, la nav, les tabs et les cartes ; tout le reste du guide s'applique à l'identique. Elle ne touche jamais aux couleurs.

## Donner une identité propre à une app

Toutes les apps partagent Zinc, mais elles ne doivent pas toutes avoir la même tête. La règle : **une seule base, des réglages par app**, jamais une copie modifiée du système.

**Par défaut, une nouvelle app applique Zinc tel quel** : style Panneau, thème par défaut, police `display` = `sans`. On ajuste ensuite, seulement si l'app le demande.

Les réglages, du plus marquant au plus discret :

1. **La structure.** Le choix de la navigation et de l'organisation des pages (barre latérale, rail d'icônes, barre supérieure, liste / détail, panneau d'outil en bas…). C'est ce qui donne le plus l'impression de changer d'environnement.
2. **La police `display`.** Une police propre à l'app, pour le titre de page et le nom de l'app seulement ; le texte courant reste en `sans`. Elle reste sobre et lisible : pas de police fantaisie, pas de script, une seule par app.
3. **Le thème par défaut.** Un accent et une température de neutre (pur, ardoise, chaud, teinté) propres à l'app. Ce n'est qu'une valeur de départ : l'utilisateur garde la main sur le thème.
4. **La variante de style.** Panneau, `net` ou `tempere`, pour toute l'app ou une zone.
5. **Un élément signature.** Un motif tiré du métier de l'app, qui revient d'une page à l'autre (une façon d'afficher les références, les chiffres, les statuts, un panneau d'outil…), construit avec les composants et les tokens existants.
6. **La voix.** La marque de l'app, le ton des textes, les états vides.

Règles :

- Changer **deux ou trois réglages** par app, pas tous. Pour qu'une app se sente vraiment différente, toucher au moins à la structure ou à la police `display`.
- Ne **jamais** changer : le comportement des composants, la grille de 4 px, les hauteurs de contrôle, les états (focus, survol, désactivé), les seuils de contraste, les exceptions de forme.
- Ne **jamais** réintroduire ce que le système exclut : verre dépoli, reflets, dégradés décoratifs, emoji, polices fantaisie.
- Techniquement, le profil d'une app tient dans une petite feuille posée après Zinc : `data-variant` sur `<html>` si besoin, `--font-display`, les graines du thème par défaut (passées à `initTheme`), et les styles de l'élément signature. Aucun composant n'est copié. Exemple dans « Utiliser Zinc dans une app ».

## Espacement et densité

- Grille de 4 px : `space-1` à `space-8`.
- Contrôles à `control-md` (32 px) par défaut, `control-sm` (28 px) dans une barre d'outils ou une ligne de tableau, `control-lg` (36 px) pour la recherche principale.
- Panneau : padding `space-5` / `space-6`. Carte : padding `space-4`. Écart entre sections : `space-8`.

## Composants et exceptions

| Composant | Forme |
| --- | --- |
| Boutons, champs | `radius-sm`, `control-md` |
| Tabs | piste `surface-muted` en `radius-md` ; onglet actif posé en `surface` avec `border` et `shadow-sm` |
| Barre de recherche | **exception** : pilule `radius-full`, `control-lg` ; le raccourci garde à droite la même marge que l'icône à gauche |
| Interrupteur, case | `switch-width` × `switch-height`, pilule ; case `checkbox-size`, `radius-xs` ; éteints en `border-control`, cochés en aplat `accent` |
| Menu, liste déroulante | `surface`, `border`, `radius-md`, `shadow-pop` ; items `control-md`, `radius-sm`, survol `surface-muted` |
| Chips de statut | **exception** : pilule `radius-full`, avec point de couleur |
| Tags | `radius-xs`, fond `surface-muted`, sans point : ils classent, ils ne signalent rien |

## Disposition

Le système n'impose pas de disposition : **chaque page choisit la sienne selon son contenu**, et une même app en mélange plusieurs. La planche **Dispositions** montre quatre organisations courantes comme repères, pas comme modèles obligatoires : sidebar + contenu, rail + panneau, barre supérieure + contenu centré, liste / détail.

## Iconographie

- **Lucide** (déjà utilisé par Zorg et CortX), trait de 2, 16 px dans les contrôles, 14 px dans les chips.
- Les icônes prennent la couleur du texte voisin (`currentColor`) ; seule l'icône de l'item actif passe en `accent-text`.
- Pas d'emoji dans l'interface.

## Contenu et ton

- Français par défaut (Zorg), anglais accepté pour les outils de dev déjà en anglais (CortX) ; une app ne mélange pas les deux.
- Phrases courtes, casse de phrase (« Nouveau projet », pas « Nouveau Projet »). Verbe d'abord sur les boutons : « Créer », « Importer », « Lancer tout ».
- Placeholders utiles : « Rechercher un projet… », « Aller à… (vue, projet) ».

## États et accessibilité

- Focus clavier : anneau `focus-ring` de 2 px plein, décalé de 2 px, sur tout élément interactif.
- Désactivé : opacité 0,5, pas de changement de couleur.
- Contrastes vérifiés dans les deux modes : texte ≥ 4,5:1 sur les quatre plans, contours de contrôle et focus ≥ 3:1. Un test du dépôt (`bun test`) le vérifie pour chaque préréglage d'accent, chaque neutre et les deux modes, et sur un balayage de couleurs libres.
