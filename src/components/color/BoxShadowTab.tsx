import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/CopyButton";
import { Plus, X } from "lucide-react";
import { ShadowLayer, defaultShadow, buildShadowCSS, buildShadowValue } from "@/lib/shadowBuilder";

export function BoxShadowTab() {
  const [layers, setLayers] = useState<ShadowLayer[]>([defaultShadow()]);

  const cssOutput = buildShadowCSS(layers);
  const shadowValue = buildShadowValue(layers);

  const updateLayer = (id: string, patch: Partial<ShadowLayer>) => {
    setLayers(layers.map(l => (l.id === id ? { ...l, ...patch } : l)));
  };

  const addLayer = () => setLayers([...layers, defaultShadow()]);
  const removeLayer = (id: string) => {
    if (layers.length <= 1) return;
    setLayers(layers.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-4 pt-4">
      {/* Preview */}
      <div className="flex items-center justify-center p-12 bg-muted/30 rounded-lg border border-border">
        <div
          className="w-40 h-28 rounded-lg bg-background border border-border"
          style={{ boxShadow: shadowValue }}
        />
      </div>

      {/* Layers */}
      {layers.map((layer, idx) => (
        <div key={layer.id} className="space-y-3 rounded-md border border-border p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Layer {idx + 1}</span>
            {layers.length > 1 && (
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeLayer(layer.id)}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SliderField label={`X: ${layer.x}px`} min={-50} max={50} value={layer.x} onChange={v => updateLayer(layer.id, { x: v })} />
            <SliderField label={`Y: ${layer.y}px`} min={-50} max={50} value={layer.y} onChange={v => updateLayer(layer.id, { y: v })} />
            <SliderField label={`Blur: ${layer.blur}px`} min={0} max={100} value={layer.blur} onChange={v => updateLayer(layer.id, { blur: v })} />
            <SliderField label={`Spread: ${layer.spread}px`} min={-50} max={50} value={layer.spread} onChange={v => updateLayer(layer.id, { spread: v })} />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={layer.color}
                onChange={e => updateLayer(layer.id, { color: e.target.value })}
                className="h-7 w-7 rounded border border-border cursor-pointer"
              />
              <span className="text-xs text-muted-foreground">Color</span>
            </div>
            <div className="flex-1">
              <SliderField label={`Opacity: ${(layer.opacity * 100).toFixed(0)}%`} min={0} max={100} value={Math.round(layer.opacity * 100)} onChange={v => updateLayer(layer.id, { opacity: v / 100 })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={layer.inset} onCheckedChange={v => updateLayer(layer.id, { inset: v })} />
              <span className="text-xs text-muted-foreground">Inset</span>
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addLayer} className="gap-1">
        <Plus className="h-3 w-3" /> Add Layer
      </Button>

      {/* Output */}
      <div className="rounded-md border border-border bg-muted/50 p-3">
        <code className="text-sm font-mono text-foreground block whitespace-pre-wrap">{cssOutput}</code>
      </div>
      <CopyButton text={cssOutput} />
    </div>
  );
}

function SliderField({ label, min, max, value, onChange }: { label: string; min: number; max: number; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground">{label}</label>
      <Slider min={min} max={max} step={1} value={[value]} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}
