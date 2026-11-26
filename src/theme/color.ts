/**
 * Outils de couleur du moteur de thème : sRGB ↔ OKLCH, contraste WCAG,
 * mélange. Aucune dépendance, aucune référence au DOM.
 */

export type Rgb = readonly [number, number, number];
export type Oklch = readonly [l: number, c: number, h: number];

/** `#rgb`, `#rrggbb` ou `#rrggbbaa` (l'alpha est ignoré) → composantes 0..1. */
export function hexToRgb(hex: string): Rgb {
  let h = hex.trim().replace("#", "");
  if (h.length === 3 || h.length === 4) {
    h = h
      .slice(0, 3)
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}/.test(h)) throw new Error(`Couleur hexadécimale invalide : ${hex}`);
  return [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16) / 255) as unknown as Rgb;
}

export function rgbToHex(rgb: Rgb): string {
  return `#${rgb
    .map((v) =>
      Math.round(Math.max(0, Math.min(1, v)) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** Composante sRGB encodée → linéaire. */
function lin(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Composante linéaire → sRGB encodée. */
function enc(c: number): number {
  const x = Math.max(0, Math.min(1, c));
  return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
}

export function rgbToOklch(rgb: Rgb): Oklch {
  const r = lin(rgb[0]);
  const g = lin(rgb[1]);
  const b = lin(rgb[2]);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.sqrt(A * A + B * B), ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360];
}

/** OKLCH → sRGB linéaire (peut sortir du gamut). */
function oklchToLinear(L: number, C: number, H: number): Rgb {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function inGamut(v: Rgb): boolean {
  return v.every((x) => x >= -0.0005 && x <= 1.0005);
}

/**
 * OKLCH → sRGB encodé. Hors gamut, la chroma est réduite par dichotomie
 * (la clarté et la teinte sont conservées).
 */
export function oklchToRgb(L: number, C: number, H: number): Rgb {
  const l = Math.max(0, Math.min(1, L));
  let v = oklchToLinear(l, C, H);
  if (!inGamut(v)) {
    let lo = 0;
    let hi = C;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToLinear(l, mid, H))) lo = mid;
      else hi = mid;
    }
    v = oklchToLinear(l, lo, H);
  }
  return v.map(enc) as unknown as Rgb;
}

export function oklchToHex(L: number, C: number, H: number): string {
  return rgbToHex(oklchToRgb(L, C, H));
}

/** Luminance relative WCAG 2.x. */
export function luminance(rgb: Rgb): number {
  return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
}

/** Rapport de contraste WCAG 2.x entre deux couleurs opaques (alpha ignoré). */
export function contrast(a: string, b: string): number {
  const la = luminance(hexToRgb(a));
  const lb = luminance(hexToRgb(b));
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/** Couleur `fg` posée avec l'opacité `alpha` sur le fond opaque `bg`. */
export function blend(fg: string, bg: string, alpha: number): string {
  const f = hexToRgb(fg);
  const b = hexToRgb(bg);
  return rgbToHex(f.map((v, i) => v * alpha + (b[i] ?? 0) * (1 - alpha)) as unknown as Rgb);
}

/** `#rrggbb` + alpha 0..1 → `#rrggbbaa`. */
export function withAlpha(hex: string, alpha: number): string {
  return `${hex.slice(0, 7)}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

/** Alpha d'une couleur `#rrggbbaa` (1 si absent). */
export function alphaOf(hex: string): number {
  const h = hex.replace("#", "");
  return h.length === 8 ? Number.parseInt(h.slice(6, 8), 16) / 255 : 1;
}
