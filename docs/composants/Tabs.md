Sélecteur de vue en onglets segmentés : une piste, et l'onglet actif posé dessus comme une petite carte.

- Piste `zn-tabs-list` : fond `surface-muted`, `radius-md`, padding 3 px.
- Onglet `zn-tab` : hauteur `control-md` moins 6 px, coins `radius-md` moins 3 px, texte `text-muted`. Actif (`data-state="active"`, posé par Radix) : fond `surface`, contour `border`, `shadow-sm`, texte `text`.
- Compteur optionnel `zn-count` en `text-faint` après le libellé.

À utiliser pour changer de vue sur les mêmes données (Tous / Actifs / Archivés, Liste / Kanban). Pas pour naviguer entre pages : c'est le rôle de la nav. Trois à cinq onglets au plus ; au-delà, un select.

**React** : `<Tabs defaultValue="tous"><TabsList aria-label="Filtre"><TabsTrigger value="tous" count={22}>Tous</TabsTrigger>…</TabsList><TabsContent value="tous">…</TabsContent></Tabs>`. Flèches du clavier pour passer d’un onglet à l’autre.
