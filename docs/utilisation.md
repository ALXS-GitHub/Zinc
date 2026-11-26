# Utiliser Zinc dans une app

Zinc se consomme comme un paquet local, `@zinc/ui`, qui exporte ses sources TypeScript et ses feuilles CSS : l'outil de build de l'app (Vite) les compile. Prérequis : React 19, et Tailwind v4 si l'app utilise shadcn/ui.

## Installer

Depuis le dossier de l'app (le dépôt `zinc` cloné à côté des apps) :

```sh
bun add @zinc/ui@file:../Zinc          # app autonome (CortX)
bun add @zinc/ui@file:../../../Zinc    # paquet d'un monorepo (Zorg : apps/web)
```

Ou depuis git, sans clone local : `bun add @zinc/ui@github:ALXS-GitHub/Zinc#<tag>`. Les dépendances de comportement (`radix-ui`, `lucide-react`) et les polices (`@fontsource-variable/*`) viennent avec le paquet.

## Brancher les styles

Une seule feuille d'entrée, dans cet ordre :

```css
/* src/index.css */
@import "tailwindcss";            /* si l'app utilise Tailwind */
@import "@zinc/ui/zinc.css";      /* polices, tokens, base, composants, variantes */
@import "@zinc/ui/shadcn.css";    /* si l'app a des composants shadcn/ui */
@import "./profil.css";           /* le profil de l'app (facultatif, voir plus bas) */
```

- `zinc.css` regroupe `fonts.css`, `tokens.css` (généré depuis `tokens.json`), la base, les composants `zn-` et les variantes. Les composants sont dans la couche `components` : un utilitaire Tailwind passé en `className` reste prioritaire.
- Sans Tailwind, importer seulement `zinc.css`. Pour charger les polices autrement, importer `tokens.css` à la place et fournir les polices soi-même.

## Thème : le réglage de l'utilisateur

Le thème (accent, neutre, mode) appartient à l'utilisateur. Le moteur l'applique sur `:root` (variables `color`, `data-theme`, classe `.dark`, `color-scheme`) et l'enregistre dans `localStorage` (`zinc:theme`).

```tsx
import { ThemeSettings, useZincTheme } from "@zinc/ui";

export function App() {
  // Réglage enregistré > défauts de l'app > Zinc (et mode du système).
  const { seed, setSeed } = useZincTheme({ defaults: { accent: { preset: "jaune" } } });
  return <Settings>{/* … */}<ThemeSettings value={seed} onChange={setSeed} /></Settings>;
}
```

Sans React : `initTheme(options)` au démarrage, `setTheme(seed)` depuis les réglages, `buildTheme(seed)` pour obtenir les valeurs sans toucher au DOM (`@zinc/ui/theme`). Pour éviter un flash clair → sombre, poser `themeBootScript()` (une chaîne) dans un `<script>` en tête de `index.html`, avant les styles.

Une app en anglais passe ses libellés à `ThemeSettings` (`labels={{ accent: "Accent", neutral: "Neutral", … }}`) : une app ne mélange pas les langues.

## Composants

```tsx
import { Shell, Sidebar, SidebarBrand, NavItem, Panel, PageHeader, Button } from "@zinc/ui";
import { FolderKanban } from "lucide-react";

<Shell>
  <Sidebar>
    <SidebarBrand>Zorg</SidebarBrand>
    <NavItem asChild active={isProjects}>
      <Link to="/projets"><FolderKanban /> Projets</Link>
    </NavItem>
  </Sidebar>
  <Panel>
    <PageHeader title="Projets" actions={<Button variant="primary">Nouveau projet</Button>} />
    {/* la disposition de la page est libre */}
  </Panel>
</Shell>
```

| Composant | Rôle | Remplace côté shadcn |
| --- | --- | --- |
| `Shell`, `Sidebar`, `SidebarBrand`, `SidebarGroupLabel`, `SidebarFooter`, `NavItem`, `Panel`, `PageHeader` | coquille Panneau | `Sidebar` et la mise en page |
| `Button` (`primary`, `secondary`, `ghost`, `danger` ; `sm`, `md`, `lg` ; `icon`) | actions | `Button` |
| `Field`, `Input`, `Textarea` | champs avec libellé, aide, erreur reliés | `Input`, `Label`, `Field` |
| `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` | liste déroulante | `Select` |
| `Search` | recherche principale (pilule, raccourci `hotkey="k"`) | — |
| `Tabs`, `TabsList`, `TabsTrigger` (`count`), `TabsContent` | onglets segmentés | `Tabs` |
| `Card`, `CardHeader`, `CardTitle`, `CardMeta`, `CardDescription`, `CardFooter`, `Spacer` | cartes | `Card` |
| `Chip` (`open`, `progress`, `done`, `blocked`), `Tag`, `Kbd` | statut, classement, raccourci | `Badge` |
| `Switch`, `Checkbox` (`label`, état indéterminé) | interrupteur, case | `Switch`, `Checkbox` |
| `Menu`, `MenuTrigger`, `MenuContent`, `MenuItem` (`icon`, `shortcut`, `danger`), `MenuCheckboxItem`, `MenuLabel`, `MenuSeparator` | menu d'actions | `DropdownMenu` |
| `ThemeSettings`, `useZincTheme` | réglage du thème | — |

Le comportement et l'accessibilité viennent de Radix ; le style vient uniquement des classes `zn-` et des tokens. Les classes sont aussi utilisables sans React (`class="zn-btn zn-btn-primary"`), comme dans les planches de la vitrine.

## La couche shadcn/ui

`@zinc/ui/shadcn.css` branche les tokens sur les variables de shadcn (`--background`, `--primary`, `--muted`, `--input`, `--ring`, `--sidebar-*`, `--chart-*`…) et sur les utilitaires Tailwind (couleurs, coins, ombres, polices, `text-xs` / `text-sm`). Les composants shadcn existants prennent l'allure Zinc sans être réécrits.

- **Une collision de nom.** Pour shadcn, `accent` est un fond de survol ; pour Zinc, c'est l'aplat. La variable `--accent` reste celle de Zinc ; l'utilitaire `bg-accent` pointe sur `surface-muted`. En Tailwind, l'aplat Zinc s'écrit `bg-primary`, et `text-primary` donne `accent-text` (lisible).
- **Ce que la couche ne fait pas.** Les hauteurs (shadcn : 36 px, Zinc : 32 px) et la structure des composants shadcn restent les leurs. Pour la coquille, les boutons, les champs, les onglets et les cartes, préférer les composants Zinc ; garder shadcn pour ce que Zinc ne fournit pas (dialogue, popover, tooltip, command…).
- Les tokens Zinc existent aussi sous leur nom en Tailwind : `bg-surface`, `bg-surface-subtle`, `text-text-muted`, `border-border-control`, `text-accent-text`, `h-control-md`, `w-sidebar`, `max-w-content`…
- La variante `dark:` suit `.dark` et `[data-theme="dark"]`.

## Variantes de style

```html
<html data-variant="net">          <!-- toute l'app -->
<section data-variant="tempere">   <!-- une zone -->
```

Les coins et les polices suivent partout (composants Zinc et shadcn) ; les changements de coquille, de nav, d'onglets et de cartes s'appliquent aux composants Zinc.

## Le profil d'une app

Par défaut, une app applique Zinc tel quel. Son profil, quand il existe, est une petite feuille posée après Zinc, et les graines par défaut passées au moteur. Gabarit (les valeurs sont à décider app par app) :

```css
/* profil.css — posé après @zinc/ui/zinc.css */
:root {
  --font-display: "<Police display>", var(--font-sans);   /* titre de page et nom de l'app */
}
/* data-variant="net" ou "tempere" sur <html>, si besoin */
/* styles de l'élément signature, construits avec les tokens existants */
```

```tsx
useZincTheme({ defaults: { neutral: "<neutre>", accent: { preset: "<accent>" } } });
```

Jamais : redéfinir un token de couleur à la main, changer les hauteurs de contrôle, la grille, les états ou les seuils de contraste, copier un composant pour le modifier.

## Faire évoluer Zinc

Tout se passe dans le dépôt `zinc`, puis `/design-sync` met la vitrine à jour.

| Pour… | Modifier | Puis |
| --- | --- | --- |
| une valeur (espacement, coin, couleur par défaut, police) | `tokens.json` | `bun run tokens` |
| un préréglage d'accent ou un neutre | `src/theme/engine.ts` (`ACCENT_PRESETS`, `NEUTRALS`) | `bun test` (contrastes) |
| une variante | `tokens.json` › `variants` et `src/styles/variants.css` | `bun run shots` |
| un composant | `src/components/*.tsx` et `src/styles/components.css` | `bun run shots` |
| le guide | `docs/` | — |

`bun run build` vérifie tout : tokens générés à jour, typecheck, tests de contraste, build de la démo, export de la vitrine. `bun run demo` lance la démo ; `bun run shots` en prend les captures (test visuel, `.showcase/shots/`).
