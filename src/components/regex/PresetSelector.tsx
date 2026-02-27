import { presets, presetCategories } from "@/lib/regexPresets";
import type { RuleConfig } from "@/lib/regexRuleConfig";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        <SelectContent className="max-h-[300px]">
          {presetCategories.map((cat) => (
            <SelectGroup key={cat}>
              <SelectLabel className="text-xs text-muted-foreground">{cat}</SelectLabel>
              {presets.filter((p) => p.category === cat).map((p) => (
                <SelectItem key={p.name} value={p.name}>
                  <span className="text-sm">{p.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{p.description}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
