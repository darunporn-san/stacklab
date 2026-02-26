import { useState } from "react";
import { CopyButton } from "../components/CopyButton";

function parseCurl(curl: string): { method: string; url: string; headers: Record<string, string>; body?: string } {
  const result: { method: string; url: string; headers: Record<string, string>; body?: string } = {
    method: "GET",
    url: "",
    headers: {},
  };

  // Remove line continuations
  const cleaned = curl.replace(/\\\n/g, " ").replace(/\\\r\n/g, " ").trim();

  // Extract URL (first quoted or unquoted string after curl)
  const urlMatch = cleaned.match(/curl\s+(?:.*?\s+)?['"]?(https?:\/\/[^\s'"]+)['"]?/);
  if (urlMatch) result.url = urlMatch[1];

  // Extract method
  const methodMatch = cleaned.match(/-X\s+['"]?(\w+)['"]?/);
  if (methodMatch) result.method = methodMatch[1].toUpperCase();

  // Extract headers
  const headerRegex = /-H\s+['"]([^'"]+)['"]/g;
  let hMatch;
  while ((hMatch = headerRegex.exec(cleaned)) !== null) {
    const colonIdx = hMatch[1].indexOf(":");
    if (colonIdx > 0) {
      const key = hMatch[1].slice(0, colonIdx).trim();
      const val = hMatch[1].slice(colonIdx + 1).trim();
      result.headers[key] = val;
    }
  }

  // Extract body
  const bodyMatch = cleaned.match(/(?:-d|--data|--data-raw|--data-binary)\s+['"](.+?)['"]/s);
  if (bodyMatch) {
    result.body = bodyMatch[1];
    if (!methodMatch) result.method = "POST";
  }

  return result;
}

function toFetchCode(parsed: ReturnType<typeof parseCurl>): string {
  const options: string[] = [];
  if (parsed.method !== "GET") options.push(`  method: "${parsed.method}"`);
  
  const headerEntries = Object.entries(parsed.headers);
  if (headerEntries.length > 0) {
    const headerStr = headerEntries.map(([k, v]) => `    "${k}": "${v}"`).join(",\n");
    options.push(`  headers: {\n${headerStr}\n  }`);
  }

  if (parsed.body) {
    options.push(`  body: ${JSON.stringify(parsed.body)}`);
  }

  if (options.length === 0) {
    return `const response = await fetch("${parsed.url}");
const data = await response.json();`;
  }

  return `const response = await fetch("${parsed.url}", {
${options.join(",\n")}
});
const data = await response.json();`;
}

export default function CurlToFetch() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convert = () => {
    try {
      const parsed = parseCurl(input);
      if (!parsed.url) {
        setOutput("// Could not parse URL from curl command");
        return;
      }
      setOutput(toFetchCode(parsed));
    } catch {
      setOutput("// Error parsing curl command");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Curl Command</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`curl -X POST "https://api.example.com/data" \\\n  -H "Content-Type: application/json" \\\n  -d '{"key": "value"}'`}
            className="h-64 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
          <button onClick={convert} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Convert
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Fetch Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <pre className="h-64 overflow-auto rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground whitespace-pre-wrap">
            {output || <span className="text-muted-foreground">Output will appear here...</span>}
          </pre>
        </div>
      </div>
    </div>
  );
}
