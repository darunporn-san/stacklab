import { useMemo } from "react";
import type { FormConfig } from "@/lib/formSchemaEngine";
import { generateErrorMessages } from "@/lib/i18nErrorEngine";
import { useTranslation } from "@/hooks/useI18n";

interface Props {
  config: FormConfig;
}

export function StepErrorMessages({ config }: Props) {
  const { t } = useTranslation();

  const messages = useMemo(() => {
    return config.fields.map(field => {
      const val = config.validations.find(v => v.fieldId === field.id);
      if (!val) return { field, en: {}, th: {} };
      const rules = {
        required: field.required,
        minLength: parseInt(val.ruleConfig.length.minLength) || undefined,
        maxLength: parseInt(val.ruleConfig.length.maxLength) || undefined,
        exactLength: parseInt(val.ruleConfig.length.exactLength) || undefined,
        mustIncludeNumber: val.ruleConfig.structural.mustIncludeNumber,
        mustIncludeUppercase: val.ruleConfig.structural.mustIncludeUppercase,
        mustIncludeLowercase: val.ruleConfig.structural.mustIncludeLowercase,
        mustIncludeSpecial: val.ruleConfig.structural.mustIncludeSpecial,
        thaiOnly: val.thaiOnly,
        englishOnly: val.englishOnly,
        noEmoji: val.ruleConfig.structural.noEmoji,
      };
      return {
        field,
        en: generateErrorMessages("en", field.label || field.name, rules),
        th: generateErrorMessages("th", field.label || field.name, rules),
      };
    });
  }, [config]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">
        {t("formWorkflow.errorMessages") || "Multi-language Error Messages"}
      </h3>

      {messages.map(({ field, en, th }) => {
        const enEntries = Object.entries(en);
        const thEntries = Object.entries(th);
        if (enEntries.length === 0) return null;

        return (
          <div key={field.id} className="rounded-lg border border-border bg-card p-4 space-y-2">
            <h4 className="text-xs font-semibold text-foreground">{field.label || field.name}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">🇺🇸 English</span>
                {enEntries.map(([key, msg]) => (
                  <div key={key} className="rounded bg-muted/50 px-2.5 py-1 text-xs text-foreground">
                    <span className="font-mono text-muted-foreground text-[10px]">{key}:</span>{" "}
                    {msg}
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">🇹🇭 ไทย</span>
                {thEntries.map(([key, msg]) => (
                  <div key={key} className="rounded bg-muted/50 px-2.5 py-1 text-xs text-foreground">
                    <span className="font-mono text-muted-foreground text-[10px]">{key}:</span>{" "}
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {messages.every(m => Object.keys(m.en).length === 0) && (
        <p className="text-xs text-muted-foreground italic">
          {t("formWorkflow.noMessages") || "No validation rules configured yet. Error messages will appear once you add rules in Step 2."}
        </p>
      )}
    </div>
  );
}
