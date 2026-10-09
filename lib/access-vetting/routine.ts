// Fire a Claude Code routine with the request details — SERVER ONLY.
//
// Docs (checked 2026-10-09):
//   https://platform.claude.com/docs/en/api/claude-code/routines-fire
// POST {CLAUDE_ROUTINE_FIRE_URL} with Authorization: Bearer <per-routine
// token>. Body {text} is freeform, max 65,536 chars, and reaches the routine
// wrapped as untrusted data; the routine's saved prompt must reference the
// <routine-fire-payload> block explicitly. No idempotency key: the caller
// (store.upsertRequest) is responsible for firing once per request.

export interface FirePayload {
  app: string; // e.g. "portfolio"
  asset: string; // e.g. "resume"
  requestId: string;
  name: string;
  email: string;
  context: string;
  approveUrl: string;
  denyUrl: string;
}

export type FireResult =
  | { fired: true; sessionUrl: string }
  | { fired: false; reason: string };

export function formatFireText(p: FirePayload): string {
  return [
    "ACCESS VETTING REQUEST",
    `app: ${p.app}`,
    `asset: ${p.asset}`,
    `request_id: ${p.requestId}`,
    `name: ${p.name}`,
    `email: ${p.email}`,
    `context: ${p.context}`,
    `approve_url: ${p.approveUrl}`,
    `deny_url: ${p.denyUrl}`,
  ].join("\n");
}

export async function fireVettingRoutine(p: FirePayload): Promise<FireResult> {
  const url = process.env.CLAUDE_ROUTINE_FIRE_URL;
  const token = process.env.CLAUDE_ROUTINE_FIRE_TOKEN;
  if (!url || !token) {
    return { fired: false, reason: "routine-not-configured" };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: formatFireText(p) }),
  });

  if (!res.ok) {
    return { fired: false, reason: `http-${res.status}` };
  }
  const json = (await res.json()) as { claude_code_session_url?: string };
  return {
    fired: true,
    sessionUrl: json.claude_code_session_url ?? "",
  };
}
