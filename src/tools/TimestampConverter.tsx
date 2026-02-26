import { useState } from "react";
import { ToolLayout } from "../components/ToolLayout";
import { CopyButton } from "../components/CopyButton";

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("");
  const [dateString, setDateString] = useState("");

  const now = () => {
    const ts = Math.floor(Date.now() / 1000);
    setTimestamp(String(ts));
  };

  const parsedFromTimestamp = (() => {
    if (!timestamp.trim()) return null;
    const num = Number(timestamp.trim());
    if (isNaN(num)) return { error: "Invalid number" };
    // Auto-detect seconds vs milliseconds
    const ms = num > 1e12 ? num : num * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return { error: "Invalid timestamp" };
    return {
      local: d.toLocaleString(),
      utc: d.toUTCString(),
      iso: d.toISOString(),
    };
  })();

  const parsedFromDate = (() => {
    if (!dateString.trim()) return null;
    const d = new Date(dateString.trim());
    if (isNaN(d.getTime())) return { error: "Invalid date" };
    return {
      seconds: Math.floor(d.getTime() / 1000),
      milliseconds: d.getTime(),
    };
  })();

  return (
    <ToolLayout title="Timestamp Converter" description="Convert between Unix timestamps and human-readable dates.">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Unix Timestamp → Date</label>
          <div className="flex gap-2">
            <input
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="e.g. 1700000000"
              className="flex-1 rounded-lg border border-border bg-code p-3 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button onClick={now} className="rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-muted">
              Now
            </button>
          </div>
          {parsedFromTimestamp && (
            "error" in parsedFromTimestamp ? (
              <div className="text-sm text-destructive">{parsedFromTimestamp.error}</div>
            ) : (
              <div className="space-y-2 rounded-lg border border-border bg-code p-4 text-sm">
                <div><span className="text-muted-foreground">Local: </span><span className="text-code-foreground">{parsedFromTimestamp.local}</span></div>
                <div><span className="text-muted-foreground">UTC: </span><span className="text-code-foreground">{parsedFromTimestamp.utc}</span></div>
                <div className="flex items-center justify-between">
                  <div><span className="text-muted-foreground">ISO: </span><span className="text-code-foreground">{parsedFromTimestamp.iso}</span></div>
                  <CopyButton text={parsedFromTimestamp.iso} />
                </div>
              </div>
            )
          )}
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Date → Unix Timestamp</label>
          <input
            type="datetime-local"
            value={dateString}
            onChange={(e) => setDateString(e.target.value)}
            className="w-full rounded-lg border border-border bg-code p-3 text-sm text-code-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {parsedFromDate && (
            "error" in parsedFromDate ? (
              <div className="text-sm text-destructive">{parsedFromDate.error}</div>
            ) : (
              <div className="space-y-2 rounded-lg border border-border bg-code p-4 text-sm">
                <div className="flex items-center justify-between">
                  <div><span className="text-muted-foreground">Seconds: </span><span className="font-mono text-code-foreground">{parsedFromDate.seconds}</span></div>
                  <CopyButton text={String(parsedFromDate.seconds)} />
                </div>
                <div className="flex items-center justify-between">
                  <div><span className="text-muted-foreground">Milliseconds: </span><span className="font-mono text-code-foreground">{parsedFromDate.milliseconds}</span></div>
                  <CopyButton text={String(parsedFromDate.milliseconds)} />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
