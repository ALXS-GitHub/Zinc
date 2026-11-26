/**
 * Aperçus de la vitrine, rendus en HTML statique depuis les vrais composants
 * (scripts/build-showcase.tsx). Chaque entrée devient
 * components/<nom>/preview.html dans l'artefact.
 */
import { Copy, FolderKanban, MoreHorizontal, Pencil, Play, Plus, Settings, Terminal, Ticket, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
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
  Field,
  Input,
  Kbd,
  NavItem,
  PageHeader,
  Panel,
  Search,
  Select,
  SelectTrigger,
  SelectValue,
  Shell,
  Sidebar,
  SidebarBrand,
  SidebarGroupLabel,
  Spacer,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  Tag,
} from "../src";

export interface Preview {
  group: string;
  height: number;
  width?: number;
  subtitle?: string;
  /** Fond de la planche : `panel` (surface) ou `shell` (bg). */
  on?: "panel" | "shell";
  element: ReactNode;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="zn-row">
      <span className="zn-label-sm">{label}</span>
      {children}
    </div>
  );
}

function ProjectCard({ name, path, status, label, tags }: { name: string; path: string; status: "progress" | "done" | "blocked" | "open"; label: string; tags: string[] }) {
  return (
    <Card interactive>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <Spacer />
        <Chip status={status}>{label}</Chip>
      </CardHeader>
      <CardMeta>{path}</CardMeta>
      <CardFooter>
        {tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
        <Spacer />
        <Button variant="ghost" size="sm" icon aria-label="Lancer">
          <Play />
        </Button>
        <Button variant="ghost" size="sm" icon aria-label="Plus d'actions">
          <MoreHorizontal />
        </Button>
      </CardFooter>
    </Card>
  );
}

function MiniApp({ variant, height = 340, compact = false }: { variant?: "net" | "tempere"; height?: number; compact?: boolean }) {
  return (
    <div data-variant={variant}>
      <Shell framed style={{ height, gridTemplateColumns: compact ? "150px minmax(0, 1fr)" : undefined }}>
        <Sidebar aria-label="Navigation de l'exemple">
          <SidebarBrand>Zorg</SidebarBrand>
          <SidebarGroupLabel>Espace</SidebarGroupLabel>
          <NavItem href="#" icon={<FolderKanban />} active count={22}>
            Projets
          </NavItem>
          <NavItem href="#" icon={<Ticket />} count={8}>
            Tickets
          </NavItem>
          <NavItem href="#" icon={<Terminal />}>
            Scripts
          </NavItem>
          <NavItem href="#" icon={<Settings />}>
            Réglages
          </NavItem>
        </Sidebar>
        <Panel>
          <PageHeader
            title="Projets"
            actions={
              <>
                {compact ? null : <Button>Importer</Button>}
                <Button variant="primary" size={compact ? "sm" : "md"}>
                  <Plus /> Nouveau
                </Button>
              </>
            }
          />
          <Tabs defaultValue="tous">
            <TabsList aria-label="Filtre">
              <TabsTrigger value="tous" count={22}>
                Tous
              </TabsTrigger>
              <TabsTrigger value="actifs" count={9}>
                Actifs
              </TabsTrigger>
              {compact ? null : <TabsTrigger value="archives">Archivés</TabsTrigger>}
            </TabsList>
          </Tabs>
          <div style={{ display: "grid", gridTemplateColumns: compact ? "minmax(0, 1fr)" : "repeat(auto-fill, minmax(220px, 1fr))", gap: "var(--space-3)" }}>
            <ProjectCard name="Zorg" path="~/dev/zorg" status="progress" label="En cours" tags={["web", "supabase"]} />
            {compact ? null : <ProjectCard name="CortX" path="~/dev/cortx" status="done" label="En ligne" tags={["tauri", "rust"]} />}
          </div>
        </Panel>
      </Shell>
    </div>
  );
}

export const previews: Record<string, Preview> = {
  Shell: {
    group: "Coquille",
    height: 470,
    width: 1000,
    on: "shell",
    subtitle: "La signature du style : navigation posée sur le fond, contenu dans un panneau surélevé.",
    element: (
<MiniApp height={420} />
    ),
  },

  Button: {
    group: "Composants",
    height: 200,
    subtitle: "Primary, secondary, ghost, danger ; trois tailles ; icône seule.",
    element: (
      <>
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
          <Button variant="ghost" size="sm" icon aria-label="Plus d'actions">
            <MoreHorizontal />
          </Button>
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
      </>
    ),
  },

  Field: {
    group: "Composants",
    height: 260,
    subtitle: "Champ, liste déroulante, recherche (pilule), aide et erreur.",
    element: (
      <>
        <Search placeholder="Rechercher un projet…" hotkey="k" />
        <div className="zn-row" style={{ alignItems: "flex-start" }}>
          <Field label="Nom du projet" help="Visible dans la navigation." style={{ width: 220 }}>
            <Input placeholder="Mon projet" />
          </Field>
          <Field label="Dossier" style={{ width: 220 }}>
            <Input defaultValue="~/dev/zorg" className="is-focus" />
          </Field>
          <Field label="Statut" style={{ width: 220 }}>
            <Select defaultValue="progress">
              <SelectTrigger>
                <SelectValue>En cours</SelectValue>
              </SelectTrigger>
            </Select>
          </Field>
        </div>
        <Field label="Port" error="Le port doit être compris entre 1 et 65535." style={{ width: 220 }}>
          <Input defaultValue="80800" />
        </Field>
      </>
    ),
  },

  Tabs: {
    group: "Composants",
    height: 140,
    subtitle: "Onglets segmentés : changer de vue sur les mêmes données.",
    element: (
      <>
        <Tabs defaultValue="tous">
          <TabsList aria-label="Filtre">
            <TabsTrigger value="tous" count={22}>
              Tous
            </TabsTrigger>
            <TabsTrigger value="actifs" count={9}>
              Actifs
            </TabsTrigger>
            <TabsTrigger value="archives">Archivés</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="kanban">
          <TabsList aria-label="Vue">
            <TabsTrigger value="liste">Liste</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
          </TabsList>
        </Tabs>
      </>
    ),
  },

  Card: {
    group: "Composants",
    height: 280,
    subtitle: "Carte d'objet, chips de statut (pilule avec point), tags.",
    element: (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 340px))", gap: "var(--space-4)" }}>
          <ProjectCard name="Zorg" path="~/dev/zorg" status="progress" label="En cours" tags={["web", "supabase"]} />
          <Card>
            <CardHeader>
              <CardTitle>PayLedger</CardTitle>
              <Spacer />
              <Chip status="blocked">Bloqué</Chip>
            </CardHeader>
            <CardMeta>~/dev/payledger</CardMeta>
            <CardDescription>Fiches de paye et suivi des démarches.</CardDescription>
          </Card>
        </div>
        <Row label="Statuts">
          <Chip status="open">Ouvert</Chip>
          <Chip status="progress">En cours</Chip>
          <Chip status="done">Terminé</Chip>
          <Chip status="blocked">Bloqué</Chip>
          <Chip>Brouillon</Chip>
          <Tag>web</Tag>
          <Kbd>Ctrl K</Kbd>
        </Row>
      </>
    ),
  },

  Switch: {
    group: "Composants",
    height: 120,
    subtitle: "Interrupteur (effet immédiat) et case à cocher, avec libellé.",
    element: (
      <>
        <Row label="Interrupteur">
          <Switch label="Notifications" defaultChecked />
          <Switch label="Synchroniser" />
          <Switch label="Désactivé" disabled />
        </Row>
        <Row label="Case">
          <Checkbox label="Archiver après fusion" defaultChecked />
          <Checkbox label="Mode compact" />
          <Checkbox label="Sélection partielle" checked="indeterminate" />
        </Row>
      </>
    ),
  },

  Menu: {
    group: "Composants",
    height: 260,
    subtitle: "Menu d'actions : surface flottante, raccourcis, action destructrice en dernier.",
    element: (
      <>
        <Button>
          <Settings /> Options
        </Button>
        {/* Rendu figé d'un menu ouvert (dans l'app, Radix le place sous son déclencheur). */}
        <div className="zn-menu" role="menu" aria-label="Options" style={{ width: 240 }}>
          <div className="zn-menu-label">Projet</div>
          <div className="zn-menu-item" role="menuitem">
            <Pencil /> Renommer
          </div>
          <div className="zn-menu-item" role="menuitem" data-highlighted="">
            <Copy /> Dupliquer <span className="zn-menu-shortcut">Ctrl D</span>
          </div>
          <div className="zn-menu-separator" role="separator" />
          <div className="zn-menu-item is-danger" role="menuitem">
            <Trash2 /> Supprimer
          </div>
        </div>
      </>
    ),
  },

  Variantes: {
    group: "Styles",
    height: 440,
    width: 1500,
    subtitle: "Les mêmes composants, le même thème : seul data-variant change.",
    element: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "var(--space-4)", width: "100%" }}>
        {(
          [
            [undefined, "Panneau (défaut)"],
            ["net", "Net · data-variant=\"net\""],
            ["tempere", "Tempéré · data-variant=\"tempere\""],
          ] as const
        ).map(([v, label]) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <span className="zn-label-sm" style={{ width: "auto" }}>
              {label}
            </span>
            <MiniApp variant={v} height={380} compact />
          </div>
        ))}
      </div>
    ),
  },
};
