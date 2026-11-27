/**
 * Test visuel : captures de la démo dans les deux modes et les trois styles,
 * plus des états interactifs (menu et liste ouverts, focus clavier), avec le
 * Chrome ou l'Edge installé (puppeteer-core, aucun navigateur téléchargé).
 *
 *   bun run build:demo && bun run shots
 *
 * Variable CHROME pour un autre navigateur. Chaque capture part d'un profil
 * vierge : le mode et le style viennent de l'URL. Sortie : .showcase/shots/.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import puppeteer, { type Page } from "puppeteer-core";
import { preview } from "vite";

const out = join(import.meta.dir, "../.showcase/shots");
const executablePath =
  process.env.CHROME ??
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].find((p) => Bun.file(p).size > 0);

if (!executablePath) {
  console.error("Aucun navigateur trouvé : définir CHROME.");
  process.exit(1);
}

type Step = (page: Page) => Promise<void>;
interface Shot {
  name: string;
  query: string;
  height?: number;
  step?: Step;
  /** Vérification dans la page : renvoie la liste des écarts (vide = ok). */
  check?: (page: Page) => Promise<string[]>;
}

/**
 * Mesures attendues des composants shadcn (repérés par data-slot) : celles de
 * Zinc. Chaque règle : sélecteur shadcn, mesure, référence — un token
 * (`control-md`) ou, quand la valeur dépend de la variante, le composant Zinc
 * équivalent posé dans la même page (`.zn-tabs-list`).
 */
const BUTTON = ':is([data-slot="button"], [data-slot$="-trigger"][data-variant][data-size]:not([data-slot="select-trigger"]))';
const SHADCN_METRICS: [selector: string, prop: "height" | "width" | "borderRadius", ref: string][] = [
  [`${BUTTON}[data-size="default"]`, "height", "control-md"],
  [`${BUTTON}[data-size="sm"]`, "height", "control-sm"],
  [`${BUTTON}[data-size="lg"]`, "height", "control-lg"],
  [`${BUTTON}[data-size="icon"]`, "width", "control-md"],
  [BUTTON, "borderRadius", ".zn-btn"],
  ['[data-slot="dropdown-menu-trigger"][data-size="default"]', "height", "control-md"],
  ['[data-slot="input"]', "height", "control-md"],
  ['[data-slot="input"]', "borderRadius", ".zn-input"],
  ['[data-slot="select-trigger"]', "height", "control-md"],
  ['[data-slot="tabs-list"]', "height", ".zn-tabs-list"],
  ['[data-slot="tabs-list"]', "borderRadius", ".zn-tabs-list"],
  ['[data-slot="checkbox"]', "height", "checkbox-size"],
  ['[data-slot="switch"]', "width", "switch-width"],
  ['[data-slot="switch"]', "height", "switch-height"],
  ['[data-slot="badge"]', "height", "tag-height"],
  ['[data-slot="card"]', "borderRadius", ".zn-card"],
];

async function checkShadcnMetrics(page: Page): Promise<string[]> {
  return page.evaluate((rules) => {
    const root = getComputedStyle(document.documentElement);
    const measure = (el: HTMLElement, prop: string) => {
      const r = el.getBoundingClientRect();
      return prop === "borderRadius" ? Number.parseFloat(getComputedStyle(el).borderTopLeftRadius) : prop === "height" ? r.height : r.width;
    };
    const out: string[] = [];
    for (const [sel, prop, ref] of rules) {
      const zinc = ref.startsWith(".") ? document.querySelector<HTMLElement>(ref) : null;
      if (ref.startsWith(".") && !zinc) out.push(`${ref} : référence Zinc absente`);
      const want = zinc ? measure(zinc, prop) : Number.parseFloat(root.getPropertyValue(`--${ref}`));
      const els = [...document.querySelectorAll<HTMLElement>(sel)];
      if (!els.length) out.push(`${sel} : aucun élément`);
      for (const el of els) {
        const got = measure(el, prop);
        if (Math.abs(got - want) > 0.5) out.push(`${sel} ${prop} = ${got}px, attendu ${ref} = ${want}px`);
      }
    }
    return out;
  }, SHADCN_METRICS);
}

const shots: Shot[] = [];
for (const mode of ["light", "dark"]) {
  for (const variant of ["panneau", "net", "tempere"]) {
    shots.push({ name: `apercu-${variant}-${mode}`, query: `view=apercu&mode=${mode}&variant=${variant}`, height: 860 });
  }
  for (const view of ["composants", "variantes", "theme"]) {
    shots.push({ name: `${view}-${mode}`, query: `view=${view}&mode=${mode}` });
  }
  for (const variant of ["panneau", "net", "tempere"]) {
    shots.push({
      name: `shadcn-${variant}-${mode}`,
      query: `view=shadcn&mode=${mode}&variant=${variant}`,
      height: 1100,
      check: checkShadcnMetrics,
    });
  }
  shots.push({
    name: `shadcn-menu-${mode}`,
    query: `view=shadcn&mode=${mode}`,
    height: 1100,
    step: async (p) => {
      for (const b of await p.$$("button")) {
        if ((await b.evaluate((e) => e.textContent))?.trim() === "Menu shadcn") {
          await b.focus();
          await p.keyboard.press("Enter");
        }
      }
      await p.waitForSelector('[data-slot="dropdown-menu-content"]');
    },
  });
  shots.push({
    name: `menu-${mode}`,
    query: `view=composants&mode=${mode}`,
    step: async (p) => {
      for (const b of await p.$$("button")) {
        if ((await b.evaluate((e) => e.textContent))?.trim() === "Options") {
          await b.focus();
          await p.keyboard.press("Enter");
        }
      }
      await p.waitForSelector('[role="menu"]');
    },
  });
  shots.push({
    name: `select-${mode}`,
    query: `view=composants&mode=${mode}`,
    height: 700,
    step: async (p) => {
      for (const box of await p.$$('[role="combobox"]')) {
        if ((await box.evaluate((e) => e.textContent))?.includes("En cours")) await box.click();
      }
      await p.waitForSelector('[role="listbox"]');
    },
  });
  shots.push({
    name: `focus-${mode}`,
    query: `view=apercu&mode=${mode}`,
    height: 400,
    step: async (p) => {
      for (let i = 0; i < 9; i++) await p.keyboard.press("Tab");
    },
  });
}

const server = await preview({ configFile: join(import.meta.dir, "../demo/vite.config.ts"), preview: { port: 4174, strictPort: false } });
const base = server.resolvedUrls?.local[0] ?? "http://localhost:4174/";
const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--hide-scrollbars"] });
mkdirSync(out, { recursive: true });

let failed = 0;
for (const s of shots) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  try {
    await page.setViewport({ width: 1440, height: s.height ?? 1500 });
    await page.goto(`${base}?${s.query}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    if (s.step) await s.step(page);
    await new Promise((r) => setTimeout(r, 150));
    await page.screenshot({ path: join(out, `${s.name}.png`) as `${string}.png` });
    if (s.check) errors.push(...(await s.check(page)));
    if (errors.length) throw new Error(errors.join("\n"));
    console.log(`ok    ${s.name}`);
  } catch (e) {
    failed++;
    console.log(`ÉCHEC ${s.name} : ${e instanceof Error ? e.message : e}`);
  } finally {
    await context.close();
  }
}

await browser.close();
await new Promise<void>((r) => server.httpServer.close(() => r()));
process.exit(failed ? 1 : 0);
