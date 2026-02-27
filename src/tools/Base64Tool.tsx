import { useState } from "react";
import { CopyButton } from "../components/CopyButton";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const loadEncodeExample = () => {
    const sample = '{"name":"DevToolbox","version":"2.0","features":["base64","json","jwt"]}';
    setInput(sample);
    setOutput(btoa(unescape(encodeURIComponent(sample))));
    setError("");
  };

  const loadDecodeExample = () => {
    const encoded = "eyJuYW1lIjoiRGV2VG9vbGJveCIsInZlcnNpb24iOiIyLjAiLCJmZWF0dXJlcyI6WyJiYXNlNjQiLCJqc29uIiwiand0Il19";
    setInput(encoded);
    setOutput(decodeURIComponent(escape(atob(encoded))));
    setError("");
  };


  const encode = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
      setError("");
    } catch (e: any) { setError(e.message); }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
      setError("");
    } catch (e: any) { setError("Invalid Base64 string"); }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text or Base64..."
            className="h-48 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
          <div className="flex gap-2">
            <button onClick={encode} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Encode
            </button>
            <button onClick={decode} className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted">
              Decode
            </button>
            <button onClick={loadEncodeExample} className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted">
              Encode Example
            </button>
            <button onClick={loadDecodeExample} className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted">
              Decode Example
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Output</label>
            {output && <CopyButton text={output} />}
          </div>
          {error ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
          ) : (
            <pre className="h-48 overflow-auto rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground whitespace-pre-wrap break-all">
              {output || <span className="text-muted-foreground">Output will appear here...</span>}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
