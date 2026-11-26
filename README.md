# Zinc

Le design système des interfaces d'app (pas des documents ni des présentations). Ce dépôt en est la **source de vérité** : tokens, moteur de thème, variantes de style, composants React et guide. La vitrine (artefact Design System sur claude.ai) est générée depuis ce dépôt par `/design-sync` et ne se modifie pas à la main.

- **Guide** : [docs/guide.md](docs/guide.md) (principes, couleur, typographie, coquille, variantes, identité d'une app).
- **Utiliser Zinc dans une app** : [docs/utilisation.md](docs/utilisation.md) (installation, styles, thème, couche shadcn, profil d'app).
- **Composants** : [docs/composants/](docs/composants/).

## En bref

```sh
bun add @zinc/ui@file:../Zinc
```

```css
@import "tailwindcss";
@import "@zinc/ui/zinc.css";
@import "@zinc/ui/shadcn.css";
```

```tsx
import { Shell, Sidebar, NavItem, Panel, PageHeader, Button, useZincTheme } from "@zinc/ui";
```

## Le dépôt

| Chemin | Contenu |
| --- | --- |
| `tokens.json` | toutes les valeurs (source unique) |
| `scripts/build-tokens.ts` | génère `src/styles/tokens.css` et `src/tokens/tokens.gen.ts` |
| `src/theme/` | moteur de thème : trois graines → tokens `color`, application sur `:root`, persistance |
| `src/styles/` | polices, base, composants `zn-`, variantes Net et Tempéré |
| `src/tailwind/shadcn.css` | couche qui branche Zinc sur shadcn/ui et Tailwind v4 |
| `src/components/` | composants React (Radix pour le comportement, tokens pour le style) |
| `docs/` | le guide, l'usage, les fiches de composants et de planches |
| `demo/` | page de démo et test visuel |
| `showcase/` | couverture, planches et aperçus de la vitrine |
| `scripts/build-showcase.tsx` | construit la vitrine dans `.showcase/project/` pour `/design-sync` |
| `tests/` | contrastes du moteur pour chaque préréglage, neutre et mode |

## Commandes

| Commande | Effet |
| --- | --- |
| `bun run tokens` | régénère les tokens après une modification de `tokens.json` |
| `bun test` | tests du moteur de thème (contrastes) |
| `bun run demo` | démo en local |
| `bun run shots` | captures de la démo (après `build:demo`) dans `.showcase/shots/` |
| `bun run build` | tokens à jour, typecheck, tests, build de la démo, vitrine |
