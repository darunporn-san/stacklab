import { useState, useEffect, useCallback, useRef } from "react";
import { decodeJwt, getTokenStatus, type DecodedJwt, type TokenStatus } from "@/lib/jwtDecode";

interface UseJWTReturn {
  token: string;
  setToken: (t: string) => void;
  decoded: DecodedJwt | null;
  error: string;
  status: TokenStatus | null;
  secondsRemaining: number | null;
  clear: () => void;
}

export function useJWT(): UseJWTReturn {
  const [token, setTokenRaw] = useState(() => {
    try { return localStorage.getItem("jwt-decoder-token") || ""; } catch { return ""; }
  });
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<TokenStatus | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const setToken = useCallback((t: string) => {
    setTokenRaw(t);
    try { localStorage.setItem("jwt-decoder-token", t); } catch {}
  }, []);

  const clear = useCallback(() => {
    setToken("");
    setDecoded(null);
    setError("");
    setStatus(null);
    setSecondsRemaining(null);
  }, [setToken]);

  // Decode
  useEffect(() => {
    if (!token.trim()) {
      setDecoded(null); setError(""); setStatus(null); setSecondsRemaining(null);
      return;
    }
    try {
      const d = decodeJwt(token);
      setDecoded(d);
      setError("");
      const s = getTokenStatus(d.payload);
      setStatus(s);
    } catch (e: any) {
      setDecoded(null);
      setError(e.message);
      setStatus("malformed");
      setSecondsRemaining(null);
    }
  }, [token]);

  // Countdown timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!decoded?.payload.exp) { setSecondsRemaining(null); return; }

    const update = () => {
      const remaining = decoded.payload.exp! - Math.floor(Date.now() / 1000);
      setSecondsRemaining(remaining);
      setStatus(getTokenStatus(decoded.payload));
      if (remaining <= 0 && timerRef.current) clearInterval(timerRef.current);
    };

    update();
    timerRef.current = setInterval(update, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [decoded]);

  return { token, setToken, decoded, error, status, secondsRemaining, clear };
}
