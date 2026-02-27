export interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

export function defaultShadow(): ShadowLayer {
  return {
    id: crypto.randomUUID(),
    x: 0,
    y: 8,
    blur: 24,
    spread: 0,
    color: "#000000",
    opacity: 0.15,
    inset: false,
  };
}

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;
}

export function buildShadowCSS(layers: ShadowLayer[]): string {
  const val = layers
    .map(l => {
      const parts = [
        ...(l.inset ? ["inset"] : []),
        `${l.x}px`,
        `${l.y}px`,
        `${l.blur}px`,
        `${l.spread}px`,
        hexToRgba(l.color, l.opacity),
      ];
      return parts.join(" ");
    })
    .join(",\n    ");
  return `box-shadow: ${val};`;
}

export function buildShadowValue(layers: ShadowLayer[]): string {
  return layers
    .map(l => {
      const parts = [
        ...(l.inset ? ["inset"] : []),
        `${l.x}px`,
        `${l.y}px`,
        `${l.blur}px`,
        `${l.spread}px`,
        hexToRgba(l.color, l.opacity),
      ];
      return parts.join(" ");
    })
    .join(", ");
}
