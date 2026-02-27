import { useState } from "react";
import { CopyButton } from "../components/CopyButton";
import { ArrowRightLeft, Trash2, Lock, Unlock } from "lucide-react";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [lastAction, setLastAction] = useState<"encode" | "decode" | null>(null);

  const loadEncodeExample = () => {
    const sample = '{"name":"DevToolbox","version":"2.0","features":["base64","json","jwt"]}';
    setInput(sample);
    setOutput(btoa(unescape(encodeURIComponent(sample))));
    setError("");
    setLastAction("encode");
  };

  const loadDecodeExample = () => {
    const encoded = "eyJuYW1lIjoiRGV2VG9vbGJveCIsInZlcnNpb24iOiIyLjAiLCJmZWF0dXJlcyI6WyJiYXNlNjQiLCJqc29uIiwiand0Il19";
    setInput(encoded);
    setOutput(decodeURIComponent(escape(atob(encoded))));
    setError("");
    setLastAction("decode");
  };

  const encode = () => {
    if (!input.trim()) return;
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
      setError("");
      setLastAction("encode");
    } catch (e: any) { setError(e.message); }
  };

  const decode = () => {
    if (!input.trim()) return;
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
      setError("");
      setLastAction("decode");
    } catch (e: any) { setError("Invalid Base64 string"); }
  };

  const swapInputOutput = () => {
    if (!output) return;
    setInput(output);
    setOutput("");
    setError("");
    setLastAction(null);
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
    setLastAction(null);
  };

  const charCount = input.length;
  const byteCount = new Blob([input]).size;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Input</label>
            <span className="text-xs text-muted-foreground">{charCount} chars · {byteCount} bytes</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encode, or Base64 to decode..."
            className="h-48 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={encode}
              disabled={!input.trim()}
              className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                lastAction === "encode"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              Encode
            </button>
            <button
              onClick={decode}
              disabled={!input.trim()}
              className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                lastAction === "decode"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              <Unlock className="h-3.5 w-3.5" />
              Decode
            </button>
            <div className="h-8 w-px bg-border self-center" />
            <button
              onClick={swapInputOutput}
              disabled={!output}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              title="Swap input ↔ output"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={clear}
              disabled={!input && !output}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear all"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <div className="h-8 w-px bg-border self-center" />
            <button onClick={loadEncodeExample} className="rounded-md border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted">
              Encode Example
            </button>
            <button onClick={loadDecodeExample} className="rounded-md border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted">
              Decode Example
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">
              Output
              {lastAction && (
                <span className="ml-2 text-xs text-primary">
                  ({lastAction === "encode" ? "Encoded" : "Decoded"})
                </span>
              )}
            </label>
            {output && <CopyButton text={output} />}
          </div>
          {error ? (
            <div className="h-48 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
          ) : (
            <pre className="h-48 overflow-auto rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground whitespace-pre-wrap break-all">
              {output || <span className="text-muted-foreground">Output will appear here...</span>}
            </pre>
          )}
          {output && (
            <div className="text-xs text-muted-foreground">
              {output.length} chars · {new Blob([output]).size} bytes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
