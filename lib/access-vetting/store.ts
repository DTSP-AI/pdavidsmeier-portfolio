// Access-vetting store — SERVER ONLY.
//
// Reproducible pattern (see ~/.claude/skills/access-vetting): a gated asset
// keeps an approved list and a log of pending requests in the app's own
// persistence layer. This app persists to the private Vercel Blob store.
// Other stacks swap this file for a Supabase/Postgres implementation with
// the same exported function signatures.

import { get, put, list, BlobNotFoundError } from "@vercel/blob";
import { createHash } from "crypto";

export type RequestStatus = "pending" | "approved" | "denied";

export interface AccessRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: RequestStatus;
  name: string; // as given
  normalizedName: string;
  email: string;
  context: string; // what they said / where they came from
  routineSessionUrl: string | null;
  decidedBy: "pete" | "routine" | null;
  decidedAt: string | null;
}

interface ApprovedFile {
  names: string[]; // normalized
  updatedAt: string;
}

const APPROVED_PATH = "access-vetting/approved.json";
const REQUEST_DIR = "access-vetting/requests";
const REQUEST_DEDUP_WINDOW_MS = 24 * 60 * 60 * 1000;

function blobToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  return token;
}

async function readJson<T>(pathname: string): Promise<T | null> {
  try {
    const blob = await get(pathname, { access: "private", token: blobToken() });
    if (!blob || blob.statusCode !== 200) return null;
    const text = await new Response(blob.stream).text();
    return JSON.parse(text) as T;
  } catch (err) {
    if (err instanceof BlobNotFoundError) return null;
    throw err;
  }
}

async function writeJson(pathname: string, value: unknown): Promise<void> {
  await put(pathname, JSON.stringify(value, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: blobToken(),
  });
}

// ── Approved list ───────────────────────────────────────────────────

export async function getApprovedNames(): Promise<string[]> {
  const file = await readJson<ApprovedFile>(APPROVED_PATH);
  return file?.names ?? [];
}

export async function addApprovedName(normalizedName: string): Promise<void> {
  const current = await getApprovedNames();
  if (current.includes(normalizedName)) return;
  await writeJson(APPROVED_PATH, {
    names: [...current, normalizedName],
    updatedAt: new Date().toISOString(),
  } satisfies ApprovedFile);
}

export async function removeApprovedName(normalizedName: string): Promise<void> {
  const current = await getApprovedNames();
  await writeJson(APPROVED_PATH, {
    names: current.filter((n) => n !== normalizedName),
    updatedAt: new Date().toISOString(),
  } satisfies ApprovedFile);
}

// ── Requests ────────────────────────────────────────────────────────

// Deterministic id: the same person asking twice maps to the same record,
// which is what stops a visitor from firing the routine on every retry.
export function requestIdFor(normalizedName: string, email: string): string {
  return createHash("sha256")
    .update(`${normalizedName}|${email.toLowerCase()}`)
    .digest("base64url")
    .slice(0, 22);
}

function requestPath(id: string): string {
  return `${REQUEST_DIR}/${id}.json`;
}

export async function getRequest(id: string): Promise<AccessRequest | null> {
  return readJson<AccessRequest>(requestPath(id));
}

export async function saveRequest(record: AccessRequest): Promise<void> {
  await writeJson(requestPath(record.id), record);
}

// Newest first. Used by the MCP admin surface (app/api/mcp/route.ts).
export async function listRequests(
  status?: RequestStatus,
  limit = 50
): Promise<AccessRequest[]> {
  const page = await list({ prefix: `${REQUEST_DIR}/`, limit: 500, token: blobToken() });
  const records = await Promise.all(
    page.blobs.map((b) => readJson<AccessRequest>(b.pathname))
  );
  return records
    .filter((r): r is AccessRequest => r !== null && (!status || r.status === status))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit);
}

export interface UpsertResult {
  record: AccessRequest;
  // true when this call created a new pending record that should be vetted
  shouldFire: boolean;
}

export async function upsertRequest(input: {
  name: string;
  normalizedName: string;
  email: string;
  context: string;
}): Promise<UpsertResult> {
  const id = requestIdFor(input.normalizedName, input.email);
  const existing = await getRequest(id);
  const now = new Date();

  if (existing) {
    if (existing.status !== "pending") {
      return { record: existing, shouldFire: false };
    }
    const age = now.getTime() - new Date(existing.createdAt).getTime();
    if (age < REQUEST_DEDUP_WINDOW_MS) {
      return { record: existing, shouldFire: false };
    }
    // Stale pending request: refresh and vet again.
    const refreshed: AccessRequest = {
      ...existing,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      context: input.context,
      routineSessionUrl: null,
    };
    await saveRequest(refreshed);
    return { record: refreshed, shouldFire: true };
  }

  const record: AccessRequest = {
    id,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    status: "pending",
    name: input.name,
    normalizedName: input.normalizedName,
    email: input.email.toLowerCase(),
    context: input.context,
    routineSessionUrl: null,
    decidedBy: null,
    decidedAt: null,
  };
  await saveRequest(record);
  return { record, shouldFire: true };
}

export async function decideRequest(
  id: string,
  action: "approve" | "deny",
  decidedBy: AccessRequest["decidedBy"]
): Promise<AccessRequest | null> {
  const record = await getRequest(id);
  if (!record) return null;
  const now = new Date().toISOString();
  const updated: AccessRequest = {
    ...record,
    status: action === "approve" ? "approved" : "denied",
    decidedBy,
    decidedAt: now,
    updatedAt: now,
  };
  await saveRequest(updated);
  if (action === "approve") {
    await addApprovedName(record.normalizedName);
  } else {
    await removeApprovedName(record.normalizedName);
  }
  return updated;
}
