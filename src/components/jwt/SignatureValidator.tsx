import { useState } from "react";
import { ShieldCheck, ShieldX, ShieldAlert, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { validateHmac, validateRsa, validateEs256, isHmacAlg, isSupportedAlg } from "@/lib/jwtValidate";

interface SignatureValidatorProps {
  token: string;
  algorithm: string;
}

type ValidationState = "idle" | "validating" | "valid" | "invalid" | "error";

export function SignatureValidator({ token, algorithm }: SignatureValidatorProps) {
  const [open, setOpen] = useState(false);
  const [secret, setSecret] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [state, setState] = useState<ValidationState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isHmac = isHmacAlg(algorithm);
  const isAsymmetric = algorithm === "RS256" || algorithm === "ES256";
  const supported = isSupportedAlg(algorithm);

  const validate = async () => {
    setState("validating");
    setErrorMsg("");
    try {
      let result = false;
      if (isHmac) {
        result = await validateHmac(token, secret, algorithm as any);
      } else if (algorithm === "RS256") {
        result = await validateRsa(token, publicKey);
      } else if (algorithm === "ES256") {
        result = await validateEs256(token, publicKey);
      }
      setState(result ? "valid" : "invalid");
    } catch (e: any) {
      setState("error");
      setErrorMsg(e.message || "Validation failed");
    }
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted/70 transition-colors text-sm font-medium"
      >
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          Validate Signature
        </span>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {open && (
        <div className="p-4 space-y-3 bg-code">
          <div className="flex items-center gap-2 rounded border border-primary/20 bg-primary/5 px-3 py-2 text-[11px] text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5 text-primary shrink-0" />
            Validation is performed locally in your browser. No data is sent to any server.
          </div>

          {!supported && (
            <div className="text-xs text-muted-foreground">
              Algorithm <code className="font-mono text-code-foreground">{algorithm}</code> is not supported for client-side validation.
              Supported: HS256, HS384, HS512, RS256, ES256.
            </div>
          )}

          {supported && isHmac && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Secret Key</label>
              <input
                type="password"
                value={secret}
                onChange={(e) => { setSecret(e.target.value); setState("idle"); }}
                placeholder="Enter HMAC secret..."
                className="w-full rounded border border-border bg-background px-3 py-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          )}

          {supported && isAsymmetric && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Public Key (PEM)</label>
              <textarea
                value={publicKey}
                onChange={(e) => { setPublicKey(e.target.value); setState("idle"); }}
                placeholder="-----BEGIN PUBLIC KEY-----&#10;...&#10;-----END PUBLIC KEY-----"
                className="h-24 w-full resize-none rounded border border-border bg-background px-3 py-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                spellCheck={false}
              />
            </div>
          )}

          {supported && (
            <button
              onClick={validate}
              disabled={state === "validating" || (isHmac ? !secret : !publicKey)}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {state === "validating" && <Loader2 className="h-3 w-3 animate-spin" />}
              Verify
            </button>
          )}

          {state === "valid" && (
            <div className="flex items-center gap-2 rounded border border-success/30 bg-success/10 px-3 py-2 text-xs font-medium text-success">
              <ShieldCheck className="h-4 w-4" /> Signature is valid
            </div>
          )}
          {state === "invalid" && (
            <div className="flex items-center gap-2 rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              <ShieldX className="h-4 w-4" /> Signature is invalid
            </div>
          )}
          {state === "error" && (
            <div className="flex items-center gap-2 rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              <ShieldX className="h-4 w-4" /> {errorMsg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
