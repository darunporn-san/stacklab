import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import type { LayoutMode, FlexConfig, GridConfig, FlexItemConfig, GridItemConfig, ResponsiveState } from "@/lib/layoutTypes";
import { generateCSS, generateTailwind, generateReactJSX, generateVueTemplate } from "@/lib/layoutGenerators";

interface Props {
  mode: LayoutMode;
  baseConfig: FlexConfig | GridConfig;
  responsive: ResponsiveState<FlexConfig | GridConfig>;
  items: (FlexItemConfig | GridItemConfig)[];
  onReset: () => void;
}

const TABS = [
  { key: "css", label: "CSS" },
  { key: "tailwind", label: "Tailwind" },
  { key: "react", label: "React JSX" },
  { key: "vue", label: "Vue" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function ExportPanel({ mode, baseConfig, responsive, items, onReset }: Props) {
  const [tab, setTab] = useState<TabKey>("css");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const output = (() => {
    switch (tab) {
      case "css": return generateCSS(mode, baseConfig, responsive, items);
      case "tailwind": return generateTailwind(mode, baseConfig, responsive, items);
      case "react": return generateReactJSX(mode, baseConfig, items);
      case "vue": return generateVueTemplate(mode, baseConfig, items);
    }
  })();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg border border-border bg-code p-0.5">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <CopyButton text={output} />
          {showResetConfirm ? (
            <div className="flex items-center gap-1">
              <button onClick={() => { onReset(); setShowResetConfirm(false); }} className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors">
                Confirm
              </button>
              <button onClick={() => setShowResetConfirm(false)} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setShowResetConfirm(true)} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Reset
            </button>
          )}
        </div>
      </div>

      <pre className="h-56 overflow-auto rounded-lg border border-border bg-code p-4 font-mono text-xs text-code-foreground whitespace-pre-wrap">
        {output}
      </pre>
    </div>
  );
}
