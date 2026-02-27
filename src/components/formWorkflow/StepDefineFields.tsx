import { Plus, Trash2, GripVertical } from "lucide-react";
import type { FormField, FieldType } from "@/lib/formSchemaEngine";
import { createField, fieldTypes } from "@/lib/formSchemaEngine";
import { useTranslation } from "@/hooks/useI18n";

interface Props {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

export function StepDefineFields({ fields, onChange }: Props) {
  const { t } = useTranslation();

  const addField = () => onChange([...fields, createField()]);
  const removeField = (id: string) => onChange(fields.filter(f => f.id !== id));
  const updateField = (id: string, patch: Partial<FormField>) =>
    onChange(fields.map(f => f.id === id ? { ...f, ...patch } : f));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {t("formWorkflow.defineFields") || "Define Fields"}
        </h3>
        <button
          onClick={addField}
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> {t("formWorkflow.addField") || "Add Field"}
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field, idx) => (
          <div key={field.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-xs font-mono text-muted-foreground">#{idx + 1}</span>
              <div className="flex-1" />
              <button
                onClick={() => removeField(field.id)}
                className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                disabled={fields.length <= 1}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  {t("formWorkflow.fieldName") || "Field Name"}
                </label>
                <input
                  value={field.name}
                  onChange={e => updateField(field.id, { name: e.target.value })}
                  placeholder="field_name"
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  {t("formWorkflow.label") || "Label"}
                </label>
                <input
                  value={field.label}
                  onChange={e => updateField(field.id, { label: e.target.value })}
                  placeholder="Display Label"
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  {t("formWorkflow.type") || "Type"}
                </label>
                <select
                  value={field.type}
                  onChange={e => updateField(field.id, { type: e.target.value as FieldType })}
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {fieldTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  {t("formWorkflow.defaultValue") || "Default Value"}
                </label>
                <input
                  value={field.defaultValue}
                  onChange={e => updateField(field.id, { defaultValue: e.target.value })}
                  placeholder="Optional"
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={field.required}
                onChange={e => updateField(field.id, { required: e.target.checked })}
                className="rounded border-border"
              />
              <span className="text-xs font-medium text-foreground">
                {t("formWorkflow.required") || "Required"}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
