import { verifyDecisionToken } from "@/lib/access-vetting/decision";
import { decideRequest } from "@/lib/access-vetting/store";

export const maxDuration = 30;

function page(title: string, body: string, status = 200): Response {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title><style>body{font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem;color:#191919}h1{font-size:1.25rem}</style></head><body><h1>${title}</h1><p>${body}</p></body></html>`,
    {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store",
      },
    }
  );
}

// GET /api/access-decision?token=<signed>
// The link Pete taps from the vetting notification. One tap, one decision.
export async function GET(req: Request) {
  const secret = process.env.NCNDA_GATE_SECRET;
  if (!secret) return page("Server misconfigured", "Gate secret is not set.", 500);

  const token = new URL(req.url).searchParams.get("token") ?? "";
  const check = verifyDecisionToken(token, secret);
  if (!check.valid) return page("Link invalid", "This decision link is expired or malformed.", 403);

  const { id, action } = check.payload;
  const record = await decideRequest(id, action, "pete");
  if (!record) return page("Not found", "No access request matches this link.", 404);

  const verb = action === "approve" ? "Approved" : "Denied";
  return page(
    `${verb}: ${record.name}`,
    `${record.name} &lt;${record.email}&gt; is now <strong>${record.status}</strong>. ` +
      (action === "approve"
        ? "They can ask Rick for the resume again and the button will drop."
        : "Rick will tell them Pete passed if they ask again.")
  );
}
