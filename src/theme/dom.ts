/**
 * Application du thème sur le document et persistance du réglage utilisateur.
 * Seul module du moteur qui touche au DOM ; aucun framework requis.
 */
import { ACCENT_PRESETS, type ColorTokens, DEFAULT_SEED, type ThemeSeed, buildTheme, isNeutralId, isPresetId } from "./engine";

export const STORAGE_KEY = "zinc:theme";

/** Valide un objet venu du stockage ; renvoie `null` s'il n'est pas un réglage complet. */
export function parseSeed(value: unknown): ThemeSeed | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const mode = v.mode === "dark" ? "dark" : v.mode === "light" ? "light" : null;
  const neutral = typeof v.neutral === "string" && isNeutralId(v.neutral) ? v.neutral : null;
  const a = v.accent as Record<string, unknown> | undefined;
  let accent: ThemeSeed["accent"] | null = null;
  if (a && typeof a.preset === "string" && isPresetId(a.preset)) accent = { preset: a.preset };
  else if (a && typeof a.color === "string" && /^#[0-9a-fA-F]{6}$/.test(a.color)) accent = { color: a.color.toLowerCase() };
  if (!mode || !neutral || !accent) return null;
  return { mode, neutral, accent };
}

/** Lit le réglage enregistré (ou `null`). Ne lève jamais d'erreur. */
export function loadSeed(key = STORAGE_KEY): ThemeSeed | null {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    return raw ? parseSeed(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

/** Enregistre le réglage. Silencieux si le stockage est indisponible. */
export function saveSeed(seed: ThemeSeed, key = STORAGE_KEY): void {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(seed));
  } catch {
    /* stockage bloqué : le thème reste appliqué pour la session */
  }
}

export function clearSeed(key = STORAGE_KEY): void {
  try {
    globalThis.localStorage?.removeItem(key);
  } catch {
    /* rien */
  }
}

/** Mode préféré du système (clair si inconnu). */
export function systemMode(): ThemeSeed["mode"] {
  try {
    return globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

/**
 * Écrit les tokens sur un élément (`:root` par défaut) et règle le mode :
 * `data-theme`, la classe `.dark` (attendue par shadcn / Tailwind) et
 * `color-scheme`.
 */
export function applyTheme(seed: ThemeSeed, el: HTMLElement = document.documentElement): ColorTokens {
  const tokens = buildTheme(seed);
  for (const [k, v] of Object.entries(tokens)) el.style.setProperty(`--${k}`, v);
  el.setAttribute("data-theme", seed.mode);
  el.classList.toggle("dark", seed.mode === "dark");
  el.style.colorScheme = seed.mode;
  return tokens;
}

/** Retire les variables posées par `applyTheme` (retour aux valeurs de tokens.css). */
export function resetTheme(el: HTMLElement = document.documentElement): void {
  for (const k of Object.keys(buildTheme(DEFAULT_SEED))) el.style.removeProperty(`--${k}`);
  el.style.removeProperty("color-scheme");
}

export interface InitThemeOptions {
  /** Graines par défaut de l'app (son profil). Zinc tel quel si absent. */
  defaults?: Partial<ThemeSeed>;
  /** Clé de stockage, pour séparer plusieurs apps sur une même origine. */
  storageKey?: string;
  /** Sans réglage enregistré, suivre le mode du système. Vrai par défaut. */
  followSystem?: boolean;
}

/**
 * Résout le thème initial (réglage enregistré > défauts de l'app > Zinc),
 * l'applique sur `:root` et le renvoie.
 */
export function initTheme(options: InitThemeOptions = {}): ThemeSeed {
  const { defaults = {}, storageKey = STORAGE_KEY, followSystem = true } = options;
  const saved = loadSeed(storageKey);
  const seed: ThemeSeed = saved ?? {
    ...DEFAULT_SEED,
    ...(followSystem ? { mode: systemMode() } : {}),
    ...defaults,
  };
  applyTheme(seed);
  return seed;
}

/** Applique et enregistre un nouveau réglage (à appeler depuis les réglages de l'app). */
export function setTheme(seed: ThemeSeed, storageKey = STORAGE_KEY): ColorTokens {
  saveSeed(seed, storageKey);
  return applyTheme(seed);
}

/**
 * Script à placer dans `<head>` avant les styles, pour poser le mode avant
 * le premier rendu (évite le flash clair → sombre). Les couleurs fines sont
 * ensuite appliquées par `initTheme()`.
 */
export function themeBootScript(storageKey = STORAGE_KEY): string {
  return `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(storageKey)})||"null");var m=s&&s.mode||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var r=document.documentElement;r.setAttribute("data-theme",m);if(m==="dark")r.classList.add("dark");}catch(e){}})();`;
}

/** Préréglage par identifiant (pratique pour un sélecteur dans les réglages). */
export function presetById(id: string) {
  return ACCENT_PRESETS.find((p) => p.id === id);
}
