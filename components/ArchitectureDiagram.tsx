"use client";

import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.5, delay },
});

const pulseGlow = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(10, 102, 194, 0)",
      "0 0 0 8px rgba(10, 102, 194, 0.15)",
      "0 0 0 0 rgba(10, 102, 194, 0)",
    ],
  },
  transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const },
};

function DataFlowLine({ className }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className ?? ""}`}>
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-0.5 h-8 bg-gradient-to-b from-[#0A66C2] to-[#0A66C2]/30 origin-top"
      />
    </div>
  );
}

function AnimatedArrow({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div className={`flex justify-center ${className ?? ""}`}>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay }}
        className="flex flex-col items-center"
      >
        <div className="w-0.5 h-6 bg-gradient-to-b from-[#0A66C2] to-[#0A66C2]/40" />
        <svg className="w-3 h-3 text-[#0A66C2]/60 -mt-0.5" viewBox="0 0 12 12" fill="currentColor">
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
  badge,
  glow,
}: {
  title: string;
  subtitle?: string;
  items?: string[];
  color: "blue" | "indigo" | "slate";
  delay: number;
  badge?: string;
  glow?: boolean;
}) {
  const colors = {
    blue: "border-[#0A66C2]/30 bg-white",
    indigo: "border-indigo-300/50 bg-indigo-50/50",
    slate: "border-gray-300 bg-gray-50/50",
  };
  const badgeColors = {
    blue: "bg-[#0A66C2] text-white",
    indigo: "bg-indigo-600 text-white",
    slate: "bg-gray-600 text-white",
  };

  return (
    <motion.div
      {...fadeUp(delay)}
      {...(glow ? pulseGlow : {})}
      className={`rounded-xl border-2 ${colors[color]} p-4 shadow-sm relative`}
    >
      {badge && (
        <span className={`absolute -top-2.5 left-4 px-2 py-0.5 text-[10px] font-semibold rounded-full ${badgeColors[color]}`}>
          {badge}
        </span>
      )}
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
      <div className="max-w-4xl mx-auto px-6">
        <motion.div {...fadeUp(0)}>
          <h2 className="text-2xl font-bold text-[#191919] mb-2">
            How I Build Multi-Agent Systems
          </h2>
          <p className="text-[#666] mb-10 max-w-2xl">
            A tiered orchestration pattern — cheap and fast agents on the front line,
            a capable supervisor making the complex decisions, and a single source of
            truth holding it all together.
          </p>
        </motion.div>

        {/* Layer 0: User */}
        <motion.div {...fadeUp(0.1)} className="flex justify-center mb-1">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F2EE] border border-gray-200">
            <svg className="w-4 h-4 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
            </svg>
            <span className="text-sm font-medium text-[#444]">User / Customer</span>
          </div>
        </motion.div>

        <AnimatedArrow delay={0.15} />

        {/* Layer 1: Client-Facing Agents */}
        <motion.div {...fadeUp(0.2)} className="mb-1">
          <div className="text-center mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#0A66C2]">
              Layer 1 — Client-Facing Agents
            </span>
            <p className="text-[10px] text-[#999] mt-0.5">Cost-effective models (GPT-4o-mini) / High volume</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <NodeBox
              title="Intake Agent"
              subtitle="First contact & qualification"
              items={[
                "Collects lead information",
                "Validates & normalizes data",
                "Contract-driven behavior",
              ]}
              color="blue"
              delay={0.25}
              badge="JORDAN"
            />
            <NodeBox
              title="Discovery Agent"
              subtitle="Deep qualification & needs mapping"
              items={[
                "Pain point identification",
                "Solution matching",
                "Behavioral adaptation",
              ]}
              color="blue"
              delay={0.3}
              badge="TAYLOR"
            />
          </div>
        </motion.div>

        {/* Connector: both agents feed into supervisor */}
        <div className="flex justify-center my-1">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="flex items-end gap-4"
          >
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent to-[#0A66C2]/30 rounded" />
            <svg className="w-3 h-3 text-[#0A66C2]/60" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 12L0 6h12L6 12z" />
            </svg>
            <div className="w-24 h-0.5 bg-gradient-to-l from-transparent to-[#0A66C2]/30 rounded" />
          </motion.div>
        </div>

        {/* Layer 2: Supervisor */}
        <motion.div {...fadeUp(0.4)} className="mb-1">
          <div className="text-center mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600">
              Layer 2 — Supervisor / Orchestrator
            </span>
            <p className="text-[10px] text-[#999] mt-0.5">Capable model (Claude) / Complex decisions</p>
          </div>
          <div className="max-w-md mx-auto">
            <NodeBox
              title="Supervisor Agent"
              subtitle="Orchestration, routing & escalation"
              items={[
                "MCP tools (CRM ops, scheduling, lookups)",
                "Real-time dashboard monitoring",
                "Agent routing & pipeline management",
                "Versioned contract system",
              ]}
              color="indigo"
              delay={0.45}
              badge="CLAUDE"
              glow
            />
          </div>

          {/* Tool strip under supervisor */}
          <motion.div
            {...fadeUp(0.5)}
            className="flex flex-wrap justify-center gap-2 mt-3 max-w-md mx-auto"
          >
            {["MCP Server", "CRM Sync", "Dashboard", "Knowledge Graph", "Memory Layer"].map(
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
        </motion.div>

        <AnimatedArrow delay={0.55} />

        {/* Layer 3: Infrastructure */}
        <motion.div {...fadeUp(0.6)}>
          <div className="text-center mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              Layer 3 — Infrastructure
            </span>
            <p className="text-[10px] text-[#999] mt-0.5">Single source of truth / Write-through caching</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
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
              delay={0.7}
            />
            <NodeBox
              title="CRM / External"
              subtitle="Normalized sync"
              items={["Salesforce, HubSpot, GHL", "Idempotent operations"]}
              color="slate"
              delay={0.75}
            />
          </div>
        </motion.div>

        {/* Data flow legend */}
        <motion.div
          {...fadeUp(0.8)}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[#999]"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0A66C2]" />
            Client agents (cost-effective, high-volume)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            Supervisor (capable model, complex logic)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gray-500" />
            Infrastructure (persistence, sync)
          </span>
        </motion.div>
      </div>
    </section>
  );
}
