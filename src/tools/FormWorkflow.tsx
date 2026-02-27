import { useState } from "react";
import { FileText, Shield, Link2, Play, Globe, Download } from "lucide-react";
import { createDefaultFormConfig, createFieldValidation, type FormConfig } from "@/lib/formSchemaEngine";
import { StepDefineFields } from "@/components/formWorkflow/StepDefineFields";
import { StepFieldRules } from "@/components/formWorkflow/StepFieldRules";
import { StepCrossField } from "@/components/formWorkflow/StepCrossField";
import { StepSimulation } from "@/components/formWorkflow/StepSimulation";
import { StepErrorMessages } from "@/components/formWorkflow/StepErrorMessages";
import { StepExport } from "@/components/formWorkflow/StepExport";
import { useTranslation } from "@/hooks/useI18n";

const steps = [
  { key: 1, icon: FileText, labelKey: "formWorkflow.step1" as const, fallback: "Define Fields" },
  { key: 2, icon: Shield, labelKey: "formWorkflow.step2" as const, fallback: "Validation Rules" },
  { key: 3, icon: Link2, labelKey: "formWorkflow.step3" as const, fallback: "Cross-Field" },
  { key: 4, icon: Play, labelKey: "formWorkflow.step4" as const, fallback: "Simulate" },
  { key: 5, icon: Globe, labelKey: "formWorkflow.step5" as const, fallback: "Error Messages" },
  { key: 6, icon: Download, labelKey: "formWorkflow.step6" as const, fallback: "Export" },
];

export default function FormWorkflow() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<FormConfig>(createDefaultFormConfig());

  // Sync validations when fields change
  const handleFieldsChange = (fields: FormConfig["fields"]) => {
    const validations = fields.map(f => {
      const existing = config.validations.find(v => v.fieldId === f.id);
      return existing || createFieldValidation(f.id);
    });
    setConfig(prev => ({ ...prev, fields, validations }));
  };

  return (
    <div className="space-y-5">
      {/* Step Navigation */}
      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-secondary p-1">
        {steps.map(s => {
          const Icon = s.icon;
          const active = step === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setStep(s.key)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t(s.labelKey) || s.fallback}</span>
              <span className="sm:hidden">{s.key}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        {step === 1 && (
          <StepDefineFields fields={config.fields} onChange={handleFieldsChange} />
        )}
        {step === 2 && (
          <StepFieldRules
            fields={config.fields}
            validations={config.validations}
            onChange={v => setConfig(prev => ({ ...prev, validations: v }))}
          />
        )}
        {step === 3 && (
          <StepCrossField
            rules={config.crossFieldRules}
            fields={config.fields}
            onChange={r => setConfig(prev => ({ ...prev, crossFieldRules: r }))}
          />
        )}
        {step === 4 && <StepSimulation config={config} />}
        {step === 5 && <StepErrorMessages config={config} />}
        {step === 6 && (
          <StepExport config={config} onImport={setConfig} />
        )}
      </div>

      {/* Step Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
          className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← {t("formWorkflow.prev") || "Previous"}
        </button>
        <button
          onClick={() => setStep(s => Math.min(6, s + 1))}
          disabled={step === 6}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t("formWorkflow.next") || "Next"} →
        </button>
      </div>
    </div>
  );
}
