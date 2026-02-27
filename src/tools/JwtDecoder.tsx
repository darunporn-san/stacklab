import { useJWT } from "@/hooks/useJWT";
import { TokenInput } from "@/components/jwt/TokenInput";
import { PayloadViewer } from "@/components/jwt/PayloadViewer";
import { ExpiryCard } from "@/components/jwt/ExpiryCard";
import { SignatureValidator } from "@/components/jwt/SignatureValidator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function JwtDecoder() {
  const { token, setToken, decoded, error, status, secondsRemaining, clear } = useJWT();

  const loadExample = () => {
    // A sample JWT (expired, safe to share)
    setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MTYyMzkwMjIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSJ9.FpHMZQmSvIqNnqGqLcKJMJdnkFe-VYRPRBfMf44GNWQ");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={loadExample} className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted">
          Load Example
        </button>
      </div>
      <TokenInput value={token} onChange={setToken} onClear={clear} status={status} />

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {decoded && (
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          {/* Main content */}
          <div className="space-y-4">
            <Tabs defaultValue="payload" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="header">Header</TabsTrigger>
                <TabsTrigger value="payload">Payload</TabsTrigger>
                <TabsTrigger value="signature">Signature</TabsTrigger>
              </TabsList>

              <TabsContent value="header" className="mt-3">
                <PayloadViewer data={decoded.header} title="Header" />
              </TabsContent>

              <TabsContent value="payload" className="mt-3">
                <PayloadViewer data={decoded.payload as Record<string, unknown>} title="Payload" />
              </TabsContent>

              <TabsContent value="signature" className="mt-3 space-y-3">
                <div className="rounded-lg border border-border bg-code p-4">
                  <label className="text-xs font-medium text-muted-foreground">Raw Signature</label>
                  <pre className="mt-1 font-mono text-xs text-code-foreground break-all">{decoded.signature}</pre>
                </div>
                <SignatureValidator token={token} algorithm={decoded.header.alg} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {status && (
              <ExpiryCard
                payload={decoded.payload}
                status={status}
                secondsRemaining={secondsRemaining}
              />
            )}

            {/* Algorithm card */}
            <div className="rounded-lg border border-border p-3 space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Algorithm</h3>
              <span className="inline-flex rounded-full bg-primary/10 border border-primary/20 px-3 py-1 font-mono text-sm font-semibold text-primary">
                {decoded.header.alg}
              </span>
              {decoded.header.typ && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-mono">{decoded.header.typ}</span>
                </div>
              )}
              {decoded.header.kid && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Key ID</span>
                  <span className="font-mono truncate ml-2 max-w-[60%]">{decoded.header.kid}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
