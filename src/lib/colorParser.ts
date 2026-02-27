export interface RGB { r: number; g: number; b: number; }
export interface RGBA extends RGB { a: number; }
export interface HSL { h: number; s: number; l: number; }

export type ColorFormat = "hex" | "rgb" | "rgba" | "hsl" | "unknown";

export function detectFormat(input: string): ColorFormat {
  const t = input.trim();
  if (/^#([0-9a-f]{3,8})$/i.test(t)) return "hex";
  if (/^rgba?\s*\(/i.test(t)) return t.toLowerCase().startsWith("rgba") ? "rgba" : "rgb";
  if (/^hsl\s*\(/i.test(t)) return "hsl";
  return "unknown";
}

export function parseHex(hex: string): RGBA {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  if (h.length === 4) h = h.split("").map(c => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

export function parseRgb(str: string): RGBA {
  const m = str.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/i);
  if (!m) return { r: 0, g: 0, b: 0, a: 1 };
  return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
}

export function parseHsl(str: string): RGBA {
  const m = str.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/i);
  if (!m) return { r: 0, g: 0, b: 0, a: 1 };
  return { ...hslToRgb({ h: +m[1], s: +m[2], l: +m[3] }), a: 1 };
}

export function parseColor(input: string): RGBA | null {
  const fmt = detectFormat(input);
  switch (fmt) {
    case "hex": return parseHex(input.trim());
    case "rgb": case "rgba": return parseRgb(input.trim());
    case "hsl": return parseHsl(input.trim());
    default: return null;
  }
}

export function rgbaToHex(c: RGBA): string {
  const hex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  const base = `#${hex(c.r)}${hex(c.g)}${hex(c.b)}`;
  return c.a < 1 ? base + hex(c.a * 255) : base;
}

export function rgbaToRgbString(c: RGBA): string {
  return `rgb(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)})`;
}

export function rgbaToRgbaString(c: RGBA): string {
  return `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${c.a.toFixed(2)})`;
}

export function rgbToHsl(c: RGB): HSL {
  const r = c.r / 255, g = c.g / 255, b = c.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function rgbaToHslString(c: RGBA): string {
  const { h, s, l } = rgbToHsl(c);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function hslToRgb(hsl: HSL): RGB {
  const s = hsl.s / 100, l = hsl.l / 100, h = hsl.h;
  if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h / 360 + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, h / 360) * 255),
    b: Math.round(hue2rgb(p, q, h / 360 - 1/3) * 255),
  };
}

export function luminance(c: RGB): number {
  const a = [c.r, c.g, c.b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function contrastRatio(c1: RGB, c2: RGB): number {
  const l1 = luminance(c1), l2 = luminance(c2);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function bestTextColor(bg: RGB): "white" | "black" {
  return luminance(bg) > 0.179 ? "black" : "white";
}
