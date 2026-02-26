export type BreakpointKey = "base" | "sm" | "md" | "lg" | "xl";

export interface BreakpointDef {
  key: BreakpointKey;
  label: string;
  minWidth: number;
  tailwindPrefix: string;
}

export const BREAKPOINTS: BreakpointDef[] = [
  { key: "base", label: "Base", minWidth: 0, tailwindPrefix: "" },
  { key: "sm", label: "sm", minWidth: 640, tailwindPrefix: "sm:" },
  { key: "md", label: "md", minWidth: 768, tailwindPrefix: "md:" },
  { key: "lg", label: "lg", minWidth: 1024, tailwindPrefix: "lg:" },
  { key: "xl", label: "xl", minWidth: 1280, tailwindPrefix: "xl:" },
];

export const VIEWPORT_PRESETS = [
  { label: "375px", width: 375 },
  { label: "768px", width: 768 },
  { label: "1024px", width: 1024 },
  { label: "1440px", width: 1440 },
];
