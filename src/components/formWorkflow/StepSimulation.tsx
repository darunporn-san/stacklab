import { useState, useMemo } from "react";
import { AlertTriangle, CheckCircle2, Zap, Bug, Shield, Smile, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import type { FormConfig, FormField, FieldValidation } from "@/lib/formSchemaEngine";
import { validateField } from "@/lib/ruleMapper";
import { validateCrossFieldRules } from "@/lib/crossFieldEngine";
import { useTranslation } from "@/hooks/useI18n";

interface Props {
  config: FormConfig;
}

// ── Smart example generators ──

function generateValidValue(field: FormField, val: FieldValidation): string {
  const min = parseInt(val.ruleConfig.length.minLength) || 0;
  const s = val.ruleConfig.structural;

  if (val.enumValues) {
    return val.enumValues.split(",")[0]?.trim() || "value";
  }

  switch (field.type) {
    case "email": return "user@example.com";
    case "phone": return "+66812345678";
    case "number": return "42";
    case "date": return "2025-01-15";
    case "price": return "199.99";
    case "slug": return "my-awesome-post";
    case "password": {
      let pw = "MyPass";
      if (s.mustIncludeNumber) pw += "1";
      if (s.mustIncludeSpecial) pw += "!";
      const need = Math.max(min, 8);
      while (pw.length < need) pw += "x";
      return pw;
    }
    default: {
      if (val.thaiOnly) return "สวัสดีครับ";
      if (val.englishOnly) return "HelloWorld";
      let txt = "ValidUser";
      if (s.mustIncludeNumber) txt += "1";
      if (s.mustIncludeUppercase && !/[A-Z]/.test(txt)) txt = "A" + txt;
      if (s.mustIncludeLowercase && !/[a-z]/.test(txt)) txt += "a";
      if (s.mustIncludeSpecial) txt += "!";
      const need = Math.max(min, 1);
      while (txt.length < need) txt += "a";
      return txt;
    }
  }
}

function generateInvalidValue(field: FormField, val: FieldValidation): string {
  const s = val.ruleConfig.structural;
  const min = parseInt(val.ruleConfig.length.minLength) || 0;
  const max = parseInt(val.ruleConfig.length.maxLength) || 0;

  if (field.required) {
    // Sometimes return empty to test required
  }

  switch (field.type) {
    case "email": return "not-an-email";
    case "phone": return "abc-phone";
    case "number": return "not_a_number";
    case "date": return "32/13/2025";
    case "price": return "free!";
    case "slug": return "Invalid Slug!!";
    case "password": {
      if (min > 0) return "ab"; // too short
      return "weak";
    }
    default: {
      if (val.thaiOnly) return "EnglishText123";
      if (val.englishOnly) return "ข้อความไทย";
      if (s.mustIncludeNumber) return "NoNumbers";
      if (s.mustIncludeUppercase) return "alllowercase";
      if (s.mustIncludeSpecial) return "NoSpecialChar1";
      if (min > 0) return "a"; // too short
      if (max > 0) return "a".repeat(max + 10); // too long
      if (s.noEmoji) return "test😀emoji";
      return "!!invalid!!";
    }
  }
}

const attackPresets = [
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

  const fillValid = () => {
    const filled: Record<string, string> = {};
    config.fields.forEach(f => {
      const val = config.validations.find(v => v.fieldId === f.id);
      filled[f.id] = val ? generateValidValue(f, val) : "test";
    });
    setValues(filled);
    setHasRun(true);
  };

  const fillInvalid = () => {
    const filled: Record<string, string> = {};
    config.fields.forEach(f => {
      const val = config.validations.find(v => v.fieldId === f.id);
      filled[f.id] = val ? generateInvalidValue(f, val) : "";
    });
    setValues(filled);
    setHasRun(true);
  };

  const resetAll = () => {
    setValues({});
    setHasRun(false);
  };

  const allValid = hasRun && results?.fieldResults.every(r => r.valid) && results?.crossResults.every(r => r.valid);
  const anyError = hasRun && results && (results.fieldResults.some(r => !r.valid) || results.crossResults.some(r => !r.valid));

  return (
    <div className="space-y-4">
      {/* Header + Example Buttons */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          {t("formWorkflow.simulationPanel") || "Validation Simulation"}
        </h3>

        {/* Example Row: Valid / Invalid */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={fillValid}
            className="flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {t("formWorkflow.validExample") || "✅ Valid Example"}
          </button>
          <button
            onClick={fillInvalid}
            className="flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            {t("formWorkflow.invalidExample") || "❌ Invalid Example"}
          </button>

          <div className="w-px bg-border mx-1 self-stretch" />

          {attackPresets.map(preset => (
            <button
              key={preset.label}
              onClick={() => fillPreset(preset.generate)}
              className="flex items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-1.5 text-[11px] font-medium text-secondary-foreground hover:bg-muted transition-colors"
            >
              <preset.icon className="h-3 w-3" /> {preset.label}
            </button>
          ))}

          <button
            onClick={resetAll}
            className="flex items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-1.5 text-[11px] font-medium text-secondary-foreground hover:bg-muted transition-colors ml-auto"
          >
            <RotateCcw className="h-3 w-3" /> {t("common.reset") || "Reset"}
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      {hasRun && (
        <div className={`rounded-lg border px-4 py-2.5 flex items-center gap-2 text-sm font-medium ${
          allValid
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            : "border-destructive/30 bg-destructive/10 text-destructive"
        }`}>
          {allValid ? (
            <><CheckCircle2 className="h-4 w-4" /> {t("formWorkflow.allPassed") || "All validations passed!"}</>
          ) : (
            <><AlertTriangle className="h-4 w-4" /> {t("formWorkflow.someErrors") || "Some fields have validation errors"}</>
          )}
        </div>
      )}

      {/* Mock Form */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        {config.fields.map(field => {
          const fieldResult = hasRun ? results?.fieldResults.find(r => r.fieldId === field.id) : null;
          return (
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
                  fieldResult?.valid === false
                    ? "border-destructive bg-destructive/5"
                    : fieldResult?.valid === true
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-border bg-background"
                }`}
              />
              {/* Errors */}
              {fieldResult?.errors.map((err, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-destructive">
                  <AlertTriangle className="h-3 w-3 shrink-0" /> {err}
                </div>
              ))}
              {fieldResult?.valid && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Valid
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cross-field results */}
      {hasRun && results?.crossResults && results.crossResults.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-3 space-y-1.5">
          <h4 className="text-xs font-semibold text-muted-foreground">Cross-Field Results</h4>
          {results.crossResults.map(r => (
            <div key={r.ruleId} className={`flex items-center gap-1.5 text-xs ${r.valid ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
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
