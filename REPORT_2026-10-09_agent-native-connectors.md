# Engineering Report: Agent-Native Connectors

**To:** Lead Engineer
**From:** Rick (DTSP-AI engineering)
**Date:** 2026-10-09
**Scope:** Portfolio resume gate, MCP surface, and the reusable pattern for every DTSP-AI app
**Status:** Built, verified locally, uncommitted. Three owner actions unlock production.

---

## 1. Summary

Pete ratified two laws today:

1. **Agent-native architecture.** Every web app we build ships a remote MCP connector (and a CLI where it fits) so agents and humans are both first-class operators.
2. **Scale.** A connector is done only when it works deployed, on the real domain, across N instances, from a real client.

The Portfolio is the smoke test. It now has an autonomous resume-vetting flow and a contract-driven MCP server, both verified. The pattern is packaged as two skills so it ports to Fight_Trainer (brand: FightCoachHQ) and every app after it.

## 2. What was built

### 2.1 Resume access vetting (Portfolio)

| Piece | Location | Role |
|---|---|---|
| Store | `lib/access-vetting/store.ts` | Approved names + request records in private Vercel Blob. Deterministic request id, 24h dedup. |
| Routine fire | `lib/access-vetting/routine.ts` | One POST to a Claude Code routine with name, email, context, signed links. |
| Decision tokens | `lib/access-vetting/decision.ts` | HMAC approve/deny links, 7-day TTL. |
| Decision route | `app/api/access-decision/route.ts` | The link Pete taps. |
| Agent tools | `app/api/chat/route.ts` | `check_resume_access` (now async, reads store) + `request_resume_access` (new). |
| Agent contract | `lib/rick-prompt.ts` | Miss path collects email, reads six statuses. |

Flow: visitor gives name → not on list → Rick collects email → one request record → routine fires → Claude researches the person with web search and sends Pete a dossier via his Slack/Gmail connector → Pete taps approve → next ask drops the resume.

### 2.2 MCP server (Portfolio)

- `portfolio.mcp.md` — contract with YAML frontmatter, the source of truth.
- `app/api/mcp/route.ts` — Streamable HTTP via `mcp-handler@2`, server name `dtsp-portfolio`, seven tools, `dtsp-v1` envelope, two-tier bearer auth (read token / admin token), per-tool admin scope check.

Tools: `portfolio_list_projects`, `portfolio_get_tech_profile` (read), `portfolio_list_access_requests`, `portfolio_get_access_request`, `portfolio_decide_access_request`, `portfolio_list_approved_names`, `portfolio_revoke_approved_name` (admin).

### 2.3 Skills (global, DTSP-AI neutral)

- **`ricks-higherdimensional-mcp-machine`** — the one MCP skill. Contract spec, `check_contract.py` (validates a contract and proves code sync, fails on drift or a missing admin guard), templates for Next.js and FastAPI, dated auth/client facts, the scale law, a hard-stop delivery gate, evals. Supersedes `mcp-architect`'s table contract.
- **`access-vetting`** — the gated-asset pattern: modules, routine prompt, Supabase SQL for FastAPI apps, delivery gate. Points at the MCP skill for the connector.

## 3. Verification (what actually ran)

| Check | Result |
|---|---|
| `tsc --noEmit`, `next build` | clean |
| Live MCP smoke (port 3111) | no token → 401; read token → tools/list + read tool `success:true`; read token on admin tool → `isError`, `forbidden`; admin token → `success:true`; bogus id → `not_found`; port killed |
| Contract ↔ route | `check_contract.py` OK (it caught five missing `destructiveHint`s first; fixed) |
| Checker negatives | wrong hint → FAIL; guard removed in TS → FAIL; guard removed in Python → FAIL |
| FastAPI template | compiles, passes checker |
| Decision tokens / request ids | mint→verify OK; tampered and wrong-secret rejected; id stable across case |
| Skills | Tim's `quick_validate.py` → valid (both) |

Not run: deployed smoke from a real client (needs tokens on Vercel), the routine end-to-end (needs the routine created), Tim's benchmark loop (prompts drafted).

## 4. Facts that shaped the design (all checked 2026-10-09)

- **LinkedIn** has no third-party person lookup outside its partner program; marketplace "lookups" are scrapers. We vet with Claude web search + email-domain triage instead.
- **Claude Code routines** fire by HTTP POST with a text payload; 30/routine/hour; payload is untrusted and the prompt must opt in. Pro/Max/Team/Enterprise.
- **Claude.ai custom connectors** accept a fixed bearer header on every plan.
- **ChatGPT** does not accept static keys. OAuth 2.1 + dynamic client registration, or anonymous read-only. Push into a chat is MCP Events (Work chats, MCP 2.0, draft spec).
- **Scale:** protocol 2026-07-28 is sessionless on both SDKs; legacy clients are served stateless. Python needs shared request-state keys, host allowlist, proxy headers; subscriptions need a shared bus we do not have yet.
- **Transport vs language:** hosting requires Streamable HTTP, not TypeScript. Next.js apps use TS; FastAPI apps mount a Python `MCPServer` in-process so tools share the UI's services.

## 5. Plan

| Phase | What | Blocker |
|---|---|---|
| 0 (now) | Set `MCP_ADMIN_TOKEN`/`MCP_READ_TOKEN` on the Vercel project; register the production URL as a Claude.ai connector; run one read + one admin tool; create the vetting routine and set its URL/token; commit. | Owner actions only |
| 1 | OAuth 2.1 authorization server, built once. Candidate: Supabase Auth (in-stack for Fight_Trainer). Docs check first. | Decision: proceed on Supabase pending verification |
| 2 | Fight_Trainer MCP: contract first (sessions list/book, fighter metrics), Python server in-process, multi-worker deploy config, CLI twin, deployed smoke. | Decision: v1 tool list |
| 3 | ChatGPT connector via OAuth; MCP Events push when a shared pub/sub bus exists. | Phase 1 |
| 4 | Roll the skill across every app; `check_contract.py` in CI. | — |

## 6. Open items and flags

- 🟠 `mcp-architect` skill: superseded for contracts, still the only local stdio scaffold. Delete or trim to a pointer. Owner decision.
- 🟠 Seed names in `lib/resume-access.ts` cannot be revoked via the store. Drop the seed array once Blob is populated. ~5 lines.
- 🟠 `tims-skill-creator-prime/scripts/quick_validate.py` reads without UTF-8 and crashes on Windows on its own ⛔. Workaround: `py -3.13 -I -X utf8`. One-line fix if the owner wants it.
- 🟡 Anthropic's synced `mcp-builder` Python reference predates py SDK v2; our template follows current docs.
- 🟡 Python Streamable HTTP stateless mode confirmed for legacy clients; sessionless by default on 2026-07-28.

## 7. Repo state

Branch `main`. Nothing committed or pushed (git was denied in the build session). Before committing: `git config user.email` must return `combatperformfit@gmail.com`.

Changed/new in `Portfolio/`: `lib/access-vetting/{store,routine,decision}.ts`, `app/api/access-decision/route.ts`, `app/api/mcp/route.ts`, `portfolio.mcp.md`, `lib/resume-access.ts`, `app/api/chat/route.ts`, `lib/rick-prompt.ts`, `.env.local.example`, `package.json`, `package-lock.json`, this report.
