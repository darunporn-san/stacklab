import type { StructuralRules, StartEndOption } from "@/lib/regexRuleConfig";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/useI18n";

interface Props {
  config: StructuralRules;
  onChange: (config: StructuralRules) => void;
}

const startEndOptionKeys: { value: StartEndOption; labelKey: string }[] = [
  { value: "uppercase", labelKey: "ruleBuilder.uppercaseLetter" },
  { value: "lowercase", labelKey: "ruleBuilder.lowercaseLetter" },
  { value: "letter", labelKey: "ruleBuilder.anyLetter" },
  { value: "number", labelKey: "ruleBuilder.number" },
  { value: "custom", labelKey: "ruleBuilder.custom" },
];

interface RuleItem { key: keyof StructuralRules; labelKey: string }

const inclusionRuleKeys: RuleItem[] = [
  { key: "mustIncludeNumber", labelKey: "ruleBuilder.atLeastOneNumber" },
  { key: "mustIncludeUppercase", labelKey: "ruleBuilder.atLeastOneUppercase" },
  { key: "mustIncludeLowercase", labelKey: "ruleBuilder.atLeastOneLowercase" },
  { key: "mustIncludeSpecial", labelKey: "ruleBuilder.atLeastOneSpecial" },
];

const exclusionRuleKeys: RuleItem[] = [
  { key: "noConsecutiveSpaces", labelKey: "ruleBuilder.noConsecutiveSpaces" },
  { key: "noConsecutiveSpecials", labelKey: "ruleBuilder.noConsecutiveSpecials" },
  { key: "noConsecutiveIdentical", labelKey: "ruleBuilder.noConsecutiveIdentical" },
  { key: "noMultipleDashes", labelKey: "ruleBuilder.noMultipleDashes" },
  { key: "noLeadingTrailingSpaces", labelKey: "ruleBuilder.noLeadingTrailing" },
  { key: "mustNotEndWithSpace", labelKey: "ruleBuilder.mustNotEndSpace" },
  { key: "mustNotEndWithSpecial", labelKey: "ruleBuilder.mustNotEndSpecial" },
  { key: "noSpecialChars", labelKey: "ruleBuilder.noSpecialChars" },
  { key: "noEmoji", labelKey: "ruleBuilder.noEmoji" },
  { key: "noNonAscii", labelKey: "ruleBuilder.asciiOnly" },
  { key: "onlyOneDash", labelKey: "ruleBuilder.onlyOneDash" },
];

export function StructuralRulesSection({ config, onChange }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const update = (patch: Partial<StructuralRules>) => onChange({ ...config, ...patch });

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
        <h3 className="text-sm font-semibold text-foreground">{t("ruleBuilder.structureRules")}</h3>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-2">
        {/* Start / End */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">{t("ruleBuilder.mustStartWith")}</label>
            <Select value={config.mustStartWith || "none"} onValueChange={(v) => update({ mustStartWith: v === "none" ? null : v as StartEndOption })}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("ruleBuilder.noRestriction")}</SelectItem>
                {startEndOptionKeys.map((o) => <SelectItem key={o.value} value={o.value}>{t(o.labelKey)}</SelectItem>)}
              </SelectContent>
            </Select>
            {config.mustStartWith === "custom" && (
              <Input value={config.mustStartWithCustom} onChange={(e) => update({ mustStartWithCustom: e.target.value })} placeholder="Character(s)" className="font-mono text-xs" />
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">{t("ruleBuilder.mustNotStartWith")}</label>
            <Input value={config.mustNotStartWith} onChange={(e) => update({ mustNotStartWith: e.target.value })} placeholder="Character(s)" className="font-mono text-xs" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">{t("ruleBuilder.mustEndWith")}</label>
            <Select value={config.mustEndWith || "none"} onValueChange={(v) => update({ mustEndWith: v === "none" ? null : v as StartEndOption })}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("ruleBuilder.noRestriction")}</SelectItem>
                {startEndOptionKeys.map((o) => <SelectItem key={o.value} value={o.value}>{t(o.labelKey)}</SelectItem>)}
              </SelectContent>
            </Select>
            {config.mustEndWith === "custom" && (
              <Input value={config.mustEndWithCustom} onChange={(e) => update({ mustEndWithCustom: e.target.value })} placeholder="Character(s)" className="font-mono text-xs" />
            )}
          </div>
        </div>

        {/* Inclusion */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">{t("ruleBuilder.mustInclude")}</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {inclusionRuleKeys.map((rule) => (
              <label key={rule.key} className="flex items-center gap-2 rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-muted/50 transition-colors">
                <Checkbox checked={config[rule.key] as boolean} onCheckedChange={() => update({ [rule.key]: !config[rule.key] })} />
                <span className="text-foreground">{t(rule.labelKey)}</span>
              </label>
            ))}
          </div>
          <Input value={config.mustIncludeSubstring} onChange={(e) => update({ mustIncludeSubstring: e.target.value })} placeholder={t("ruleBuilder.mustIncludeSubstring")} className="font-mono text-xs" />
        </div>

        {/* Exclusion */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">{t("ruleBuilder.exclusionConstraints")}</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {exclusionRuleKeys.map((rule) => (
              <label key={rule.key} className="flex items-center gap-2 rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-muted/50 transition-colors">
                <Checkbox checked={config[rule.key] as boolean} onCheckedChange={() => update({ [rule.key]: !config[rule.key] })} />
                <span className="text-foreground">{t(rule.labelKey)}</span>
              </label>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input value={config.excludeChars} onChange={(e) => update({ excludeChars: e.target.value })} placeholder={t("ruleBuilder.excludeChars")} className="font-mono text-xs" />
            <Input value={config.excludeWord} onChange={(e) => update({ excludeWord: e.target.value })} placeholder={t("ruleBuilder.excludeWord")} className="font-mono text-xs" />
            <Input value={config.maxRepeatChars} onChange={(e) => update({ maxRepeatChars: e.target.value.replace(/\D/g, "") })} placeholder={t("ruleBuilder.maxRepeat")} className="font-mono text-xs" />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
