Menu d'actions (Radix DropdownMenu) ouvert depuis un bouton : une liste courte d'actions sur un objet.

- **Contenu** (`zn-menu`) : fond `surface`, contour `border`, `radius-md`, `shadow-pop`, padding `space-1`. C'est un élément qui flotte : seule `shadow-pop` lui revient.
- **Item** (`zn-menu-item`) : `control-md`, `radius-sm`, icône Lucide 16 px en `text-muted`, survol et clavier en `surface-muted`. Raccourci à droite en `mono` `text-faint`. Action destructrice (`danger`) : texte et icône en `danger`, toujours en dernier, après un séparateur.
- **Libellé de groupe** (`zn-menu-label`) : eyebrow, capitales, `text-faint`. **Séparateur** : filet `border`.
- Case cochée dans un menu (`MenuCheckboxItem`) : coche en `accent-text` à droite.

Verbe d'abord, casse de phrase : « Renommer », « Dupliquer », « Supprimer ». Le déclencheur est en général un bouton `ghost` icône (`aria-label="Plus d'actions"`) ou un bouton `secondary`.

**React** : `<Menu><MenuTrigger asChild><Button …/></MenuTrigger><MenuContent><MenuItem icon={<Pencil />} shortcut="Ctrl D">Dupliquer</MenuItem><MenuSeparator /><MenuItem icon={<Trash2 />} danger>Supprimer</MenuItem></MenuContent></Menu>`. Ouverture au clic, à Entrée ou à Espace ; flèches pour parcourir ; Échap pour fermer.
