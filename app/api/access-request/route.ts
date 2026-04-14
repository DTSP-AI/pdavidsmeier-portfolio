import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { projects } from "@/lib/projects";
import { fillNcnda, getNcndaTemplate } from "@/lib/ncnda-templates";
import {
  persistAccessRequest,
  type AccessRequestRecord,
} from "@/lib/access-storage";
import { mintNcndaToken } from "@/lib/ncnda-token";

// One signature only unlocks gated projects sharing the same disclosing
// party (ndaKey). A signer viewing Deal Whisperer signs the DealWhisper Inc.
// NDA and only receives tokens for DealWhisper-owned projects; a signer
// viewing a DTSP-owned project signs the DTSP NDA and only receives tokens
// for DTSP-owned projects. Different parties require separate signatures.
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export const maxDuration = 30;

const ALLOWED_ROLES = new Set(["employer", "recruiter", "vc"]);

interface IncomingPayload {
  role?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  typedSignature?: string;
  agreed?: boolean;
  projectIds?: string[];
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

export async function POST(req: Request) {
  let payload: IncomingPayload;
  try {
    payload = (await req.json()) as IncomingPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const role = (payload.role ?? "").toLowerCase().trim();
  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim().toLowerCase();
  const phoneRaw = (payload.phone ?? "").trim();
  const company = (payload.company ?? "").trim();
  const typedSignature = (payload.typedSignature ?? "").trim();
  const agreed = payload.agreed === true;
  const projectIds = Array.isArray(payload.projectIds) ? payload.projectIds : [];

  if (!ALLOWED_ROLES.has(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (phoneRaw.replace(/\D/g, "").length < 7) {
    return NextResponse.json({ error: "Valid phone is required" }, { status: 400 });
  }
  if (!company) {
    return NextResponse.json(
      { error: "Company / Firm name is required" },
      { status: 400 }
    );
  }
  if (!agreed) {
    return NextResponse.json(
      { error: "You must agree to the NCNDA terms" },
      { status: 400 }
    );
  }
  if (typedSignature.toLowerCase() !== name.toLowerCase()) {
    return NextResponse.json(
      { error: "Typed signature must exactly match your name" },
      { status: 400 }
    );
  }

  // Signing the NCNDA grants access to every gated project sharing the
  // same disclosing party (ndaKey) as whichever project the user clicked.
  // We do NOT mint tokens spanning NDA keys: binding a recipient under
  // DealWhisper Inc.'s NDA cannot grant access to DTSP-owned projects and
  // vice versa.
  if (projectIds.length === 0) {
    return NextResponse.json(
      { error: "projectIds is required" },
      { status: 400 }
    );
  }
  const clicked = projects.find(
    (p) => p.id === projectIds[0] && p.gated && p.ndaKey
  );
  if (!clicked || !clicked.ndaKey) {
    return NextResponse.json(
      { error: "Requested project is not gated" },
      { status: 400 }
    );
  }
  const activeNdaKey = clicked.ndaKey;
  const unlockable = projects.filter(
    (p) => p.gated && p.ndaKey === activeNdaKey
  );
  if (unlockable.length === 0) {
    return NextResponse.json(
      { error: "No gated projects configured for this NDA" },
      { status: 500 }
    );
  }

  const phone = normalizePhone(phoneRaw);
  const createdAt = new Date().toISOString();
  const id = randomUUID();

  const roleLabel =
    role === "employer"
      ? "Employer"
      : role === "recruiter"
        ? "Recruiter"
        : "Venture Capital / Investor";

  const activeTemplate = getNcndaTemplate(activeNdaKey);
  const renderedNcnda = fillNcnda(activeNdaKey, {
    effectiveDate: createdAt.slice(0, 10),
    recipientName: name,
    recipientEntity: company,
    recipientRole: roleLabel,
    recipientEmail: email,
    recipientPhone: phone,
    gatedProjectTitles: unlockable.map((p) => `${p.title} — ${p.subtitle}`),
  });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;
  const userAgent = req.headers.get("user-agent") ?? null;

  const record: AccessRequestRecord = {
    id,
    createdAt,
    ncndaVersion: activeTemplate.metadata.version,
    role: role as AccessRequestRecord["role"],
    name,
    email,
    phone,
    company,
    gatedProjects: unlockable.map((p) => p.id),
    signature: {
      typedName: typedSignature,
      agreedAt: createdAt,
      ipAddress: ip,
      userAgent,
    },
    renderedNcnda,
  };

  const secret = process.env.NCNDA_GATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Server misconfigured: NCNDA_GATE_SECRET is not set" },
      { status: 500 }
    );
  }

  try {
    await persistAccessRequest(record);
    const expSeconds = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
    const token = await mintNcndaToken(
      {
        id,
        exp: expSeconds,
        projects: unlockable.map((p) => p.id),
      },
      secret
    );
    return NextResponse.json({
      ok: true,
      id,
      unlockedProjects: unlockable.map((p) => {
        const sep = p.url && p.url.includes("?") ? "&" : "?";
        return {
          id: p.id,
          title: p.title,
          url: p.url ? `${p.url}${sep}ncnda=${token}` : null,
        };
      }),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Storage failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
