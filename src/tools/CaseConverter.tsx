import { useState, useMemo, useEffect, useCallback } from "react";
import { CopyButton } from "../components/CopyButton";
import { CaseType, CASE_TYPES, convertMultiline, detectCase } from "../lib/caseConverter";
import { Copy, Check } from "lucide-react";

export default function CaseConverterTool() {
  const [input, setInput] = useState("");
  const [perLine, setPerLine] = useState(false);
  const [preserveUppercase, setPreserveUppercase] = useState(false);
  const [strictAlphanumeric, setStrictAlphanumeric] = useState(false);
  const [removeSpecialChars, setRemoveSpecialChars] = useState(false);
  const [keepLeadingTrailing, setKeepLeadingTrailing] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const opts = useMemo(
    () => ({ preserveUppercase, strictAlphanumeric, removeSpecialChars, keepLeadingTrailingSeparators: keepLeadingTrailing }),
    [preserveUppercase, strictAlphanumeric, removeSpecialChars, keepLeadingTrailing]
  );

  const results = useMemo(() => {
    if (!input.trim()) return {} as Record<CaseType, string>;
    const r: Partial<Record<CaseType, string>> = {};
    for (const t of CASE_TYPES) {
      r[t] = convertMultiline(input, t, perLine, opts);
    }
    return r as Record<CaseType, string>;
  }, [input, perLine, opts]);

  const detected = useMemo(() => {
    const firstLine = input.split("\n")[0]?.trim() ?? "";
    return detectCase(firstLine);
  }, [input]);

  const copyAll = useCallback(async () => {
    const text = CASE_TYPES.map((t) => `// ${t}\n${results[t] ?? ""}`).join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }, [results]);

  // Keyboard shortcut: Cmd/Ctrl+Enter → copy camelCase
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        const camel = results[CaseType.Camel];
        if (camel) navigator.clipboard.writeText(camel);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [results]);

  const toggles = [
    { label: "Convert each line", checked: perLine, set: setPerLine },
    { label: "Preserve uppercase", checked: preserveUppercase, set: setPreserveUppercase },
    { label: "Strict alphanumeric", checked: strictAlphanumeric, set: setStrictAlphanumeric },
    { label: "Remove special chars", checked: removeSpecialChars, set: setRemoveSpecialChars },
    { label: "Keep leading/trailing", checked: keepLeadingTrailing, set: setKeepLeadingTrailing },
  ];

  return (
    <div className="space-y-4">
      {/* Options */}
      <div className="flex flex-wrap items-center gap-4">
        {toggles.map(({ label, checked, set }) => (
          <label key={label} className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => set((v) => !v)}
              className="h-4 w-4 rounded border-border bg-code accent-primary"
            />
            <span className="text-sm text-muted-foreground">{label}</span>
          </label>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Input</span>
          {detected && (
            <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
              Detected: {detected}
            </span>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          placeholder="Type or paste text here…"
          className="h-32 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Copy All */}
      {input.trim() && (
        <div className="flex justify-end">
          <button
            onClick={copyAll}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted"
          >
            {copiedAll ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedAll ? "Copied All" : "Copy All"}
          </button>
        </div>
      )}

      {/* Output grid */}
      {input.trim() && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CASE_TYPES.map((t) => (
            <div key={t} className="rounded-lg border border-border bg-code p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{t}</span>
                <CopyButton text={results[t] ?? ""} />
              </div>
              <pre className="whitespace-pre-wrap break-all font-mono text-sm text-code-foreground min-h-[1.5rem]">
                {results[t]}
              </pre>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Tip: Press <kbd className="rounded border border-border bg-secondary px-1 py-0.5 text-[10px]">⌘/Ctrl + Enter</kbd> to copy the camelCase result.
      </p>
    </div>
  );
}
