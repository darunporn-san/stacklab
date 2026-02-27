import { useState, useMemo } from "react";
import RegexRuleBuilder from "./RegexRuleBuilder";

type Mode = "tester" | "builder";

export default function RegexTester() {
  const [mode, setMode] = useState<Mode>("tester");
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState("");

  const toggleFlag = (f: string) => {
    setFlags((prev) => prev.includes(f) ? prev.replace(f, "") : prev + f);
  };

  const { matches, highlighted, error } = useMemo(() => {
    if (!pattern) return { matches: [], highlighted: testText, error: "" };
    try {
      const regex = new RegExp(pattern, flags);
      const matchList = [...testText.matchAll(new RegExp(pattern, flags.includes("g") ? flags : flags + "g"))];
      let result: { text: string; match: boolean }[] = [];
      let lastIndex = 0;
      for (const m of matchList) {
        const start = m.index!;
        if (start > lastIndex) result.push({ text: testText.slice(lastIndex, start), match: false });
        result.push({ text: m[0], match: true });
        lastIndex = start + m[0].length;
      }
      if (lastIndex < testText.length) result.push({ text: testText.slice(lastIndex), match: false });
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

  return (
    <div>
      {/* Mode Toggle */}
      <div className="mb-5 flex rounded-lg border border-border bg-secondary p-1 w-fit">
        <button
          onClick={() => setMode("tester")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "tester" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Regex Tester
        </button>
        <button
          onClick={() => setMode("builder")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "builder" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Rule Builder 🔥
        </button>
      </div>

      {mode === "builder" ? (
        <RegexRuleBuilder />
      ) : (
        <div className="space-y-4">
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
              {["g", "i", "m"].map((f) => (
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
            <button onClick={loadExample} className="rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted">
              Load Example
            </button>
          </div>
          {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Test String</label>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter test text..."
              className="h-32 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              spellCheck={false}
            />
          </div>
          {testText && pattern && !error && (
            <>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{Array.isArray(matches) ? matches.length : 0}</span> match{Array.isArray(matches) && matches.length !== 1 ? "es" : ""} found
              </div>
              <div className="rounded-lg border border-border bg-code p-4 font-mono text-sm whitespace-pre-wrap break-all">
                {Array.isArray(highlighted) && highlighted.map((seg, i) =>
                  seg.match ? (
                    <mark key={i} className="rounded bg-primary/25 text-primary px-0.5">{seg.text}</mark>
                  ) : (
                    <span key={i} className="text-code-foreground">{seg.text}</span>
                  )
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
