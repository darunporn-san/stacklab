import { useState, useCallback } from "react";
import { CopyButton } from "../components/CopyButton";
import {
  InputData,
  jsonInputForTargetLanguage,
  quicktype,
} from "quicktype-core";

interface Options {
  rootName: string;
  useType: boolean;
  allOptional: boolean;
  useReadonly: boolean;
}

async function jsonToTs(json: string, opts: Options): Promise<string> {
  const jsonInput = jsonInputForTargetLanguage("typescript");
  await jsonInput.addSource({ name: opts.rootName || "Root", samples: [json] });
  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const result = await quicktype({
    inputData,
    lang: "typescript",
    rendererOptions: {
      "just-types": "true",
      "prefer-types": opts.useType ? "true" : "false",
      "nice-property-names": "false",
    },
    allPropertiesOptional: opts.allOptional,
  });

  let output = result.lines.join("\n");

  if (opts.useReadonly) {
    output = output.replace(
      /^(\s+)([\w"]+\??:)/gm,
      "$1readonly $2"
    );
  }

  return output.trim();
}

export default function JsonToTypescriptTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Options>({
    rootName: "Root",
    useType: false,
    allOptional: false,
    useReadonly: false,
  });

  const generate = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    try {
      JSON.parse(input);
      const result = await jsonToTs(input, options);
      setOutput(result);
    } catch (e: any) {
      setError(e.message ?? "Invalid JSON");
      setOutput("");
    } finally {
      setLoading(false);
    }
  }, [input, options]);

  return (
    <div className="space-y-4">
      {/* Options */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Root Name</label>
          <input
            value={options.rootName}
            onChange={(e) => setOptions((o) => ({ ...o, rootName: e.target.value }))}
            className="h-9 w-40 rounded-md border border-border bg-code px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {[
          { key: "useType" as const, label: "Use type" },
          { key: "allOptional" as const, label: "Optional fields" },
          { key: "useReadonly" as const, label: "Readonly" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={() => setOptions((o) => ({ ...o, [key]: !o[key] }))}
              className="h-4 w-4 rounded border-border bg-code accent-primary"
            />
            <span className="text-sm text-muted-foreground">{label}</span>
          </label>
        ))}
        <button
          onClick={generate}
          disabled={loading || !input.trim()}
          className="rounded-md bg-primary px-5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 ml-auto"
        >
          {loading ? "Generating…" : "Generate"}
        </button>
      </div>

      {/* Panels */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground">JSON Input</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder='{ "name": "John", "age": 30 }'
            className="h-80 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">TypeScript Output</span>
            {output && <CopyButton text={output} />}
          </div>
          <pre className="h-80 w-full overflow-auto rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground">
            {output || (error ? <span className="text-destructive">{error}</span> : <span className="text-muted-foreground">Output will appear here…</span>)}
          </pre>
        </div>
      </div>
    </div>
  );
}
