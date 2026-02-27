import type { StructuralRules, StartEndOption } from "@/lib/regexRuleConfig";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

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

interface RuleItem { key: keyof StructuralRules; label: string }

const inclusionRules: RuleItem[] = [
  { key: "mustIncludeNumber", label: "At least one number" },
  { key: "mustIncludeUppercase", label: "At least one uppercase" },
  { key: "mustIncludeLowercase", label: "At least one lowercase" },
  { key: "mustIncludeSpecial", label: "At least one special character" },
];

const exclusionRules: RuleItem[] = [
  { key: "noConsecutiveSpaces", label: "No consecutive spaces" },
  { key: "noConsecutiveSpecials", label: "No consecutive special chars" },
  { key: "noConsecutiveIdentical", label: "No consecutive identical chars" },
  { key: "noMultipleDashes", label: "No multiple dashes" },
  { key: "noLeadingTrailingSpaces", label: "No leading/trailing spaces" },
  { key: "mustNotEndWithSpace", label: "Must not end with space" },
  { key: "mustNotEndWithSpecial", label: "Must not end with special char" },
  { key: "noSpecialChars", label: "No special characters at all" },
  { key: "noEmoji", label: "No emoji" },
  { key: "noNonAscii", label: "ASCII only (no non-ASCII)" },
  { key: "onlyOneDash", label: "Only one dash allowed" },
];

export function StructuralRulesSection({ config, onChange }: Props) {
  const [open, setOpen] = useState(true);
  const update = (patch: Partial<StructuralRules>) => onChange({ ...config, ...patch });

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
        <h3 className="text-sm font-semibold text-foreground">Structure Rules</h3>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-2">
        {/* Start / End */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Must start with</label>
            <Select value={config.mustStartWith || "none"} onValueChange={(v) => update({ mustStartWith: v === "none" ? null : v as StartEndOption })}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No restriction</SelectItem>
                {startEndOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {config.mustStartWith === "custom" && (
              <Input value={config.mustStartWithCustom} onChange={(e) => update({ mustStartWithCustom: e.target.value })} placeholder="Character(s)" className="font-mono text-xs" />
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Must not start with</label>
            <Input value={config.mustNotStartWith} onChange={(e) => update({ mustNotStartWith: e.target.value })} placeholder="Character(s)" className="font-mono text-xs" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Must end with</label>
            <Select value={config.mustEndWith || "none"} onValueChange={(v) => update({ mustEndWith: v === "none" ? null : v as StartEndOption })}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No restriction</SelectItem>
                {startEndOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {config.mustEndWith === "custom" && (
              <Input value={config.mustEndWithCustom} onChange={(e) => update({ mustEndWithCustom: e.target.value })} placeholder="Character(s)" className="font-mono text-xs" />
            )}
          </div>
        </div>

        {/* Inclusion */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">🔹 Must Include</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {inclusionRules.map((rule) => (
              <label key={rule.key} className="flex items-center gap-2 rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-muted/50 transition-colors">
                <Checkbox checked={config[rule.key] as boolean} onCheckedChange={() => update({ [rule.key]: !config[rule.key] })} />
                <span className="text-foreground">{rule.label}</span>
              </label>
            ))}
          </div>
          <Input value={config.mustIncludeSubstring} onChange={(e) => update({ mustIncludeSubstring: e.target.value })} placeholder="Must include substring..." className="font-mono text-xs" />
        </div>

        {/* Exclusion */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">🔸 Exclusion & Constraints</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {exclusionRules.map((rule) => (
              <label key={rule.key} className="flex items-center gap-2 rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-muted/50 transition-colors">
                <Checkbox checked={config[rule.key] as boolean} onCheckedChange={() => update({ [rule.key]: !config[rule.key] })} />
                <span className="text-foreground">{rule.label}</span>
              </label>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input value={config.excludeChars} onChange={(e) => update({ excludeChars: e.target.value })} placeholder="Exclude characters..." className="font-mono text-xs" />
            <Input value={config.excludeWord} onChange={(e) => update({ excludeWord: e.target.value })} placeholder="Exclude word..." className="font-mono text-xs" />
            <Input value={config.maxRepeatChars} onChange={(e) => update({ maxRepeatChars: e.target.value.replace(/\D/g, "") })} placeholder="Max repeat (e.g. 2)" className="font-mono text-xs" />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
