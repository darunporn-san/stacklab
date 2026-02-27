import { presets } from "@/lib/regexPresets";
import type { RuleConfig } from "@/lib/regexRuleConfig";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  onSelect: (config: RuleConfig) => void;
}

export function PresetSelector({ onSelect }: Props) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">Load Preset</label>
      <Select onValueChange={(v) => {
        const preset = presets.find((p) => p.name === v);
        if (preset) onSelect(structuredClone(preset.config));
      }}>
        <SelectTrigger className="text-sm"><SelectValue placeholder="Choose a preset..." /></SelectTrigger>
        <SelectContent>
          {presets.map((p) => (
            <SelectItem key={p.name} value={p.name}>
              <div className="flex flex-col">
                <span>{p.name}</span>
                <span className="text-xs text-muted-foreground">{p.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
