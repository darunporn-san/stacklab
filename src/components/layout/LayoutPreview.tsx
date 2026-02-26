import type { FlexConfig, GridConfig, FlexItemConfig, GridItemConfig, LayoutMode } from "@/lib/layoutTypes";
import type { BreakpointKey } from "@/lib/breakpointConfig";
import { BREAKPOINTS } from "@/lib/breakpointConfig";
import { useMemo } from "react";

interface Props {
  mode: LayoutMode;
  flexConfig: FlexConfig;
  gridConfig: GridConfig;
  flexItems: FlexItemConfig[];
  gridItems: GridItemConfig[];
  viewportWidth: number;
  activeBreakpoint: BreakpointKey;
  showGridOverlay: boolean;
}

const ITEM_COLORS = [
  "hsl(190 80% 45% / 0.25)",
  "hsl(150 60% 45% / 0.25)",
  "hsl(280 60% 55% / 0.25)",
  "hsl(30 80% 55% / 0.25)",
  "hsl(350 70% 55% / 0.25)",
  "hsl(60 70% 45% / 0.25)",
  "hsl(210 70% 50% / 0.25)",
  "hsl(170 60% 40% / 0.25)",
];

export function LayoutPreview({ mode, flexConfig, gridConfig, flexItems, gridItems, viewportWidth, activeBreakpoint, showGridOverlay }: Props) {
  const bpLabel = BREAKPOINTS.find(b => b.key === activeBreakpoint)?.label || "base";

  const containerStyle = useMemo(() => {
    if (mode === "flex") {
      return {
        display: "flex" as const,
        flexDirection: flexConfig.direction,
        justifyContent: flexConfig.justifyContent,
        alignItems: flexConfig.alignItems,
        alignContent: flexConfig.alignContent,
        flexWrap: flexConfig.flexWrap,
        gap: `${flexConfig.gap}px`,
        padding: `${flexConfig.padding}px`,
      };
    }
    return {
      display: "grid" as const,
      gridTemplateColumns: gridConfig.templateColumns,
      gridTemplateRows: gridConfig.templateRows,
      gap: `${gridConfig.gap}px`,
      padding: `${gridConfig.padding}px`,
    };
  }, [mode, flexConfig, gridConfig]);

  const items = mode === "flex" ? flexItems : gridItems;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Preview — {viewportWidth}px
        </span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-mono font-medium text-primary">
          {bpLabel}
        </span>
      </div>

      <div className="overflow-auto rounded-lg border border-border bg-background">
        <div
          style={{ width: `${Math.min(viewportWidth, 1440)}px`, maxWidth: "100%", minHeight: 200, position: "relative" }}
          className="mx-auto transition-all duration-300"
        >
          {showGridOverlay && mode === "grid" && (
            <div
              className="absolute inset-0 pointer-events-none border border-dashed border-primary/20"
              style={{ ...containerStyle, opacity: 0.3 }}
            >
              {items.map((_, i) => (
                <div key={i} className="border border-dashed border-primary/30 rounded" />
              ))}
            </div>
          )}

          <div style={containerStyle}>
            {items.map((item, i) => {
              const itemStyle: React.CSSProperties = { background: ITEM_COLORS[i % ITEM_COLORS.length] };

              if (mode === "flex") {
                const f = item as FlexItemConfig;
                itemStyle.order = f.order;
                itemStyle.flexGrow = f.flexGrow;
                itemStyle.flexShrink = f.flexShrink;
                itemStyle.flexBasis = f.flexBasis;
              } else {
                const g = item as GridItemConfig;
                if (g.colSpan > 1) itemStyle.gridColumn = `span ${g.colSpan}`;
                if (g.rowSpan > 1) itemStyle.gridRow = `span ${g.rowSpan}`;
              }

              return (
                <div
                  key={item.id}
                  style={itemStyle}
                  className="flex items-center justify-center rounded-md border border-border px-4 py-6 text-xs font-mono text-foreground transition-all"
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
