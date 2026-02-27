import type { CharacterSetConfig as CharSetConfig } from "@/lib/regexRuleConfig";
import { buildCharacterClass } from "@/lib/regexGenerator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
  config: CharSetConfig;
  onChange: (config: CharSetConfig) => void;
}

type BoolKey = "uppercaseLetters" | "lowercaseLetters" | "thaiChars" | "unicodeLetters" |
  "numbers" | "decimalPoint" | "negativeSign" |
  "basicSymbols" | "brackets" | "slashPunctuation" | "currencySymbols" | "urlSafeChars" |
  "underscore" | "dash" | "dot";

interface OptGroup {
  title: string;
  items: { key: BoolKey; label: string; hint: string }[];
}

const groups: OptGroup[] = [
  { title: "🔤 Alphabet", items: [
    { key: "uppercaseLetters", label: "Uppercase", hint: "A–Z" },
    { key: "lowercaseLetters", label: "Lowercase", hint: "a–z" },
    { key: "thaiChars", label: "Thai Characters", hint: "ก–ฮ" },
    { key: "unicodeLetters", label: "Unicode Letters", hint: "\\p{L}" },
  ]},
  { title: "🔢 Numbers", items: [
    { key: "numbers", label: "Digits", hint: "0–9" },
    { key: "decimalPoint", label: "Decimal Point", hint: "." },
    { key: "negativeSign", label: "Negative Sign", hint: "-" },
  ]},
  { title: "🔣 Special Characters", items: [
    { key: "basicSymbols", label: "Basic Symbols", hint: "!@#$%^&*()" },
    { key: "brackets", label: "Brackets", hint: "{}[]()" },
    { key: "slashPunctuation", label: "Slash & Punctuation", hint: "/\\|:;\"'<>" },
    { key: "currencySymbols", label: "Currency", hint: "$€£¥฿₹" },
    { key: "urlSafeChars", label: "URL Safe", hint: "_.~" },
    { key: "underscore", label: "Underscore", hint: "_" },
    { key: "dash", label: "Dash", hint: "-" },
    { key: "dot", label: "Dot", hint: "." },
  ]},
];

export function CharacterSetSection({ config, onChange }: Props) {
  const [open, setOpen] = useState(true);
  const toggle = (key: BoolKey) => onChange({ ...config, [key]: !config[key] });
  const charClass = buildCharacterClass(config);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
        <h3 className="text-sm font-semibold text-foreground">Allowed Characters</h3>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-2">
        {groups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">{group.title}</span>
            <div className="grid grid-cols-2 gap-1.5">
              {group.items.map((opt) => (
                <label key={opt.key} className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs cursor-pointer hover:bg-muted/50 transition-colors">
                  <Checkbox checked={!!config[opt.key]} onCheckedChange={() => toggle(opt.key)} />
                  <span className="text-foreground">{opt.label}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">{opt.hint}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Space Control */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Space Control</span>
          <Select value={config.spaceMode} onValueChange={(v) => onChange({ ...config, spaceMode: v as CharSetConfig["spaceMode"], space: v !== "none" })}>
            <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No spaces allowed</SelectItem>
              <SelectItem value="normal">Normal spaces</SelectItem>
              <SelectItem value="single">Single spaces only</SelectItem>
              <SelectItem value="multiple">Multiple spaces</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Custom Characters</Label>
          <Input value={config.customChars} onChange={(e) => onChange({ ...config, customChars: e.target.value })} placeholder="e.g. @#$" className="font-mono text-sm" />
        </div>

        {/* Preview */}
        <div className="rounded-md border border-border bg-code px-3 py-2 font-mono text-xs text-code-foreground">
          Character class: <span className="text-primary break-all">{charClass}</span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
