/**
 * Moteur de thème Zinc : trois graines (neutre, accent, mode) → tous les
 * tokens de la famille `color`. Port TypeScript de l'objet `AX` de la planche
 * Couleurs. Pur : ni DOM, ni dépendance UI.
 */
import type { ColorTokenName } from "../tokens/tokens.gen";
import { contrast, hexToRgb, oklchToHex, rgbToOklch, withAlpha } from "./color";

export type ThemeMode = "light" | "dark";

export const ACCENT_PRESETS = [
  { id: "jaune", name: "Jaune", light: "#f5c518", dark: "#facc15" },
  { id: "teal", name: "Teal", light: "#0f766e", dark: "#2dd4bf" },
  { id: "bleu", name: "Bleu", light: "#2563eb", dark: "#60a5fa" },
  { id: "violet", name: "Violet", light: "#6d28d9", dark: "#a78bfa" },
  { id: "vert", name: "Vert", light: "#15803d", dark: "#4ade80" },
  { id: "rose", name: "Rose", light: "#be185d", dark: "#f472b6" },
  { id: "graphite", name: "Graphite", light: "#27272a", dark: "#e4e4e7" },
] as const;

export type AccentPresetId = (typeof ACCENT_PRESETS)[number]["id"];

/** Température des neutres : teinte OKLCH et chroma de base (`h: null` = teinte de l'accent). */
export const NEUTRALS = [
  { id: "pur", name: "Pur", h: 0, c: 0 },
  { id: "ardoise", name: "Ardoise", h: 255, c: 0.006 },
  { id: "chaud", name: "Chaud", h: 70, c: 0.008 },
  { id: "teinte", name: "Teinté", h: null, c: 0.012 },
] as const;

export type NeutralId = (typeof NEUTRALS)[number]["id"];

/**
 * Les trois graines d'un thème. `accent` est soit un préréglage
 * (`{ preset: "jaune" }`), soit une couleur libre (`{ color: "#ff6600" }`),
 * utilisée telle quelle dans les deux modes.
 */
export interface ThemeSeed {
  neutral: NeutralId;
  accent: { preset: AccentPresetId } | { color: string };
  mode: ThemeMode;
}

export const DEFAULT_SEED: ThemeSeed = {
  neutral: "ardoise",
  accent: { preset: "jaune" },
  mode: "light",
};

export type ColorTokens = Record<ColorTokenName, string>;

type NeutralName =
  | "bg"
  | "surface"
  | "surface-subtle"
  | "surface-muted"
  | "surface-sunken"
  | "border"
  | "border-strong"
  | "border-control"
  | "text"
  | "text-muted"
  | "text-faint";

/** Pour chaque neutre : [clarté OKLCH, multiplicateur de chroma]. */
const NEUTRAL_STEPS: Record<ThemeMode, Record<NeutralName, readonly [number, number]>> = {
  light: {
    bg: [0.958, 1.2],
    surface: [1.0, 0],
    "surface-subtle": [0.985, 0.5],
    "surface-muted": [0.965, 1],
    "surface-sunken": [0.948, 1],
    border: [0.915, 1],
    "border-strong": [0.86, 1],
    "border-control": [0.635, 1],
    text: [0.235, 1.8],
    "text-muted": [0.475, 1.5],
    "text-faint": [0.535, 1.2],
  },
  dark: {
    bg: [0.155, 1.4],
    surface: [0.205, 1.4],
    "surface-subtle": [0.222, 1.4],
    "surface-muted": [0.24, 1.4],
    "surface-sunken": [0.15, 1.2],
    border: [0.29, 1.4],
    "border-strong": [0.355, 1.4],
    "border-control": [0.505, 1.2],
    text: [0.95, 0.5],
    "text-muted": [0.75, 1],
    "text-faint": [0.645, 1],
  },
};

/** Couleurs d'état : indépendantes de l'accent et du neutre. */
const STATES: Record<ThemeMode, Record<"danger" | "on-danger" | "success" | "warning" | "info", string>> = {
  light: { danger: "#dc2626", "on-danger": "#ffffff", success: "#15803d", warning: "#c2410c", info: "#2563eb" },
  dark: { danger: "#f87171", "on-danger": "#1f0707", success: "#4ade80", warning: "#fb923c", info: "#60a5fa" },
};

/** Seuils de contraste du système (WCAG 2.x AA). */
export const CONTRAST = { text: 4.5, ui: 3 } as const;

/** Les quatre plans sur lesquels le texte doit rester lisible. */
export const TEXT_GROUNDS = ["bg", "surface", "surface-subtle", "surface-muted"] as const;

export function isPresetId(id: string): id is AccentPresetId {
  return ACCENT_PRESETS.some((p) => p.id === id);
}

export function isNeutralId(id: string): id is NeutralId {
  return NEUTRALS.some((n) => n.id === id);
}

/** L'aplat d'accent choisi pour un mode. */
export function accentBase(seed: ThemeSeed): string {
  if ("preset" in seed.accent) {
    const id = seed.accent.preset;
    const preset = ACCENT_PRESETS.find((p) => p.id === id) ?? ACCENT_PRESETS[0];
    return preset[seed.mode];
  }
  return seed.accent.color;
}

function minContrast(color: string, grounds: readonly string[]): number {
  return Math.min(...grounds.map((g) => contrast(color, g)));
}

/** Construit tous les tokens `color` d'un thème à partir de ses graines. */
export function buildTheme(seed: ThemeSeed): ColorTokens {
  const mode: ThemeMode = seed.mode === "dark" ? "dark" : "light";
  const [L, C, H] = rgbToOklch(hexToRgb(accentBase({ ...seed, mode })));
  const neutral = NEUTRALS.find((n) => n.id === seed.neutral) ?? NEUTRALS[1];
  const nh = neutral.h ?? H;
  const nc = neutral.c;

  const steps = NEUTRAL_STEPS[mode];
  const n = {} as Record<NeutralName, string>;
  for (const key of Object.keys(steps) as NeutralName[]) {
    const [l, k] = steps[key];
    n[key] = oklchToHex(l, nc * k, nh);
  }

  // accent : l'aplat tel que choisi.
  const fill = oklchToHex(L, C, H);

  // accent-text : l'aplat foncé (clair) ou éclairci (sombre) jusqu'à ≥ 4,5:1
  // sur tous les plans où un lien ou une icône active peut se poser.
  const grounds = TEXT_GROUNDS.map((g) => n[g]);
  let textL = L;
  let text = fill;
  for (let guard = 0; minContrast(text, grounds) < CONTRAST.text && guard < 100; guard++) {
    textL += mode === "light" ? -0.01 : 0.01;
    text = oklchToHex(textL, C, H);
  }

  const hoverStep = L > 0.7 ? -0.06 : mode === "light" ? -0.07 : 0.07;
  const softAlpha = mode === "light" ? (L > 0.7 ? 0.2 : 0.1) : 0.15;

  // on-accent : blanc ou encre foncée teintée, selon le meilleur contraste.
  const white = "#ffffff";
  const ink = oklchToHex(0.2, Math.min(C, 0.05), H);
  const onAccent = contrast(white, fill) >= contrast(ink, fill) ? white : ink;

  // focus-ring : l'aplat s'il tient 3:1 sur les plans, sinon accent-text.
  const focus = minContrast(fill, grounds) >= CONTRAST.ui ? fill : text;

  return {
    ...n,
    accent: fill,
    "accent-hover": oklchToHex(L + hoverStep, C, H),
    "accent-soft": withAlpha(fill, softAlpha),
    "accent-text": text,
    "on-accent": onAccent,
    "focus-ring": focus,
    ...STATES[mode],
  };
}

/** Bloc CSS des variables d'un thème (à coller dans une feuille d'app). */
export function themeToCss(tokens: ColorTokens, selector = ":root"): string {
  const lines = Object.entries(tokens).map(([k, v]) => `  --${k}: ${v};`);
  return `${selector} {\n${lines.join("\n")}\n}\n`;
}
