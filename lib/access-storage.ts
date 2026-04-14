import { put } from "@vercel/blob";

export interface AccessRequestRecord {
  id: string;
  createdAt: string;
  ncndaVersion: string;
  role: "employer" | "recruiter" | "vc";
  name: string;
  email: string;
  phone: string;
  company: string;
  gatedProjects: string[];
  signature: {
    typedName: string;
    agreedAt: string;
    ipAddress: string | null;
    userAgent: string | null;
  };
  renderedNcnda: string;
}

export async function persistAccessRequest(record: AccessRequestRecord): Promise<{
  url: string;
  pathname: string;
}> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not configured. Provision a Vercel Blob store and set the token in env."
    );
  }

  const safeEmail = record.email.replace(/[^a-zA-Z0-9._-]/g, "_");
  const pathname = `access-requests/${record.createdAt.slice(0, 10)}/${record.id}-${safeEmail}.json`;

  // Store is provisioned with --access private; SDK v2.3+ supports this
  // directly. Blob URLs from a private store are not publicly fetchable.
  const blob = await put(pathname, JSON.stringify(record, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: true,
    token,
  });

  return { url: blob.url, pathname: blob.pathname };
}
