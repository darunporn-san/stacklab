import { useState, useMemo } from "react";
import RegexRuleBuilder from "./RegexRuleBuilder";
import ThaiValidationMode from "./ThaiValidationMode";

type Mode = "tester" | "builder" | "thai";

export default function RegexTester() {
  const [mode, setMode] = useState<Mode>("tester");
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("gu");
  const [testText, setTestText] = useState("");

  const toggleFlag = (f: string) => {
    setFlags((prev) => prev.includes(f) ? prev.replace(f, "") : prev + f);
  };

  const insertPattern = (p: string) => {
    setPattern((prev) => prev + p);
  };

  const { matches, highlighted, error } = useMemo(() => {
    if (!pattern) return { matches: [], highlighted: testText, error: "" };
    try {
      const normalizedText = testText.normalize("NFC");
      const regex = new RegExp(pattern, flags);
      const globalFlags = flags.includes("g") ? flags : flags + "g";
      const matchList = [...normalizedText.matchAll(new RegExp(pattern, globalFlags))];
      let result: { text: string; match: boolean; index?: number }[] = [];
      let lastIndex = 0;
      for (const m of matchList) {
        const start = m.index!;
        if (start > lastIndex) result.push({ text: normalizedText.slice(lastIndex, start), match: false });
        result.push({ text: m[0], match: true, index: start });
        lastIndex = start + m[0].length;
      }
      if (lastIndex < normalizedText.length) result.push({ text: normalizedText.slice(lastIndex), match: false });
      return { matches: matchList, highlighted: result, error: "" };
    } catch (e: any) {
      return { matches: [], highlighted: [], error: e.message };
    }
  }, [pattern, flags, testText]);

  const loadExample = () => {
    setPattern("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b");
    setFlags("gi");
    setTestText("Contact us at support@example.com or sales@company.org.\nInvalid emails: @broken, user@, hello@.com\nValid: admin@devtoolbox.io, test.user+tag@gmail.com");
  };

  const loadThaiExample = () => {
    setPattern("[ก-๙]+");
    setFlags("gu");
    setTestText("สวัสดีครับ Hello World ยินดีต้อนรับ\nทดสอบ ๑๒๓ Test 456\nภาษาไทย mixed English ข้อความ");
  };

  const thaiQuickInserts = [
    { label: "🔤 Thai Letters", value: "[ก-๙]" },
    { label: "👤 Thai Name", value: "^[ก-๙\\s]+$" },
    { label: "🔢 Thai Digits", value: "[๐-๙]" },
    { label: "🔄 Thai+EN", value: "[A-Za-zก-๙\\s]" },
    { label: "📱 Thai Phone", value: "^(?:\\+66|0)[689]\\d{8}$" },
    { label: "🆔 Thai ID", value: "^\\d{13}$" },
  ];

  const modeButtons: { key: Mode; label: string }[] = [
    { key: "tester", label: "Regex Tester" },
    { key: "builder", label: "Rule Builder 🔥" },
    { key: "thai", label: "Thai Mode 🇹🇭" },
  ];

  return (
    <div>
      {/* Mode Toggle */}
      <div className="mb-5 flex flex-wrap rounded-lg border border-border bg-secondary p-1 w-fit">
        {modeButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setMode(btn.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === btn.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {mode === "builder" ? (
        <RegexRuleBuilder />
      ) : mode === "thai" ? (
        <ThaiValidationMode />
      ) : (
        <div className="space-y-4">
          {/* Thai Quick Insert */}
          <div className="flex flex-wrap gap-1.5">
            {thaiQuickInserts.map((item) => (
              <button
                key={item.label}
                onClick={() => insertPattern(item.value)}
                className="rounded-md border border-border bg-secondary px-2.5 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-muted transition-colors"
                title={item.value}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px] space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Pattern</label>
              <input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                className="w-full rounded-lg border border-border bg-code p-3 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                spellCheck={false}
              />
            </div>
            <div className="flex gap-1">
              {["g", "i", "m", "u"].map((f) => (
                <button
                  key={f}
                  onClick={() => toggleFlag(f)}
                  className={`rounded-md border px-3 py-2.5 font-mono text-sm font-medium transition-colors ${
                    flags.includes(f)
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-secondary text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              <button onClick={loadExample} className="rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted">
                Example
              </button>
              <button onClick={loadThaiExample} className="rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted">
                🇹🇭 ตัวอย่าง
              </button>
            </div>
          </div>

          {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Test String</label>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter test text... (supports Thai ภาษาไทย)"
              className="h-32 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              spellCheck={false}
            />
          </div>

          {testText && pattern && !error && (
            <>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span><span className="font-medium text-foreground">{Array.isArray(matches) ? matches.length : 0}</span> match{Array.isArray(matches) && matches.length !== 1 ? "es" : ""} found</span>
                {flags.includes("u") && <span className="text-xs bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono">Unicode mode</span>}
              </div>

              {/* Highlighted matches */}
              <div className="rounded-lg border border-border bg-code p-4 font-mono text-sm whitespace-pre-wrap break-all">
                {Array.isArray(highlighted) && highlighted.map((seg, i) =>
                  seg.match ? (
                    <mark key={i} className="rounded bg-primary/25 text-primary px-0.5" title={seg.index !== undefined ? `Index: ${seg.index}` : undefined}>
                      {seg.text}
                    </mark>
                  ) : (
                    <span key={i} className="text-code-foreground">{seg.text}</span>
                  )
                )}
              </div>

              {/* Match Details */}
              {Array.isArray(matches) && matches.length > 0 && matches.length <= 20 && (
                <div className="rounded-lg border border-border bg-card p-3">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">Match Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {matches.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-md bg-muted/50 px-2.5 py-1 text-xs">
                        <span className="font-mono text-muted-foreground">#{i + 1}</span>
                        <span className="font-mono text-primary font-medium truncate">"{m[0]}"</span>
                        <span className="ml-auto text-muted-foreground">@{m.index}</span>
                        {m.length > 1 && (
                          <span className="text-muted-foreground">({m.length - 1} groups)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
