import { useState } from "react";
import type { PatternSegment, SegmentType } from "@/lib/regexRuleConfig";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useTranslation } from "@/hooks/useI18n";

interface Props {
  segments: PatternSegment[];
  useSegments: boolean;
  onToggle: (v: boolean) => void;
  onChange: (segments: PatternSegment[]) => void;
}

const segmentTypeKeys: { value: SegmentType; labelKey: string }[] = [
  { value: "uppercase", labelKey: "ruleBuilder.uppercaseLetters" },
  { value: "lowercase", labelKey: "ruleBuilder.lowercaseLetters" },
  { value: "letters", labelKey: "ruleBuilder.anyLetters" },
  { value: "digits", labelKey: "ruleBuilder.digits" },
  { value: "alphanumeric", labelKey: "ruleBuilder.alphanumeric" },
  { value: "any", labelKey: "ruleBuilder.anyCharacter" },
  { value: "literal", labelKey: "ruleBuilder.literalString" },
  { value: "optional", labelKey: "ruleBuilder.optionalLiteral" },
];

export function PatternSegmentsSection({ segments, useSegments, onToggle, onChange }: Props) {
  const { t } = useTranslation();
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const addSegment = () => {
    onChange([...segments, { id: crypto.randomUUID(), type: "uppercase", value: "1" }]);
  };

  const removeSegment = (id: string) => onChange(segments.filter((s) => s.id !== id));
  const updateSegment = (id: string, patch: Partial<PatternSegment>) => onChange(segments.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newSegs = [...segments];
    const [moved] = newSegs.splice(dragIdx, 1);
    newSegs.splice(idx, 0, moved);
    onChange(newSegs);
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{t("ruleBuilder.patternBlocks")}</h3>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">{t("ruleBuilder.structuredMode")}</Label>
          <Switch checked={useSegments} onCheckedChange={onToggle} />
        </div>
      </div>

      {useSegments && (
        <div className="space-y-2">
          {segments.map((seg, idx) => (
            <div
              key={seg.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 transition-colors ${dragIdx === idx ? "opacity-50" : ""}`}
            >
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
              <span className="text-xs text-muted-foreground w-4 shrink-0">{idx + 1}</span>
              <Select value={seg.type} onValueChange={(v) => updateSegment(seg.id, { type: v as SegmentType })}>
                <SelectTrigger className="text-xs flex-1 min-w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {segmentTypeKeys.map((st) => <SelectItem key={st.value} value={st.value}>{t(st.labelKey)}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input
                value={seg.value}
                onChange={(e) => updateSegment(seg.id, { value: e.target.value })}
                placeholder={seg.type === "literal" || seg.type === "optional" ? "text" : "count"}
                className="w-16 font-mono text-xs"
              />
              <label className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
                <Checkbox checked={!!seg.optional} onCheckedChange={(v) => updateSegment(seg.id, { optional: !!v })} />
                Opt
              </label>
              <button onClick={() => removeSegment(seg.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button onClick={addSegment} className="flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors w-full justify-center">
            <Plus className="h-3.5 w-3.5" /> {t("ruleBuilder.addSegment")}
          </button>
        </div>
      )}
    </div>
  );
}
