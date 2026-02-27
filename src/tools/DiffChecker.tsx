import { useState, useMemo, useCallback, useEffect } from "react";
import { CopyButton } from "../components/CopyButton";
import { computeDiff, getDiffStats, DiffLine } from "../lib/diffChecker";
import { Download, Trash2 } from "lucide-react";

export default function DiffCheckerTool() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [unified, setUnified] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreKeyOrder, setIgnoreKeyOrder] = useState(false);
  const [jsonFormat, setJsonFormat] = useState(false);
  const [debouncedOriginal, setDebouncedOriginal] = useState("");
  const [debouncedModified, setDebouncedModified] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedOriginal(original);
      setDebouncedModified(modified);
    }, 200);
    return () => clearTimeout(id);
  }, [original, modified]);

  const diff = useMemo(
    () => computeDiff(debouncedOriginal, debouncedModified, { ignoreWhitespace, ignoreJsonKeyOrder: ignoreKeyOrder, jsonFormat }),
    [debouncedOriginal, debouncedModified, ignoreWhitespace, ignoreKeyOrder, jsonFormat]
  );

  const stats = useMemo(() => getDiffStats(diff), [diff]);

  const diffText = useMemo(() => {
    return diff.map((l) => {
      const prefix = l.type === "added" ? "+ " : l.type === "removed" ? "- " : "  ";
      return prefix + l.content;
    }).join("\n");
  }, [diff]);

  const downloadDiff = useCallback(() => {
    const blob = new Blob([diffText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diff.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [diffText]);

  const toggles = [
    { label: "Unified view", checked: unified, set: setUnified },
    { label: "Ignore whitespace", checked: ignoreWhitespace, set: setIgnoreWhitespace },
    { label: "Ignore JSON key order", checked: ignoreKeyOrder, set: setIgnoreKeyOrder },
    { label: "Format JSON", checked: jsonFormat, set: setJsonFormat },
  ];

  const lineColor = (type: DiffLine["type"]) => {
    if (type === "added") return "bg-success/15 text-success";
    if (type === "removed") return "bg-destructive/15 text-destructive";
    return "";
  };

  const hasDiff = debouncedOriginal || debouncedModified;

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
        <button
          onClick={() => {
            setOriginal('{\n  "name": "DevToolbox",\n  "version": "1.0.0",\n  "features": ["json", "diff"],\n  "author": "dev"\n}');
            setModified('{\n  "name": "DevToolbox",\n  "version": "2.0.0",\n  "features": ["json", "diff", "jwt"],\n  "author": "dev",\n  "license": "MIT"\n}');
          }}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-muted"
        >
          Load Example
        </button>
        <button
          onClick={() => { setOriginal(""); setModified(""); }}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-muted"
        >
          <Trash2 className="h-3 w-3" /> Clear
        </button>
      </div>

      {/* Input panels */}
      {!unified && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Original</span>
            <textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              spellCheck={false}
              placeholder="Paste original code…"
              className="h-56 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Modified</span>
            <textarea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              spellCheck={false}
              placeholder="Paste modified code…"
              className="h-56 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}

      {unified && (
        <div className="grid gap-4 lg:grid-cols-2">
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            spellCheck={false}
            placeholder="Original…"
            className="h-32 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            spellCheck={false}
            placeholder="Modified…"
            className="h-32 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      )}

      {/* Stats */}
      {hasDiff && (
        <div className="flex flex-wrap items-center gap-4">
          <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">+{stats.added} added</span>
          <span className="rounded-full bg-destructive/15 px-2.5 py-0.5 text-xs font-medium text-destructive">−{stats.removed} removed</span>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">{stats.total} total changes</span>
          <div className="ml-auto flex gap-2">
            <CopyButton text={diffText} />
            <button
              onClick={downloadDiff}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-muted"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </button>
          </div>
        </div>
      )}

      {/* Diff output */}
      {hasDiff && (
        <div className="overflow-auto rounded-lg border border-border bg-code">
          <table className="w-full border-collapse font-mono text-sm">
            <tbody>
              {diff.map((line, i) => (
                <tr key={i} className={lineColor(line.type)}>
                  <td className="w-12 select-none border-r border-border px-2 py-0.5 text-right text-xs text-muted-foreground/60">
                    {line.lineOld ?? ""}
                  </td>
                  <td className="w-12 select-none border-r border-border px-2 py-0.5 text-right text-xs text-muted-foreground/60">
                    {line.lineNew ?? ""}
                  </td>
                  <td className="w-6 select-none px-1 py-0.5 text-center text-xs">
                    {line.type === "added" ? "+" : line.type === "removed" ? "−" : " "}
                  </td>
                  <td className="whitespace-pre-wrap break-all px-2 py-0.5">{line.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
