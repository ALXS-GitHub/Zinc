/**
 * tokens.json → src/styles/tokens.css + src/tokens/tokens.gen.ts
 *
 *   bun scripts/build-tokens.ts           écrit les fichiers
 *   bun scripts/build-tokens.ts --check   échoue s'ils ne sont pas à jour
 *
 * tokens.json est la seule source des valeurs : rien n'est recopié à la main.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const CSS_OUT = join(ROOT, "src/styles/tokens.css");
const TS_OUT = join(ROOT, "src/tokens/tokens.gen.ts");

type Themed = string | Record<string, string>;
interface Token {
  name: string;
  value: Themed;
  usage?: string;
}
interface Family {
  note?: string;
  tokens: Token[];
}
interface TypeStyle {
  name: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: number | string;
  letterSpacing?: string;
  family?: string;
  sample?: string;
  usage?: string;
}
interface Tokens {
  name: string;
  version: number;
  color: Family & { themes: { id: string; name: string }[] };
  type: {
    fonts: unknown[];
    families: Record<string, string>;
    groups: { name: string; family: string; styles: TypeStyle[] }[];
  };
  [family: string]: unknown;
}

const tokens = JSON.parse(readFileSync(join(ROOT, "tokens.json"), "utf8")) as Tokens;
const themes = tokens.color.themes.map((t) => t.id);
const firstTheme = themes[0] ?? "light";

/** Familles « plates » (une valeur par token, sans thème). */
const FLAT_FAMILIES = ["spacing", "radius", "size", "layout"] as const;
/** Familles par thème (comme les couleurs). */
const THEMED_FAMILIES = ["shadow"] as const;

function family(key: string): Family {
  const f = tokens[key] as Family | undefined;
  if (!f || !Array.isArray(f.tokens)) throw new Error(`Famille manquante ou mal formée : ${key}`);
  return f;
}

function valueFor(v: Themed, theme: string): string {
  if (typeof v === "string") return v;
  return v[theme] ?? v[firstTheme] ?? "";
}

/** `{accent-text}` → `var(--accent-text)`. */
function cssValue(v: string): string {
  const alias = /^\{([A-Za-z0-9_.-]+)\}$/.exec(v);
  return alias ? `var(--${alias[1]})` : v;
}

// --- Vérifications -----------------------------------------------------------
const seen = new Set<string>();
for (const key of ["color", ...THEMED_FAMILIES, ...FLAT_FAMILIES]) {
  for (const t of family(key).tokens) {
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(t.name)) throw new Error(`Nom de token invalide : ${t.name}`);
    if (seen.has(t.name)) throw new Error(`Token en double : ${t.name}`);
    seen.add(t.name);
  }
}
const colorNames = new Set(family("color").tokens.map((t) => t.name));
for (const t of family("color").tokens) {
  for (const th of themes) {
    const v = valueFor(t.value, th);
    const alias = /^\{(.+)\}$/.exec(v);
    if (alias && !colorNames.has(alias[1] ?? "")) throw new Error(`Alias inconnu dans ${t.name} : ${v}`);
    if (!alias && !/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) {
      throw new Error(`Couleur non hexadécimale dans ${t.name} (${th}) : ${v}`);
    }
  }
}

// --- CSS ---------------------------------------------------------------------
const HEADER = "/* Zinc — généré depuis tokens.json par scripts/build-tokens.ts. Ne pas modifier à la main. */";

function themedBlock(theme: string): string[] {
  const out: string[] = [];
  for (const t of family("color").tokens) out.push(`  --${t.name}: ${cssValue(valueFor(t.value, theme))};`);
  for (const key of THEMED_FAMILIES) {
    for (const t of family(key).tokens) out.push(`  --${t.name}: ${valueFor(t.value, theme)};`);
  }
  return out;
}

const css: string[] = [HEADER, ""];
css.push("/* Couche Couleur : thème par défaut (neutre ardoise, accent jaune). Le moteur de thème réécrit ces variables sur :root. */");
css.push(`:root,\n[data-theme="${firstTheme}"] {`, `  color-scheme: ${firstTheme === "dark" ? "dark" : "light"};`, ...themedBlock(firstTheme), "}", "");
for (const th of themes.slice(1)) {
  const sel = th === "dark" ? `[data-theme="dark"],\n.dark` : `[data-theme="${th}"]`;
  css.push(`${sel} {`, `  color-scheme: ${th === "dark" ? "dark" : "light"};`, ...themedBlock(th), "}", "");
}

css.push("/* Couche Style et Disposition : espacements, coins, hauteurs, mesures, polices, échelle typographique. */", ":root {");
for (const key of FLAT_FAMILIES) {
  for (const t of family(key).tokens) css.push(`  --${t.name}: ${valueFor(t.value, firstTheme)};`);
}
for (const [k, stack] of Object.entries(tokens.type.families)) css.push(`  --font-${k}: ${stack};`);
for (const g of tokens.type.groups) {
  for (const s of g.styles) {
    const fam = s.family ?? g.family;
    css.push(`  --type-${s.name}-family: var(--font-${fam});`);
    css.push(`  --type-${s.name}-size: ${s.fontSize};`);
    css.push(`  --type-${s.name}-line: ${s.lineHeight};`);
    css.push(`  --type-${s.name}-weight: ${s.fontWeight};`);
    css.push(`  --type-${s.name}-tracking: ${s.letterSpacing ?? "0"};`);
  }
}
css.push("}", "");
const cssText = `${css.join("\n")}`;

// --- TypeScript --------------------------------------------------------------
function literal(v: unknown): string {
  return JSON.stringify(v, null, 2);
}

function flat(key: string): Record<string, string> {
  return Object.fromEntries(family(key).tokens.map((t) => [t.name, valueFor(t.value, firstTheme)]));
}

function themed(key: string): Record<string, Record<string, string>> {
  return Object.fromEntries(
    family(key).tokens.map((t) => [t.name, Object.fromEntries(themes.map((th) => [th, valueFor(t.value, th)]))]),
  );
}

const typeStyles = Object.fromEntries(
  tokens.type.groups.flatMap((g) =>
    g.styles.map((s) => [
      s.name,
      {
        family: s.family ?? g.family,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        fontWeight: s.fontWeight,
        letterSpacing: s.letterSpacing ?? "0",
      },
    ]),
  ),
);

const ts = `// Zinc — généré depuis tokens.json par scripts/build-tokens.ts. Ne pas modifier à la main.

export const THEMES = ${literal(themes)} as const;
export type ThemeId = (typeof THEMES)[number];

/** Couleurs par thème. Une valeur \`{nom}\` est un alias d'un autre token couleur. */
export const color = ${literal(themed("color"))} as const;
export type ColorTokenName = keyof typeof color;
export const COLOR_TOKEN_NAMES = Object.keys(color) as ColorTokenName[];

export const shadow = ${literal(themed("shadow"))} as const;
export type ShadowTokenName = keyof typeof shadow;

export const spacing = ${literal(flat("spacing"))} as const;
export type SpacingTokenName = keyof typeof spacing;

export const radius = ${literal(flat("radius"))} as const;
export type RadiusTokenName = keyof typeof radius;

export const size = ${literal(flat("size"))} as const;
export type SizeTokenName = keyof typeof size;

export const layout = ${literal(flat("layout"))} as const;
export type LayoutTokenName = keyof typeof layout;

export const fontFamilies = ${literal(tokens.type.families)} as const;
export type FontFamilyName = keyof typeof fontFamilies;

export const typeStyles = ${literal(typeStyles)} as const;
export type TypeStyleName = keyof typeof typeStyles;

export type TokenName =
  | ColorTokenName
  | ShadowTokenName
  | SpacingTokenName
  | RadiusTokenName
  | SizeTokenName
  | LayoutTokenName;

/** Référence CSS d'un token : \`cssVar("surface")\` → \`"var(--surface)"\`. */
export function cssVar(name: TokenName | \`font-\${FontFamilyName}\`): string {
  return \`var(--\${name})\`;
}
`;

// --- Écriture ou vérification -------------------------------------------------
const outputs: [string, string][] = [
  [CSS_OUT, cssText],
  [TS_OUT, ts],
];

if (process.argv.includes("--check")) {
  const stale = outputs.filter(([p, text]) => !existsSync(p) || readFileSync(p, "utf8") !== text);
  if (stale.length) {
    console.error(`Fichiers générés périmés : ${stale.map(([p]) => p.replace(ROOT, ".")).join(", ")}\nLancer : bun run tokens`);
    process.exit(1);
  }
  console.log("Tokens générés à jour.");
} else {
  for (const [p, text] of outputs) {
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, text);
    console.log(`écrit ${p.replace(ROOT, ".")}`);
  }
}
