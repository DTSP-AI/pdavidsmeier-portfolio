// Shared NCNDA gate token (HMAC-SHA256, base64url payload + sig).
// Uses Web Crypto so the same code works in Node runtime (route handlers)
// AND Edge runtime (middleware). The two gated apps must use byte-for-byte
// the same algorithm — see the gating prompts.

const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

export interface NcndaTokenPayload {
  id: string;
  exp: number;
  projects: string[];
}

function b64urlFromBytes(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlFromString(s: string): string {
  return b64urlFromBytes(ENCODER.encode(s));
}

function bytesFromB64url(s: string): Uint8Array {
  const padLen = (4 - (s.length % 4)) % 4;
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padLen);
  const bin = atob(padded);
  const buf = new ArrayBuffer(bin.length);
  const out = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    ENCODER.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function mintNcndaToken(
  payload: NcndaTokenPayload,
  secret: string
): Promise<string> {
  const body = b64urlFromString(JSON.stringify(payload));
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, ENCODER.encode(body));
  return `${body}.${b64urlFromBytes(new Uint8Array(sig))}`;
}

export interface VerifyResult {
  valid: boolean;
  reason?: string;
  payload?: NcndaTokenPayload;
}

export async function verifyNcndaToken(
  token: string,
  secret: string,
  requiredProject: string
): Promise<VerifyResult> {
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false, reason: "malformed" };
  const [body, sig] = parts;
  let sigBytes: Uint8Array;
  try {
    sigBytes = bytesFromB64url(sig);
  } catch {
    return { valid: false, reason: "bad-sig-encoding" };
  }
  const key = await importKey(secret);
  // TS lib bickers about ArrayBufferLike vs ArrayBuffer; the runtime accepts
  // a Uint8Array view fine. Cast through a BufferSource view.
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    sigBytes as unknown as ArrayBuffer,
    ENCODER.encode(body)
  );
  if (!ok) return { valid: false, reason: "sig-mismatch" };
  let payload: NcndaTokenPayload;
  try {
    payload = JSON.parse(DECODER.decode(bytesFromB64url(body)));
  } catch {
    return { valid: false, reason: "bad-json" };
  }
  if (
    typeof payload.exp !== "number" ||
    payload.exp < Math.floor(Date.now() / 1000)
  ) {
    return { valid: false, reason: "expired" };
  }
  if (
    !Array.isArray(payload.projects) ||
    !payload.projects.includes(requiredProject)
  ) {
    return { valid: false, reason: "project-not-allowed" };
  }
  return { valid: true, payload };
}
