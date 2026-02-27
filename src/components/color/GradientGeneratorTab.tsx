import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  GradientConfig,
  GradientStop,
  defaultGradient,
  buildGradientCSS,
  buildGradientValue,
} from "@/lib/gradientBuilder";

export function GradientGeneratorTab() {
  const [config, setConfig] = useState<GradientConfig>(defaultGradient());

  const cssOutput = buildGradientCSS(config);
  const gradientValue = buildGradientValue(config);

  const updateStop = (idx: number, patch: Partial<GradientStop>) => {
    const stops = config.stops.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    setConfig({ ...config, stops });
  };

  const addStop = () => {
    if (config.stops.length >= 5) return;
    setConfig({
      ...config,
      stops: [...config.stops, { color: "#ffffff", position: 50 }],
    });
  };

  const removeStop = (idx: number) => {
    if (config.stops.length <= 2) return;
    setConfig({ ...config, stops: config.stops.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4 pt-4">
      {/* Type toggle */}
      <div className="flex gap-2">
        {(["linear", "radial"] as const).map(t => (
          <Button
            key={t}
            variant={config.type === t ? "default" : "outline"}
            size="sm"
            onClick={() => setConfig({ ...config, type: t })}
            className="capitalize"
          >
            {t}
          </Button>
        ))}
      </div>

      {/* Angle */}
      {config.type === "linear" && (
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Angle: {config.angle}°</label>
          <Slider
            min={0}
            max={360}
            step={1}
            value={[config.angle]}
            onValueChange={([v]) => setConfig({ ...config, angle: v })}
          />
        </div>
      )}

      {/* Stops */}
      <div className="space-y-3">
        {config.stops.map((stop, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <input
              type="color"
              value={stop.color}
              onChange={e => updateStop(idx, { color: e.target.value })}
              className="h-8 w-8 rounded border border-border cursor-pointer"
            />
            <div className="flex-1">
              <Slider
                min={0}
                max={100}
                step={1}
                value={[stop.position]}
                onValueChange={([v]) => updateStop(idx, { position: v })}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8">{stop.position}%</span>
            {config.stops.length > 2 && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeStop(idx)}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
        {config.stops.length < 5 && (
          <Button variant="outline" size="sm" onClick={addStop} className="gap-1">
            <Plus className="h-3 w-3" /> Add Stop
          </Button>
        )}
      </div>

      {/* Preview */}
      <div
        className="h-32 rounded-lg border border-border"
        style={{ background: gradientValue }}
      />

      {/* Output */}
      <div className="rounded-md border border-border bg-muted/50 p-3">
        <code className="text-sm font-mono text-foreground block whitespace-pre-wrap">{cssOutput}</code>
      </div>
      <CopyButton text={cssOutput} />
    </div>
  );
}
