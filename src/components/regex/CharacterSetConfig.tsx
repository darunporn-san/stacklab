import type { CharacterSetConfig as CharSetConfig } from "@/lib/regexRuleConfig";
import { buildCharacterClass } from "@/lib/regexGenerator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/useI18n";

interface Props {
  config: CharSetConfig;
  onChange: (config: CharSetConfig) => void;
}

type BoolKey = "uppercaseLetters" | "lowercaseLetters" | "thaiChars" | "unicodeLetters" |
  "numbers" | "decimalPoint" | "negativeSign" |
  "basicSymbols" | "brackets" | "slashPunctuation" | "currencySymbols" | "urlSafeChars" |
  "underscore" | "dash" | "dot";

interface OptGroup {
  titleKey: string;
  items: { key: BoolKey; labelKey: string; hint: string }[];
}

const groups: OptGroup[] = [
  { titleKey: "ruleBuilder.alphabet", items: [
    { key: "uppercaseLetters", labelKey: "ruleBuilder.uppercase", hint: "A–Z" },
    { key: "lowercaseLetters", labelKey: "ruleBuilder.lowercase", hint: "a–z" },
    { key: "thaiChars", labelKey: "ruleBuilder.thaiChars", hint: "ก–ฮ" },
    { key: "unicodeLetters", labelKey: "ruleBuilder.unicodeLetters", hint: "\\p{L}" },
  ]},
  { titleKey: "ruleBuilder.numbers", items: [
    { key: "numbers", labelKey: "ruleBuilder.digits", hint: "0–9" },
    { key: "decimalPoint", labelKey: "ruleBuilder.decimalPoint", hint: "." },
    { key: "negativeSign", labelKey: "ruleBuilder.negativeSign", hint: "-" },
  ]},
  { titleKey: "ruleBuilder.specialChars", items: [
    { key: "basicSymbols", labelKey: "ruleBuilder.basicSymbols", hint: "!@#$%^&*()" },
    { key: "brackets", labelKey: "ruleBuilder.brackets", hint: "{}[]()" },
    { key: "slashPunctuation", labelKey: "ruleBuilder.slashPunctuation", hint: "/\\|:;\"'<>" },
    { key: "currencySymbols", labelKey: "ruleBuilder.currency", hint: "$€£¥฿₹" },
    { key: "urlSafeChars", labelKey: "ruleBuilder.urlSafe", hint: "_.~" },
    { key: "underscore", labelKey: "ruleBuilder.underscore", hint: "_" },
    { key: "dash", labelKey: "ruleBuilder.dash", hint: "-" },
    { key: "dot", labelKey: "ruleBuilder.dot", hint: "." },
  ]},
];

export function CharacterSetSection({ config, onChange }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const toggle = (key: BoolKey) => onChange({ ...config, [key]: !config[key] });
  const charClass = buildCharacterClass(config);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
        <h3 className="text-sm font-semibold text-foreground">{t("ruleBuilder.allowedChars")}</h3>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-2">
        {groups.map((group) => (
          <div key={group.titleKey} className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">{t(group.titleKey)}</span>
            <div className="grid grid-cols-2 gap-1.5">
              {group.items.map((opt) => (
                <label key={opt.key} className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs cursor-pointer hover:bg-muted/50 transition-colors">
                  <Checkbox checked={!!config[opt.key]} onCheckedChange={() => toggle(opt.key)} />
                  <span className="text-foreground">{t(opt.labelKey)}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">{opt.hint}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Space Control */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">{t("ruleBuilder.spaceControl")}</span>
          <Select value={config.spaceMode} onValueChange={(v) => onChange({ ...config, spaceMode: v as CharSetConfig["spaceMode"], space: v !== "none" })}>
            <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t("ruleBuilder.noSpaces")}</SelectItem>
              <SelectItem value="normal">{t("ruleBuilder.normalSpaces")}</SelectItem>
              <SelectItem value="single">{t("ruleBuilder.singleSpaces")}</SelectItem>
              <SelectItem value="multiple">{t("ruleBuilder.multipleSpaces")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">{t("ruleBuilder.customChars")}</Label>
          <Input value={config.customChars} onChange={(e) => onChange({ ...config, customChars: e.target.value })} placeholder="e.g. @#$" className="font-mono text-sm" />
        </div>

        {/* Preview */}
        <div className="rounded-md border border-border bg-code px-3 py-2 font-mono text-xs text-code-foreground">
          {t("ruleBuilder.charClass")}: <span className="text-primary break-all">{charClass}</span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
