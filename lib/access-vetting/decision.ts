// Signed approve/deny links — SERVER ONLY.
// Same HMAC scheme as lib/resume-access.ts so one secret covers the gate.

import { createHmac, timingSafeEqual } from "crypto";

export const DECISION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface DecisionPayload {
  purpose: "access-decision";
  id: string;
  action: "approve" | "deny";
  exp: number;
}

function sign(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

export function mintDecisionToken(
  id: string,
  action: DecisionPayload["action"],
  secret: string
): string {
  const payload: DecisionPayload = {
    purpose: "access-decision",
    id,
    action,
    exp: Math.floor(Date.now() / 1000) + DECISION_TTL_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

export function verifyDecisionToken(
  token: string,
  secret: string
): { valid: true; payload: DecisionPayload } | { valid: false; reason: string } {
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false, reason: "malformed" };
  const [body, sig] = parts;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(body, secret));
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false, reason: "sig-mismatch" };
  }
  let payload: DecisionPayload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return { valid: false, reason: "bad-json" };
  }
  if (payload.purpose !== "access-decision") {
    return { valid: false, reason: "wrong-purpose" };
  }
  if (payload.action !== "approve" && payload.action !== "deny") {
    return { valid: false, reason: "bad-action" };
  }
  if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
    return { valid: false, reason: "expired" };
  }
  return { valid: true, payload };
}

export function decisionUrls(
  baseUrl: string,
  id: string,
  secret: string
): { approveUrl: string; denyUrl: string } {
  const mk = (action: DecisionPayload["action"]) =>
    `${baseUrl}/api/access-decision?token=${encodeURIComponent(
      mintDecisionToken(id, action, secret)
    )}`;
  return { approveUrl: mk("approve"), denyUrl: mk("deny") };
}
