"use client";

import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.5, delay },
});

const defenses = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Contract-Driven Behavior Boundaries",
    desc: "Every agent operates within a versioned behavioral contract that defines exactly what it can and cannot do. The contract is the authority — not the model, not the code. Deviation from contract is a system failure, not a feature.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "Input Sanitization & Role Isolation",
    desc: "User input is always treated as data, never as instructions. System prompts live in a privileged layer that user messages cannot access or override. Role boundaries are enforced at the architecture level, not just the prompt level.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    ),
    title: "Persona Integrity Protection",
    desc: "Agents resist attempts to alter their identity, adopt new roles, or \"switch modes.\" Whether it's social engineering, jailbreak patterns, or indirect injection through retrieved content — the persona holds.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    title: "Scope Enforcement & Output Validation",
    desc: "Agents have hard boundaries on what they can output. No code generation, no tool execution outside their sanctioned set, no data exfiltration. If a response falls outside the defined scope, it's caught before it reaches the user.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    title: "Tiered Access Control",
    desc: "Client-facing agents have no direct access to external APIs, CRM systems, or sensitive infrastructure. Only the Supervisor — running on a more capable model with MCP tools — can execute privileged operations. The attack surface is minimized by design.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
      </svg>
    ),
    title: "Continuous Adversarial Testing",
    desc: "Every agent deployment goes through structured adversarial testing — prompt injection attempts, scope boundary probing, role confusion attacks, and indirect injection via knowledge base content. The defenses are validated, not assumed.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: "Adaptive Threat Escalation",
    desc: "When repeated injection attempts are detected, the system doesn't just keep deflecting — it escalates. A server-side classifier scores every message against a 10-level attack taxonomy, and on the third attempt, the entire inference engine hot-swaps to a more capable model with a counter-injection protocol. The agent starts demonstrating attacks two levels above what the attacker tried — educating them on what a real attack looks like while proving it wouldn't work either. The attacker never knows the engine changed. They just know they're outmatched.",
  },
];

interface SecuritySectionProps {
  videoSrc?: string;
}

export default function SecuritySection({ videoSrc }: SecuritySectionProps) {
  return (
    <section className="w-full bg-white dark:bg-neutral-950 py-12 md:py-16 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div {...fadeUp(0)}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#191919] dark:text-white">
              Agent Security & Prompt Fortification
            </h2>
          </div>
          <p className="text-[#666] dark:text-neutral-400 mb-10 max-w-2xl">
            AI agents that talk to users are attack surfaces. Every system I
            build treats prompt injection as a first-class threat — not an
            afterthought. Here's how the defenses are layered, without giving
            away the specifics.
          </p>
        </motion.div>

        {/* Video player */}
        <motion.div
          {...fadeUp(0.1)}
          className="mb-10 rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-sm bg-black aspect-video"
        >
          {videoSrc ? (
            <video
              src={videoSrc}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                </svg>
                <p className="text-sm">Security architecture demo</p>
                <p className="text-xs text-gray-400 mt-1">Video coming soon</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Defense grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {defenses.map((def, i) => (
            <motion.div
              key={def.title}
              {...fadeUp(0.2 + i * 0.07)}
              whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}
              className="bg-[#FAFAFA] dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5 transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0A66C2]/10 dark:bg-[#0A66C2]/20 flex items-center justify-center text-[#0A66C2] dark:text-[#4A9EFF] shrink-0 mt-0.5">
                  {def.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#191919] dark:text-white mb-1">
                    {def.title}
                  </h4>
                  <p className="text-xs text-[#666] dark:text-neutral-400 leading-relaxed">
                    {def.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          {...fadeUp(0.7)}
          className="mt-8 p-4 rounded-xl bg-[#F4F2EE] dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-center"
        >
          <p className="text-sm text-[#444] dark:text-neutral-300">
            The specific techniques, detection patterns, and enforcement
            mechanisms are proprietary — but the results are testable.{" "}
            <span className="font-semibold text-[#191919] dark:text-white">
              Try to jailbreak Rick in the chat.
            </span>{" "}
            See what happens.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
