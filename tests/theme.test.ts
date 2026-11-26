import { describe, expect, test } from "bun:test";
import { alphaOf, blend, contrast } from "../src/theme/color";
import {
  ACCENT_PRESETS,
  CONTRAST,
  type ColorTokens,
  NEUTRALS,
  TEXT_GROUNDS,
  type ThemeMode,
  type ThemeSeed,
  buildTheme,
} from "../src/theme/engine";
import { COLOR_TOKEN_NAMES, color } from "../src/tokens/tokens.gen";

const MODES: ThemeMode[] = ["light", "dark"];

/** Toutes les combinaisons préréglage × neutre × mode. */
const presetSeeds: ThemeSeed[] = ACCENT_PRESETS.flatMap((p) =>
  NEUTRALS.flatMap((n) => MODES.map((mode) => ({ neutral: n.id, accent: { preset: p.id }, mode }))),
);

/** Un balayage de couleurs libres (teintes × clartés), pour les accents choisis à la main. */
const freeColors = [
  "#ff0000", "#ff7a00", "#ffe600", "#b4ff00", "#00ff66", "#00e5ff", "#0066ff", "#7a00ff", "#ff00cc",
  "#7f1d1d", "#14532d", "#1e3a8a", "#581c87", "#000000", "#ffffff", "#808080", "#fde68a", "#a7f3d0",
];
const freeSeeds: ThemeSeed[] = freeColors.flatMap((c) =>
  NEUTRALS.flatMap((n) => MODES.map((mode) => ({ neutral: n.id, accent: { color: c }, mode }))),
);

function label(s: ThemeSeed): string {
  const a = "preset" in s.accent ? s.accent.preset : s.accent.color;
  return `${a} · ${s.neutral} · ${s.mode}`;
}

/** Liste des paires sous leur seuil, pour un message d'échec lisible. */
function failures(t: ColorTokens): string[] {
  const out: string[] = [];
  const check = (fg: keyof ColorTokens, grounds: readonly (keyof ColorTokens)[], min: number) => {
    for (const g of grounds) {
      const r = contrast(t[fg], t[g]);
      if (r < min) out.push(`${fg} sur ${g} : ${r.toFixed(2)} < ${min}`);
    }
  };
  check("text", TEXT_GROUNDS, CONTRAST.text);
  check("text-muted", TEXT_GROUNDS, CONTRAST.text);
  check("text-faint", TEXT_GROUNDS, CONTRAST.text);
  check("accent-text", TEXT_GROUNDS, CONTRAST.text);
  check("border-control", TEXT_GROUNDS, CONTRAST.ui);
  check("focus-ring", TEXT_GROUNDS, CONTRAST.ui);
  check("on-accent", ["accent"], CONTRAST.text);
  check("on-danger", ["danger"], CONTRAST.text);
  // Texte posé sur un élément sélectionné (accent-soft composé sur surface).
  const soft = blend(t.accent, t.surface, alphaOf(t["accent-soft"]));
  const r = contrast(t.text, soft);
  if (r < CONTRAST.text) out.push(`text sur accent-soft : ${r.toFixed(2)} < ${CONTRAST.text}`);
  return out;
}

describe("moteur de thème", () => {
  test("produit exactement les noms de la famille color de tokens.json", () => {
    const t = buildTheme({ neutral: "ardoise", accent: { preset: "jaune" }, mode: "light" });
    expect(Object.keys(t).sort()).toEqual([...COLOR_TOKEN_NAMES].sort());
  });

  test("les graines par défaut redonnent les valeurs de tokens.json", () => {
    for (const mode of MODES) {
      const t = buildTheme({ neutral: "ardoise", accent: { preset: "jaune" }, mode });
      for (const name of COLOR_TOKEN_NAMES) {
        const ref: string = color[name][mode];
        const alias = /^\{(.+)\}$/.exec(ref)?.[1] as keyof ColorTokens | undefined;
        expect({ name, mode, value: t[name] }).toEqual({ name, mode, value: alias ? t[alias] : ref });
      }
    }
  });

  test("accent garde l'aplat tel que choisi", () => {
    for (const p of ACCENT_PRESETS) {
      for (const mode of MODES) {
        expect(buildTheme({ neutral: "pur", accent: { preset: p.id }, mode }).accent).toBe(p[mode]);
      }
    }
    expect(buildTheme({ neutral: "pur", accent: { color: "#ff6600" }, mode: "dark" }).accent).toBe("#ff6600");
  });

  test("focus-ring = l'aplat s'il tient 3:1, sinon accent-text", () => {
    for (const seed of presetSeeds) {
      const t = buildTheme(seed);
      const fillOk = TEXT_GROUNDS.every((g) => contrast(t.accent, t[g]) >= CONTRAST.ui);
      expect(t["focus-ring"]).toBe(fillOk ? t.accent : t["accent-text"]);
    }
  });

  test.each(presetSeeds.map((s) => [label(s), s] as const))("contrastes — préréglage %s", (_, seed) => {
    expect(failures(buildTheme(seed))).toEqual([]);
  });

  test.each(freeSeeds.map((s) => [label(s), s] as const))("contrastes — couleur libre %s", (_, seed) => {
    expect(failures(buildTheme(seed))).toEqual([]);
  });
});
