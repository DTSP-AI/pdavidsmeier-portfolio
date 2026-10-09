// Portfolio MCP server — the agent-facing surface of this app.
//
// CONTRACT: portfolio.mcp.md at the repo root is the source of truth
// (mcp-architect law: contract first, every tool matches it exactly).
// Change the contract, then this file. Never the reverse.
//
// Architecture law (2026-10-09): every DTSP-AI app ships an MCP connector so
// agents and humans are both first-class operators. This is the reference.
//
// Transport: Streamable HTTP at /api/mcp (mcp-handler v2, Vercel docs
// 2026-09-18). mcp-architect's stdio scaffold is for local Claude Code
// servers; a remote connector for Claude.ai / ChatGPT must be HTTP.
// Auth: bearer token via withMcpAuth. Claude.ai custom connectors send a
// fixed bearer header; Claude Code / Cursor do too. ChatGPT requires
// OAuth 2.1 (no static keys) — phase two.
//
// Tools are thin wrappers over the same modules the UI uses. No logic lives
// here; if a tool needs something new, add it to lib/ and call it.

import type { AuthInfo } from "@modelcontextprotocol/server";
import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";
import { projects, capabilities, techStack } from "@/lib/projects";
import {
  decideRequest,
  getApprovedNames,
  getRequest,
  listRequests,
  removeApprovedName,
} from "@/lib/access-vetting/store";
import { APPROVED_RESUME_RECIPIENTS, normalizeName } from "@/lib/resume-access";

export const maxDuration = 60;

const SCOPE_READ = "portfolio:read";
const SCOPE_ADMIN = "access:admin";

// ── Response envelope (contract: "Error Response Format") ──────────
type ErrorCode = "forbidden" | "not_found" | "seed_name" | "validation_error" | "internal";

function ok(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify({ success: true, data }, null, 2) }],
  };
}

function fail(code: ErrorCode, message: string, suggestion: string) {
  return {
    isError: true,
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({ success: false, error: { code, message, suggestion } }, null, 2),
      },
    ],
  };
}

// Per-tool scope gate. withMcpAuth only enforces the handler-wide
// requiredScopes (read); admin tools check the admin scope themselves.
function isAdmin(extra: { http?: { authInfo?: AuthInfo } }): boolean {
  return extra.http?.authInfo?.scopes.includes(SCOPE_ADMIN) === true;
}
const FORBIDDEN = fail(
  "forbidden",
  "access:admin scope required",
  "Connect with MCP_ADMIN_TOKEN to use owner tools."
);

// Every tool body runs inside this so an exception becomes a contract error,
// not a transport failure.
async function guarded(fn: () => Promise<ReturnType<typeof ok>>) {
  try {
    return await fn();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[mcp] tool error:", message);
    return fail("internal", message, "Retry; if it persists check Blob/env configuration.");
  }
}

const handler = createMcpHandler(
  (server) => {
    // ── Public portfolio surface ─────────────────────────────────────
    server.registerTool(
      "portfolio_list_projects",
      {
        description:
          "List the projects on Pete Davidsmeier's portfolio: id, title, subtitle, category, public blurb, URL, and whether the project is gated behind an NCNDA.",
        inputSchema: z.object({}),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      async () =>
        guarded(async () =>
          ok(
            projects.map((p) => ({
              id: p.id,
              title: p.title,
              subtitle: p.subtitle,
              category: p.category,
              blurb: p.blurb,
              url: p.url,
              gated: p.gated === true,
              inDev: p.inDev === true,
              comingSoon: p.comingSoon === true,
            }))
          )
        )
    );

    server.registerTool(
      "portfolio_get_tech_profile",
      {
        description:
          "Pete's public capabilities list and tech stack by category, as shown on the portfolio.",
        inputSchema: z.object({}),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      async () => guarded(async () => ok({ capabilities, techStack }))
    );

    // ── Access-vetting admin surface (owner only) ────────────────────
    server.registerTool(
      "portfolio_list_access_requests",
      {
        description:
          "List resume access requests (newest first). Filter by status: pending, approved, denied. Owner-only.",
        inputSchema: z.object({
          status: z.enum(["pending", "approved", "denied"]).optional(),
          limit: z.number().int().min(1).max(200).default(50),
        }),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      async ({ status, limit }, extra) => {
        if (!isAdmin(extra)) return FORBIDDEN;
        return guarded(async () => {
          const items = await listRequests(status, limit);
          return ok({ items, total: items.length, has_more: false });
        });
      }
    );

    server.registerTool(
      "portfolio_get_access_request",
      {
        description:
          "Fetch one resume access request by id, including the routine session URL if the vetting routine ran. Owner-only.",
        inputSchema: z.object({ id: z.string().min(8) }),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      async ({ id }, extra) => {
        if (!isAdmin(extra)) return FORBIDDEN;
        return guarded(async () => {
          const r = await getRequest(id);
          return r
            ? ok(r)
            : fail("not_found", `No access request with id ${id}`, "List requests to find a valid id.");
        });
      }
    );

    server.registerTool(
      "portfolio_decide_access_request",
      {
        description:
          "Approve or deny a resume access request. Approve adds the person to the approved list so Rick hands them the resume on their next ask; deny blocks them. Owner-only. Reversible only by the opposite decision.",
        inputSchema: z.object({
          id: z.string().min(8),
          action: z.enum(["approve", "deny"]),
        }),
        annotations: {
          readOnlyHint: false,
          destructiveHint: true,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async ({ id, action }, extra) => {
        if (!isAdmin(extra)) return FORBIDDEN;
        return guarded(async () => {
          const r = await decideRequest(id, action, "pete");
          return r
            ? ok(r)
            : fail("not_found", `No access request with id ${id}`, "List requests to find a valid id.");
        });
      }
    );

    server.registerTool(
      "portfolio_list_approved_names",
      {
        description:
          "List everyone currently approved for the resume: seed names (code) and names approved through vetting (store). Owner-only.",
        inputSchema: z.object({}),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      async (_args, extra) => {
        if (!isAdmin(extra)) return FORBIDDEN;
        return guarded(async () =>
          ok({
            seed: APPROVED_RESUME_RECIPIENTS.map(normalizeName),
            approved: await getApprovedNames(),
          })
        );
      }
    );

    server.registerTool(
      "portfolio_revoke_approved_name",
      {
        description:
          "Remove a vetted name from the approved list. Seed names in code cannot be revoked here. Owner-only.",
        inputSchema: z.object({ fullName: z.string().min(2) }),
        annotations: {
          readOnlyHint: false,
          destructiveHint: true,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async ({ fullName }, extra) => {
        if (!isAdmin(extra)) return FORBIDDEN;
        return guarded(async () => {
          const n = normalizeName(fullName);
          if (APPROVED_RESUME_RECIPIENTS.map(normalizeName).includes(n)) {
            return fail(
              "seed_name",
              `${n} is a seed name defined in code`,
              "Edit APPROVED_RESUME_RECIPIENTS in lib/resume-access.ts and redeploy."
            );
          }
          await removeApprovedName(n);
          return ok({ revoked: n });
        });
      }
    );
  },
  { serverInfo: { name: "dtsp-portfolio", version: "1.1.0" } }
);

// Auth tiers (contract: auth.anonymous_scope = portfolio:read).
//   no token          -> anonymous, public read tools only. This is the
//                        ChatGPT path: ChatGPT accepts no static keys, only
//                        OAuth 2.1 or anonymous read-only (DOCUMENTED 2026-10-09).
//   MCP_READ_TOKEN    -> same as anonymous, kept for clients that want a header.
//   MCP_ADMIN_TOKEN   -> everything. Claude.ai / Claude Code fixed header.
//   wrong token       -> 401. A present-but-invalid credential is never
//                        silently downgraded to anonymous.
const verifyToken = async (
  _req: Request,
  bearerToken?: string
): Promise<AuthInfo | undefined> => {
  if (!bearerToken) return undefined;
  const admin = process.env.MCP_ADMIN_TOKEN;
  const read = process.env.MCP_READ_TOKEN;
  if (admin && bearerToken === admin) {
    return { token: bearerToken, clientId: "owner", scopes: [SCOPE_READ, SCOPE_ADMIN] };
  }
  if (read && bearerToken === read) {
    return { token: bearerToken, clientId: "reader", scopes: [SCOPE_READ] };
  }
  throw new Error("invalid bearer token");
};

const authHandler = withMcpAuth(handler, verifyToken, {
  required: false,
  resourceMetadataPath: "/.well-known/oauth-protected-resource",
});

export { authHandler as GET, authHandler as POST, authHandler as DELETE };
