export interface JwtHeader {
  alg: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
}

export interface JwtPayload {
  [key: string]: unknown;
  sub?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  nbf?: number;
  jti?: string;
  role?: string | string[];
}

export interface DecodedJwt {
  header: JwtHeader;
  payload: JwtPayload;
  signature: string;
  raw: { header: string; payload: string; signature: string };
}

export type TokenStatus = "valid" | "expired" | "near-expiry" | "malformed" | "no-expiry";

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
}

export function decodeJwt(token: string): DecodedJwt {
  const trimmed = token.trim();
  if (!trimmed) throw new Error("Token is empty");

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    throw new Error(`Invalid JWT: expected 3 segments, got ${parts.length}`);
  }

  try {
    const headerJson = base64UrlDecode(parts[0]);
    const header = JSON.parse(headerJson) as JwtHeader;

    const payloadJson = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadJson) as JwtPayload;

    return {
      header,
      payload,
      signature: parts[2],
      raw: { header: parts[0], payload: parts[1], signature: parts[2] },
    };
  } catch (e: any) {
    if (e.message?.includes("Invalid JWT")) throw e;
    throw new Error("Malformed JWT: unable to decode segments");
  }
}

export function getTokenStatus(payload: JwtPayload): TokenStatus {
  if (payload.exp == null) return "no-expiry";
  const now = Math.floor(Date.now() / 1000);
  const diff = payload.exp - now;
  if (diff <= 0) return "expired";
  if (diff <= 300) return "near-expiry"; // 5 minutes
  return "valid";
}

export const KNOWN_CLAIMS = new Set([
  "sub", "iss", "aud", "exp", "iat", "nbf", "jti", "role", "roles",
  "name", "email", "scope", "permissions", "azp", "at_hash", "nonce",
]);
