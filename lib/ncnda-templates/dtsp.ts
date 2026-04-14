import type { NcndaTemplate } from "./types";

// DTSP Agentic Technologies LLC one-way NDA.
// Mirrors NDCA_DTSP_Agentic_Technologies_LLC.md in the repo root.
// Do not edit the body here without syncing the source document.

export const dtspTemplate: NcndaTemplate = {
  key: "dtsp",
  metadata: {
    disclosingPartyName: "DTSP Agentic Technologies LLC",
    entityDescriptor: "a Florida limited liability company",
    version: "2026-04-v1",
    summaryParagraphs: [
      "By signing, {{NAME}} on behalf of {{ENTITY}} agrees to hold all Confidential Information of DTSP Agentic Technologies LLC in strict confidence, use it solely to evaluate a potential engagement, and refrain from disclosing, copying, reverse engineering, or feeding it into any third-party AI, ML, or training system without prior written consent.",
      "Confidential Information includes source code, multi-agent architectures, LangGraph definitions, agent contracts, system prompts, datasets, knowledge graphs, product designs, financials, and all derivatives. Obligations survive for five (5) years, and in perpetuity for trade secrets. Governed by Florida law, venue in Miami-Dade County, jury trial waived.",
      "Full agreement is captured and stored with your signature. Typing your name below constitutes an electronic signature under 15 U.S.C. § 7001 (E-SIGN) and Florida law.",
    ],
    footerLine: "DTSP Agentic Technologies LLC · Confidential",
  },
  body: `# NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT (NDCA)

**Effective Date:** {{EFFECTIVE_DATE}}

**Disclosing Party:**
DTSP Agentic Technologies LLC
a Florida limited liability company
("Company" or "Disclosing Party")

**Receiving Party:**
Name: {{RECIPIENT_NAME}}
Entity / Individual: {{RECIPIENT_ENTITY}}
Role: {{RECIPIENT_ROLE}}
Email: {{RECIPIENT_EMAIL}}
Phone: {{RECIPIENT_PHONE}}
("Recipient" or "Receiving Party")

Company and Recipient are each a "Party" and collectively the "Parties."

---

## 1. PURPOSE

The Parties wish to explore and/or engage in a business relationship involving the evaluation, development, licensing, deployment, integration, testing, support, investment in, or commercialization of Company's proprietary artificial intelligence systems, multi-agent architectures, software platforms, data assets, and related products and services (the "Purpose"). In connection with the Purpose, Company will disclose certain Confidential Information to Recipient, and Recipient agrees to protect such information under the terms of this Agreement.

## 2. DEFINITION OF CONFIDENTIAL INFORMATION

"Confidential Information" means any and all non-public, proprietary, or confidential information — in any form — disclosed or made available by Company, including without limitation: (a) source code, repositories, build artifacts, CI/CD pipelines; (b) multi-agent architectures, LangGraph/LangChain definitions, agent contracts, system prompts, prompt engineering methodologies, fine-tuning datasets, embeddings, vector stores, retrieval strategies, memory architectures, tool definitions, routing logic, model selection strategies, and evaluation harnesses; (c) training data, synthetic data, labeled datasets, knowledge bases, ontologies, knowledge graphs, customer conversations, transcripts, and derivative datasets; (d) trade secrets under the Florida Uniform Trade Secrets Act (Fla. Stat. §§ 688.001–688.009) and the Defend Trade Secrets Act (18 U.S.C. § 1836 et seq.); (e) business plans, roadmaps, pricing, financials, pipelines, customer lists, investor materials, and marketing plans; (f) product designs, prototypes, demos, wireframes, architecture diagrams, API contracts, and benchmarks; (g) intellectual property, inventions, methods, algorithms, and IP filings; (h) third-party information held by Company under confidentiality; and (i) derivatives, notes, analyses, and compilations prepared by Recipient.

### 2.1 Exclusions
Confidential Information does not include information Recipient can demonstrate by contemporaneous written records: (i) was lawfully in Recipient's possession prior to disclosure; (ii) is or becomes publicly known through no act of Recipient; (iii) is lawfully received from a third party not under a confidentiality obligation; or (iv) is independently developed without use of Confidential Information. Burden of proof rests on Recipient.

## 3. OBLIGATIONS OF RECIPIENT

Recipient shall: (a) hold all Confidential Information in strict confidence using at least a reasonable standard of care; (b) use Confidential Information solely for the Purpose; (c) not disclose, publish, reverse engineer, decompile, disassemble, copy, or make derivative works without Company's prior written consent; (d) not use Confidential Information to compete with Company, solicit Company's customers, employees, contractors, or partners, or develop any similar or competitive product, service, model, agent, prompt, or system; (e) restrict access to Representatives with a strict need to know who are bound by written confidentiality obligations at least as protective as those herein; (f) not remove or obscure proprietary notices; (g) not input, upload, submit, or expose any Confidential Information to any third-party AI, ML, LLM, or training system without Company's prior written consent; and (h) promptly notify Company of any actual or suspected unauthorized use, disclosure, loss, or compromise.

## 4. INTELLECTUAL PROPERTY AND OWNERSHIP

4.1 No License. All Confidential Information remains the sole and exclusive property of Company. No right, title, interest, license, or ownership — express or implied — is granted.

4.2 Feedback. Any feedback, suggestions, or improvements Recipient provides shall be the sole property of Company, and Recipient hereby irrevocably assigns all right, title, and interest in such Feedback to Company.

4.3 No Reverse Engineering. Recipient shall not reverse engineer, decompile, disassemble, or attempt to derive the source code, architecture, algorithms, prompts, model weights, or training methodology of any Company system, whether accessed through API, binary, demo, or otherwise.

4.4 Residuals Disclaimed. No "residuals" or unaided-memory clause is implied.

## 5. COMPELLED DISCLOSURE

If required to disclose by law or court order, Recipient shall (to the extent legally permitted) provide Company prompt written notice, cooperate with protective-order efforts, and disclose only the minimum required.

## 6. TERM AND DURATION OF OBLIGATIONS

6.1 Term. Commences on the Effective Date and continues until terminated by either Party on thirty (30) days' written notice.

6.2 Survival. Confidentiality and non-use obligations survive termination and remain in force (a) for five (5) years from the date of disclosure for non–trade secret Confidential Information, and (b) in perpetuity for any Confidential Information constituting a trade secret.

## 7. RETURN OR DESTRUCTION

Upon request or termination, Recipient shall within ten (10) business days return or permanently destroy all Confidential Information and certify destruction in writing. One archival copy may be retained solely for legal compliance and remains subject to this Agreement indefinitely.

## 8. NO SOLICITATION

For twenty-four (24) months after termination, Recipient shall not solicit for employment, hire, or engage any employee, contractor, or consultant of Company with whom Recipient became acquainted in connection with the Purpose, without Company's prior written consent.

## 9. REMEDIES AND ENFORCEMENT

9.1 Irreparable Harm. Any breach would cause Company irreparable harm for which monetary damages would be inadequate. Company is entitled to injunctive relief, specific performance, and other equitable remedies without posting bond or proving damages.

9.2 Damages. Company may recover all damages including lost profits, disgorgement, exemplary damages where permitted, and reasonable attorneys' fees and costs.

9.3 Trade Secret Enforcement. Company reserves all rights under the Florida Uniform Trade Secrets Act and the Defend Trade Secrets Act, including ex parte seizure under 18 U.S.C. § 1836(b)(2).

9.4 DTSA Immunity Notice (18 U.S.C. § 1833(b)). Recipient is notified of the whistleblower immunity for confidential disclosure to government officials or attorneys for the sole purpose of reporting or investigating a suspected violation of law, or in filings made under seal.

## 10. WARRANTIES AND DISCLAIMERS

10.1 Authority. Each Party represents it has full authority to enter this Agreement.

10.2 As-Is. All Confidential Information is provided "AS IS" without warranty of any kind.

## 11. NO OBLIGATION TO PROCEED

Nothing obligates either Party to enter any further transaction or to disclose any particular information.

## 12. GOVERNING LAW, VENUE, AND JURISDICTION

12.1 Governing Law. Florida law, without regard to conflict-of-laws principles.

12.2 Venue. Exclusive venue in the state or federal courts located in Miami-Dade County, Florida. Parties consent to personal jurisdiction and venue therein.

12.3 Waiver of Jury Trial. EACH PARTY IRREVOCABLY WAIVES ANY RIGHT TO A TRIAL BY JURY IN ANY ACTION ARISING OUT OF OR RELATING TO THIS AGREEMENT.

## 13. GENERAL PROVISIONS

Entire Agreement; written amendments only; no waiver except in writing; severability with reformation; no assignment by Recipient without Company consent; notices in writing; independent contractors; counterparts and electronic signatures binding; headings for convenience; no rule of construction against drafter.

---

## EXHIBIT A — DESCRIPTION OF CONFIDENTIAL INFORMATION

Confidential Information covered by this engagement includes the following Company systems and any associated documentation, demos, architectures, prompts, datasets, and derivative materials:

{{EXHIBIT_A_PROJECTS}}

---

## SIGNATURES

**DTSP AGENTIC TECHNOLOGIES LLC**
By: Peter Dominguez
Title: Managing Member
Date: {{EFFECTIVE_DATE}}

**RECIPIENT**
By: {{RECIPIENT_NAME}} (electronically signed)
Entity: {{RECIPIENT_ENTITY}}
Role: {{RECIPIENT_ROLE}}
Date: {{EFFECTIVE_DATE}}
`,
};
