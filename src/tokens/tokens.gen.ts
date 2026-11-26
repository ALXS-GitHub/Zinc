// Zinc — généré depuis tokens.json par scripts/build-tokens.ts. Ne pas modifier à la main.

export const THEMES = [
  "light",
  "dark"
] as const;
export type ThemeId = (typeof THEMES)[number];

/** Couleurs par thème. Une valeur `{nom}` est un alias d'un autre token couleur. */
export const color = {
  "bg": {
    "light": "#eef1f6",
    "dark": "#0a0c10"
  },
  "surface": {
    "light": "#ffffff",
    "dark": "#15171b"
  },
  "surface-subtle": {
    "light": "#f9fafc",
    "dark": "#181b1f"
  },
  "surface-muted": {
    "light": "#f1f4f7",
    "dark": "#1d2023"
  },
  "surface-sunken": {
    "light": "#ebeef2",
    "dark": "#090b0e"
  },
  "border": {
    "light": "#e0e3e7",
    "dark": "#292c30"
  },
  "border-strong": {
    "light": "#ced1d5",
    "dark": "#393c40"
  },
  "border-control": {
    "light": "#888b8e",
    "dark": "#696c70"
  },
  "text": {
    "light": "#1b1e23",
    "dark": "#edeef0"
  },
  "text-muted": {
    "light": "#595d61",
    "dark": "#abaeb2"
  },
  "text-faint": {
    "light": "#6a6d71",
    "dark": "#8b8e91"
  },
  "accent": {
    "light": "#f5c518",
    "dark": "#facc15"
  },
  "accent-hover": {
    "light": "#dfb200",
    "dark": "#e4b900"
  },
  "accent-soft": {
    "light": "#f5c51833",
    "dark": "#facc1526"
  },
  "accent-text": {
    "light": "#856900",
    "dark": "#facc15"
  },
  "on-accent": {
    "light": "#1e1500",
    "dark": "#1d1500"
  },
  "focus-ring": {
    "light": "{accent-text}",
    "dark": "{accent}"
  },
  "danger": {
    "light": "#dc2626",
    "dark": "#f87171"
  },
  "on-danger": {
    "light": "#ffffff",
    "dark": "#1f0707"
  },
  "success": {
    "light": "#15803d",
    "dark": "#4ade80"
  },
  "warning": {
    "light": "#c2410c",
    "dark": "#fb923c"
  },
  "info": {
    "light": "#2563eb",
    "dark": "#60a5fa"
  }
} as const;
export type ColorTokenName = keyof typeof color;
export const COLOR_TOKEN_NAMES = Object.keys(color) as ColorTokenName[];

export const shadow = {
  "shadow-sm": {
    "light": "0 1px 2px rgba(16, 24, 40, 0.06)",
    "dark": "0 1px 2px rgba(0, 0, 0, 0.4)"
  },
  "shadow-pop": {
    "light": "0 8px 24px -8px rgba(16, 24, 40, 0.18), 0 2px 6px -2px rgba(16, 24, 40, 0.08)",
    "dark": "0 12px 32px -8px rgba(0, 0, 0, 0.6), 0 2px 6px -2px rgba(0, 0, 0, 0.4)"
  }
} as const;
export type ShadowTokenName = keyof typeof shadow;

export const spacing = {
  "space-1": "4px",
  "space-2": "8px",
  "space-3": "12px",
  "space-4": "16px",
  "space-5": "20px",
  "space-6": "24px",
  "space-8": "32px"
} as const;
export type SpacingTokenName = keyof typeof spacing;

export const radius = {
  "radius-xs": "4px",
  "radius-sm": "6px",
  "radius-md": "8px",
  "radius-lg": "12px",
  "radius-full": "999px"
} as const;
export type RadiusTokenName = keyof typeof radius;

export const size = {
  "control-sm": "28px",
  "control-md": "32px",
  "control-lg": "36px",
  "icon-sm": "14px",
  "icon-md": "16px",
  "chip-height": "22px",
  "tag-height": "20px",
  "checkbox-size": "16px",
  "switch-width": "32px",
  "switch-height": "18px"
} as const;
export type SizeTokenName = keyof typeof size;

export const layout = {
  "sidebar-width": "232px",
  "shell-gap": "6px",
  "rail-width": "56px",
  "header-height": "48px",
  "content-max": "1120px",
  "list-pane-width": "360px"
} as const;
export type LayoutTokenName = keyof typeof layout;

export const fontFamilies = {
  "sans": "\"Hanken Grotesk Variable\", \"Hanken Grotesk\", \"Segoe UI\", ui-sans-serif, system-ui, sans-serif",
  "display": "\"Hanken Grotesk Variable\", \"Hanken Grotesk\", \"Segoe UI\", ui-sans-serif, system-ui, sans-serif",
  "mono": "\"JetBrains Mono Variable\", \"JetBrains Mono\", \"Cascadia Mono\", Consolas, ui-monospace, SFMono-Regular, Menlo, monospace",
  "sans-tempere": "\"Plus Jakarta Sans Variable\", \"Plus Jakarta Sans\", \"Segoe UI\", ui-sans-serif, system-ui, sans-serif",
  "display-tempere": "\"Outfit Variable\", Outfit, \"Segoe UI\", ui-sans-serif, system-ui, sans-serif"
} as const;
export type FontFamilyName = keyof typeof fontFamilies;

export const typeStyles = {
  "display": {
    "family": "display",
    "fontSize": "22px",
    "lineHeight": "28px",
    "fontWeight": 600,
    "letterSpacing": "-0.01em"
  },
  "title": {
    "family": "sans",
    "fontSize": "15px",
    "lineHeight": "20px",
    "fontWeight": 600,
    "letterSpacing": "0"
  },
  "body": {
    "family": "sans",
    "fontSize": "13.5px",
    "lineHeight": "20px",
    "fontWeight": 400,
    "letterSpacing": "0"
  },
  "label": {
    "family": "sans",
    "fontSize": "13px",
    "lineHeight": "18px",
    "fontWeight": 500,
    "letterSpacing": "0"
  },
  "caption": {
    "family": "sans",
    "fontSize": "12px",
    "lineHeight": "16px",
    "fontWeight": 400,
    "letterSpacing": "0"
  },
  "eyebrow": {
    "family": "sans",
    "fontSize": "11px",
    "lineHeight": "14px",
    "fontWeight": 600,
    "letterSpacing": "0.06em"
  },
  "code": {
    "family": "mono",
    "fontSize": "12.5px",
    "lineHeight": "18px",
    "fontWeight": 400,
    "letterSpacing": "0"
  }
} as const;
export type TypeStyleName = keyof typeof typeStyles;

/** Variantes de style et leurs surcharges de tokens. */
export const variants = {
  "net": {
    "name": "Net",
    "tokens": {
      "radius-lg": "10px"
    }
  },
  "tempere": {
    "name": "Tempéré",
    "tokens": {
      "radius-xs": "6px",
      "radius-sm": "8px",
      "radius-md": "12px",
      "radius-lg": "14px",
      "font-sans": "{sans-tempere}",
      "font-display": "{display-tempere}"
    }
  }
} as const;
export type VariantId = keyof typeof variants;

export type TokenName =
  | ColorTokenName
  | ShadowTokenName
  | SpacingTokenName
  | RadiusTokenName
  | SizeTokenName
  | LayoutTokenName;

/** Référence CSS d'un token : `cssVar("surface")` → `"var(--surface)"`. */
export function cssVar(name: TokenName | `font-${FontFamilyName}`): string {
  return `var(--${name})`;
}
