import { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  pattern: string;
  testInput: string;
  onTestInputChange: (v: string) => void;
}

export function LiveTestPanel({ pattern, testInput, onTestInputChange }: Props) {
  const result = useMemo(() => {
    if (!pattern || !testInput) return null;
    try {
      const regex = new RegExp(pattern);
      const isValid = regex.test(testInput);
      return { isValid, error: "" };
    } catch (e: any) {
      return { isValid: false, error: e.message };
    }
  }, [pattern, testInput]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Live Test</h3>
      <textarea
        value={testInput}
        onChange={(e) => onTestInputChange(e.target.value)}
        placeholder="Type test input..."
        className="h-20 w-full resize-none rounded-lg border border-border bg-code p-3 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        spellCheck={false}
      />
      {testInput && result && (
        <div className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${
          result.error
            ? "border-destructive/50 bg-destructive/10 text-destructive"
            : result.isValid
              ? "border-success/50 bg-success/10 text-success"
              : "border-destructive/50 bg-destructive/10 text-destructive"
        }`}>
          {result.error ? (
            <><XCircle className="h-4 w-4" /> Regex error: {result.error}</>
          ) : result.isValid ? (
            <><CheckCircle2 className="h-4 w-4" /> Valid — Input matches the pattern</>
          ) : (
            <><XCircle className="h-4 w-4" /> Invalid — Input does not match</>
          )}
        </div>
      )}
    </div>
  );
}
