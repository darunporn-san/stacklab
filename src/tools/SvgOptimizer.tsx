import { useState, useMemo, useCallback } from "react";
import { FileDropZone } from "../components/FileDropZone";
import { CodeBlock } from "../components/CodeBlock";
import {
  optimizeSvg,
  isValidSvg,
  svgToReactComponent,
  svgToVueComponent,
  svgToInlineHtml,
  svgReactImportUsage,
  svgVueImportUsage,
  getByteSize,
  formatBytes,
  SvgOptimizeOptions,
} from "../lib/svgOptimizer";
import { RotateCcw, Download } from "lucide-react";

const TABS = ["Optimized SVG", "React Component", "React Import", "Vue Component", "Vue Import", "Inline HTML"] as const;
type Tab = (typeof TABS)[number];

export default function SvgOptimizerTool() {
  const [raw, setRaw] = useState("");
  const [componentName, setComponentName] = useState("MyIcon");
  const [tab, setTab] = useState<Tab>("Optimized SVG");
  const [opts, setOpts] = useState<SvgOptimizeOptions>({
    removeWidthHeight: true,
    convertToCurrentColor: true,
    removeComments: true,
    minify: false,
  });

  const toggle = (key: keyof SvgOptimizeOptions) =>
    setOpts((o) => ({ ...o, [key]: !o[key] }));

  const valid = useMemo(() => (raw.trim() ? isValidSvg(raw) : null), [raw]);
  const optimized = useMemo(() => (valid ? optimizeSvg(raw, opts) : ""), [raw, opts, valid]);

  const originalSize = useMemo(() => getByteSize(raw), [raw]);
  const optimizedSize = useMemo(() => getByteSize(optimized), [optimized]);
  const reduction = originalSize > 0 ? Math.round(((originalSize - optimizedSize) / originalSize) * 100) : 0;

  const name = componentName || "MyIcon";

  const output = useMemo(() => {
    if (!optimized) return "";
    switch (tab) {
      case "Optimized SVG":
        return optimized;
      case "React Component":
        return svgToReactComponent(optimized, name);
      case "React Import":
        return svgReactImportUsage(name, name);
      case "Vue Component":
        return svgToVueComponent(optimized, name);
      case "Vue Import":
        return svgVueImportUsage(name, name);
      case "Inline HTML":
        return svgToInlineHtml(optimized);
    }
  }, [optimized, tab, name]);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setRaw(e.target?.result as string);
    reader.readAsText(file);
  }, []);

  const toggleItems = [
    { key: "removeWidthHeight" as const, label: "Remove width/height" },
    { key: "convertToCurrentColor" as const, label: "Use currentColor" },
    { key: "removeComments" as const, label: "Remove comments" },
    { key: "minify" as const, label: "Minify" },
  ];

  return (
    <div className="space-y-4">
      {/* Options row */}
      <div className="flex flex-wrap items-center gap-4">
        {toggleItems.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={opts[key]}
              onChange={() => toggle(key)}
              className="h-4 w-4 rounded border-border bg-code accent-primary"
            />
            <span className="text-sm text-muted-foreground">{label}</span>
          </label>
        ))}
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Name:</label>
          <input
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            className="h-8 w-32 rounded-md border border-border bg-code px-2 font-mono text-sm text-code-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Input SVG</span>
            {raw && (
              <button
                onClick={() => setRaw("")}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>
          <FileDropZone accept=".svg" onFile={handleFile} />
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            spellCheck={false}
            placeholder="Paste SVG markup here…"
            className="h-64 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {valid === false && (
            <p className="text-xs text-destructive">Invalid SVG — must contain {"<svg>…</svg>"}</p>
          )}
        </div>

        {/* Output panel */}
        <div className="space-y-3">
          {/* Preview + Stats */}
          {optimized && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-muted-foreground">Preview</span>
                  <span className="text-xs text-muted-foreground">
                    {formatBytes(originalSize)} → {formatBytes(optimizedSize)}{" "}
                    <span className="text-success">({reduction}% saved)</span>
                  </span>
                </div>
                <button
                  onClick={() => {
                    const blob = new Blob([optimized], { type: "image/svg+xml" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}.svg`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-muted"
                >
                  <Download className="h-3.5 w-3.5" /> Download .svg
                </button>
              </div>
              <div
                className="flex items-center justify-center rounded-lg border border-border bg-card p-6 overflow-hidden [&>svg]:max-w-full [&>svg]:max-h-[180px] [&>svg]:w-auto [&>svg]:h-auto"
                dangerouslySetInnerHTML={{ __html: optimized }}
                style={{ maxHeight: 200 }}
              />
            </>
          )}

          {/* Tabs */}
          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === t
                    ? "bg-card text-card-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {output && <CodeBlock code={output} label={tab} />}
        </div>
      </div>
    </div>
  );
}
