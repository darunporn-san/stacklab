import { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { RuleConfig } from "@/lib/regexRuleConfig";
import { getFailureReasons } from "@/lib/regexGenerator";
import { useTranslation } from "@/hooks/useI18n";

interface Props {
  pattern: string;
  config: RuleConfig;
  testInput: string;
  onTestInputChange: (v: string) => void;
}

export function LiveTestPanel({ pattern, config, testInput, onTestInputChange }: Props) {
  const { t } = useTranslation();
  const result = useMemo(() => {
    if (!pattern || !testInput) return null;
    try {
      const regex = new RegExp(pattern);
      const isValid = regex.test(testInput);
      const reasons = isValid ? [] : getFailureReasons(pattern, testInput, config);
      return { isValid, error: "", reasons };
    } catch (e: any) {
      return { isValid: false, error: e.message, reasons: [] };
    }
  }, [pattern, testInput, config]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{t("ruleBuilder.liveTest")}</h3>
      <textarea
        value={testInput}
        onChange={(e) => onTestInputChange(e.target.value)}
        placeholder={t("ruleBuilder.testInput")}
        className="h-20 w-full resize-none rounded-lg border border-border bg-code p-3 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        spellCheck={false}
      />
      {testInput && result && (
        <div className="space-y-2">
          <div className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${
            result.error
              ? "border-destructive/50 bg-destructive/10 text-destructive"
              : result.isValid
                ? "border-success/50 bg-success/10 text-success"
                : "border-destructive/50 bg-destructive/10 text-destructive"
          }`}>
            {result.error ? (
              <><XCircle className="h-4 w-4 shrink-0" /> {t("ruleBuilder.regexError")}: {result.error}</>
            ) : result.isValid ? (
              <><CheckCircle2 className="h-4 w-4 shrink-0" /> {t("ruleBuilder.valid")}</>
            ) : (
              <><XCircle className="h-4 w-4 shrink-0" /> {t("ruleBuilder.invalid")}</>
            )}
          </div>
          {!result.isValid && result.reasons.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1">
              <span className="text-xs font-medium text-destructive">{t("ruleBuilder.failureReasons")}:</span>
              {result.reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-destructive/80">
                  <span className="shrink-0 mt-0.5">•</span> {r}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
