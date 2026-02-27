import type { CharacterSetConfig as CharSetConfig } from "@/lib/regexRuleConfig";
import { buildCharacterClass } from "@/lib/regexGenerator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  config: CharSetConfig;
  onChange: (config: CharSetConfig) => void;
}

const options: { key: keyof Omit<CharSetConfig, "customChars">; label: string; hint: string }[] = [
  { key: "uppercaseLetters", label: "Uppercase Letters", hint: "A–Z" },
  { key: "lowercaseLetters", label: "Lowercase Letters", hint: "a–z" },
  { key: "numbers", label: "Numbers", hint: "0–9" },
  { key: "space", label: "Space", hint: "' '" },
  { key: "underscore", label: "Underscore", hint: "_" },
  { key: "dash", label: "Dash", hint: "-" },
  { key: "dot", label: "Dot", hint: "." },
];

export function CharacterSetSection({ config, onChange }: Props) {
  const toggle = (key: keyof Omit<CharSetConfig, "customChars">) => {
    onChange({ ...config, [key]: !config[key] });
  };

  const charClass = buildCharacterClass(config);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Allowed Characters</h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <label key={opt.key} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm cursor-pointer hover:bg-muted/50 transition-colors">
            <Checkbox checked={config[opt.key]} onCheckedChange={() => toggle(opt.key)} />
            <span className="text-foreground">{opt.label}</span>
            <span className="ml-auto font-mono text-xs text-muted-foreground">{opt.hint}</span>
          </label>
        ))}
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Custom Characters</Label>
        <Input
          value={config.customChars}
          onChange={(e) => onChange({ ...config, customChars: e.target.value })}
          placeholder="e.g. @#$"
          className="font-mono text-sm"
        />
      </div>
      <div className="rounded-md border border-border bg-code px-3 py-2 font-mono text-xs text-code-foreground">
        Character class: <span className="text-primary">{charClass}</span>
      </div>
    </div>
  );
}
