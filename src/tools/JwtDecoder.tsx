import { useState, useEffect } from "react";
import { CopyButton } from "../components/CopyButton";

function decodeJwt(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT: must have 3 parts");
  const decode = (s: string) => {
    const base64 = s.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  };
  return { header: decode(parts[0]), payload: decode(parts[1]) };
}

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!input.trim()) { setHeader(""); setPayload(""); setError(""); return; }
    try {
      const decoded = decodeJwt(input.trim());
      const payloadObj = decoded.payload;
      if (payloadObj.exp) {
        payloadObj._exp_readable = new Date(payloadObj.exp * 1000).toLocaleString();
      }
      if (payloadObj.iat) {
        payloadObj._iat_readable = new Date(payloadObj.iat * 1000).toLocaleString();
      }
      setHeader(JSON.stringify(decoded.header, null, 2));
      setPayload(JSON.stringify(payloadObj, null, 2));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setHeader("");
      setPayload("");
    }
  }, [input]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">JWT Token</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JWT token here..."
          className="h-24 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          spellCheck={false}
        />
      </div>
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      {header && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">Header</label>
              <CopyButton text={header} />
            </div>
            <pre className="overflow-auto rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground">{header}</pre>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">Payload</label>
              <CopyButton text={payload} />
            </div>
            <pre className="overflow-auto rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground">{payload}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
