import { useState } from "react";
import { ToolLayout } from "../components/ToolLayout";
import { CopyButton } from "../components/CopyButton";

function generateUUID(): string {
  return crypto.randomUUID();
}

export default function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([generateUUID()]);

  const generate = () => {
    setUuids(Array.from({ length: count }, () => generateUUID()));
  };

  return (
    <ToolLayout title="UUID Generator" description="Generate random v4 UUIDs.">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Count</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-lg border border-border bg-code px-3 py-2.5 text-sm text-code-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {[1, 5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <button onClick={generate} className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          Generate
        </button>
        <CopyButton text={uuids.join("\n")} />
      </div>
      <div className="rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground space-y-1">
        {uuids.map((uuid, i) => (
          <div key={i} className="flex items-center justify-between gap-2 group">
            <span className="select-all">{uuid}</span>
            <CopyButton text={uuid} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
