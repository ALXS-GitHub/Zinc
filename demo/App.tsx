import {
  Component,
  Copy,
  FolderKanban,
  Layers,
  Moon,
  MoreHorizontal,
  Palette,
  Pencil,
  Play,
  Plus,
  Settings,
  Sun,
  Terminal,
  Ticket,
  Trash2,
} from "lucide-react";
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMeta,
  CardTitle,
  Checkbox,
  Chip,
  type ChipStatus,
  Field,
  Input,
  Kbd,
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
  NavItem,
  PageHeader,
  Panel,
  Search,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Shell,
  Sidebar,
  SidebarBrand,
  SidebarFooter,
  SidebarGroupLabel,
  Spacer,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  Tag,
  TEXT_GROUNDS,
  ThemeSettings,
  type ThemeSeed,
  Textarea,
  alphaOf,
  applyTheme,
  blend,
  buildTheme,
  contrast,
  themeToCss,
  useZincTheme,
} from "@zinc/ui";
import {
  ShBadge,
  ShButton,
  ShCard,
  ShCardContent,
  ShCardDescription,
  ShCardHeader,
  ShCardTitle,
  ShCheckbox,
  ShDropdownMenu,
  ShDropdownMenuContent,
  ShDropdownMenuItem,
  ShDropdownMenuShortcut,
  ShDropdownMenuTrigger,
  ShInput,
  ShLabel,
  ShSelect,
  ShSelectContent,
  ShSelectItem,
  ShSelectTrigger,
  ShSelectValue,
  ShSwitch,
  ShTabs,
  ShTabsList,
  ShTabsTrigger,
  ShTextarea,
} from "./shadcn/ui";

type Variant = "panneau" | "net" | "tempere";
type View = "apercu" | "composants" | "variantes" | "theme" | "shadcn";

const VIEWS: { id: View; label: string; icon: ReactNode }[] = [
  { id: "apercu", label: "Aperçu", icon: <FolderKanban /> },
  { id: "composants", label: "Composants", icon: <Component /> },
  { id: "variantes", label: "Variantes", icon: <Layers /> },
  { id: "theme", label: "Thème", icon: <Palette /> },
  { id: "shadcn", label: "shadcn", icon: <Terminal /> },
];

const VARIANTS: { id: Variant; label: string }[] = [
  { id: "panneau", label: "Panneau" },
  { id: "net", label: "Net" },
  { id: "tempere", label: "Tempéré" },
];

const query = new URLSearchParams(location.search);
/** ?mode=dark : mode de départ quand aucun réglage n’est enregistré (captures). */
const modeParam = query.get("mode");
const forcedMode = modeParam === "dark" || modeParam === "light" ? modeParam : null;

function initialView(): View {
  const v = query.get("view");
  return VIEWS.some((x) => x.id === v) ? (v as View) : "apercu";
}

function initialVariant(): Variant {
  const v = document.documentElement.getAttribute("data-variant");
  return v === "net" || v === "tempere" ? v : "panneau";
}

export function App() {
  const { seed, setSeed } = useZincTheme({ defaults: forcedMode ? { mode: forcedMode } : {} });
  const [view, setView] = useState<View>(initialView);
  const [variant, setVariant] = useState<Variant>(initialVariant);

  useEffect(() => {
    const root = document.documentElement;
    if (variant === "panneau") root.removeAttribute("data-variant");
    else root.setAttribute("data-variant", variant);
  }, [variant]);

  return (
    <Shell>
      <Sidebar>
        <SidebarBrand>Zinc</SidebarBrand>
        <SidebarGroupLabel>Démo</SidebarGroupLabel>
        {VIEWS.map((v) => (
          <NavItem
            key={v.id}
            href={`#${v.id}`}
            icon={v.icon}
            active={view === v.id}
            onClick={(e) => {
              e.preventDefault();
              setView(v.id);
            }}
          >
            {v.label}
          </NavItem>
        ))}
        <SidebarFooter>
          <SidebarGroupLabel>Style</SidebarGroupLabel>
          <Select value={variant} onValueChange={(v) => setVariant(v as Variant)}>
            <SelectTrigger aria-label="Style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VARIANTS.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <NavItem
            href="#mode"
            icon={seed.mode === "dark" ? <Sun /> : <Moon />}
            onClick={(e) => {
              e.preventDefault();
              setSeed({ ...seed, mode: seed.mode === "dark" ? "light" : "dark" });
            }}
          >
            {seed.mode === "dark" ? "Mode clair" : "Mode sombre"}
          </NavItem>
        </SidebarFooter>
      </Sidebar>
      <Panel>
        {view === "apercu" && <Overview />}
        {view === "composants" && <Components />}
        {view === "variantes" && <Variants seed={seed} />}
        {view === "theme" && <ThemeView seed={seed} setSeed={setSeed} />}
        {view === "shadcn" && <ShadcnView />}
      </Panel>
    </Shell>
  );
}

/* ---- Aperçu : une page type dans la coquille --------------------------- */

const PROJECTS: { name: string; path: string; desc: string; status: ChipStatus; label: string; tags: string[] }[] = [
  { name: "Zorg", path: "~/dev/zorg", desc: "Tickets et kanbans pour tous les projets.", status: "progress", label: "En cours", tags: ["web", "supabase"] },
  { name: "CortX", path: "~/dev/cortx", desc: "Terminal et agents de développement.", status: "done", label: "En ligne", tags: ["tauri", "rust"] },
  { name: "PayLedger", path: "~/dev/payledger", desc: "Fiches de paye et suivi des démarches.", status: "blocked", label: "Bloqué", tags: ["local", "sqlite"] },
  { name: "Souvenirs", path: "~/dev/souvenirs", desc: "Albums photo hors ligne.", status: "open", label: "Ouvert", tags: ["web"] },
];

function ProjectCard({ p }: { p: (typeof PROJECTS)[number] }) {
  return (
    <Card interactive tabIndex={0}>
      <CardHeader>
        <CardTitle>{p.name}</CardTitle>
        <Spacer />
        <Chip status={p.status}>{p.label}</Chip>
      </CardHeader>
      <CardMeta>{p.path}</CardMeta>
      <CardDescription>{p.desc}</CardDescription>
      <CardFooter>
        {p.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
        <Spacer />
        <Button variant="ghost" size="sm" icon aria-label="Lancer">
          <Play />
        </Button>
        <RowMenu />
      </CardFooter>
    </Card>
  );
}

function RowMenu() {
  return (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="ghost" size="sm" icon aria-label="Plus d'actions">
          <MoreHorizontal />
        </Button>
      </MenuTrigger>
      <MenuContent align="end">
        <MenuItem icon={<Pencil />}>Renommer</MenuItem>
        <MenuItem icon={<Copy />} shortcut="Ctrl D">
          Dupliquer
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Trash2 />} danger>
          Supprimer
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}

function Overview() {
  return (
    <>
      <PageHeader
        title="Projets"
        actions={
          <>
            <Button>Importer</Button>
            <Button variant="primary">
              <Plus /> Nouveau projet
            </Button>
          </>
        }
      />
      <Search placeholder="Rechercher un projet…" hotkey="k" />
      <Tabs defaultValue="tous">
        <TabsList aria-label="Filtrer les projets">
          <TabsTrigger value="tous" count={22}>
            Tous
          </TabsTrigger>
          <TabsTrigger value="actifs" count={9}>
            Actifs
          </TabsTrigger>
          <TabsTrigger value="archives">Archivés</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="demo-grid">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.name} p={p} />
        ))}
      </div>
      <div className="demo-terminal">
        <b>$</b> bun run build
      </div>
    </>
  );
}

/* ---- Composants -------------------------------------------------------- */

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="demo-row">
      <span className="demo-label">{label}</span>
      {children}
    </div>
  );
}

function Components() {
  const [notif, setNotif] = useState(true);
  const [sync, setSync] = useState(false);
  const [check, setCheck] = useState<boolean | "indeterminate">(true);
  const [compact, setCompact] = useState(false);
  return (
    <>
      <PageHeader title="Composants" />
      <section className="demo-section">
        <h2 className="zn-section-title">Boutons</h2>
        <Row label="Variantes">
          <Button variant="primary">
            <Plus /> Nouveau projet
          </Button>
          <Button>Importer</Button>
          <Button variant="ghost">Annuler</Button>
          <Button variant="danger">
            <Trash2 /> Supprimer
          </Button>
        </Row>
        <Row label="Tailles">
          <Button variant="primary" size="sm">
            Lancer tout
          </Button>
          <Button size="sm">Arrêter</Button>
          <Button variant="ghost" size="sm" icon aria-label="Lancer">
            <Play />
          </Button>
          <Button variant="primary">Créer</Button>
          <Button variant="primary" size="lg">
            Créer le compte
          </Button>
        </Row>
        <Row label="Désactivé">
          <Button variant="primary" disabled>
            Créer
          </Button>
          <Button disabled>Importer</Button>
        </Row>
      </section>

      <section className="demo-section">
        <h2 className="zn-section-title">Champs</h2>
        <Search placeholder="Aller à… (vue, projet)" hotkey="k" />
        <div className="demo-grid">
          <Field label="Nom du projet" help="Visible dans la navigation.">
            <Input placeholder="Mon projet" />
          </Field>
          <Field label="Dossier">
            <Input defaultValue="~/dev/zorg" />
          </Field>
          <Field label="Statut">
            <Select defaultValue="progress">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Ouvert</SelectItem>
                <SelectItem value="progress">En cours</SelectItem>
                <SelectItem value="done">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Port" error="Le port doit être compris entre 1 et 65535.">
            <Input defaultValue="80800" />
          </Field>
          <Field label="Notes">
            <Textarea placeholder="Contexte, liens…" />
          </Field>
        </div>
      </section>

      <section className="demo-section">
        <h2 className="zn-section-title">Onglets</h2>
        <Tabs defaultValue="kanban">
          <TabsList aria-label="Vue">
            <TabsTrigger value="liste">Liste</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      <section className="demo-section">
        <h2 className="zn-section-title">Cartes, chips et tags</h2>
        <div className="demo-grid">
          <ProjectCard p={PROJECTS[0] as (typeof PROJECTS)[number]} />
          <Card>
            <CardHeader>
              <CardTitle>Carte statique</CardTitle>
            </CardHeader>
            <CardDescription>Fond surface-subtle, contour border, sans ombre.</CardDescription>
          </Card>
        </div>
        <Row label="Statuts">
          <Chip status="open">Ouvert</Chip>
          <Chip status="progress">En cours</Chip>
          <Chip status="done">Terminé</Chip>
          <Chip status="blocked">Bloqué</Chip>
          <Chip>Brouillon</Chip>
        </Row>
        <Row label="Tags">
          <Tag>web</Tag>
          <Tag>supabase</Tag>
          <Tag>rust</Tag>
          <Kbd>Ctrl K</Kbd>
        </Row>
      </section>

      <section className="demo-section">
        <h2 className="zn-section-title">Interrupteurs et cases</h2>
        <Row label="Interrupteur">
          <Switch label="Notifications" checked={notif} onCheckedChange={setNotif} />
          <Switch label="Synchroniser" checked={sync} onCheckedChange={setSync} />
          <Switch label="Désactivé" disabled />
        </Row>
        <Row label="Case">
          <Checkbox label="Archiver après fusion" checked={check} onCheckedChange={setCheck} />
          <Checkbox label="Mode compact" checked={compact} onCheckedChange={(v) => setCompact(v === true)} />
          <Checkbox label="Sélection partielle" checked="indeterminate" />
          <Checkbox label="Désactivée" disabled />
        </Row>
      </section>

      <section className="demo-section">
        <h2 className="zn-section-title">Menu</h2>
        <Row label="Menu">
          <Menu>
            <MenuTrigger asChild>
              <Button>
                <Settings /> Options
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuLabel>Projet</MenuLabel>
              <MenuItem icon={<Pencil />}>Renommer</MenuItem>
              <MenuItem icon={<Copy />} shortcut="Ctrl D">
                Dupliquer
              </MenuItem>
              <MenuCheckboxItem checked>Afficher les archivés</MenuCheckboxItem>
              <MenuSeparator />
              <MenuItem icon={<Trash2 />} danger>
                Supprimer
              </MenuItem>
            </MenuContent>
          </Menu>
        </Row>
      </section>
    </>
  );
}

/* ---- Variantes et modes côte à côte ------------------------------------ */

/** Zone dont le thème est calculé par le moteur (pour montrer clair et sombre ensemble). */
function ThemeZone({ seed, children }: { seed: ThemeSeed; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (ref.current) applyTheme(seed, ref.current);
  }, [seed]);
  return (
    <div ref={ref} style={{ background: "var(--bg)", color: "var(--text)", borderRadius: "var(--radius-lg)" }}>
      {children}
    </div>
  );
}

function MiniApp({ variant }: { variant: Variant }) {
  return (
    <div data-variant={variant === "panneau" ? undefined : variant}>
      <Shell framed>
        <Sidebar aria-label="Navigation de l'exemple">
          <SidebarBrand>Zorg</SidebarBrand>
          <NavItem href="#" icon={<FolderKanban />} active count={22} onClick={(e) => e.preventDefault()}>
            Projets
          </NavItem>
          <NavItem href="#" icon={<Ticket />} count={8} onClick={(e) => e.preventDefault()}>
            Tickets
          </NavItem>
          <NavItem href="#" icon={<Settings />} onClick={(e) => e.preventDefault()}>
            Réglages
          </NavItem>
        </Sidebar>
        <Panel>
          <PageHeader title="Projets" actions={<Button variant="primary" size="sm">Nouveau</Button>} />
          <Tabs defaultValue="tous">
            <TabsList aria-label="Filtre">
              <TabsTrigger value="tous">Tous</TabsTrigger>
              <TabsTrigger value="actifs">Actifs</TabsTrigger>
            </TabsList>
          </Tabs>
          <Card>
            <CardHeader>
              <CardTitle>Zorg</CardTitle>
              <Spacer />
              <Chip status="progress">En cours</Chip>
            </CardHeader>
            <CardMeta>~/dev/zorg</CardMeta>
            <CardFooter>
              <Tag>web</Tag>
              <Spacer />
              <Button size="sm">Ouvrir</Button>
            </CardFooter>
          </Card>
        </Panel>
      </Shell>
    </div>
  );
}

function Variants({ seed }: { seed: ThemeSeed }) {
  return (
    <>
      <PageHeader title="Variantes" />
      <p className="zn-card-desc">
        Même thème de couleur, seule la couche Style change. Chaque ligne est calculée par le moteur pour son mode.
      </p>
      {(["light", "dark"] as const).map((mode) => (
        <section key={mode} className="demo-section">
          <h2 className="zn-section-title">{mode === "light" ? "Clair" : "Sombre"}</h2>
          <ThemeZone seed={{ ...seed, mode }}>
            <div className="demo-trio" style={{ padding: "var(--space-3)" }}>
              {VARIANTS.map((v) => (
                <div key={v.id}>
                  <p className="demo-caption">{v.label}</p>
                  <MiniApp variant={v.id} />
                </div>
              ))}
            </div>
          </ThemeZone>
        </section>
      ))}
    </>
  );
}

/* ---- Thème : réglage et contrastes ------------------------------------- */

const CHECKS: { name: string; on: readonly string[]; min: number }[] = [
  { name: "text", on: TEXT_GROUNDS, min: 4.5 },
  { name: "text-muted", on: TEXT_GROUNDS, min: 4.5 },
  { name: "text-faint", on: TEXT_GROUNDS, min: 4.5 },
  { name: "accent-text", on: TEXT_GROUNDS, min: 4.5 },
  { name: "border-control", on: TEXT_GROUNDS, min: 3 },
  { name: "focus-ring", on: TEXT_GROUNDS, min: 3 },
  { name: "on-accent", on: ["accent"], min: 4.5 },
];

function ThemeView({ seed, setSeed }: { seed: ThemeSeed; setSeed: (s: ThemeSeed) => void }) {
  const t = buildTheme(seed);
  const [showCss, setShowCss] = useState(false);
  const fmt = (x: number) => x.toFixed(1).replace(".", ",");
  return (
    <>
      <PageHeader title="Thème" />
      <Card>
        <ThemeSettings value={seed} onChange={setSeed} />
      </Card>
      <section className="demo-section">
        <h2 className="zn-section-title">Contrastes du thème courant</h2>
        <div className="demo-swatches">
          {Object.entries(t).map(([name, value]) => {
            const check = CHECKS.find((c) => c.name === name);
            const tt = t as Record<string, string>;
            const worst = check ? Math.min(...check.on.map((g) => contrast(value, tt[g] ?? "#000"))) : null;
            const isSoft = name === "accent-soft";
            return (
              <div key={name} className="demo-swatch">
                <div
                  className="demo-swatch-color"
                  style={name === "on-accent" ? { background: t.accent, color: value } : { background: value }}
                >
                  {name === "on-accent" ? "Aa" : null}
                </div>
                <div className="demo-swatch-meta">
                  <code>{name}</code>
                  <span className="zn-card-meta">{value}</span>
                  {worst != null && check ? (
                    <span className={worst < check.min ? "bad" : undefined}>
                      {fmt(worst)}:1 au pire {worst < check.min ? `— sous ${fmt(check.min)}` : ""}
                    </span>
                  ) : isSoft ? (
                    <span>text dessus : {fmt(contrast(t.text, blend(t.accent, t.surface, alphaOf(value))))}:1</span>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <Button onClick={() => setShowCss(!showCss)}>{showCss ? "Masquer le CSS" : "Voir le CSS du thème"}</Button>
        </div>
        {showCss ? (
          <pre className="demo-terminal" style={{ margin: 0, overflow: "auto", color: "var(--text)" }}>
            {themeToCss(t, seed.mode === "dark" ? '[data-theme="dark"]' : ":root")}
          </pre>
        ) : null}
      </section>
    </>
  );
}

/* ---- shadcn : composants non retouchés, stylés par la couche ----------- */

function ShadcnView() {
  return (
    <>
      <PageHeader title="shadcn" />
      <p className="zn-card-desc">
        Composants shadcn/ui v4 recopiés sans retouche (classes h-9, rounded-md, ring-[3px]…). La couche{" "}
        <code>@zinc/ui/shadcn.css</code> leur impose les mesures Zinc par leurs attributs <code>data-slot</code> : chaque
        ligne pose le composant Zinc puis son équivalent shadcn, à la même hauteur.
      </p>
      <section className="demo-section" data-testid="shadcn-compare">
        <Row label="Bouton">
          <Button variant="primary">Créer</Button>
          <ShButton>Créer</ShButton>
          <Button>Importer</Button>
          <ShButton variant="outline">Importer</ShButton>
          <ShButton variant="secondary">Secondaire</ShButton>
          <ShButton variant="ghost">Fantôme</ShButton>
          <ShButton variant="destructive">Supprimer</ShButton>
          <ShButton variant="link">Lien</ShButton>
        </Row>
        <Row label="Tailles">
          <Button variant="primary" size="sm">
            Petit
          </Button>
          <ShButton size="sm">Petit</ShButton>
          <Button variant="primary" size="lg">
            Grand
          </Button>
          <ShButton size="lg">Grand</ShButton>
          <Button icon aria-label="Lancer">
            <Play />
          </Button>
          <ShButton variant="outline" size="icon" aria-label="Lancer">
            <Play />
          </ShButton>
        </Row>
        <Row label="Champ">
          <div style={{ width: 220 }}>
            <Input placeholder="Zinc" aria-label="Champ Zinc" />
          </div>
          <div style={{ width: 220 }}>
            <ShInput placeholder="shadcn" aria-label="Champ shadcn" />
          </div>
          <div style={{ width: 220 }}>
            <ShInput defaultValue="80800" aria-invalid aria-label="Champ invalide" />
          </div>
        </Row>
        <Row label="Liste">
          <div style={{ width: 220 }}>
            <Select defaultValue="progress">
              <SelectTrigger aria-label="Statut Zinc">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="progress">En cours</SelectItem>
                <SelectItem value="done">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ShSelect defaultValue="progress">
            <ShSelectTrigger aria-label="Statut shadcn" style={{ width: 220 }}>
              <ShSelectValue />
            </ShSelectTrigger>
            <ShSelectContent>
              <ShSelectItem value="progress">En cours</ShSelectItem>
              <ShSelectItem value="done">Terminé</ShSelectItem>
            </ShSelectContent>
          </ShSelect>
        </Row>
        <Row label="Onglets">
          <Tabs defaultValue="tous">
            <TabsList aria-label="Onglets Zinc">
              <TabsTrigger value="tous">Tous</TabsTrigger>
              <TabsTrigger value="actifs">Actifs</TabsTrigger>
            </TabsList>
          </Tabs>
          <ShTabs defaultValue="tous">
            <ShTabsList aria-label="Onglets shadcn">
              <ShTabsTrigger value="tous">Tous</ShTabsTrigger>
              <ShTabsTrigger value="actifs">Actifs</ShTabsTrigger>
            </ShTabsList>
          </ShTabs>
        </Row>
        <Row label="Cases">
          <Checkbox defaultChecked aria-label="Case Zinc" />
          <ShCheckbox defaultChecked aria-label="Case shadcn" />
          <Switch defaultChecked aria-label="Interrupteur Zinc" />
          <ShSwitch defaultChecked aria-label="Interrupteur shadcn" />
          <ShSwitch aria-label="Interrupteur shadcn éteint" />
          <ShLabel htmlFor="sh-cb">
            <ShCheckbox id="sh-cb" /> Libellé shadcn
          </ShLabel>
        </Row>
        <Row label="Badge, menu">
          <Tag>web</Tag>
          <ShBadge variant="secondary">web</ShBadge>
          <ShBadge>Nouveau</ShBadge>
          <ShBadge variant="outline">v0.1</ShBadge>
          <ShDropdownMenu>
            <ShDropdownMenuTrigger asChild>
              <ShButton variant="outline">Menu shadcn</ShButton>
            </ShDropdownMenuTrigger>
            <ShDropdownMenuContent>
              <ShDropdownMenuItem>
                Dupliquer <ShDropdownMenuShortcut>Ctrl D</ShDropdownMenuShortcut>
              </ShDropdownMenuItem>
              <ShDropdownMenuItem>Réglages</ShDropdownMenuItem>
              <ShDropdownMenuItem variant="destructive">Supprimer</ShDropdownMenuItem>
            </ShDropdownMenuContent>
          </ShDropdownMenu>
        </Row>
      </section>
      <div className="demo-grid">
        <Card>
          <CardHeader>
            <CardTitle>Carte Zinc</CardTitle>
          </CardHeader>
          <CardDescription>surface-subtle, radius-md, padding space-4.</CardDescription>
        </Card>
        <ShCard>
          <ShCardHeader>
            <ShCardTitle>Carte shadcn</ShCardTitle>
            <ShCardDescription>Même fond, mêmes coins, même retrait.</ShCardDescription>
          </ShCardHeader>
          <ShCardContent>
            <ShTextarea placeholder="Notes" aria-label="Notes" />
          </ShCardContent>
        </ShCard>
      </div>
    </>
  );
}
