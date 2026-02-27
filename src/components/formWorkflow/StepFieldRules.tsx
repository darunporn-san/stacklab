import { useState } from "react";
import type { FormField, FieldValidation } from "@/lib/formSchemaEngine";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "@/hooks/useI18n";

interface Props {
  fields: FormField[];
  validations: FieldValidation[];
  onChange: (validations: FieldValidation[]) => void;
}

export function StepFieldRules({ fields, validations, onChange }: Props) {
  const { t } = useTranslation();
  const [expandedField, setExpandedField] = useState<string | null>(fields[0]?.id || null);

  const updateValidation = (fieldId: string, patch: Partial<FieldValidation>) => {
    onChange(validations.map(v => v.fieldId === fieldId ? { ...v, ...patch } : v));
  };

  const updateRuleConfig = (fieldId: string, path: string, value: any) => {
    onChange(validations.map(v => {
      if (v.fieldId !== fieldId) return v;
      const config = { ...v.ruleConfig };
      if (path.startsWith("length.")) {
        config.length = { ...config.length, [path.split(".")[1]]: value };
      } else if (path.startsWith("structural.")) {
        config.structural = { ...config.structural, [path.split(".")[1]]: value };
      }
      return { ...v, ruleConfig: config };
    }));
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">
        {t("formWorkflow.validationRules") || "Validation Rules"}
      </h3>

      {fields.map(field => {
        const val = validations.find(v => v.fieldId === field.id);
        if (!val) return null;
        const isExpanded = expandedField === field.id;
        const s = val.ruleConfig.structural;
        const l = val.ruleConfig.length;

        return (
          <div key={field.id} className="rounded-lg border border-border bg-card overflow-hidden">
            <button
              onClick={() => setExpandedField(isExpanded ? null : field.id)}
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              <span>{field.label || field.name} <span className="text-xs text-muted-foreground font-mono">({field.type})</span></span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-4 border-t border-border pt-3">
                {/* Length */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                    {t("ruleBuilder.lengthConstraints") || "Length Constraints"}
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">{t("ruleBuilder.minLength") || "Min"}</label>
                      <input value={l.minLength} onChange={e => updateRuleConfig(field.id, "length.minLength", e.target.value)} className="w-full rounded border border-border bg-background px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ring" placeholder="0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">{t("ruleBuilder.maxLength") || "Max"}</label>
                      <input value={l.maxLength} onChange={e => updateRuleConfig(field.id, "length.maxLength", e.target.value)} className="w-full rounded border border-border bg-background px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ring" placeholder="0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">{t("ruleBuilder.exactLength") || "Exact"}</label>
                      <input value={l.exactLength} onChange={e => updateRuleConfig(field.id, "length.exactLength", e.target.value)} className="w-full rounded border border-border bg-background px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ring" placeholder="0" />
                    </div>
                  </div>
                </div>

                {/* Must include */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                    {t("ruleBuilder.mustInclude") || "🔹 Must Include"}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      ["mustIncludeUppercase", t("ruleBuilder.atLeastOneUppercase") || "Uppercase"],
                      ["mustIncludeLowercase", t("ruleBuilder.atLeastOneLowercase") || "Lowercase"],
                      ["mustIncludeNumber", t("ruleBuilder.atLeastOneNumber") || "Number"],
                      ["mustIncludeSpecial", t("ruleBuilder.atLeastOneSpecial") || "Special char"],
                    ] as const).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 text-xs cursor-pointer">
                        <input type="checkbox" checked={(s as any)[key]} onChange={e => updateRuleConfig(field.id, `structural.${key}`, e.target.checked)} className="rounded border-border" />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                    {t("formWorkflow.languageRestriction") || "Language Restriction"}
                  </h4>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input type="checkbox" checked={val.thaiOnly} onChange={e => updateValidation(field.id, { thaiOnly: e.target.checked, englishOnly: false })} className="rounded border-border" />
                      {t("formWorkflow.thaiOnly") || "Thai Only"}
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input type="checkbox" checked={val.englishOnly} onChange={e => updateValidation(field.id, { englishOnly: e.target.checked, thaiOnly: false })} className="rounded border-border" />
                      {t("formWorkflow.englishOnly") || "English Only"}
                    </label>
                  </div>
                </div>

                {/* Custom regex */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Custom Regex</label>
                  <input
                    value={val.customRegex}
                    onChange={e => updateValidation(field.id, { customRegex: e.target.value })}
                    placeholder="^[a-z]+$"
                    className="w-full rounded border border-border bg-code px-2 py-1 text-xs font-mono text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                {/* Enum */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    {t("formWorkflow.enumValues") || "Enum Values"} <span className="text-muted-foreground font-normal">(comma-separated)</span>
                  </label>
                  <input
                    value={val.enumValues}
                    onChange={e => updateValidation(field.id, { enumValues: e.target.value })}
                    placeholder="admin, user, editor"
                    className="w-full rounded border border-border bg-background px-2 py-1 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                {/* Exclusion */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                    {t("ruleBuilder.exclusionConstraints") || "🔸 Constraints"}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      ["noConsecutiveSpaces", t("ruleBuilder.noConsecutiveSpaces") || "No consecutive spaces"],
                      ["noEmoji", t("ruleBuilder.noEmoji") || "No emoji"],
                      ["noNonAscii", t("ruleBuilder.asciiOnly") || "ASCII only"],
                      ["noConsecutiveIdentical", t("ruleBuilder.noConsecutiveIdentical") || "No repeats"],
                    ] as const).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 text-xs cursor-pointer">
                        <input type="checkbox" checked={(s as any)[key]} onChange={e => updateRuleConfig(field.id, `structural.${key}`, e.target.checked)} className="rounded border-border" />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
