import type { StructuralRules, StartEndOption } from "@/lib/regexRuleConfig";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Props {
  config: StructuralRules;
  onChange: (config: StructuralRules) => void;
}

const startEndOptions: { value: StartEndOption; label: string }[] = [
  { value: "uppercase", label: "Uppercase letter" },
  { value: "lowercase", label: "Lowercase letter" },
  { value: "letter", label: "Any letter" },
  { value: "number", label: "Number" },
  { value: "custom", label: "Custom" },
];

const booleanRules: { key: keyof StructuralRules; label: string }[] = [
  { key: "noConsecutiveSpaces", label: "No consecutive spaces" },
  { key: "noConsecutiveSpecials", label: "No consecutive special characters" },
  { key: "noLeadingTrailingSpaces", label: "No leading/trailing spaces" },
  { key: "noSpecialChars", label: "No special characters" },
  { key: "onlyOneDash", label: "Only one dash allowed" },
  { key: "mustIncludeNumber", label: "Must include at least one number" },
  { key: "mustIncludeUppercase", label: "Must include at least one uppercase" },
  { key: "mustIncludeLowercase", label: "Must include at least one lowercase" },
];

export function StructuralRulesSection({ config, onChange }: Props) {
  const update = (patch: Partial<StructuralRules>) => onChange({ ...config, ...patch });

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Structure Rules</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Must start with</label>
          <Select
            value={config.mustStartWith || "none"}
            onValueChange={(v) => update({ mustStartWith: v === "none" ? null : v as StartEndOption })}
          >
            <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No restriction</SelectItem>
              {startEndOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {config.mustStartWith === "custom" && (
            <Input value={config.mustStartWithCustom} onChange={(e) => update({ mustStartWithCustom: e.target.value })} placeholder="Character(s)" className="font-mono text-sm" />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Must end with</label>
          <Select
            value={config.mustEndWith || "none"}
            onValueChange={(v) => update({ mustEndWith: v === "none" ? null : v as StartEndOption })}
          >
            <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No restriction</SelectItem>
              {startEndOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {config.mustEndWith === "custom" && (
            <Input value={config.mustEndWithCustom} onChange={(e) => update({ mustEndWithCustom: e.target.value })} placeholder="Character(s)" className="font-mono text-sm" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {booleanRules.map((rule) => (
          <label key={rule.key} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-muted/50 transition-colors">
            <Checkbox
              checked={config[rule.key] as boolean}
              onCheckedChange={() => update({ [rule.key]: !config[rule.key] })}
            />
            <span className="text-foreground">{rule.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
