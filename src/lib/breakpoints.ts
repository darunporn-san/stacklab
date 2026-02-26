export interface DevicePreset {
  label: string;
  width: number;
  height: number;
  icon: string;
}

export const DEVICE_PRESETS: DevicePreset[] = [
  { label: "Mobile", width: 375, height: 812, icon: "📱" },
  { label: "Tablet", width: 768, height: 1024, icon: "📋" },
  { label: "Laptop", width: 1024, height: 768, icon: "💻" },
  { label: "Desktop", width: 1440, height: 900, icon: "🖥️" },
];

export interface Breakpoint {
  label: string;
  minWidth: number;
}

export const TAILWIND_BREAKPOINTS: Breakpoint[] = [
  { label: "xs", minWidth: 0 },
  { label: "sm", minWidth: 640 },
  { label: "md", minWidth: 768 },
  { label: "lg", minWidth: 1024 },
  { label: "xl", minWidth: 1280 },
  { label: "2xl", minWidth: 1536 },
];

export const MULTI_PREVIEW_WIDTHS = [375, 768, 1440];

export function getActiveBreakpoint(
  width: number,
  breakpoints: Breakpoint[] = TAILWIND_BREAKPOINTS
): string {
  let active = breakpoints[0].label;
  for (const bp of breakpoints) {
    if (width >= bp.minWidth) active = bp.label;
  }
  return active;
}

export function getOrientation(w: number, h: number): "portrait" | "landscape" {
  return h >= w ? "portrait" : "landscape";
}

export function getPresetName(w: number, h: number): string | null {
  const match = DEVICE_PRESETS.find(
    (d) => (d.width === w && d.height === h) || (d.width === h && d.height === w)
  );
  return match?.label ?? null;
}

export function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
