/**
 * Construit la vitrine (artefact Design System) depuis le dépôt, dans
 * .showcase/project/ — les chemins sont ceux de l'artefact sous project/.
 *
 *   bun run build:showcase
 *
 * Tout vient du dépôt : guide (docs/), tokens.json, tokens.css généré, styles
 * des composants (bundle.css), aperçus rendus depuis les composants React,
 * moteur de thème compilé dans la planche Couleurs. L'index
 * (design-system.json) est écrit au moment de la synchro, à partir de
 * l'index publié (il porte des clés que seule la vitrine connaît).
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { previews } from "../showcase/previews";

const ROOT = join(import.meta.dir, "..");
const OUT = join(ROOT, ".showcase/project");
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");
function write(path: string, text: string) {
  const full = join(OUT, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, text);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const sha = Bun.spawnSync(["git", "rev-parse", "--short", "HEAD"], { cwd: ROOT }).stdout.toString().trim() || "local";
const dirty = Bun.spawnSync(["git", "status", "--porcelain"], { cwd: ROOT }).stdout.toString().trim() !== "";
const ref = `main@${sha}${dirty ? "+modifs" : ""}`;

// --- Guide ---------------------------------------------------------------------
write("README.md", read("docs/guide.md"));
write("utilisation.md", read("docs/utilisation.md"));

// --- Tokens --------------------------------------------------------------------
const tokens = JSON.parse(read("tokens.json"));
tokens.meta = {
  source: "design-sync",
  repo: "ALXS-GitHub/Zinc",
  ref,
  paths: { tokens: ["tokens.json"], docs: ["docs/"], components: ["src/components/", "src/styles/"] },
  synced: new Date().toISOString().slice(0, 10),
};
write("tokens.json", `${JSON.stringify(tokens, null, 2)}\n`);

const tokensCss = read("src/styles/tokens.css").split("\n").slice(1).join("\n");
write("tokens.css", `/* Zinc — generated from tokens.json */\n${tokensCss}`);

// --- Styles des composants ------------------------------------------------------
const FONTS =
  "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400..700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400..700&family=Outfit:wght@400..700&display=swap";
const bundleCss = [
  `@import url("${FONTS}");`,
  "/* Zinc — styles des composants, assemblés depuis src/styles/ (base, components, variants)",
  `   et showcase/preview.css par scripts/build-showcase.tsx, ${ref}. Ne pas modifier ici. */`,
  read("src/styles/base.css"),
  read("src/styles/components.css"),
  read("src/styles/variants.css"),
  read("showcase/preview.css"),
].join("\n");
if (/<\/style/i.test(bundleCss)) throw new Error("bundle.css contient </style");
write("components/bundle.css", bundleCss);

// --- Aperçus rendus depuis les composants React ------------------------------------
function page(name: string, marker: string, body: string): string {
  return `${marker}
<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><title>${name}</title></head>
<body>
${body}
</body>
</html>
`;
}

function markerFor(p: { group: string; height: number; width?: number; subtitle?: string }): string {
  const attrs = [`group="${p.group}"`, `height=${p.height}`];
  if (p.width) attrs.push(`width=${p.width}`);
  if (p.subtitle) attrs.push(`subtitle="${p.subtitle.replace(/"/g, "&quot;")}"`);
  return `<!-- @dsCard ${attrs.join(" ")} -->`;
}

for (const [name, p] of Object.entries(previews)) {
  const html = renderToStaticMarkup(p.element);
  write(
    `components/${name}/preview.html`,
    page(name, markerFor(p), `<div class="zn-stage" data-on="${p.on ?? "panel"}">${html}</div>`),
  );
}

// --- Planche Couleurs : le moteur du dépôt, compilé -----------------------------------
const entry = join(ROOT, ".showcase/theme-entry.ts");
writeFileSync(entry, `import * as Z from "../src/theme";\n(window as unknown as { ZincTheme: typeof Z }).ZincTheme = Z;\n`);
const built = await Bun.build({ entrypoints: [entry], format: "iife", minify: true, target: "browser" });
rmSync(entry);
if (!built.success || !built.outputs[0]) throw new Error(`Compilation du moteur : ${built.logs.join("\n")}`);
const engine = await built.outputs[0].text();
if (/<\/script|<!--/i.test(engine)) throw new Error("Le moteur compilé contient </script ou <!--");
write("components/Couleurs/preview.html", read("showcase/couleurs.html").replace("/*__ENGINE__*/", engine.trim()));

// --- Couverture et planches figées ------------------------------------------------
write("components/Cover/preview.html", read("showcase/cover.html"));
for (const f of readdirSync(join(ROOT, "showcase/planches"))) {
  write(`components/${basename(f, ".html")}/preview.html`, read(`showcase/planches/${f}`));
}

// --- Fiches (README des cartes) ---------------------------------------------------
for (const dir of ["docs/composants", "docs/planches"]) {
  for (const f of readdirSync(join(ROOT, dir))) write(`components/${basename(f, ".md")}/README.md`, read(`${dir}/${f}`));
}

// --- Vérifications ------------------------------------------------------------------
const cards = readdirSync(join(OUT, "components"), { withFileTypes: true }).filter((d) => d.isDirectory());
const problems: string[] = [];
for (const d of cards) {
  const dir = join(OUT, "components", d.name);
  if (!existsSync(join(dir, "preview.html"))) problems.push(`${d.name} : pas d'aperçu`);
  if (d.name !== "Cover" && !existsSync(join(dir, "README.md"))) problems.push(`${d.name} : pas de fiche`);
  if (existsSync(join(dir, "preview.html"))) {
    const first = readFileSync(join(dir, "preview.html"), "utf8").split("\n")[0] ?? "";
    if (!first.startsWith("<!-- @dsCard")) problems.push(`${d.name} : ligne 1 sans marqueur @dsCard`);
  }
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(`Vitrine construite (${ref}) : ${cards.length} cartes dans .showcase/project/`);
