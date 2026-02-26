import { Clock, Timer, Calendar, Shield } from "lucide-react";
import { type JwtPayload, type TokenStatus } from "@/lib/jwtDecode";
import { formatUtc, formatLocal, getRelativeTime, formatCountdown } from "@/lib/timeHelpers";
import { useState } from "react";

interface ExpiryCardProps {
  payload: JwtPayload;
  status: TokenStatus;
  secondsRemaining: number | null;
}

const STATUS_COLORS: Record<string, string> = {
  valid: "border-success/40 bg-success/5",
  "near-expiry": "border-[hsl(40,80%,50%)]/40 bg-[hsl(40,80%,50%)]/5",
  expired: "border-destructive/40 bg-destructive/5",
  "no-expiry": "border-border bg-muted/30",
  malformed: "border-destructive/40 bg-destructive/5",
};

const COUNTDOWN_COLORS: Record<string, string> = {
  valid: "text-success",
  "near-expiry": "text-[hsl(40,80%,45%)]",
  expired: "text-destructive",
};

export function ExpiryCard({ payload, status, secondsRemaining }: ExpiryCardProps) {
  const [showUtc, setShowUtc] = useState(true);
  const [showLocal, setShowLocal] = useState(true);

  const alg = "—"; // Will be passed from header if needed
  const timestamps = [
    { key: "exp", label: "Expires", icon: Timer, value: payload.exp },
    { key: "iat", label: "Issued At", icon: Calendar, value: payload.iat },
    { key: "nbf", label: "Not Before", icon: Shield, value: payload.nbf },
  ].filter(t => t.value != null);

  return (
    <div className={`rounded-lg border p-4 space-y-3 ${STATUS_COLORS[status] || STATUS_COLORS["no-expiry"]}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <Clock className="h-4 w-4" /> Token Status
        </h3>
        <div className="flex gap-2">
          <label className="flex items-center gap-1 text-[10px] text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={showUtc} onChange={() => setShowUtc(!showUtc)} className="h-3 w-3 rounded" /> UTC
          </label>
          <label className="flex items-center gap-1 text-[10px] text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={showLocal} onChange={() => setShowLocal(!showLocal)} className="h-3 w-3 rounded" /> Local
          </label>
        </div>
      </div>

      {secondsRemaining != null && (
        <div className="text-center py-2">
          <span className={`font-mono text-2xl font-bold ${COUNTDOWN_COLORS[status] || "text-foreground"}`}>
            {secondsRemaining > 0 ? formatCountdown(secondsRemaining) : "Expired"}
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            {secondsRemaining > 0 ? "Time remaining" : payload.exp ? getRelativeTime(payload.exp) : ""}
          </p>
        </div>
      )}

      {timestamps.length > 0 && (
        <div className="space-y-2">
          {timestamps.map(({ key, label, icon: Icon, value }) => (
            <div key={key} className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Icon className="h-3 w-3 text-muted-foreground" />
                {label}
                <span className="ml-auto text-[10px] text-muted-foreground">{getRelativeTime(value!)}</span>
              </div>
              <div className="pl-5 space-y-0.5 text-[11px] font-mono text-muted-foreground">
                {showLocal && <div>{formatLocal(value!)}</div>}
                {showUtc && <div>{formatUtc(value!)}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary info */}
      <div className="border-t border-border/50 pt-2 space-y-1">
        {payload.iss && (
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Issuer</span>
            <span className="font-mono text-foreground truncate ml-2 max-w-[60%] text-right">{String(payload.iss)}</span>
          </div>
        )}
        {payload.aud && (
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Audience</span>
            <span className="font-mono text-foreground truncate ml-2 max-w-[60%] text-right">
              {Array.isArray(payload.aud) ? payload.aud.join(", ") : String(payload.aud)}
            </span>
          </div>
        )}
        {payload.sub && (
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Subject</span>
            <span className="font-mono text-foreground truncate ml-2 max-w-[60%] text-right">{String(payload.sub)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
