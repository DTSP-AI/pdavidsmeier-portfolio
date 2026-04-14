// Shared types for the portfolio NCNDA template registry.
// Each gated project declares an NdaKey that selects one of these
// templates. Signing an NDA only unlocks projects sharing its disclosing
// party — different parties require separate signatures.

export type NdaKey = "dtsp" | "dealwhisper";

export interface NcndaMetadata {
  // Full legal name of the disclosing party as it appears in the document.
  disclosingPartyName: string;
  // Entity descriptor, e.g. "a Florida limited liability company".
  entityDescriptor: string;
  // Version stamp persisted alongside each signed record.
  version: string;
  // Paragraphs shown in the modal summary preview (inside <p> blocks).
  // The first paragraph is rendered with {{NAME}} / {{ENTITY}} tokens
  // replaced client-side.
  summaryParagraphs: string[];
  // Footer line shown at the bottom of the modal (e.g. "DTSP ... · Confidential").
  footerLine: string;
}

export interface NcndaTemplate {
  key: NdaKey;
  metadata: NcndaMetadata;
  // Body string with {{EFFECTIVE_DATE}}, {{RECIPIENT_*}}, {{EXHIBIT_A_PROJECTS}} tokens.
  body: string;
}

export interface NcndaFillInput {
  effectiveDate: string;
  recipientName: string;
  recipientEntity: string;
  recipientRole: string;
  recipientEmail: string;
  recipientPhone: string;
  gatedProjectTitles: string[];
}
