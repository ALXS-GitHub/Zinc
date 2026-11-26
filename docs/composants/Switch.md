Interrupteur et case à cocher : un réglage à effet immédiat, un choix à valider avec le formulaire.

- **Interrupteur** (`zn-switch`, Radix Switch) : piste `switch-width` × `switch-height`, pilule. Éteint : contour `border-control`, fond `surface-muted`, pouce `border-control`. Allumé : piste en aplat `accent`, pouce `on-accent`. Pour un réglage qui s'applique tout de suite (notifications, synchronisation).
- **Case** (`zn-checkbox`, Radix Checkbox) : `checkbox-size`, `radius-xs`, contour `border-control` sur `surface`. Cochée ou indéterminée : aplat `accent`, coche Lucide en `on-accent`. Pour un choix dans un formulaire ou une sélection de lignes.
- Libellé cliquable à droite (`zn-check`), en `body`, écart `space-2`. Sans libellé visible, fournir `aria-label`.
- Focus : anneau `focus-ring` 2 px décalé de 2 px. Désactivé : opacité 0,5.

**React** : `<Switch label="Notifications" checked={on} onCheckedChange={setOn} />`, `<Checkbox label="Archiver après fusion" checked={value} onCheckedChange={setValue} />` (`checked="indeterminate"` pour une sélection partielle).
