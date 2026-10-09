---
name: dtsp-portfolio
version: 1.1.0
app: portfolio
transport: streamable-http
endpoint: /api/mcp
runtime: nextjs-vercel
envelope: dtsp-v1
auth:
  mode: bearer
  anonymous_scope: portfolio:read
  scopes:
    portfolio:read: { token_env: MCP_READ_TOKEN }
    access:admin: { token_env: MCP_ADMIN_TOKEN, includes: [portfolio:read] }
env: [MCP_ADMIN_TOKEN, MCP_READ_TOKEN, BLOB_READ_WRITE_TOKEN]
tools:
  - { name: portfolio_list_projects, scope: portfolio:read, readOnly: true, destructive: false, idempotent: true, openWorld: false }
  - { name: portfolio_get_tech_profile, scope: portfolio:read, readOnly: true, destructive: false, idempotent: true, openWorld: false }
  - { name: portfolio_list_access_requests, scope: access:admin, readOnly: true, destructive: false, idempotent: true, openWorld: false, errors: [forbidden] }
  - { name: portfolio_get_access_request, scope: access:admin, readOnly: true, destructive: false, idempotent: true, openWorld: false, errors: [forbidden, not_found] }
  - { name: portfolio_decide_access_request, scope: access:admin, readOnly: false, destructive: true, idempotent: true, openWorld: false, errors: [forbidden, not_found] }
  - { name: portfolio_list_approved_names, scope: access:admin, readOnly: true, destructive: false, idempotent: true, openWorld: false, errors: [forbidden] }
  - { name: portfolio_revoke_approved_name, scope: access:admin, readOnly: false, destructive: true, idempotent: true, openWorld: false, errors: [forbidden, seed_name] }
clients: [claude-ai, claude-code, cursor, chatgpt-anonymous-read]
cli: none
---

# dtsp-portfolio MCP Contract

Source of truth for `app/api/mcp/route.ts`. Frontmatter is checked against
the route by `ricks-higherdimensional-mcp-machine/scripts/check_contract.py`.
Change this file first, bump `version`, then the code.

Transport is Streamable HTTP because the server is a remote connector for
Claude.ai, Claude Code, Cursor and ChatGPT; stdio does not apply.

Auth tiers: no token = anonymous with `portfolio:read` (the ChatGPT path,
since ChatGPT accepts no static keys); `MCP_ADMIN_TOKEN` = everything
(Claude.ai / Claude Code fixed header). A present but invalid token receives
HTTP 401. A tool called without the scope it needs returns the `forbidden`
envelope with `isError: true`. Admin tools are never reachable anonymously.

## Tools

### portfolio_list_projects

List the public portfolio projects.

**Parameters:** none

**Returns:**
```json
{ "success": true, "data": [ { "id": "deal-whisperer", "title": "...", "subtitle": "...", "category": "...", "blurb": "...", "url": "https://...", "gated": false, "inDev": false, "comingSoon": false } ] }
```

### portfolio_get_tech_profile

Public capabilities list and tech stack by category.

**Parameters:** none

**Returns:**
```json
{ "success": true, "data": { "capabilities": ["..."], "techStack": [ { "category": "...", "items": ["..."] } ] } }
```

### portfolio_list_access_requests

List resume access requests, newest first. Scope `access:admin`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| status | enum | No | pending, approved, denied |
| limit | int | No | 1-200. Default 50 |

**Returns:**
```json
{ "success": true, "data": { "items": [ { "id": "...", "status": "pending", "name": "...", "email": "...", "context": "...", "routineSessionUrl": null, "createdAt": "...", "updatedAt": "..." } ], "total": 1, "has_more": false } }
```

**Errors:** forbidden

### portfolio_get_access_request

Fetch one request by id. Scope `access:admin`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | Request id (22-char base64url) |

**Returns:** `{ "success": true, "data": <AccessRequest> }`

**Errors:** forbidden, not_found

### portfolio_decide_access_request

Approve or deny a request. Approve adds the normalized name to the approved
list; deny removes it. Scope `access:admin`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | Request id |
| action | enum | Yes | approve, deny |

**Returns:** `{ "success": true, "data": <AccessRequest with status/decidedBy/decidedAt> }`

**Errors:** forbidden, not_found

### portfolio_list_approved_names

Seed names (code) plus vetted names (store). Scope `access:admin`.

**Parameters:** none

**Returns:** `{ "success": true, "data": { "seed": ["..."], "approved": ["..."] } }`

**Errors:** forbidden

### portfolio_revoke_approved_name

Remove a vetted name. Seed names are refused. Scope `access:admin`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| fullName | string | Yes | Name as approved; normalized before matching |

**Returns:** `{ "success": true, "data": { "revoked": "<normalized name>" } }`

**Errors:** forbidden, seed_name

## Error Response Format

All tool errors set `isError: true` and return:
```json
{ "success": false, "error": { "code": "forbidden | not_found | seed_name | validation_error | internal", "message": "Human-readable description", "suggestion": "What the caller should do" } }
```

## Pagination

`portfolio_list_access_requests` returns at most `limit` items with
`has_more: false`; the store is small. Cursor pagination is added to the
contract before it is added to the code.

## Client registration

- Claude.ai: Settings → Connectors → Add custom connector → URL above → auth
  = fixed header `Authorization: Bearer <token>`.
- Claude Code: `claude mcp add --transport http dtsp-portfolio <url> --header "Authorization: Bearer <token>"`.
- ChatGPT: Settings → Apps → Advanced → Developer mode → Create app → URL
  above → authentication "No authentication". Gets the two public tools
  only. Admin tools require OAuth 2.1 + DCR on ChatGPT (phase two).
