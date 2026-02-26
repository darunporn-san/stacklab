import { useState, useCallback, useEffect } from "react";
import type { BreakpointKey } from "@/lib/breakpointConfig";
import type {
  LayoutMode, FlexConfig, GridConfig, FlexItemConfig, GridItemConfig, ResponsiveState,
} from "@/lib/layoutTypes";
import { DEFAULT_FLEX, DEFAULT_GRID, createFlexItem, createGridItem } from "@/lib/layoutTypes";

const STORAGE_KEY = "responsive-layout-lab";

interface LayoutState {
  mode: LayoutMode;
  activeBreakpoint: BreakpointKey;
  viewportWidth: number;
  flexConfig: FlexConfig;
  gridConfig: GridConfig;
  flexItems: FlexItemConfig[];
  gridItems: GridItemConfig[];
  flexResponsive: ResponsiveState<FlexConfig>;
  gridResponsive: ResponsiveState<GridConfig>;
  showGridOverlay: boolean;
}

const initialState: LayoutState = {
  mode: "flex",
  activeBreakpoint: "base",
  viewportWidth: 1024,
  flexConfig: { ...DEFAULT_FLEX },
  gridConfig: { ...DEFAULT_GRID },
  flexItems: [createFlexItem(0), createFlexItem(1), createFlexItem(2)],
  gridItems: [createGridItem(0), createGridItem(1), createGridItem(2), createGridItem(3), createGridItem(4), createGridItem(5)],
  flexResponsive: {},
  gridResponsive: {},
  showGridOverlay: false,
};

function loadState(): LayoutState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialState, ...JSON.parse(raw) };
  } catch {}
  return initialState;
}

export function useResponsiveLayout() {
  const [state, setState] = useState<LayoutState>(loadState);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 300);
    return () => clearTimeout(timer);
  }, [state]);

  const setMode = useCallback((mode: LayoutMode) => setState(s => ({ ...s, mode })), []);
  const setBreakpoint = useCallback((bp: BreakpointKey) => setState(s => ({ ...s, activeBreakpoint: bp })), []);
  const setViewportWidth = useCallback((w: number) => setState(s => ({ ...s, viewportWidth: w })), []);
  const toggleGridOverlay = useCallback(() => setState(s => ({ ...s, showGridOverlay: !s.showGridOverlay })), []);

  const updateFlexConfig = useCallback((updates: Partial<FlexConfig>) => {
    setState(s => {
      if (s.activeBreakpoint === "base") {
        return { ...s, flexConfig: { ...s.flexConfig, ...updates } };
      }
      const bpOverrides = s.flexResponsive[s.activeBreakpoint] || {};
      return {
        ...s,
        flexResponsive: { ...s.flexResponsive, [s.activeBreakpoint]: { ...bpOverrides, ...updates } },
      };
    });
  }, []);

  const updateGridConfig = useCallback((updates: Partial<GridConfig>) => {
    setState(s => {
      if (s.activeBreakpoint === "base") {
        return { ...s, gridConfig: { ...s.gridConfig, ...updates } };
      }
      const bpOverrides = s.gridResponsive[s.activeBreakpoint] || {};
      return {
        ...s,
        gridResponsive: { ...s.gridResponsive, [s.activeBreakpoint]: { ...bpOverrides, ...updates } },
      };
    });
  }, []);

  const addItem = useCallback(() => {
    setState(s => {
      if (s.mode === "flex") {
        return { ...s, flexItems: [...s.flexItems, createFlexItem(s.flexItems.length)] };
      }
      return { ...s, gridItems: [...s.gridItems, createGridItem(s.gridItems.length)] };
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setState(s => ({
      ...s,
      flexItems: s.flexItems.filter(i => i.id !== id),
      gridItems: s.gridItems.filter(i => i.id !== id),
    }));
  }, []);

  const updateFlexItem = useCallback((id: string, updates: Partial<FlexItemConfig>) => {
    setState(s => ({
      ...s,
      flexItems: s.flexItems.map(i => i.id === id ? { ...i, ...updates } : i),
    }));
  }, []);

  const updateGridItem = useCallback((id: string, updates: Partial<GridItemConfig>) => {
    setState(s => ({
      ...s,
      gridItems: s.gridItems.map(i => i.id === id ? { ...i, ...updates } : i),
    }));
  }, []);

  const resetLayout = useCallback(() => setState(initialState), []);

  // Resolve config for current breakpoint
  const resolvedFlexConfig: FlexConfig = (() => {
    let cfg = { ...state.flexConfig };
    const bpOrder: BreakpointKey[] = ["base", "sm", "md", "lg", "xl"];
    for (const bp of bpOrder) {
      if (bp === "base") continue;
      const override = state.flexResponsive[bp];
      if (override) cfg = { ...cfg, ...override };
      if (bp === state.activeBreakpoint) break;
    }
    return cfg;
  })();

  const resolvedGridConfig: GridConfig = (() => {
    let cfg = { ...state.gridConfig };
    const bpOrder: BreakpointKey[] = ["base", "sm", "md", "lg", "xl"];
    for (const bp of bpOrder) {
      if (bp === "base") continue;
      const override = state.gridResponsive[bp];
      if (override) cfg = { ...cfg, ...override };
      if (bp === state.activeBreakpoint) break;
    }
    return cfg;
  })();

  return {
    ...state,
    resolvedFlexConfig,
    resolvedGridConfig,
    setMode,
    setBreakpoint,
    setViewportWidth,
    toggleGridOverlay,
    updateFlexConfig,
    updateGridConfig,
    addItem,
    removeItem,
    updateFlexItem,
    updateGridItem,
    resetLayout,
  };
}
