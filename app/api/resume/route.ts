import { get } from "@vercel/blob";
import {
  RESUME_BLOB_PATHNAME,
  RESUME_DOWNLOAD_FILENAME,
  verifyResumeToken,
} from "@/lib/resume-access";

export const maxDuration = 30;

// GET /api/resume?token=<signed>
// The PDF never lives in the repo or in /public. It is streamed from the
// private Blob store only when the HMAC token from check_resume_access
// verifies. Anything else gets a 403 with no body worth reading.
export async function GET(req: Request) {
  const secret = process.env.NCNDA_GATE_SECRET;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!secret || !blobToken) {
    return new Response("Server misconfigured", { status: 500 });
  }

  const token = new URL(req.url).searchParams.get("token") ?? "";
  const check = await verifyResumeToken(token, secret);
  if (!check.valid) {
    return new Response("Forbidden", { status: 403 });
  }

  const blob = await get(RESUME_BLOB_PATHNAME, {
    access: "private",
    token: blobToken,
  });
  if (!blob || blob.statusCode !== 200) {
    return new Response("Resume not available", { status: 404 });
  }

  return new Response(blob.stream, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${RESUME_DOWNLOAD_FILENAME}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
