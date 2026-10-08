// Resume access gate — SERVER ONLY. Never import from a client component.
//
// Design: Rick (the LLM) never sees this list. He collects a name and calls
// the check_resume_access tool; this module does the match, mints a short-
// lived HMAC token, and /api/resume streams the PDF from the PRIVATE Blob
// store only when the signature verifies. Social-engineering Rick yields
// nothing because Rick holds nothing.

import { createHmac, timingSafeEqual } from "crypto";

// Approved recipients. Add a full name here to grant resume access.
export const APPROVED_RESUME_RECIPIENTS: readonly string[] = [
  "Ben Stover",
  "Pete Davidsmeier",
];

// Pathname inside the private Vercel Blob store (uploaded out-of-band).
export const RESUME_BLOB_PATHNAME = "resume/Pete_Davidsmeier_Resume.pdf";
export const RESUME_DOWNLOAD_FILENAME = "Pete_Davidsmeier_Resume.pdf";

// Download links are single-purpose and short-lived.
export const RESUME_TOKEN_TTL_SECONDS = 60 * 10; // 10 minutes

export function normalizeName(raw: string): string {
  return raw
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, " ") // drop punctuation except name-safe chars
    .replace(/\s+/g, " ")
    .trim();
}

export function isApprovedRecipient(name: string): boolean {
  const n = normalizeName(name);
  if (!n) return false;
  return APPROVED_RESUME_RECIPIENTS.some((a) => normalizeName(a) === n);
}

export interface ResumeTokenPayload {
  purpose: "resume";
  name: string; // normalized approved name
  exp: number; // unix seconds
}

function sign(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

export function mintResumeToken(name: string, secret: string): string {
  const payload: ResumeTokenPayload = {
    purpose: "resume",
    name: normalizeName(name),
    exp: Math.floor(Date.now() / 1000) + RESUME_TOKEN_TTL_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

export function verifyResumeToken(
  token: string,
  secret: string
): { valid: true; payload: ResumeTokenPayload } | { valid: false; reason: string } {
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false, reason: "malformed" };
  const [body, sig] = parts;
  const expected = sign(body, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false, reason: "sig-mismatch" };
  }
  let payload: ResumeTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return { valid: false, reason: "bad-json" };
  }
  if (payload.purpose !== "resume") return { valid: false, reason: "wrong-purpose" };
  if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
    return { valid: false, reason: "expired" };
  }
  // Re-check the bank at download time so revoking a name revokes live links.
  if (!isApprovedRecipient(payload.name)) {
    return { valid: false, reason: "not-approved" };
  }
  return { valid: true, payload };
}
