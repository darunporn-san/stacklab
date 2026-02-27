export interface GradientStop {
  color: string;
  position: number; // 0-100
}

export type GradientType = "linear" | "radial";

export interface GradientConfig {
  type: GradientType;
  angle: number;
  stops: GradientStop[];
}

export function buildGradientCSS(config: GradientConfig): string {
  const stops = config.stops
    .map(s => `${s.color} ${s.position}%`)
    .join(", ");
  if (config.type === "radial") {
    return `background: radial-gradient(circle, ${stops});`;
  }
  return `background: linear-gradient(${config.angle}deg, ${stops});`;
}

export function buildGradientValue(config: GradientConfig): string {
  const stops = config.stops
    .map(s => `${s.color} ${s.position}%`)
    .join(", ");
  if (config.type === "radial") {
    return `radial-gradient(circle, ${stops})`;
  }
  return `linear-gradient(${config.angle}deg, ${stops})`;
}

export function defaultGradient(): GradientConfig {
  return {
    type: "linear",
    angle: 135,
    stops: [
      { color: "#667eea", position: 0 },
      { color: "#764ba2", position: 100 },
    ],
  };
}
