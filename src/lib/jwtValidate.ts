/**
 * Client-side JWT signature validation using Web Crypto API.
 * Supports HMAC (HS256/384/512) and RSA (RS256) / ECDSA (ES256).
 * All operations run locally — no data leaves the browser.
 */

type HmacAlg = "HS256" | "HS384" | "HS512";
type RsaAlg = "RS256";
type EcAlg = "ES256";
export type SupportedAlg = HmacAlg | RsaAlg | EcAlg;

const HMAC_HASH: Record<HmacAlg, string> = {
  HS256: "SHA-256",
  HS384: "SHA-384",
  HS512: "SHA-512",
};

function base64UrlToUint8Array(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function validateHmac(
  token: string,
  secret: string,
  alg: HmacAlg
): Promise<boolean> {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return false;

  const hash = HMAC_HASH[alg];
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const signingInput = encoder.encode(`${parts[0]}.${parts[1]}`);

  const key = await crypto.subtle.importKey(
    "raw", keyData, { name: "HMAC", hash }, false, ["sign"]
  );

  const sig = await crypto.subtle.sign("HMAC", key, signingInput);
  const expected = new Uint8Array(sig);
  const actual = base64UrlToUint8Array(parts[2]);

  if (expected.length !== actual.length) return false;
  return expected.every((b, i) => b === actual[i]);
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const lines = pem
    .replace(/-----BEGIN [A-Z ]+-----/, "")
    .replace(/-----END [A-Z ]+-----/, "")
    .replace(/\s/g, "");
  const binary = atob(lines);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function validateRsa(
  token: string,
  publicKeyPem: string
): Promise<boolean> {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return false;

  try {
    const keyData = pemToArrayBuffer(publicKeyPem);
    const key = await crypto.subtle.importKey(
      "spki", keyData,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false, ["verify"]
    );

    const encoder = new TextEncoder();
    const signingInput = encoder.encode(`${parts[0]}.${parts[1]}`);
    const signature = base64UrlToUint8Array(parts[2]);

    return crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signature.buffer as ArrayBuffer, signingInput);
  } catch {
    return false;
  }
}

export async function validateEs256(
  token: string,
  publicKeyPem: string
): Promise<boolean> {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return false;

  try {
    const keyData = pemToArrayBuffer(publicKeyPem);
    const key = await crypto.subtle.importKey(
      "spki", keyData,
      { name: "ECDSA", namedCurve: "P-256" },
      false, ["verify"]
    );

    const encoder = new TextEncoder();
    const signingInput = encoder.encode(`${parts[0]}.${parts[1]}`);
    const signature = base64UrlToUint8Array(parts[2]);

    return crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" }, key, signature.buffer as ArrayBuffer, signingInput
    );
  } catch {
    return false;
  }
}

export function isHmacAlg(alg: string): alg is HmacAlg {
  return alg in HMAC_HASH;
}

export function isSupportedAlg(alg: string): alg is SupportedAlg {
  return ["HS256", "HS384", "HS512", "RS256", "ES256"].includes(alg);
}
