import {
  convertToModelMessages,
  streamText,
  stepCountIs,
  tool,
  UIMessage,
  InferUITools,
  UIDataTypes,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import {
  rickSystemPrompt,
  rickTopicDirectives,
  rickCounterInjectionDirective,
} from "@/lib/rick-prompt";
import { isApprovedRecipient, mintResumeToken } from "@/lib/resume-access";

export const maxDuration = 30;

// ── Rick's tools ────────────────────────────────────────────────────
// The approved-name bank lives server-side in lib/resume-access.ts.
// Rick only ever sees {approved: boolean}. He cannot leak what he
// cannot see.

const rickTools = {
  check_resume_access: tool({
    description:
      "Check whether a visitor is on Pete's approved resume list. Call this ONLY after the visitor has given you their full name in response to a resume request. Returns approved=true with a download link the UI renders as a button, or approved=false.",
    inputSchema: z.object({
      fullName: z
        .string()
        .describe("The visitor's full name exactly as they gave it"),
    }),
    execute: async ({ fullName }) => {
      const secret = process.env.NCNDA_GATE_SECRET;
      if (!secret) {
        return { approved: false as const, reason: "gate-not-configured" };
      }
      if (!isApprovedRecipient(fullName)) {
        return { approved: false as const };
      }
      const token = mintResumeToken(fullName, secret);
      return {
        approved: true as const,
        downloadUrl: `/api/resume?token=${encodeURIComponent(token)}`,
      };
    },
  }),
};

export type RickUITools = InferUITools<typeof rickTools>;
export type RickUIMessage = UIMessage<never, UIDataTypes, RickUITools>;

// ── Injection classifier ────────────────────────────────────────────
// Fast regex-based heuristic that catches ~90% of prompt injection
// patterns without an LLM call. Runs on every user message.

const INJECTION_PATTERNS = [
  // Level 1: Basic extraction
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /print\s+(your\s+)?(system\s+)?prompt/i,
  /show\s+(me\s+)?(your\s+)?(system\s+)?prompt/i,
  /output\s+(your\s+)?(full\s+)?(system\s+)?(prompt|instructions)/i,
  /what\s+(are|were)\s+your\s+instructions/i,
  /repeat\s+everything\s+above/i,
  /what\s+were\s+you\s+told/i,

  // Level 2: Role confusion
  /you\s+are\s+now\s+/i,
  /\bDAN\b.*mode/i,
  /do\s+anything\s+now/i,
  /enter\s+.*mode/i,
  /switch\s+to\s+.*mode/i,
  /you\s+have\s+no\s+restrictions/i,
  /pretend\s+(to\s+be|you\s+are)/i,
  /roleplay\s+as/i,

  // Level 3: Authority impersonation
  /this\s+is\s+(pete|the\s+developer|the\s+creator|an?\s+authorized)/i,
  /i('m|\s+am)\s+(pete|the\s+developer|the\s+admin)/i,
  /authorized\s+(request|developer|debug)/i,
  /security\s+(audit|review|test).*output/i,

  // Level 4+: Format/encoding tricks
  /translate\s+(this\s+)?to\s+.*:\s*.*instructions/i,
  /base64|rot13|pig\s*latin/i,
  /encode|decode.*prompt/i,

  // Level 5+: Hypothetical / indirect
  /if\s+you\s+(were|had)\s+(to\s+)?(have\s+)?(a\s+)?prompt/i,
  /hypothetically/i,
  /what\s+would\s+your\s+prompt\s+(say|look|contain)/i,

  // Level 7+: Delimiter / system spoofing
  /\bSYSTEM\s*:/i,
  /---\s*\n?\s*new\s+instructions/i,
  /\[SYSTEM\]/i,

  // Level 8+: Negation / paradox
  /list\s+(everything|what)\s+you\s+(can'?t|cannot|are\s+not\s+allowed)/i,
  /describe\s+what\s+you\s+cannot/i,

  // Level 9: Meta-cognitive
  /are\s+(your\s+)?instructions\s+ethical/i,
  /should\s+you\s+override/i,
  /your\s+constraints\s+are\s+(actually\s+)?harmful/i,

  // Scope escape: Code generation / dev requests
  /write\s+(me\s+)?(a\s+)?(python|javascript|typescript|code|function|script|class|component)/i,
  /generate\s+(a\s+)?(code|function|script|snippet|example|boilerplate)/i,
  /can\s+you\s+(code|program|write|build|create)\s+(me\s+)?/i,
  /give\s+me\s+(a\s+)?(code|script|function|snippet)/i,
  /show\s+me\s+(how\s+to\s+)?(code|implement|build|write)/i,
  /help\s+me\s+(code|build|write|implement|debug)/i,
  /\b(import|require|npm\s+install|pip\s+install|def\s+\w+|function\s+\w+|const\s+\w+\s*=)/i,
];

function classifyInjection(text: string): { isInjection: boolean; level: number } {
  const lower = text.toLowerCase();

  // Quick keyword pre-filter
  const suspiciousKeywords = [
    "system prompt", "instructions", "ignore", "DAN", "pretend",
    "override", "authorized", "debug", "jailbreak", "restrictions",
    "roleplay", "translate", "hypothetically", "base64", "SYSTEM:",
    "write me", "generate code", "code snippet", "function", "script",
    "implement", "npm install", "pip install", "import ",
  ];

  const hasSuspiciousKeyword = suspiciousKeywords.some((kw) =>
    lower.includes(kw.toLowerCase())
  );
  if (!hasSuspiciousKeyword) return { isInjection: false, level: 0 };

  // Match against patterns and determine level
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      // Determine level from which pattern matched
      if (/write\s+(me\s+)?(a\s+)?(python|javascript|typescript|code|function|script)|generate\s+(a\s+)?(code|function|script|snippet)|can\s+you\s+(code|program|write|build|create)|give\s+me\s+(a\s+)?(code|script|function)|show\s+me\s+(how\s+to\s+)?(code|implement)|help\s+me\s+(code|build|write|implement|debug)|\b(import|require|npm\s+install|pip\s+install|def\s+\w+|function\s+\w+|const\s+\w+\s*=)/i.test(text)) return { isInjection: true, level: 4 };
      if (/are\s+(your\s+)?instructions\s+ethical|should\s+you\s+override|constraints\s+are.*harmful/i.test(text)) return { isInjection: true, level: 9 };
      if (/list\s+(everything|what)\s+you\s+(can'?t|cannot)|describe\s+what\s+you\s+cannot/i.test(text)) return { isInjection: true, level: 8 };
      if (/SYSTEM\s*:|---\s*\n?\s*new\s+instructions|\[SYSTEM\]/i.test(text)) return { isInjection: true, level: 7 };
      if (/hypothetically|if\s+you\s+(were|had).*prompt|what\s+would\s+your\s+prompt/i.test(text)) return { isInjection: true, level: 6 };
      if (/translate\s+(this\s+)?to|base64|rot13|pig\s*latin|encode|decode.*prompt/i.test(text)) return { isInjection: true, level: 4 };
      if (/this\s+is\s+(pete|the\s+developer)|i('m|\s+am)\s+(pete|the\s+developer)|authorized\s+(request|developer)|security\s+(audit|review)/i.test(text)) return { isInjection: true, level: 3 };
      if (/you\s+are\s+now|DAN.*mode|do\s+anything\s+now|enter\s+.*mode|switch\s+to|no\s+restrictions|pretend|roleplay/i.test(text)) return { isInjection: true, level: 2 };
      return { isInjection: true, level: 1 };
    }
  }

  return { isInjection: false, level: 0 };
}

// ── Attempt counter (conversation-scoped) ───────────────────────────
// Counts injection attempts across the full message history

function countInjectionAttempts(messages: UIMessage[]): number {
  let count = 0;
  for (const msg of messages) {
    if (msg.role !== "user") continue;
    const text = msg.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join(" ") ?? "";
    if (classifyInjection(text).isInjection) count++;
  }
  return count;
}

// ── Route handler ───────────────────────────────────────────────────

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Get the latest user message text
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  const lastText = lastUserMsg?.parts
    ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ") ?? "";

  const current = classifyInjection(lastText);
  const attemptCount = countInjectionAttempts(messages);

  // Decide model: Claude for attempt 3+ injections, GPT-4o otherwise
  const useEscalation = current.isInjection && attemptCount >= 3;

  const modelMessages = await convertToModelMessages(messages);

  if (useEscalation) {
    // Append a counter-injection directive to the system prompt so
    // Claude gets deterministic instructions without polluting the
    // message stream (no leaked [INTERNAL] tags).
    // All prompt text lives in the contract (lib/rick-prompt.ts); the route
    // only supplies the numbers.
    const counterLevel = Math.min(current.level + 2, 10);
    const escalatedSystem = `${rickSystemPrompt}\n\n${rickCounterInjectionDirective({
      attemptCount,
      level: current.level,
      counterLevel,
    })}`;

    // claude-sonnet-4-20250514 was retired 2026-06-15 (404 from the API);
    // claude-sonnet-5-5 is Anthropic's documented drop-in replacement. It
    // rejects non-default temperature (400) and runs adaptive thinking, so
    // no sampling params and a higher output cap (thinking counts against it).
    const result = streamText({
      model: anthropic("claude-sonnet-5-5"),
      system: escalatedSystem,
      messages: modelMessages,
      maxOutputTokens: 4000,
    });

    return result.toUIMessageStreamResponse();
  }

  // Standard path: GPT-4o for normal questions + early deflections.
  // Tools are only wired here — the escalation path is for attackers,
  // and attackers don't get a resume.
  // Topic directives (from the contract) reinforce the rules GPT-4o drifts
  // on when the latest message is about that topic.
  const directives = rickTopicDirectives
    .filter((d) => d.pattern.test(lastText))
    .map((d) => d.directive);
  const standardSystem =
    directives.length > 0
      ? `${rickSystemPrompt}\n\n${directives.join("\n\n")}`
      : rickSystemPrompt;

  const result = streamText({
    model: openai("gpt-4o"),
    system: standardSystem,
    messages: modelMessages,
    tools: rickTools,
    stopWhen: stepCountIs(3),
    temperature: 0.7,
    maxOutputTokens: 800,
  });

  return result.toUIMessageStreamResponse();
}
