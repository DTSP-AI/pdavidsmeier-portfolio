// Registry for per-disclosing-party NCNDA templates.
//
// Each gated project in lib/projects.ts declares an ndaKey that selects one
// of these templates. Signing an NDA only unlocks projects sharing the same
// disclosing party — different parties require separate signatures. This is
// the critical invariant enforced by the access-request route.

import type { NdaKey, NcndaTemplate, NcndaFillInput } from "./types";
import { dtspTemplate } from "./dtsp";
import { dealwhisperTemplate } from "./dealwhisper";

const templates: Record<NdaKey, NcndaTemplate> = {
  dtsp: dtspTemplate,
  dealwhisper: dealwhisperTemplate,
};

export function getNcndaTemplate(key: NdaKey): NcndaTemplate {
  const tpl = templates[key];
  if (!tpl) {
    throw new Error(`Unknown NDA key: ${key}`);
  }
  return tpl;
}

export function fillNcnda(key: NdaKey, input: NcndaFillInput): string {
  const { body } = getNcndaTemplate(key);
  const exhibitA = input.gatedProjectTitles
    .map((title, i) => `${i + 1}. ${title}`)
    .join("\n");
  return body
    .replaceAll("{{EFFECTIVE_DATE}}", input.effectiveDate)
    .replaceAll("{{RECIPIENT_NAME}}", input.recipientName)
    .replaceAll("{{RECIPIENT_ENTITY}}", input.recipientEntity)
    .replaceAll("{{RECIPIENT_ROLE}}", input.recipientRole)
    .replaceAll("{{RECIPIENT_EMAIL}}", input.recipientEmail)
    .replaceAll("{{RECIPIENT_PHONE}}", input.recipientPhone)
    .replaceAll("{{EXHIBIT_A_PROJECTS}}", exhibitA);
}

export type { NdaKey, NcndaTemplate, NcndaMetadata, NcndaFillInput } from "./types";
