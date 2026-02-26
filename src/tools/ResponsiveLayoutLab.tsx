import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { FlexControls } from "@/components/layout/FlexControls";
import { GridControls } from "@/components/layout/GridControls";
import { LayoutPreview } from "@/components/layout/LayoutPreview";
import { ExportPanel } from "@/components/layout/ExportPanel";
import { BREAKPOINTS, VIEWPORT_PRESETS } from "@/lib/breakpointConfig";
import { RotateCw, Grid3X3 } from "lucide-react";

export default function ResponsiveLayoutLabTool() {
  const layout = useResponsiveLayout();

  return (
    <div className="space-y-5">
      {/* Top bar: Mode + Breakpoints + Viewport */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Mode toggle */}
        <div className="flex rounded-lg border border-border bg-code p-0.5">
          {(["flex", "grid"] as const).map(m => (
            <button
              key={m}
              onClick={() => layout.setMode(m)}
              className={`rounded-md px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
                layout.mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Breakpoint selector */}
        <div className="flex gap-1">
          {BREAKPOINTS.map(bp => (
            <button
              key={bp.key}
              onClick={() => layout.setBreakpoint(bp.key)}
              className={`rounded-md px-2.5 py-1.5 text-[11px] font-mono font-medium transition-colors ${
                layout.activeBreakpoint === bp.key
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {bp.label}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Viewport presets */}
        <div className="flex gap-1">
          {VIEWPORT_PRESETS.map(p => (
            <button
              key={p.width}
              onClick={() => layout.setViewportWidth(p.width)}
              className={`rounded-md px-2 py-1.5 text-[11px] font-mono transition-colors ${
                layout.viewportWidth === p.width
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Custom width */}
        <input
          type="number"
          value={layout.viewportWidth}
          onChange={e => layout.setViewportWidth(+e.target.value)}
          className="h-8 w-20 rounded-md border border-border bg-code px-2 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          min={200}
          max={2560}
        />

        {/* Rotate */}
        <button
          onClick={() => layout.setViewportWidth(layout.viewportWidth === 375 ? 667 : layout.viewportWidth === 667 ? 375 : layout.viewportWidth)}
          className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          title="Rotate"
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>

        {/* Grid overlay toggle */}
        {layout.mode === "grid" && (
          <button
            onClick={layout.toggleGridOverlay}
            className={`rounded-md border p-1.5 transition-colors ${
              layout.showGridOverlay
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
            title="Toggle grid overlay"
          >
            <Grid3X3 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Main: Controls + Preview */}
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="rounded-lg border border-border bg-card p-4 overflow-y-auto max-h-[520px]">
          {layout.mode === "flex" ? (
            <FlexControls
              config={layout.resolvedFlexConfig}
              items={layout.flexItems}
              onChange={layout.updateFlexConfig}
              onAddItem={layout.addItem}
              onRemoveItem={layout.removeItem}
              onUpdateItem={layout.updateFlexItem}
            />
          ) : (
            <GridControls
              config={layout.resolvedGridConfig}
              items={layout.gridItems}
              onChange={layout.updateGridConfig}
              onAddItem={layout.addItem}
              onRemoveItem={layout.removeItem}
              onUpdateItem={layout.updateGridItem}
            />
          )}
        </div>

        <LayoutPreview
          mode={layout.mode}
          flexConfig={layout.resolvedFlexConfig}
          gridConfig={layout.resolvedGridConfig}
          flexItems={layout.flexItems}
          gridItems={layout.gridItems}
          viewportWidth={layout.viewportWidth}
          activeBreakpoint={layout.activeBreakpoint}
          showGridOverlay={layout.showGridOverlay}
        />
      </div>

      {/* Export */}
      <ExportPanel
        mode={layout.mode}
        baseConfig={layout.mode === "flex" ? layout.flexConfig : layout.gridConfig}
        responsive={layout.mode === "flex" ? layout.flexResponsive : layout.gridResponsive}
        items={layout.mode === "flex" ? layout.flexItems : layout.gridItems}
        onReset={layout.resetLayout}
      />
    </div>
  );
}
