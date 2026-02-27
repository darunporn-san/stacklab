import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/CopyButton";
import { generateClamp, defaultClamp, ClampConfig } from "@/lib/clampCalculator";

export function ClampCalculatorTab() {
  const [config, setConfig] = useState<ClampConfig>(defaultClamp());

  const clampValue = useMemo(() => generateClamp(config), [config]);
  const cssOutput = `font-size: ${clampValue};`;

  const update = (key: keyof ClampConfig, val: string) => {
    const n = parseInt(val) || 0;
    setConfig(prev => ({ ...prev, [key]: n }));
  };

  return (
    <div className="space-y-4 pt-4">
      <p className="text-xs text-muted-foreground">
        Generate a responsive <code className="text-foreground">clamp(min, preferred, max)</code> value.
        The preferred value is auto-calculated from viewport range.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Field label="Min Size (px)" value={config.minSize} onChange={v => update("minSize", v)} />
        <Field label="Max Size (px)" value={config.maxSize} onChange={v => update("maxSize", v)} />
        <Field label="Min Viewport (px)" value={config.minViewport} onChange={v => update("minViewport", v)} />
        <Field label="Max Viewport (px)" value={config.maxViewport} onChange={v => update("maxViewport", v)} />
      </div>

      {/* Preview */}
      <div className="rounded-lg border border-border p-6 bg-muted/30">
        <p style={{ fontSize: clampValue }} className="text-foreground font-semibold leading-tight">
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>

      {/* Output */}
      <div className="rounded-md border border-border bg-muted/50 p-3">
        <code className="text-sm font-mono text-foreground">{cssOutput}</code>
      </div>
      <CopyButton text={cssOutput} />
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground">{label}</label>
      <Input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="font-mono"
      />
    </div>
  );
}
