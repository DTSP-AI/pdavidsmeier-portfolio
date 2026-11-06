"use client";

import { useSyncExternalStore } from "react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

type Dimension = {
  key: "episodic" | "semantic" | "procedural" | "capability";
  name: string;
  short: string;
  question: string;
  desc: string;
  color: string;
};

const dimensions: Dimension[] = [
  {
    key: "episodic",
    name: "Episodic Memory",
    short: "Episodic",
    question: "What happened?",
    desc: "Retaining relevant experiences, decisions, interactions, and execution outcomes across sessions.",
    color: "#38BDF8",
  },
  {
    key: "semantic",
    name: "Semantic Memory",
    short: "Semantic",
    question: "What is known?",
    desc: "Organizing knowledge into meaningful concepts, entities, and relationships that can be retrieved in context.",
    color: "#A78BFA",
  },
  {
    key: "procedural",
    name: "Procedural Memory",
    short: "Procedural",
    question: "What has worked?",
    desc: "Capturing and evaluating successful workflows, strategies, and lessons learned to inform future execution.",
    color: "#34D399",
  },
  {
    key: "capability",
    name: "Capability Intelligence",
    short: "Capability",
    question: "What can be done?",
    desc: "Discovering available tools and capabilities based on task requirements, prerequisites, and authorization boundaries.",
    color: "#FBBF24",
  },
];

const focusAreas = [
  "Retrieval quality",
  "Knowledge relationships",
  "Capability discovery",
  "Procedural learning",
  "Policy-governed execution",
];

/* ---------- Desktop graphic (SVG) ---------- */

const HUB = { x: 300, y: 260 };
const GATE_X = 630;
const EXEC = { x: 760, y: 260 };

const nodePos: Record<Dimension["key"], { x: number; y: number }> = {
  episodic: { x: 120, y: 105 },
  semantic: { x: 480, y: 105 },
  procedural: { x: 120, y: 415 },
  capability: { x: 480, y: 415 },
};

const noopSubscribe = () => () => {};

function CognitiveGraphic() {
  // Ambient pulses render client-side only: the server cannot know the
  // viewer's reduced-motion preference, so rendering them in SSR would
  // cause a hydration mismatch for reduced-motion users.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const reduce = useReducedMotion() || !mounted;

  return (
    <svg
      viewBox="0 0 880 520"
      className="w-full h-auto"
      role="img"
      aria-labelledby="cm-title cm-desc"
    >
      <title id="cm-title">Persistent cognitive memory architecture</title>
      <desc id="cm-desc">
        Four cognitive dimensions (episodic, semantic, procedural and capability
        intelligence) feed a central orchestration layer. Orchestration passes
        through a separate policy gate before any tool or action executes.
      </desc>

      <defs>
        <pattern id="cm-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="#ffffff" strokeOpacity="0.05" />
        </pattern>
        <radialGradient id="cm-hub" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0A66C2" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id="cm-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
        </radialGradient>
        {dimensions.map((d) => {
          const p = nodePos[d.key];
          return (
            <path key={d.key} id={`cm-path-${d.key}`} d={`M${p.x} ${p.y} L${HUB.x} ${HUB.y}`} />
          );
        })}
        <path id="cm-path-exec" d={`M${HUB.x + 64} ${HUB.y} L${EXEC.x - 70} ${EXEC.y}`} />
      </defs>

      <rect width="880" height="520" fill="url(#cm-grid)" />

      {/* Memory-side label */}
      <text x="300" y="30" textAnchor="middle" fill="#94A3B8" fontSize="12" letterSpacing="3">
        MEMORY INFORMS DECISIONS
      </text>
      <text x="755" y="30" textAnchor="middle" fill="#FDA4AF" fontSize="11" letterSpacing="2">
        POLICY AUTHORIZES ACTIONS
      </text>

      {/* Edges: dimensions to hub */}
      {dimensions.map((d, i) => {
        const p = nodePos[d.key];
        return (
          <motion.line
            key={d.key}
            x1={p.x}
            y1={p.y}
            x2={HUB.x}
            y2={HUB.y}
            stroke={d.color}
            strokeOpacity="0.55"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.12 }}
          />
        );
      })}

      {/* Edge: hub to execution, through the gate */}
      <motion.line
        x1={HUB.x + 64}
        y1={HUB.y}
        x2={EXEC.x - 70}
        y2={EXEC.y}
        stroke="#E2E8F0"
        strokeOpacity="0.45"
        strokeWidth="2"
        strokeDasharray="6 6"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
      />

      {/* Signal pulses (skipped for reduced motion) */}
      {!reduce && (
        <g>
          {dimensions.map((d, i) => (
            <circle key={d.key} r="4" fill={d.color}>
              <animateMotion dur="2.8s" begin={`${i * 0.7}s`} repeatCount="indefinite">
                <mpath href={`#cm-path-${d.key}`} />
              </animateMotion>
            </circle>
          ))}
          <circle r="4" fill="#F8FAFC">
            <animateMotion dur="3.2s" begin="1.4s" repeatCount="indefinite">
              <mpath href="#cm-path-exec" />
            </animateMotion>
          </circle>
        </g>
      )}

      {/* Authorization boundary */}
      <line
        x1={GATE_X}
        y1="60"
        x2={GATE_X}
        y2="480"
        stroke="#FB7185"
        strokeOpacity="0.6"
        strokeWidth="1.5"
        strokeDasharray="4 8"
      />
      <rect x={GATE_X + 1} y="60" width="249" height="420" fill="#FB7185" fillOpacity="0.04" />
      <text
        x={GATE_X + 14}
        y="470"
        fill="#FDA4AF"
        fontSize="11"
        letterSpacing="2"
      >
        AUTHORIZATION BOUNDARY
      </text>

      {/* Policy gate shield */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 1 }}
        style={{ transformOrigin: `${GATE_X}px ${HUB.y}px` }}
      >
        <path
          d={`M${GATE_X} ${HUB.y - 30} l24 9 v18 c0 16 -11 27 -24 33 c-13 -6 -24 -17 -24 -33 v-18 z`}
          fill="#0B1220"
          stroke="#FB7185"
          strokeWidth="2"
        />
        <path
          d={`M${GATE_X - 9} ${HUB.y + 1} l6 6 l12 -13`}
          fill="none"
          stroke="#FB7185"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x={GATE_X} y={HUB.y + 56} textAnchor="middle" fill="#FDA4AF" fontSize="13" fontWeight="600">
          Policy Gate
        </text>
        <text x={GATE_X} y={HUB.y + 74} textAnchor="middle" fill="#94A3B8" fontSize="11">
          permissions · validation · oversight
        </text>
      </motion.g>

      {/* Execution node */}
      <motion.g
        initial={{ opacity: 0, x: 12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 1.15 }}
      >
        <rect
          x={EXEC.x - 70}
          y={EXEC.y - 36}
          width="140"
          height="72"
          rx="14"
          fill="#0F172A"
          stroke="#E2E8F0"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />
        <text x={EXEC.x} y={EXEC.y - 4} textAnchor="middle" fill="#F8FAFC" fontSize="15" fontWeight="600">
          Execution
        </text>
        <text x={EXEC.x} y={EXEC.y + 16} textAnchor="middle" fill="#94A3B8" fontSize="11">
          tools &amp; actions
        </text>
      </motion.g>

      {/* Orchestration hub */}
      <circle cx={HUB.x} cy={HUB.y} r="110" fill="url(#cm-glow)" />
      {!reduce && (
        <motion.circle
          cx={HUB.x}
          cy={HUB.y}
          r="64"
          fill="none"
          stroke="#22D3EE"
          strokeWidth="1.5"
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.35, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}
        />
      )}
      <motion.g
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}
      >
        <circle cx={HUB.x} cy={HUB.y} r="62" fill="url(#cm-hub)" />
        <text x={HUB.x} y={HUB.y - 2} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700">
          Orchestration
        </text>
        <text x={HUB.x} y={HUB.y + 16} textAnchor="middle" fill="#E0F2FE" fontSize="10.5">
          context assembly
        </text>
      </motion.g>

      {/* Dimension nodes */}
      {dimensions.map((d, i) => {
        const p = nodePos[d.key];
        return (
          <motion.g
            key={d.key}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
          >
            <rect
              x={p.x - 88}
              y={p.y - 32}
              width="176"
              height="64"
              rx="14"
              fill="#0F172A"
              stroke={d.color}
              strokeWidth="1.5"
            />
            <circle cx={p.x - 66} cy={p.y} r="6" fill={d.color} />
            <text x={p.x - 50} y={p.y - 4} fill="#F8FAFC" fontSize="15" fontWeight="600">
              {d.short}
            </text>
            <text x={p.x - 50} y={p.y + 15} fill="#94A3B8" fontSize="11.5">
              {d.question}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}

/* ---------- Mobile graphic (stacked HTML) ---------- */

function CognitiveGraphicMobile() {
  return (
    <div className="flex flex-col items-center gap-3 p-5" aria-hidden="true">
      <p className="text-[10px] tracking-[0.25em] text-slate-400">MEMORY INFORMS DECISIONS</p>
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {dimensions.map((d) => (
          <div
            key={d.key}
            className="rounded-xl bg-slate-900 border px-3 py-2.5"
            style={{ borderColor: d.color }}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-xs font-semibold text-slate-50">{d.short}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{d.question}</p>
          </div>
        ))}
      </div>
      <div className="w-px h-5 bg-cyan-400/50" />
      <div className="rounded-full px-5 py-2.5 bg-gradient-to-br from-cyan-400 to-[#0A66C2] text-white text-center shadow-[0_0_30px_rgba(34,211,238,0.35)]">
        <p className="text-sm font-bold leading-tight">Orchestration</p>
        <p className="text-[10px] text-sky-100">context assembly</p>
      </div>
      <div className="w-full flex items-center gap-2 my-1">
        <span className="flex-1 border-t border-dashed border-rose-400/60" />
        <span className="text-[10px] tracking-[0.2em] text-rose-300">POLICY GATE</span>
        <span className="flex-1 border-t border-dashed border-rose-400/60" />
      </div>
      <div className="rounded-xl px-5 py-2.5 bg-slate-900 border border-slate-300/40 text-center">
        <p className="text-sm font-semibold text-slate-50">Execution</p>
        <p className="text-[10px] text-slate-400">tools &amp; actions</p>
      </div>
      <p className="text-[10px] tracking-[0.25em] text-rose-300">POLICY AUTHORIZES ACTIONS</p>
    </div>
  );
}

/* ---------- Video area ---------- */

function WalkthroughVideo({ videoSrc }: { videoSrc?: string }) {
  if (videoSrc) {
    return (
      <div>
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-sm bg-black aspect-video">
          <video
            src={videoSrc}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <p className="mt-2 text-xs text-[#666] dark:text-neutral-400">
          Full architecture walkthrough coming soon.
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-sm aspect-video bg-[#0B1220]">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(34,211,238,0.25), transparent 45%), radial-gradient(circle at 75% 65%, rgba(167,139,250,0.22), transparent 45%)",
        }}
      />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <span className="flex items-center justify-center w-14 h-14 rounded-full border border-white/25 bg-white/5 mb-4">
          <svg className="w-6 h-6 text-white/80 ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13a.5.5 0 00.76.43l10.5-6.5a.5.5 0 000-.86L8.76 5.07A.5.5 0 008 5.5z" />
          </svg>
        </span>
        <p className="text-white font-semibold text-sm sm:text-base">Watch the architecture in action</p>
        <p className="text-slate-400 text-xs mt-1">60–75 second cinematic walkthrough · Coming soon</p>
      </div>
    </div>
  );
}

/* ---------- Section ---------- */

interface MemorySectionProps {
  videoSrc?: string;
}

export default function MemorySection({ videoSrc }: MemorySectionProps) {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="cognitive-memory"
        aria-labelledby="cognitive-memory-heading"
        className="w-full bg-[#F4F2EE] dark:bg-neutral-900 py-12 md:py-16 overflow-hidden"
      >
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#0A66C2]">
                DTSP AI Technologies / System Architecture
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Architecture in development
              </span>
            </div>
            <h2
              id="cognitive-memory-heading"
              className="text-2xl md:text-3xl font-bold text-[#191919] dark:text-white mb-2"
            >
              Persistent Cognitive Memory &amp; Capability Intelligence
            </h2>
            <p className="font-semibold text-[#191919] dark:text-neutral-200 mb-4">
              Engineering AI systems that learn from experience—not just longer conversations.
            </p>
            <p className="text-[#666] dark:text-neutral-400 mb-3">
              Modern AI systems can reason, generate, and execute. But sustained
              intelligence requires more than a context window.
            </p>
            <p className="text-[#666] dark:text-neutral-400 mb-8">
              At DTSP AI Technologies, we&apos;re developing an architectural
              approach that connects persistent knowledge, historical experiences,
              reusable workflows, and dynamically discoverable capabilities.
            </p>
          </motion.div>

          {/* Architecture graphic */}
          <motion.div
            {...fadeUp(0.1)}
            className="mb-10 rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-sm bg-[#0B1220]"
          >
            <div className="flex items-center justify-between px-5 pt-4">
              <p className="text-xs sm:text-sm font-semibold text-slate-100">
                Beyond Chatbots. Beyond Context Windows.
              </p>
              <span className="hidden sm:inline text-[10px] tracking-widest text-slate-500">
                CONCEPTUAL VIEW
              </span>
            </div>
            <div className="hidden md:block px-4 pb-4">
              <CognitiveGraphic />
            </div>
            <div className="md:hidden">
              <CognitiveGraphicMobile />
            </div>
          </motion.div>

          {/* Four dimensions */}
          <motion.h3
            {...fadeUp(0.15)}
            className="text-lg font-bold text-[#191919] dark:text-white mb-5"
          >
            Four Dimensions of Agentic Intelligence
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {dimensions.map((d, i) => (
              <motion.div
                key={d.key}
                {...fadeUp(0.2 + i * 0.08)}
                whileHover={{ y: -3 }}
                className="bg-white dark:bg-neutral-950 rounded-xl border border-gray-200 dark:border-neutral-800 p-5 shadow-sm hover:shadow-md transition-shadow"
                style={{ borderTop: `3px solid ${d.color}` }}
              >
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <h4 className="text-sm font-bold text-[#191919] dark:text-white">{d.name}</h4>
                  <span className="text-xs font-medium text-[#0A66C2] dark:text-sky-400 whitespace-nowrap">
                    {d.question}
                  </span>
                </div>
                <p className="text-xs text-[#666] dark:text-neutral-400 leading-relaxed">{d.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Governance */}
          <motion.div
            {...fadeUp(0.2)}
            className="mb-10 rounded-xl border border-rose-200/70 dark:border-rose-900/50 bg-white dark:bg-neutral-950 p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-[#191919] dark:text-white mb-2">
              Intelligence Without Uncontrolled Autonomy
            </h3>
            <p className="text-base font-semibold text-[#191919] dark:text-white mb-2">
              Memory informs decisions.{" "}
              <span className="text-rose-600 dark:text-rose-400">Policy authorizes actions.</span>
            </p>
            <p className="text-sm text-[#666] dark:text-neutral-400 leading-relaxed">
              The architecture separates learned knowledge from execution
              authority, preserving explicit permissions, validation, and human
              oversight.
            </p>
          </motion.div>

          {/* Objective */}
          <motion.div {...fadeUp(0.2)} className="mb-10 max-w-3xl">
            <h3 className="text-lg font-bold text-[#191919] dark:text-white mb-2">
              The Engineering Objective
            </h3>
            <p className="text-sm text-[#666] dark:text-neutral-400 leading-relaxed mb-4">
              Move beyond stateless AI interactions toward persistent,
              context-aware agent systems capable of improving their decisions
              through evaluated experience.
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#191919] dark:text-neutral-200 mb-2">
              Current focus
            </p>
            <ul className="flex flex-wrap gap-2 mb-4">
              {focusAreas.map((f) => (
                <li
                  key={f}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#0A66C2]/10 text-[#0A66C2] dark:bg-sky-900/40 dark:text-sky-300 border border-[#0A66C2]/20 dark:border-sky-800/50"
                >
                  {f}
                </li>
              ))}
            </ul>
            <p className="text-xs italic text-[#888] dark:text-neutral-500">
              Architecture under active development and evaluation.
            </p>
          </motion.div>

          {/* Video */}
          <motion.div {...fadeUp(0.15)}>
            <WalkthroughVideo videoSrc={videoSrc} />
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
