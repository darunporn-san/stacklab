import { BREAKPOINTS, type BreakpointKey } from "./breakpointConfig";
import type { FlexConfig, GridConfig, FlexItemConfig, GridItemConfig, LayoutMode, ResponsiveState } from "./layoutTypes";
import { DEFAULT_FLEX, DEFAULT_GRID } from "./layoutTypes";

// ─── Helpers ───

function mergeConfig<T extends object>(base: T, overrides: Partial<T> | undefined): T {
  return overrides ? { ...base, ...overrides } : base;
}

function resolvedConfigs<T extends object>(base: T, responsive: ResponsiveState<T>): Record<BreakpointKey, T> {
  const result = {} as Record<BreakpointKey, T>;
  let merged = { ...base };
  for (const bp of BREAKPOINTS) {
    merged = mergeConfig(merged, responsive[bp.key]);
    result[bp.key] = { ...merged };
  }
  return result;
}

// ─── CSS Generation ───

function flexToCSS(config: FlexConfig): string {
  return [
    `display: flex;`,
    `flex-direction: ${config.direction};`,
    `justify-content: ${config.justifyContent};`,
    `align-items: ${config.alignItems};`,
    `align-content: ${config.alignContent};`,
    `flex-wrap: ${config.flexWrap};`,
    `gap: ${config.gap}px;`,
    `padding: ${config.padding}px;`,
  ].join("\n  ");
}

function gridToCSS(config: GridConfig): string {
  return [
    `display: grid;`,
    `grid-template-columns: ${config.templateColumns};`,
    `grid-template-rows: ${config.templateRows};`,
    `gap: ${config.gap}px;`,
    `padding: ${config.padding}px;`,
  ].join("\n  ");
}

export function generateCSS(
  mode: LayoutMode,
  baseConfig: FlexConfig | GridConfig,
  responsive: ResponsiveState<FlexConfig | GridConfig>,
  items: (FlexItemConfig | GridItemConfig)[]
): string {
  const configs = resolvedConfigs(baseConfig, responsive);
  const lines: string[] = [`.container {`];

  // base styles
  const baseCfg = configs.base;
  lines.push(`  ${mode === "flex" ? flexToCSS(baseCfg as FlexConfig) : gridToCSS(baseCfg as GridConfig)}`);
  lines.push(`}`);

  // media queries
  for (const bp of BREAKPOINTS.slice(1)) {
    const cfg = configs[bp.key];
    const baseRef = configs.base;
    const props = mode === "flex" ? flexToCSS(cfg as FlexConfig) : gridToCSS(cfg as GridConfig);
    const baseProps = mode === "flex" ? flexToCSS(baseRef as FlexConfig) : gridToCSS(baseRef as GridConfig);
    if (props !== baseProps) {
      lines.push("");
      lines.push(`@media (min-width: ${bp.minWidth}px) {`);
      lines.push(`  .container {`);
      lines.push(`    ${mode === "flex" ? flexToCSS(cfg as FlexConfig) : gridToCSS(cfg as GridConfig)}`);
      lines.push(`  }`);
      lines.push(`}`);
    }
  }

  // items
  if (mode === "flex") {
    (items as FlexItemConfig[]).forEach((item, i) => {
      if (item.order !== 0 || item.flexGrow !== 0 || item.flexShrink !== 1 || item.flexBasis !== "auto") {
        lines.push("");
        lines.push(`.item-${i + 1} {`);
        if (item.order !== 0) lines.push(`  order: ${item.order};`);
        if (item.flexGrow !== 0) lines.push(`  flex-grow: ${item.flexGrow};`);
        if (item.flexShrink !== 1) lines.push(`  flex-shrink: ${item.flexShrink};`);
        if (item.flexBasis !== "auto") lines.push(`  flex-basis: ${item.flexBasis};`);
        lines.push(`}`);
      }
    });
  } else {
    (items as GridItemConfig[]).forEach((item, i) => {
      if (item.colSpan > 1 || item.rowSpan > 1) {
        lines.push("");
        lines.push(`.item-${i + 1} {`);
        if (item.colSpan > 1) lines.push(`  grid-column: span ${item.colSpan};`);
        if (item.rowSpan > 1) lines.push(`  grid-row: span ${item.rowSpan};`);
        lines.push(`}`);
      }
    });
  }

  return lines.join("\n");
}

// ─── Tailwind Generation ───

const flexDirectionMap: Record<string, string> = {
  row: "flex-row", "row-reverse": "flex-row-reverse", column: "flex-col", "column-reverse": "flex-col-reverse",
};
const justifyMap: Record<string, string> = {
  "flex-start": "justify-start", "flex-end": "justify-end", center: "justify-center",
  "space-between": "justify-between", "space-around": "justify-around", "space-evenly": "justify-evenly",
};
const alignMap: Record<string, string> = {
  "flex-start": "items-start", "flex-end": "items-end", center: "items-center", stretch: "items-stretch", baseline: "items-baseline",
};
const wrapMap: Record<string, string> = {
  nowrap: "flex-nowrap", wrap: "flex-wrap", "wrap-reverse": "flex-wrap-reverse",
};

function flexToTailwind(config: FlexConfig, prefix: string): string[] {
  return [
    `${prefix}flex`,
    `${prefix}${flexDirectionMap[config.direction] || "flex-row"}`,
    `${prefix}${justifyMap[config.justifyContent] || "justify-start"}`,
    `${prefix}${alignMap[config.alignItems] || "items-stretch"}`,
    `${prefix}${wrapMap[config.flexWrap] || "flex-nowrap"}`,
    `${prefix}gap-[${config.gap}px]`,
    `${prefix}p-[${config.padding}px]`,
  ];
}

function gridToTailwind(config: GridConfig, prefix: string): string[] {
  const cols = config.templateColumns;
  let colClass = `grid-cols-[${cols}]`;
  const repeatMatch = cols.match(/^repeat\((\d+),\s*1fr\)$/);
  if (repeatMatch) colClass = `grid-cols-${repeatMatch[1]}`;

  return [
    `${prefix}grid`,
    `${prefix}${colClass}`,
    `${prefix}gap-[${config.gap}px]`,
    `${prefix}p-[${config.padding}px]`,
  ];
}

export function generateTailwind(
  mode: LayoutMode,
  baseConfig: FlexConfig | GridConfig,
  responsive: ResponsiveState<FlexConfig | GridConfig>,
  items: (FlexItemConfig | GridItemConfig)[]
): string {
  const configs = resolvedConfigs(baseConfig, responsive);
  const classes: string[] = [];

  for (const bp of BREAKPOINTS) {
    const cfg = configs[bp.key];
    const prefix = bp.tailwindPrefix;
    if (mode === "flex") {
      classes.push(...flexToTailwind(cfg as FlexConfig, prefix));
    } else {
      classes.push(...gridToTailwind(cfg as GridConfig, prefix));
    }
  }

  // dedupe: only keep classes that differ from base
  const unique = [...new Set(classes)];

  const containerLine = `<div class="${unique.join(" ")}">`;

  const itemLines = items.map((item, i) => {
    const cls: string[] = [];
    if (mode === "grid") {
      const g = item as GridItemConfig;
      if (g.colSpan > 1) cls.push(`col-span-${g.colSpan}`);
      if (g.rowSpan > 1) cls.push(`row-span-${g.rowSpan}`);
    } else {
      const f = item as FlexItemConfig;
      if (f.order !== 0) cls.push(`order-${f.order}`);
      if (f.flexGrow === 1) cls.push("grow");
      if (f.flexShrink === 0) cls.push("shrink-0");
      if (f.flexBasis !== "auto") cls.push(`basis-[${f.flexBasis}]`);
    }
    return `  <div${cls.length ? ` class="${cls.join(" ")}"` : ""}>Item ${i + 1}</div>`;
  });

  return [containerLine, ...itemLines, `</div>`].join("\n");
}

// ─── React JSX ───

export function generateReactJSX(
  mode: LayoutMode,
  baseConfig: FlexConfig | GridConfig,
  items: (FlexItemConfig | GridItemConfig)[]
): string {
  const style = mode === "flex"
    ? {
      display: "flex",
      flexDirection: (baseConfig as FlexConfig).direction,
      justifyContent: (baseConfig as FlexConfig).justifyContent,
      alignItems: (baseConfig as FlexConfig).alignItems,
      flexWrap: (baseConfig as FlexConfig).flexWrap,
      gap: `${(baseConfig as FlexConfig).gap}px`,
      padding: `${(baseConfig as FlexConfig).padding}px`,
    }
    : {
      display: "grid",
      gridTemplateColumns: (baseConfig as GridConfig).templateColumns,
      gridTemplateRows: (baseConfig as GridConfig).templateRows,
      gap: `${(baseConfig as GridConfig).gap}px`,
      padding: `${(baseConfig as GridConfig).padding}px`,
    };

  const styleStr = JSON.stringify(style, null, 4).replace(/"([^"]+)":/g, "$1:");

  const itemsStr = items.map((_, i) => `        <div>Item ${i + 1}</div>`).join("\n");

  return `export default function Layout() {
  return (
    <div style={${styleStr}}>
${itemsStr}
    </div>
  );
}`;
}

// ─── Vue Template ───

export function generateVueTemplate(
  mode: LayoutMode,
  baseConfig: FlexConfig | GridConfig,
  items: (FlexItemConfig | GridItemConfig)[]
): string {
  const cssProps = mode === "flex"
    ? [
      `display: flex`,
      `flex-direction: ${(baseConfig as FlexConfig).direction}`,
      `justify-content: ${(baseConfig as FlexConfig).justifyContent}`,
      `align-items: ${(baseConfig as FlexConfig).alignItems}`,
      `flex-wrap: ${(baseConfig as FlexConfig).flexWrap}`,
      `gap: ${(baseConfig as FlexConfig).gap}px`,
      `padding: ${(baseConfig as FlexConfig).padding}px`,
    ]
    : [
      `display: grid`,
      `grid-template-columns: ${(baseConfig as GridConfig).templateColumns}`,
      `grid-template-rows: ${(baseConfig as GridConfig).templateRows}`,
      `gap: ${(baseConfig as GridConfig).gap}px`,
      `padding: ${(baseConfig as GridConfig).padding}px`,
    ];

  const style = cssProps.join("; ");
  const itemsStr = items.map((_, i) => `      <div>Item ${i + 1}</div>`).join("\n");

  return `<script setup>
// Responsive Layout Component
</script>

<template>
  <div style="${style}">
${itemsStr}
  </div>
</template>`;
}
