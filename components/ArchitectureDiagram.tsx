"use client";

import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.45, delay, ease: "easeOut" as const },
});

function AnimatedArrow({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay }}
        className="flex flex-col items-center py-1"
      >
        <div className="w-px h-5 bg-gradient-to-b from-[#0A66C2]/50 to-[#0A66C2]/20" />
        <svg className="w-2.5 h-2.5 text-[#0A66C2]/40 -mt-px" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 12L0 6h12L6 12z" />
        </svg>
      </motion.div>
    </div>
  );
}

function NodeBox({
  title,
  subtitle,
  items,
  color,
  delay,
  accent,
}: {
  title: string;
  subtitle?: string;
  items?: string[];
  color: "blue" | "indigo" | "amber" | "emerald" | "slate";
  delay: number;
  accent?: boolean;
}) {
  const styles = {
    blue: "border-[#0A66C2]/25 bg-white",
    indigo: "border-indigo-300/40 bg-indigo-50/30",
    amber: "border-amber-300/40 bg-amber-50/30",
    emerald: "border-emerald-300/40 bg-emerald-50/30",
    slate: "border-gray-200 bg-gray-50/50",
  };

  return (
    <motion.div
      {...fadeUp(delay)}
      className={`rounded-xl border-2 ${styles[color]} p-4 shadow-sm relative ${accent ? "ring-1 ring-indigo-200/50" : ""}`}
    >
      <h4 className="text-sm font-bold text-[#191919]">{title}</h4>
      {subtitle && <p className="text-xs text-[#666] mt-0.5">{subtitle}</p>}
      {items && (
        <ul className="mt-2 space-y-1">
          {items.map((item) => (
            <li key={item} className="text-xs text-[#555] flex items-start gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#0A66C2] mt-1.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

export default function ArchitectureDiagram() {
  return (
    <section className="w-full bg-white py-12 md:py-16 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div {...fadeUp(0)}>
          <h2 className="text-2xl font-bold text-[#191919] mb-2">
            How I Build Multi-Agent Systems
          </h2>
          <p className="text-[#666] mb-10 max-w-2xl">
            A tiered orchestration pattern — cost-effective agents on the front
            line, validation layers that eliminate hallucinations, a capable
            supervisor working in tandem with human oversight, and a single
            source of truth holding it all together.
          </p>
        </motion.div>

        {/* Layer 0: User */}
        <motion.div {...fadeUp(0.05)} className="flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F2EE] border border-gray-200">
            <svg className="w-4 h-4 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
            </svg>
            <span className="text-sm font-medium text-[#444]">User / Customer</span>
          </div>
        </motion.div>

        <AnimatedArrow delay={0.1} />

        {/* Layer 1: Client-Facing Agents */}
        <div className="mb-1">
          <motion.div {...fadeUp(0.12)} className="text-center mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#0A66C2]">
              Layer 1 — Client-Facing Agents
            </span>
            <p className="text-[10px] text-[#999] mt-0.5">Cost-effective models / High volume / Contract-driven behavior</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <NodeBox
              title="Intake Agent"
              subtitle="First contact & qualification"
              items={[
                "Information collection",
                "Data validation & normalization",
                "Contract-driven conversations",
              ]}
              color="blue"
              delay={0.15}
            />
            <NodeBox
              title="Discovery Agent"
              subtitle="Deep qualification & research"
              items={[
                "Pain point identification",
                "Market & competitor research",
                "Behavioral adaptation",
              ]}
              color="blue"
              delay={0.2}
            />
            <NodeBox
              title="Solutions Architect"
              subtitle="Solution design from discovery"
              items={[
                "Builds solutions from L1 insights",
                "Maps needs to capabilities",
                "Generates proposals & specs",
              ]}
              color="blue"
              delay={0.25}
            />
          </div>
        </div>

        <AnimatedArrow delay={0.3} />

        {/* Validation Layer */}
        <div className="mb-1">
          <motion.div {...fadeUp(0.32)} className="text-center mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600">
              Validation Layer — Hallucination Elimination
            </span>
            <p className="text-[10px] text-[#999] mt-0.5">Every claim verified before it reaches the next layer</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            <NodeBox
              title="Fact Verification"
              subtitle="Cross-reference against source data"
              items={["Claims checked against KB", "No unsupported assertions pass"]}
              color="emerald"
              delay={0.35}
            />
            <NodeBox
              title="Schema Validation"
              subtitle="Structural integrity checks"
              items={["Output conforms to contracts", "Required fields enforced"]}
              color="emerald"
              delay={0.38}
            />
            <NodeBox
              title="Scope Guard"
              subtitle="Boundary enforcement"
              items={["Blocks out-of-scope responses", "Catches injection attempts"]}
              color="emerald"
              delay={0.41}
            />
          </div>
        </div>

        <AnimatedArrow delay={0.45} />

        {/* Layer 2: Supervisor + Human in the Loop */}
        <div className="mb-1">
          <motion.div {...fadeUp(0.47)} className="text-center mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600">
              Layer 2 — Supervisor + Human-in-the-Loop
            </span>
            <p className="text-[10px] text-[#999] mt-0.5">Capable model / Complex decisions / Human oversight</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <NodeBox
              title="Supervisor Agent"
              subtitle="Orchestration, routing & escalation"
              items={[
                "MCP tools (CRM, scheduling, lookups)",
                "Agent routing & pipeline management",
                "Versioned contract system",
                "Escalation & exception handling",
              ]}
              color="indigo"
              delay={0.5}
              accent
            />
            <NodeBox
              title="Human-in-the-Loop"
              subtitle="Real-time oversight & approval"
              items={[
                "Live dashboard monitoring",
                "Approval gates for critical actions",
                "Override & intervention controls",
                "Feedback loop into agent tuning",
              ]}
              color="amber"
              delay={0.53}
            />
          </div>

          {/* Tool strip */}
          <motion.div
            {...fadeUp(0.56)}
            className="flex flex-wrap justify-center gap-2 mt-3 max-w-2xl mx-auto"
          >
            {["MCP Server", "CRM Sync", "Dashboard", "Knowledge Graph", "Memory Layer", "Approval Gates"].map(
              (tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200/50"
                >
                  {tool}
                </span>
              )
            )}
          </motion.div>
        </div>

        <AnimatedArrow delay={0.6} />

        {/* Layer 3: Infrastructure */}
        <div>
          <motion.div {...fadeUp(0.62)} className="text-center mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              Layer 3 — Infrastructure
            </span>
            <p className="text-[10px] text-[#999] mt-0.5">Single source of truth / Write-through caching</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            <NodeBox
              title="PostgreSQL"
              subtitle="Source of truth"
              items={["All writes land here first", "Audit trail & sync log"]}
              color="slate"
              delay={0.65}
            />
            <NodeBox
              title="4-Layer Memory"
              subtitle="Hot → SQLite → Vector → PG"
              items={["Request-scoped caching", "Semantic search layer"]}
              color="slate"
              delay={0.68}
            />
            <NodeBox
              title="CRM / External"
              subtitle="Normalized sync"
              items={["Salesforce, HubSpot, GHL", "Idempotent operations"]}
              color="slate"
              delay={0.71}
            />
          </div>
        </div>

        {/* Legend */}
        <motion.div
          {...fadeUp(0.75)}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-[#999]"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0A66C2]" />
            Client agents
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Validation
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            Supervisor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Human oversight
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gray-500" />
            Infrastructure
          </span>
        </motion.div>
      </div>
    </section>
  );
}
