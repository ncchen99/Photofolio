/**
 * Color extraction & atmosphere utilities.
 *
 * The goal: extract dominant colors from images, then
 * compress them into ultra-subtle "atmosphere" tints
 * that blend seamlessly with the warm paper background.
 *
 * Pipeline: raw color → desaturate → brighten → mix with paper base
 */

// The paper background color in RGB
const PAPER = { r: 241, g: 232, b: 212 }; // #f1e8d4

export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };

/* ── Conversion helpers ──────────────────────────────── */

export function rgbToHsl({ r, g, b }: RGB): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h, s, l };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

/* ── Color processing: the "atmosphere" pipeline ───── */

/**
 * Compress a raw color into an atmosphere tint:
 * 1. Desaturate (cap saturation at maxSat)
 * 2. Brighten (push lightness toward target)
 * 3. Mix with paper base color
 */
export function toAtmosphereTint(
  color: RGB,
  opts?: {
    maxSaturation?: number;   // 0–1, default 0.28 — balanced saturation
    targetLightness?: number; // 0–1, default 0.86 — the sweet spot between dark and washed out
    paperMix?: number;        // 0–1 how much paper to blend in, default 0.50
  },
): RGB {
  const maxSat = opts?.maxSaturation ?? 0.28;
  const targetL = opts?.targetLightness ?? 0.86;
  const paperMix = opts?.paperMix ?? 0.50;

  const hsl = rgbToHsl(color);

  // 1. Desaturate — keeps color hint but keeps it organic
  hsl.s = Math.min(hsl.s, maxSat);

  // 2. Moderately push lightness up (0.72 factor provides a gentle lift)
  hsl.l = hsl.l + (targetL - hsl.l) * 0.72;

  const tinted = hslToRgb(hsl);

  // 3. Mix with paper — 50% paper mix brings perfect blending to the beige background
  return {
    r: Math.round(tinted.r * (1 - paperMix) + PAPER.r * paperMix),
    g: Math.round(tinted.g * (1 - paperMix) + PAPER.g * paperMix),
    b: Math.round(tinted.b * (1 - paperMix) + PAPER.b * paperMix),
  };
}

/**
 * Average multiple RGB colors.
 */
export function averageColors(colors: RGB[]): RGB {
  if (colors.length === 0) return { ...PAPER };
  const sum = colors.reduce(
    (acc, c) => ({ r: acc.r + c.r, g: acc.g + c.g, b: acc.b + c.b }),
    { r: 0, g: 0, b: 0 },
  );
  return {
    r: Math.round(sum.r / colors.length),
    g: Math.round(sum.g / colors.length),
    b: Math.round(sum.b / colors.length),
  };
}

export function rgbString(c: RGB, alpha = 1): string {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
}

/**
 * Extract the dominant color from an image by sampling
 * on a tiny canvas. Returns a promise that resolves to the
 * average color of the image (downscaled to 4×4).
 */
export function extractDominantColor(src: string): Promise<RGB> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 4; // sample at 4x4
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve({ ...PAPER });
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      resolve({
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count),
      });
    };
    img.onerror = () => resolve({ ...PAPER });
    img.src = src;
  });
}
