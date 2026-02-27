import { useState, useMemo } from "react";
import { Play, AlertTriangle, CheckCircle2, Zap, Bug, Shield, Smile } from "lucide-react";
import type { FormConfig } from "@/lib/formSchemaEngine";
import { validateField } from "@/lib/ruleMapper";
import { validateCrossFieldRules } from "@/lib/crossFieldEngine";
import { useTranslation } from "@/hooks/useI18n";

interface Props {
  config: FormConfig;
}

const testPresets = [
  { label: "Empty", icon: AlertTriangle, generate: () => "" },
  { label: "Emoji 😀", icon: Smile, generate: () => "test😀emoji🎉" },
  { label: "SQL Injection", icon: Bug, generate: () => "'; DROP TABLE users; --" },
  { label: "XSS", icon: Shield, generate: () => '<script>alert("xss")</script>' },
];

export function StepSimulation({ config }: Props) {
  const { t } = useTranslation();
  const [values, setValues] = useState<Record<string, string>>({});
  const [hasRun, setHasRun] = useState(false);

  const results = useMemo(() => {
    if (!hasRun) return null;
    const fieldResults = config.fields.map(field => {
      const val = config.validations.find(v => v.fieldId === field.id);
      if (!val) return { fieldId: field.id, valid: true, errors: [] };
      return validateField(field, val, values[field.id] || "");
    });
    const crossResults = validateCrossFieldRules(config.crossFieldRules, config.fields, values);
    return { fieldResults, crossResults };
  }, [values, hasRun, config]);

  const fillPreset = (gen: () => string) => {
    const filled: Record<string, string> = {};
    config.fields.forEach(f => { filled[f.id] = gen(); });
    setValues(filled);
    setHasRun(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          {t("formWorkflow.simulationPanel") || "Validation Simulation"}
        </h3>
        <div className="flex gap-1.5 flex-wrap">
          {testPresets.map(preset => (
            <button
              key={preset.label}
              onClick={() => fillPreset(preset.generate)}
              className="flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-muted transition-colors"
            >
              <preset.icon className="h-3 w-3" /> {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mock Form */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        {config.fields.map(field => (
          <div key={field.id} className="space-y-1">
            <label className="text-xs font-medium text-foreground">
              {field.label || field.name}
              {field.required && <span className="text-destructive ml-0.5">*</span>}
              <span className="ml-2 text-muted-foreground font-mono text-[10px]">{field.type}</span>
            </label>
            <input
              value={values[field.id] || ""}
              onChange={e => {
                setValues(prev => ({ ...prev, [field.id]: e.target.value }));
                if (!hasRun) setHasRun(true);
              }}
              placeholder={field.defaultValue || `Enter ${field.label || field.name}...`}
              className={`w-full rounded-md border px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
                hasRun && results?.fieldResults.find(r => r.fieldId === field.id)?.valid === false
                  ? "border-destructive bg-destructive/5"
                  : hasRun && results?.fieldResults.find(r => r.fieldId === field.id)?.valid
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-border bg-background"
              }`}
            />
            {/* Errors */}
            {hasRun && results?.fieldResults
              .find(r => r.fieldId === field.id)
              ?.errors.map((err, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-destructive">
                  <AlertTriangle className="h-3 w-3 shrink-0" /> {err}
                </div>
              ))}
            {hasRun && results?.fieldResults.find(r => r.fieldId === field.id)?.valid && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                <CheckCircle2 className="h-3 w-3" /> Valid
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cross-field results */}
      {hasRun && results?.crossResults && results.crossResults.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-3 space-y-1.5">
          <h4 className="text-xs font-semibold text-muted-foreground">Cross-Field Results</h4>
          {results.crossResults.map(r => (
            <div key={r.ruleId} className={`flex items-center gap-1.5 text-xs ${r.valid ? "text-emerald-600" : "text-destructive"}`}>
              {r.valid ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              {r.valid ? "Pass" : r.message}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setHasRun(true)}
        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <Zap className="h-4 w-4" /> {t("formWorkflow.runValidation") || "Run Validation"}
      </button>
    </div>
  );
}
