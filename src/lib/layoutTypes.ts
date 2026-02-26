import type { BreakpointKey } from "./breakpointConfig";

export type LayoutMode = "flex" | "grid";

export interface FlexConfig {
  direction: "row" | "row-reverse" | "column" | "column-reverse";
  justifyContent: string;
  alignItems: string;
  alignContent: string;
  flexWrap: "nowrap" | "wrap" | "wrap-reverse";
  gap: number;
  padding: number;
}

export interface FlexItemConfig {
  id: string;
  order: number;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
}

export interface GridConfig {
  templateColumns: string;
  templateRows: string;
  gap: number;
  padding: number;
}

export interface GridItemConfig {
  id: string;
  colSpan: number;
  rowSpan: number;
}

export const DEFAULT_FLEX: FlexConfig = {
  direction: "row",
  justifyContent: "flex-start",
  alignItems: "stretch",
  alignContent: "stretch",
  flexWrap: "nowrap",
  gap: 8,
  padding: 16,
};

export const DEFAULT_GRID: GridConfig = {
  templateColumns: "repeat(3, 1fr)",
  templateRows: "auto",
  gap: 8,
  padding: 16,
};

export function createFlexItem(index: number): FlexItemConfig {
  return { id: `item-${Date.now()}-${index}`, order: 0, flexGrow: 0, flexShrink: 1, flexBasis: "auto" };
}

export function createGridItem(index: number): GridItemConfig {
  return { id: `item-${Date.now()}-${index}`, colSpan: 1, rowSpan: 1 };
}

export type ResponsiveState<T> = Partial<Record<BreakpointKey, Partial<T>>>;
