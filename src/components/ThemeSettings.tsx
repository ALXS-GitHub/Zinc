import { ToggleGroup } from "radix-ui";
import { type CSSProperties, useCallback, useState } from "react";
import { type InitThemeOptions, STORAGE_KEY, initTheme, setTheme } from "../theme/dom";
import {
  ACCENT_PRESETS,
  type AccentPresetId,
  NEUTRALS,
  type NeutralId,
  type ThemeMode,
  type ThemeSeed,
  accentBase,
  isNeutralId,
} from "../theme/engine";
import { cx } from "./cx";

/**
 * Thème courant, appliqué sur `:root` et enregistré localement.
 * À appeler une fois, en haut de l'app.
 */
export function useZincTheme(options: InitThemeOptions = {}) {
  const storageKey = options.storageKey ?? STORAGE_KEY;
  const [seed, setSeedState] = useState<ThemeSeed>(() => initTheme(options));
  const setSeed = useCallback(
    (next: ThemeSeed) => {
      setTheme(next, storageKey);
      setSeedState(next);
    },
    [storageKey],
  );
  return { seed, setSeed } as const;
}

export interface ThemeSettingsLabels {
  accent: string;
  neutral: string;
  mode: string;
  custom: string;
  light: string;
  dark: string;
  presets: Partial<Record<AccentPresetId, string>>;
  neutrals: Partial<Record<NeutralId, string>>;
}

const LABELS_FR: ThemeSettingsLabels = {
  accent: "Accent",
  neutral: "Neutre",
  mode: "Mode",
  custom: "Couleur libre",
  light: "Clair",
  dark: "Sombre",
  presets: {},
  neutrals: {},
};

export interface ThemeSettingsProps {
  value: ThemeSeed;
  onChange: (seed: ThemeSeed) => void;
  /** Libellés (français par défaut). Une app en anglais les fournit tous. */
  labels?: Partial<ThemeSettingsLabels>;
  className?: string;
}

/** Réglage du thème par l'utilisateur : accent, neutre, mode. Construit avec les composants Zinc. */
export function ThemeSettings({ value, onChange, labels: custom, className }: ThemeSettingsProps) {
  const labels = { ...LABELS_FR, ...custom };
  const presetId = "preset" in value.accent ? value.accent.preset : null;
  const customColor = "color" in value.accent ? value.accent.color : accentBase({ ...value, mode: "light" });

  return (
    <div className={cx("zn-theme-settings", className)}>
      <div className="zn-theme-row">
        <span className="zn-field-label" id="zn-theme-accent">
          {labels.accent}
        </span>
        <div className="zn-swatches" role="radiogroup" aria-labelledby="zn-theme-accent">
          {ACCENT_PRESETS.map((p) => {
            const name = labels.presets[p.id] ?? p.name;
            const checked = presetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={checked}
                aria-label={name}
                title={name}
                className="zn-swatch"
                style={{ "--zn-swatch": p[value.mode] } as CSSProperties}
                onClick={() => onChange({ ...value, accent: { preset: p.id } })}
              />
            );
          })}
          <label className="zn-swatch-custom" aria-checked={presetId === null} title={labels.custom}>
            <input
              type="color"
              aria-label={labels.custom}
              value={customColor}
              onChange={(e) => onChange({ ...value, accent: { color: e.target.value } })}
            />
            <span>{labels.custom}</span>
          </label>
        </div>
      </div>

      <div className="zn-theme-row">
        <span className="zn-field-label" id="zn-theme-neutral">
          {labels.neutral}
        </span>
        <ToggleGroup.Root
          type="single"
          className="zn-tabs-list"
          aria-labelledby="zn-theme-neutral"
          value={value.neutral}
          onValueChange={(v) => {
            if (v && isNeutralId(v)) onChange({ ...value, neutral: v });
          }}
        >
          {NEUTRALS.map((n) => (
            <ToggleGroup.Item key={n.id} value={n.id} className="zn-tab">
              {labels.neutrals[n.id] ?? n.name}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </div>

      <div className="zn-theme-row">
        <span className="zn-field-label" id="zn-theme-mode">
          {labels.mode}
        </span>
        <ToggleGroup.Root
          type="single"
          className="zn-tabs-list"
          aria-labelledby="zn-theme-mode"
          value={value.mode}
          onValueChange={(v) => {
            if (v === "light" || v === "dark") onChange({ ...value, mode: v as ThemeMode });
          }}
        >
          <ToggleGroup.Item value="light" className="zn-tab">
            {labels.light}
          </ToggleGroup.Item>
          <ToggleGroup.Item value="dark" className="zn-tab">
            {labels.dark}
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
    </div>
  );
}
