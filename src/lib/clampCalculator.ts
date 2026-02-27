export interface ClampConfig {
  minSize: number;
  maxSize: number;
  minViewport: number;
  maxViewport: number;
}

export function generateClamp(config: ClampConfig): string {
  const { minSize, maxSize, minViewport, maxViewport } = config;
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const yIntercept = minSize - slope * minViewport;
  const vw = +(slope * 100).toFixed(4);
  const rem = +(yIntercept / 16).toFixed(4);
  const preferred = `${rem}rem + ${vw}vw`;
  return `clamp(${minSize}px, ${preferred}, ${maxSize}px)`;
}

export function defaultClamp(): ClampConfig {
  return { minSize: 16, maxSize: 24, minViewport: 320, maxViewport: 1200 };
}
