import { useState } from "react";
import { CopyButton } from "../components/CopyButton";
import { ArrowRightLeft, Trash2, Lock, Unlock, Globe } from "lucide-react";

export default function UriEncoderDecoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [lastAction, setLastAction] = useState<"encodeURI" | "encodeURIComponent" | "decodeURI" | "decodeURIComponent" | null>(null);

  const loadExample = (example: string) => {
    setInput(example);
    setOutput("");
    setError("");
    setLastAction(null);
  };

  const encodeURIAction = () => {
    if (!input.trim()) return;
    try {
      setOutput(encodeURI(input));
      setError("");
      setLastAction("encodeURI");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Encoding failed");
    }
  };

  const encodeURIComponentAction = () => {
    if (!input.trim()) return;
    try {
      setOutput(encodeURIComponent(input));
      setError("");
      setLastAction("encodeURIComponent");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Encoding failed");
    }
  };

  const decodeURIAction = () => {
    if (!input.trim()) return;
    try {
      setOutput(decodeURI(input));
      setError("");
      setLastAction("decodeURI");
    } catch (e: unknown) {
      setError("Invalid URI string");
    }
  };

  const decodeURIComponentAction = () => {
    if (!input.trim()) return;
    try {
      setOutput(decodeURIComponent(input));
      setError("");
      setLastAction("decodeURIComponent");
    } catch (e: unknown) {
      setError("Invalid URI component string");
    }
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
    <div className="space-y-6">
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
            placeholder="Enter text or URL to encode/decode..."
            className="h-48 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={encodeURIAction}
              disabled={!input.trim()}
              className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                lastAction === "encodeURI"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              Encode URI
            </button>
            <button
              onClick={encodeURIComponentAction}
              disabled={!input.trim()}
              className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                lastAction === "encodeURIComponent"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              Encode Component
            </button>
            <button
              onClick={decodeURIAction}
              disabled={!input.trim()}
              className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                lastAction === "decodeURI"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              <Unlock className="h-3.5 w-3.5" />
              Decode URI
            </button>
            <button
              onClick={decodeURIComponentAction}
              disabled={!input.trim()}
              className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                lastAction === "decodeURIComponent"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              <Unlock className="h-3.5 w-3.5" />
              Decode Component
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
            <button onClick={() => loadExample("Hello World")} className="rounded-md border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted">
              Hello World
            </button>
            <button onClick={() => loadExample("React & Vue")} className="rounded-md border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted">
              React & Vue
            </button>
            <button onClick={() => loadExample("email=test@gmail.com")} className="rounded-md border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted">
              email=test@gmail.com
            </button>
            <button onClick={() => loadExample("/search?q=hello world")} className="rounded-md border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted">
              /search?q=hello world
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
                  ({lastAction})
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

      {/* JavaScript Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">JavaScript Examples</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-medium">encodeURI()</h4>
            <pre className="rounded-lg border border-border bg-code p-4 text-sm text-code-foreground overflow-x-auto">
{`encodeURI("https://example.com/path?q=hello world");
// "https://example.com/path?q=hello%20world"`}
            </pre>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">encodeURIComponent()</h4>
            <pre className="rounded-lg border border-border bg-code p-4 text-sm text-code-foreground overflow-x-auto">
{`encodeURIComponent("hello world");
// "hello%20world"`}
            </pre>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">decodeURI()</h4>
            <pre className="rounded-lg border border-border bg-code p-4 text-sm text-code-foreground overflow-x-auto">
{`decodeURI("https://example.com/path?q=hello%20world");
// "https://example.com/path?q=hello world"`}
            </pre>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">decodeURIComponent()</h4>
            <pre className="rounded-lg border border-border bg-code p-4 text-sm text-code-foreground overflow-x-auto">
{`decodeURIComponent("hello%20world");
// "hello world"`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}