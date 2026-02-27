import { Plus, Trash2 } from "lucide-react";
import type { CrossFieldRule, FormField } from "@/lib/formSchemaEngine";
import { createCrossFieldRule } from "@/lib/formSchemaEngine";
import { useTranslation } from "@/hooks/useI18n";

interface Props {
  rules: CrossFieldRule[];
  fields: FormField[];
  onChange: (rules: CrossFieldRule[]) => void;
}

const ruleTypes = [
  { value: "match", label: "Must match (confirm)" },
  { value: "lessThan", label: "Must be less than" },
  { value: "requiredIf", label: "Required if" },
  { value: "atLeastOne", label: "At least one in group" },
] as const;

export function StepCrossField({ rules, fields, onChange }: Props) {
  const { t } = useTranslation();

  const addRule = () => onChange([...rules, createCrossFieldRule()]);
  const removeRule = (id: string) => onChange(rules.filter(r => r.id !== id));
  const updateRule = (id: string, patch: Partial<CrossFieldRule>) =>
    onChange(rules.map(r => r.id === id ? { ...r, ...patch } : r));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {t("formWorkflow.crossFieldValidation") || "Cross-Field Validation"}
        </h3>
        <button onClick={addRule} className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" /> {t("formWorkflow.addRule") || "Add Rule"}
        </button>
      </div>

      {rules.length === 0 && (
        <p className="text-xs text-muted-foreground italic">
          {t("formWorkflow.noCrossFieldRules") || "No cross-field rules yet. Add one to create dependencies between fields."}
        </p>
      )}

      {rules.map(rule => (
        <div key={rule.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <select
              value={rule.type}
              onChange={e => updateRule(rule.id, { type: e.target.value as CrossFieldRule["type"] })}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {ruleTypes.map(rt => (
                <option key={rt.value} value={rt.value}>{rt.label}</option>
              ))}
            </select>
            <div className="flex-1" />
            <button onClick={() => removeRule(rule.id)} className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {rule.type === "atLeastOne" ? (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Select fields in group:</label>
              <div className="flex flex-wrap gap-2">
                {fields.map(f => (
                  <label key={f.id} className="flex items-center gap-1.5 text-xs cursor-pointer rounded-md border border-border px-2 py-1 hover:bg-muted/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={rule.group.includes(f.id)}
                      onChange={e => {
                        const group = e.target.checked
                          ? [...rule.group, f.id]
                          : rule.group.filter(id => id !== f.id);
                        updateRule(rule.id, { group });
                      }}
                      className="rounded border-border"
                    />
                    {f.label || f.name}
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Field A</label>
                <select
                  value={rule.fieldA}
                  onChange={e => updateRule(rule.id, { fieldA: e.target.value })}
                  className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Select...</option>
                  {fields.map(f => (
                    <option key={f.id} value={f.id}>{f.label || f.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end justify-center text-xs text-muted-foreground font-medium pb-2">
                {rule.type === "match" ? "must equal" : rule.type === "lessThan" ? "< less than" : "triggers →"}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">
                  {rule.type === "requiredIf" ? "Required Field" : "Field B"}
                </label>
                <select
                  value={rule.fieldB}
                  onChange={e => updateRule(rule.id, { fieldB: e.target.value })}
                  className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Select...</option>
                  {fields.map(f => (
                    <option key={f.id} value={f.id}>{f.label || f.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {rule.type === "requiredIf" && (
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">When value equals (leave empty = any value)</label>
              <input
                value={rule.value}
                onChange={e => updateRule(rule.id, { value: e.target.value })}
                placeholder="e.g. true, yes, checked"
                className="w-full rounded border border-border bg-background px-2 py-1 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
